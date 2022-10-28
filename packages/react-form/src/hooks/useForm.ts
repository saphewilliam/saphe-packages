import { useAsyncReducer, Util } from '@saphe/react-use';
import { useId, useMemo } from 'react';
import { Field, Fields } from '../lib/field';
import { FieldsBuilder, Plugins } from '../lib/fieldPlugin';
import { ComponentPropsBase, FieldPropsBase, PropsFromMany } from '../lib/props';
import { MaybePromise, OutputValue } from '../lib/util';
import { ValidationMode } from '../lib/validation';

export interface FormConfig<P extends Plugins, F extends Fields> {
  /** Optional, declares the fields of the form */
  fields?: (t: FieldsBuilder<P>) => F;
  /** Optional, supply configuration for form validation */
  validation?: {
    /** Optional (default: ValidationMode.AFTER_BLUR), the global validation mode */
    mode?: ValidationMode;
    // TODO In the form, fields may be set explicitly to not-required by `{ required: false }` or may override the error function as normally.
    // TODO This should also affect the FormStateValues typing
    // required?: (fieldName: string) => string;
  };
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

export type FormStateTouched<F extends Fields> = {
  [I in keyof F]: F[I] extends Field<
    infer _RawValue,
    infer _Value,
    infer Many,
    infer _Validation,
    infer _State,
    infer _Options
  >
    ? boolean extends Many
      ? boolean
      : Many extends true
      ? boolean[]
      : boolean
    : never;
};

export type FormStateErrors<F extends Fields> = {
  [I in keyof F]: F[I] extends Field<
    infer _RawValue,
    infer _Value,
    infer Many,
    infer _Validation,
    infer _State,
    infer _Options
  >
    ? boolean extends Many
      ? string
      : Many extends true
      ? string[]
      : string
    : never;
};

export type FormStateHelpers<_F extends Fields> = {
  formControl: {
    onSubmit: (e: { preventDefault: () => void }) => void;
    onReset: (e: { preventDefault: () => void }) => void;
  };
  submitButtonControl: {
    key: string;
    label: string;
    isDisabled: boolean;
    isLoading: boolean;
    type: 'submit' | 'reset' | 'button';
    onClick: (e: { preventDefault: () => void }) => void;
  };
};

export interface FormState<F extends Fields> {
  controls: FormStateControls<F>;
  fields: FormStateFields<F>;
  values: FormStateValues<F>;
  touched: FormStateTouched<F>;
  errors: FormStateErrors<F>;
  helpers: FormStateHelpers<F>;
}

const validateField = (field: any, value: any): string => {
  if (!field.validation) return '';

  // Required check
  if (
    field.validation.required &&
    JSON.stringify(value) === JSON.stringify(field.plugin.initialValue)
  )
    return field.validation.required;

  // TODO
  // Plugin-specific validation options
  const pluginError = field.plugin.validate(value, field.validation, 'enabled');
  if (pluginError !== '') return pluginError;

  // Custom validate function
  if (field.validation.validate) {
    const validateResult = field.validation.validate(value);
    if (validateResult !== '') return validateResult;
  }

  return '';
};

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
              fields: ((field.initialValue as any[]) ?? [field.plugin.initialValue]).map(
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
                value: field.plugin.serialize(field.initialValue ?? field.plugin.initialValue),
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
    [initialFields, id],
  );

  const initialValues = useMemo<FormStateValues<F>>(
    () =>
      Object.entries(initialFields).reduce(
        (prev, [fieldName, field]) => ({
          ...prev,
          [fieldName]: field.initialValue ?? field.plugin.initialValue,
        }),
        {} as FormStateValues<F>,
      ),
    [initialFields],
  );

  const initialTouched = useMemo<FormStateTouched<F>>(
    () =>
      Object.entries(initialFields).reduce<FormStateTouched<F>>(
        (prev, [fieldName, field]) => ({
          ...prev,
          [fieldName]: field.many ? Array(field.initialValue?.length ?? 1).fill(false) : false,
        }),
        {} as FormStateTouched<F>,
      ),
    [initialFields],
  );

  const initialErrors = useMemo<FormStateErrors<F>>(
    () =>
      Object.entries(initialFields).reduce<FormStateErrors<F>>(
        (prev, [fieldName, field]) => ({
          ...prev,
          [fieldName]: field.many ? Array(field.initialValue?.length ?? 1).fill('') : '',
        }),
        {} as FormStateErrors<F>,
      ),
    [initialFields],
  );

  // export function getInitialFormTouchedState<T extends Fields>(
  //   fields: T,
  //   prevTouched: Record<string, boolean> = {},
  // ): FormTouched<T> {
  //   const touched: Record<string, boolean> = {};
  //   for (const fieldName of Object.keys(fields)) touched[fieldName] = prevTouched[fieldName] ?? false;
  //   return touched as FormTouched<T>;
  // }

