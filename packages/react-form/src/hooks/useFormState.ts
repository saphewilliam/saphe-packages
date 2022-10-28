import { useAsyncReducer, Util } from '@saphe/react-use';
import { Fields } from '../lib/field';
import { Plugins } from '../lib/plugin';
import { FormConfig, FormState, FormValues } from '../lib/types';
import { validateField, ValidationMode } from '../lib/validation';

export const useFormState = <P extends Plugins, F extends Fields>(
  config: FormConfig<P, F>,
  initialState: FormState<F>,
) =>
  useAsyncReducer(initialState, {
    reset: () => initialState,
    change: (state, targetValue: any, fieldName: keyof F, fieldIndex?: number) => {
      const stateField = state[fieldName];
      const { field, value, touched, error } = stateField;
      const newValue = field.plugin.parse(targetValue);

      const v = field.validation?.mode ?? config.validation?.mode ?? ValidationMode.AFTER_BLUR;
      const shouldValidate =
        v === ValidationMode.ON_CHANGE ||
        (v === ValidationMode.AFTER_BLUR && fieldIndex !== undefined
          ? (touched as any)[fieldIndex]
          : touched);

      let newState: FormState<F> = {
        ...state,
        [fieldName]: {
          ...stateField,
          ...(fieldIndex === undefined
            ? {
                value: newValue,
                error: shouldValidate ? validateField(field, newValue) : error,
              }
            : {
                value: Object.assign([], value, { [fieldIndex]: newValue }),
                error: shouldValidate
                  ? Object.assign([], error, { [fieldIndex]: validateField(field, newValue) })
                  : error,
              }),
        },
      };

      if (config.onChange) {
        const onChangeResult = config.onChange(newState, targetValue, fieldName, fieldIndex);
        if (typeof onChangeResult !== 'undefined') newState = onChangeResult;
      }

      if (config.changeEffect) {
        const changeEffectResult = config.changeEffect(
          newState,
          targetValue,
          fieldName,
          fieldIndex,
        );
        if (Util.isPromise(changeEffectResult)) Promise.resolve(changeEffectResult);
      }

      return newState;
    },
    blur: (state, fieldName: keyof F, fieldIndex?: number) => {
      const stateField = state[fieldName];
      const { field, value, touched, error } = stateField;
      const newValue = fieldIndex === undefined ? value : (value as any)[fieldIndex];

      const v = field.validation?.mode ?? config.validation?.mode ?? ValidationMode.AFTER_BLUR;
      const shouldValidate = v === ValidationMode.ON_BLUR || v === ValidationMode.AFTER_BLUR;

      let newState: FormState<F> = {
        ...state,
        [fieldName]: {
          ...stateField,
          ...(fieldIndex === undefined
            ? {
                touched: true,
                error: shouldValidate ? validateField(field, newValue) : error,
              }
            : {
                touched: Object.assign([], touched, { [fieldIndex]: true }),
                error: shouldValidate
                  ? Object.assign([], error, { [fieldIndex]: validateField(field, newValue) })
                  : error,
              }),
        },
      };

      if (config.onBlur) {
        const onChangeResult = config.onBlur(state, fieldName, fieldIndex);
        if (typeof onChangeResult !== 'undefined') newState = onChangeResult;
      }

      if (config.blurEffect) {
        const changeEffectResult = config.blurEffect(newState, fieldName, fieldIndex);
        if (Util.isPromise(changeEffectResult)) Promise.resolve(changeEffectResult);
      }

      return newState;
    },
    submit: async (state) => {
      let canSubmit = true;
      let newState: FormState<F> = Object.entries(state).reduce((prev, [fieldName, stateField]) => {
        const { value, field } = stateField;
        let touched: boolean | boolean[];
        let error: string | string[];

        if (Array.isArray(value)) {
          touched = Array(value.length).fill(true);
          error = value.map((v) => {
            const e = validateField(field, v);
            if (e !== '') canSubmit = false;
            return e;
          });
        } else {
          touched = true;
          error = validateField(field, value);
          if (error !== '') canSubmit = false;
        }

        return { ...prev, [fieldName]: { ...stateField, touched, error } };
      }, {} as FormState<F>);

      if (!canSubmit) return newState;

      if (config.onSubmit) {
        const formValues = Object.entries(state).reduce<FormValues<F>>(
          (prev, [fieldName, stateField]) => ({ ...prev, [fieldName]: stateField.value }),
          {} as FormValues<F>,
        );
        let onSubmitResult = config.onSubmit(newState, formValues);
        if (Util.isPromise(onSubmitResult)) onSubmitResult = await onSubmitResult;
        if (typeof onSubmitResult !== 'undefined') newState = onSubmitResult;
      }

      return newState;
    },
  });
