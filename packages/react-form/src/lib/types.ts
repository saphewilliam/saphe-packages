import { Field, FieldMany, Fields, FieldState } from './field';
import { FieldsBuilder, Plugins } from './plugin';
import { ManyProps, Props } from './props';
import { MaybePromise, OutputValue, TypeFromMany } from './util';
import { FieldValidation, ValidationMode } from './validation';
import { UseAsyncReducerTypes } from '@saphe/react-use';

// TODO defineField -esc helper functions
// TODO extract props from plugin for defining components

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
  /** Optional, defines what should happen on a form reset event */
  onReset?: (formState: FormState<F>) => MaybePromise<FormState<F> | void>;
  /** Optional, defines what should happen on a form submit event */
  onSubmit?: (
    formState: FormState<F>,
    formValues: FormValues<F>,
  ) => MaybePromise<FormState<F> | void>;
}

export interface Form<F extends Fields> {
  state: FormState<F>;
  props: FormProps<F>;
  isLoading: boolean;
  error: UseAsyncReducerTypes.Error<FormState<F>> | null;
}

export type FormStateField<
  RawValue,
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value>,
  State extends FieldState,
  Options extends object,
> = {
  field: Field<RawValue, Value, Many, Validation, State, Options>;
  value: OutputValue<Value, Many, Validation>;
  touched: TypeFromMany<boolean, boolean[], Many>;
  error: TypeFromMany<string, string[], Many>;
};

export type FormState<F extends Fields> = {
  [I in keyof F]: F[I] extends Field<
    infer RawValue,
    infer Value,
    infer Many,
    infer Validation,
    infer State,
    infer Options
  >
    ? FormStateField<RawValue, Value, Many, Validation, State, Options>
    : never;
};

export type FormValues<F extends Fields> = {
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

export type FormProps<F extends Fields> = {
  [I in keyof F]: F[I] extends Field<
    infer RawValue,
    infer _Value,
    infer Many,
    infer _Validation,
    infer _State,
    infer Options
  >
    ? TypeFromMany<Props<RawValue>, ManyProps<RawValue>, Many> & Options
    : never;
} & {
  form: {
    onReset: (e?: { preventDefault: () => void }) => void;
    onSubmit: (e?: { preventDefault: () => void }) => void;
  };
  submitButton: {
    key: string;
    label: string;
    isDisabled: boolean;
    isLoading: boolean;
    type: 'submit' | 'reset' | 'button';
    onClick: (e: { preventDefault: () => void }) => void;
  };
};
