import { useAsyncReducer, Util } from '@saphe/react-use';
import { useId, useMemo } from 'react';
import { Field, Fields } from '../lib/field';
import { FieldsBuilder, Plugins } from '../lib/plugin';
import { ComponentPropsBase, FieldPropsBase, PropsFromMany } from '../lib/props';
import { MaybePromise, OutputValue } from '../lib/util';

export interface FormConfig<P extends Plugins, F extends Fields> {
  /** Optional, declares the fields of the form */
  fields?: (t: FieldsBuilder<P>) => F;
  /** Optional, synchronous function that fires on a form field change event */
  onChange?: (
    formState: FormState<F>,
    targetValue: any,
    fieldName: keyof F,
    fieldIndex?: number,
  ) => FormState<F> | void;
  /** Optional, synchronous function that fires on a form field blur event */
  onBlur?: (
    formState: FormState<F>,
    fieldName: keyof F,
    fieldIndex?: number,
  ) => FormState<F> | void;
  /** Optional, sync or async function that fires after a form field change event */
  changeEffect?: (
    formState: FormState<F>,
    targetValue: any,
    fieldName: keyof F,
    fieldIndex?: number,
  ) => MaybePromise<void>;
  /** Optional, sync or async function that fires after a form field blur event */
  blurEffect?: (
    formState: FormState<F>,
    fieldName: keyof F,
    fieldIndex?: number,
  ) => MaybePromise<void>;
  /** Optional, defines what should happen on a submit event */
  onSubmit?: (formState: FormState<F>) => MaybePromise<FormState<F> | void>;
}

export type FormStateControls<F extends Fields> = {
  [I in keyof F]: F[I] extends Field<
    infer RawValue,
    infer _Value,
    infer Many,
    infer _Validation,
    infer _State,
    infer Options
  >
    ? PropsFromMany<RawValue, Many> & Options
    : never;
};

export type FormStateFields<F extends Fields> = {
  [I in keyof F]: F[I] extends Field<
    infer RawValue,
    infer Value,
    infer Many,
    infer Validation,
    infer State,
    infer Options
  >
    ? Field<RawValue, Value, Many, Validation, State, Options>
    : never;
};

export type FormStateValues<F extends Fields> = {
  [I in keyof F]: F[I] extends Field<
    infer _RawValue,
    infer Value,
    infer Many,
    infer Validation,
    infer _State,
    infer _Options
  >
    ? OutputValue<Value, Many, Validation>
    : never;
};

export interface FormState<F extends Fields> {
  controls: FormStateControls<F>;
  fields: FormStateFields<F>;
  values: FormStateValues<F>;
  helpers: {
    submitButtonControl: {
      onClick: (e: { preventDefault: () => void }) => void;
    };
  };
}

