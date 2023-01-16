import { Util } from '@saphe/react-use';
import { Fields } from '../lib/field';
import { Plugins } from '../lib/plugin';
import { FormConfig, FormState, FormValues, ValidationMode } from '../lib/types';
import { FieldValidation, validateField } from '../lib/validation';
import { useAsyncReducer } from '@saphe/react-use';

export const useFormState = <P extends Plugins, F extends Fields>(
  config: FormConfig<P, F>,
  initialState: FormState<F>,
) =>
  useAsyncReducer(initialState, {
    reset: () => initialState,
    addField: (formState, fieldName: keyof F, initialValue: unknown) => {
      if (!formState[fieldName].field.many) return formState;
      return {
        ...formState,
        [fieldName]: {
          ...formState[fieldName],
          value: [...(formState[fieldName].value as unknown[]), initialValue],
        },
      };
    },
    removeField: (formState, fieldName: keyof F, fieldIndex: number) => {
      if (!formState[fieldName].field.many) return formState;
      const v = formState[fieldName].value as unknown[];
      return {
        ...formState,
        [fieldName]: {
          ...formState[fieldName],
          value: v.slice(0, fieldIndex).concat(v.slice(fieldIndex + 1)),
        },
      };
    },
    change: (formState, targetValue: unknown, fieldName: keyof F, fieldIndex?: number) => {
      const stateField = formState[fieldName];
      const { field, value, touched, error, state } = stateField;
      const newValue = field.plugin.parse ? field.plugin.parse(targetValue) : targetValue;

      const v =
        (field.validation as FieldValidation | undefined)?.mode ??
        config.validation?.mode ??
        ValidationMode.AFTER_BLUR;
      const shouldValidate =
        v === ValidationMode.ON_CHANGE ||
        (v === ValidationMode.AFTER_BLUR && fieldIndex !== undefined
          ? (touched as never as boolean[])[fieldIndex]
          : touched);

      let newState: FormState<F> = {
        ...formState,
        [fieldName]: {
          ...stateField,
          ...(fieldIndex === undefined
            ? {
                value: newValue,
                error: shouldValidate ? validateField(field, state, newValue) : error,
              }
            : {
                value: Object.assign([], value, { [fieldIndex]: newValue }),
                error: shouldValidate
                  ? Object.assign([], error, {
                      [fieldIndex]: validateField(field, state, newValue),
                    })
                  : error,
              }),
        },
      };

      if (config.onChange) {
        const onChangeResult = config.onChange({
          formState: newState,
          targetValue,
          fieldName,
          fieldIndex,
        });
        if (typeof onChangeResult !== 'undefined') newState = onChangeResult;
      }

      if (config.changeEffect) {
        const changeEffectResult = config.changeEffect({
          formState: newState,
          targetValue,
          fieldName,
          fieldIndex,
        });
        if (Util.isPromise(changeEffectResult)) Promise.resolve(changeEffectResult);
      }

      return newState;
    },
    blur: (formState, fieldName: keyof F, fieldIndex?: number) => {
      const stateField = formState[fieldName];
      const { field, value, touched, error, state } = stateField;
      const newValue = fieldIndex === undefined ? value : (value as unknown[])[fieldIndex];

      const v =
        (field.validation as FieldValidation | undefined)?.mode ??
        config.validation?.mode ??
        ValidationMode.AFTER_BLUR;
      const shouldValidate = v === ValidationMode.ON_BLUR || v === ValidationMode.AFTER_BLUR;

      let newState: FormState<F> = {
        ...formState,
        [fieldName]: {
          ...stateField,
          ...(fieldIndex === undefined
            ? {
                touched: true,
                error: shouldValidate ? validateField(field, state, newValue) : error,
              }
            : {
                touched: Object.assign([], touched, { [fieldIndex]: true }),
                error: shouldValidate
                  ? Object.assign([], error, {
                      [fieldIndex]: validateField(field, state, newValue),
                    })
                  : error,
              }),
        },
      };

      if (config.onBlur) {
        const onChangeResult = config.onBlur({
          formState: newState,
          fieldName,
          fieldIndex,
        });
        if (typeof onChangeResult !== 'undefined') newState = onChangeResult;
      }

      if (config.blurEffect) {
        const blurEffectResult = config.blurEffect({
          formState: newState,
          fieldName,
          fieldIndex,
        });
        if (Util.isPromise(blurEffectResult)) Promise.resolve(blurEffectResult);
      }

      return newState;
    },
    submit: async (formState) => {
      let canSubmit = true;
      let newState: FormState<F> = Object.entries(formState).reduce(
        (prev, [fieldName, stateField]) => {
          const { value, field, state } = stateField;
          let touched: boolean | boolean[];
          let error: string | string[];

          if (Array.isArray(value)) {
            touched = Array(value.length).fill(true);
            error = value.map((v) => {
              const e = validateField(field, state, v);
              if (e !== '') canSubmit = false;
              return e;
            });
          } else {
            touched = true;
            error = validateField(field, state, value);
            if (error !== '') canSubmit = false;
          }

          return { ...prev, [fieldName]: { ...stateField, touched, error } };
        },
        {} as FormState<F>,
      );

      const formValues = Object.entries(formState).reduce<FormValues<F>>(
        (prev, [fieldName, stateField]) => ({ ...prev, [fieldName]: stateField.value }),
        {} as FormValues<F>,
      );

      if (canSubmit && config.onSubmit) {
        let onSubmitResult = config.onSubmit({
          formState: newState,
          initialFormState: initialState,
          formValues,
        });
        if (Util.isPromise(onSubmitResult)) onSubmitResult = await onSubmitResult;
        if (typeof onSubmitResult !== 'undefined') newState = onSubmitResult;
      }

      if (config.submitEffect) {
        const submitEffectResult = config.submitEffect({
          formState: newState,
          initialFormState: initialState,
          formValues,
        });
        if (Util.isPromise(submitEffectResult)) Promise.resolve(submitEffectResult);
      }

      return newState;
    },
  });