  // export function getInitialFormErrorsState<T extends Fields>(
  //   fields: T,
  //   prevErrors: Record<string, string> = {},
  // ): FormErrors<T> {
  //   const errors: Record<string, string> = {};
  //   for (const fieldName of Object.keys(fields)) errors[fieldName] = prevErrors[fieldName] ?? '';
  //   return errors as FormErrors<T>;
  // }

  // export function getInitialFormValuesState<T extends Fields>(
  //   fields: T,
  //   prevValues: Record<string, FieldValueCrude> = {},
  // ): FormValues<T> {
  //   const values: Record<string, FieldValueCrude> = {};
  //   for (const [fieldName, field] of Object.entries(fields)) {
  //     values[fieldName] = prevValues[fieldName] ?? field.initialValue ?? getDefaultFieldValue(field);
  //   }

  //   return values as FormValues<T>;
  // }

  // TODO helpers should be added afterwards, not included in state
  const initialHelpers = useMemo<FormStateHelpers<F>>(
    () => ({
      formControl: {
        onSubmit: (e) => {
          e.preventDefault();
          actions.submit();
        },
        onReset: (e) => {
          e.preventDefault();
          actions.reset();
        },
      },
      submitButtonControl: {
        key: `${id}submitButton`,
        type: 'submit',
        // TODO
        label: '',
        isDisabled: false,
        isLoading: false,
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
    }),
    [id],
  );

  const initialState: FormState<F> = useMemo(
    () => ({
      fields: initialFields,
      controls: initialControls,
      values: initialValues,
      touched: initialTouched,
      errors: initialErrors,
      helpers: initialHelpers,
    }),
    [initialFields, initialControls, initialValues, initialHelpers],
  );

  // TODO?
  // useEffect(() => {
  //   if (stringify(config.fields) !== stringify(state.fields)) actions.reset();
  // }, [actions, config.fields, state.fields]);

  // TODO isLoading, error
  const { state, actions } = useAsyncReducer(initialState, {
    reset: () => initialState,
    change: (state, targetValue: any, fieldName: keyof F, fieldIndex?: number) => {
      const field = state.fields[fieldName];
      const newValue = field.plugin.parse(targetValue);
      const v = field.validation?.mode ?? config.validation?.mode ?? ValidationMode.AFTER_BLUR;
      const shouldValidate =
        v === ValidationMode.ON_CHANGE ||
        (v === ValidationMode.AFTER_BLUR && fieldIndex !== undefined
          ? (state.touched[fieldName] as unknown as boolean[])[fieldIndex]
          : state.touched[fieldName]);

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
        errors: shouldValidate
          ? {
              ...state.errors,
              [fieldName]:
                fieldIndex === undefined
                  ? validateField(field, newValue)
                  : Object.assign([], state.errors[fieldName], {
                      [fieldIndex]: validateField(field, newValue),
                    }),
            }
          : state.errors,
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
      const field = state.fields[fieldName];
      const newValue =
        fieldIndex === undefined
          ? state.values[fieldName]
          : (state.values[fieldName] as any[])[fieldIndex];

      const v = field.validation?.mode ?? config.validation?.mode ?? ValidationMode.AFTER_BLUR;
      const shouldValidate = v === ValidationMode.ON_BLUR || v === ValidationMode.AFTER_BLUR;

      let newState: FormState<F> = {
        ...state,
        touched: {
          ...state.touched,
          [fieldName]:
            fieldIndex === undefined
              ? true
              : Object.assign([], state.touched[fieldName], { [fieldIndex]: true }),
        },
        errors: shouldValidate
          ? {
              ...state.errors,
              [fieldName]:
                fieldIndex === undefined
                  ? validateField(field, newValue)
                  : Object.assign([], state.errors[fieldName], {
                      [fieldIndex]: validateField(field, newValue),
                    }),
            }
          : state.errors,
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
      let newState: FormState<F> = {
        ...state,
        touched: Object.entries(state.touched).reduce<FormStateTouched<F>>(
          (prev, [fieldName, touched]) => ({
            ...prev,
            [fieldName]: Array.isArray(touched) ? touched.map(() => true) : true,
          }),
          {} as FormStateTouched<F>,
        ),
      };

      let canSubmit = true;
      const newErrors: Record<string, string | string[]> = {};
      const newTouched: Record<string, boolean | boolean[]> = {};
      for (const [fieldName, field] of Object.entries(newState.fields)) {
        const value = state.values[fieldName];
        if (Array.isArray(value)) {
          const errors: string[] = value.map((v) => {
            const error = validateField(field, v);
            if (error !== '') canSubmit = false;
            return error;
          });
          newErrors[fieldName] = errors;
          newTouched[fieldName] = Array(errors.length).fill(true);
        } else {
          const error = validateField(field, value);
          if (error !== '') canSubmit = false;
          newErrors[fieldName] = error;
          newTouched[fieldName] = true;
        }
      }

      if (!canSubmit)
        return {
          ...newState,
          errors: newErrors as FormStateErrors<F>,
          touched: newTouched as FormStateTouched<F>,
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