export function useForm<P extends Plugins, F extends Fields>(
  plugins: P,
  config: FormConfig<P, F>,
): FormState<F> {
  const id = useId();

  const initialFields = useMemo<FormStateFields<F>>(
    () =>
      config.fields
        ? config.fields({
            field: Object.entries(plugins.fields).reduce(
              (prev, [pluginName, plugin]) => ({
                ...prev,
                [pluginName]: (opts: any) => ({ ...opts, plugin }),
              }),
              {} as any,
            ),
          })
        : ({} as any),
    [config.fields],
  );

  const initialControls = useMemo<FormStateControls<F>>(
    () =>
      Object.entries(initialFields).reduce((prev, [fieldName, field]) => {
        const componentProps: ComponentPropsBase = {
          label:
            field.label ??
            fieldName
              .replace(/([A-Z])/g, (match) => ` ${match}`)
              .replace(/^./, (match) => match.toUpperCase())
              .trim(),
          description: field.description ?? '',
        };

        const fieldProps = field.many
          ? (() => ({
              fields: ((field.initialValue as any[]) ?? [field.plugin.defaultInitialValue]).map(
                (value: any, index) => {
                  const props: FieldPropsBase<any> = {
                    id: `${id}${fieldName}${index}`,
                    name: `${id}${fieldName}${index}`,
                    describedBy: `${id}${fieldName}Description`,
                    value: field.plugin.serialize(value),
                    onChange: (targetValue: any) => actions.change(targetValue, fieldName, index),
                    onBlur: () => actions.blur(fieldName, index),

                    // TODO
                    isDisabled: false,
                    isHidden: false,
                    error: '',
                  };
                  return props;
                },
              ),
            }))()
          : (() => {
              const props: FieldPropsBase<any> = {
                id: `${id}${fieldName}`,
                name: `${id}${fieldName}`,
                describedBy: `${id}${fieldName}Description`,
                value: field.plugin.serialize(
                  field.initialValue ?? field.plugin.defaultInitialValue,
                ),
                onChange: (targetValue: any) => actions.change(targetValue, fieldName),
                onBlur: () => actions.blur(fieldName),

                // TODO
                isDisabled: false,
                isHidden: false,
                error: '',
              };
              return props;
            })();

        return {
          ...prev,
          [fieldName]: {
            ...field,
            ...componentProps,
            ...fieldProps,
          },
        };
      }, {} as FormStateControls<F>),
    [initialFields],
  );

  const initialValues = useMemo<FormStateValues<F>>(
    () =>
      Object.entries(initialFields).reduce(
        (prev, [fieldName, field]) => ({
          ...prev,
          [fieldName]: field.initialValue ?? field.plugin.defaultInitialValue,
        }),
        {} as FormStateValues<F>,
      ),
    [initialFields],
  );

  const initialState: FormState<F> = useMemo(
    () => ({
      fields: initialFields,
      controls: initialControls,
      values: initialValues,
      helpers: {
        submitButtonControl: {
          key: `${id}submitButton`,
          type: 'submit',
          // label: !isLoading
          //   ? submitButton?.label ?? 'Submit'
          //   : submitButton?.submittingLabel ?? submitButton?.label ?? 'Processing...',
          // disabled: Object.values(state.errors).reduce<boolean>(
          //   (prev, curr) => prev || curr !== '',
          //   false,
          // ),
          // isLoading,
          onClick: (e) => {
            e.preventDefault();
            actions.submit();
          },
        },
      },
    }),
    [initialFields, initialControls, initialValues],
  );

  // TODO isLoading, error
  const { state, actions } = useAsyncReducer(initialState, {
    reset: () => initialState,
    change: (state, targetValue: any, fieldName: keyof F, fieldIndex?: number) => {
      const field = state.fields[fieldName];

      const newValue = field.plugin.parse(targetValue);
      // if (field.many && newValue === null) newValue = [];
      // if (field.many && !Array.isArray(newValue)) newValue = [targetValue];

      let newState: FormState<F> = {
        ...state,
        controls: {
          ...state.controls,
          [fieldName]: {
            ...state.controls[fieldName],
            ...(fieldIndex === undefined
              ? { value: targetValue }
              : {
                  fields: Object.assign([], (state.controls[fieldName] as any).fields, {
                    [fieldIndex]: {
                      ...(state.controls[fieldName] as any).fields[fieldIndex],
                      value: targetValue,
                    },
                  }),
                }),
          },
        },
        values: {
          ...state.values,
          [fieldName]:
            fieldIndex === undefined
              ? newValue
              : Object.assign([], state.values[fieldName], { [fieldIndex]: newValue }),
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
      let newState: FormState<F> = state;

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
      let newState: FormState<F> = state;
      let canSubmit = true;
      const newErrors: Record<string, string> = {};
      const newTouched: Record<string, boolean> = {};
      for (const [fieldName, _field] of Object.entries(newState.fields)) {
        // TODO
        // const error = validateField(field, state.values[fieldName as keyof typeof state.values]);
        const error = '';
        if (error !== '') canSubmit = false;
        newErrors[fieldName] = error;
        newTouched[fieldName] = true;
      }

      if (!canSubmit)
        return {
          ...newState,
          // TODO
          // errors: newErrors as FormErrors<T>,
          // touched: newTouched as FormTouched<T>,
        };

      if (config.onSubmit) {
        let onSubmitResult = config.onSubmit(newState);
        if (Util.isPromise(onSubmitResult)) onSubmitResult = await onSubmitResult;
        if (typeof onSubmitResult !== 'undefined') newState = onSubmitResult;
      }

      return newState;
    },
  });

  return state;
}
