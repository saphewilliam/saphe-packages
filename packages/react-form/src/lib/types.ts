import { Field, Fields } from './field';
import { Plugin, Plugins, FieldsBuilder } from './plugin';
import { ManyProps, SingleProps } from './props';
import { ExplicitTypeFromMany, MaybePromise, OutputValue, TypeFromMany } from './util';
import { FieldValidation } from './validation';

/** Extract the props type for a plugin, used for defining components */
export type SinglePropsFromPlugin<P> = P extends Plugin<
  infer RawValue,
  infer _Value,
  infer _Many,
  infer _Validation,
  infer Options
>
  ? SingleProps<RawValue> & Options
  : never;

/** Extract the props type for a plugin, used for defining components */
export type ManyPropsFromPlugin<P> = P extends Plugin<
  infer RawValue,
  infer _Value,
  infer _Many,
  infer _Validation,
  infer Options
>
  ? ManyProps<RawValue> & Options
  : never;

/** Extract the props type for a plugin, used for defining components */
export type PropsFromPlugin<P> = P extends Plugin<
  infer RawValue,
  infer _Value,
  infer Many,
  infer _Validation,
  infer Options
>
  ? ExplicitTypeFromMany<
      SingleProps<RawValue> | ManyProps<RawValue>,
      SingleProps<RawValue>,
      ManyProps<RawValue>,
      Many
    > &
      Options
  : never;

/** Helper function for defining a reusable subset of fields outside of the hook definition */
export const defineFields = <P extends Plugins, F extends Fields>(
  _plugins: P,
  fields: (t: FieldsBuilder<P>) => F,
) => fields;

/** Type used for declaring if a field is many or not */
export type FieldMany = boolean;

/** Enum which shows the current state of a form field */
export enum FieldState {
  ENABLED = 'ENABLED',
  LOADING = 'LOADING',
  DISABLED = 'DISABLED',
  HIDDEN = 'HIDDEN',
}

/** Enum which defines when a form field is validated. */
export enum ValidationMode {
  ON_CHANGE = 'ON_CHANGE',
  ON_BLUR = 'ON_BLUR',
  AFTER_BLUR = 'AFTER_BLUR',
  ON_SUBMIT = 'ON_SUBMIT',
}

interface ButtonConfig {
  /** Optional, the text displayed on the button */
  label?: string;
  /** Optional, the text displayed on the button while the form is performing the action */
  isLoadingLabel?: string;
}

export interface FormConfig<P extends Plugins, F extends Fields> {
  /** Optional, declares the fields of the form */
  fields?: (f: FieldsBuilder<P>) => F;
  /** Optional, supply global configuration for form validation */
  validation?: {
    /** Optional (default: ValidationMode.AFTER_BLUR), the global validation mode */
    mode?: ValidationMode;
    // TODO In the form, fields may be set explicitly to not-required by `{ required: false }` or may override the error function as normally.
    // TODO This should also affect the FormStateValues typing
    // required?: (fieldName: string) => string;
  };
  /** Optional, configures the form's submit button */
  submitButton?: ButtonConfig;
  /** Optional, configures the form's reset button */
  resetButton?: ButtonConfig;
  /** Optional, synchronous function that fires on a form field change event */
  onChange?: (opts: {
    formState: FormState<F>;
    // TODO enumerate all possible form values
    targetValue: unknown;
    fieldName: keyof F;
    /** `fieldIndex` is only supplied when the changed field has `many: true` */
    fieldIndex?: number;
  }) => FormState<F> | void;
  /** Optional, synchronous function that fires on a form field blur event */
  onBlur?: (opts: {
    formState: FormState<F>;
    fieldName: keyof F;
    /** `fieldIndex` is only supplied when the blurred field has `many: true` */
    fieldIndex?: number;
  }) => FormState<F> | void;
  /** Optional, sync or async function that fires after a form field change event */
  changeEffect?: (opts: {
    formState: FormState<F>;
    targetValue: unknown;
    fieldName: keyof F;
    /** `fieldIndex` is only supplied when the changed field has `many: true` */
    fieldIndex?: number;
  }) => MaybePromise<void>;
  /** Optional, sync or async function that fires after a form field blur event */
  blurEffect?: (opts: {
    formState: FormState<F>;
    fieldName: keyof F;
    /** `fieldIndex` is only supplied when the blurred field has `many: true` */
    fieldIndex?: number;
  }) => MaybePromise<void>;
  /** Optional, defines what should happen when the form state is initialized */
  // TODO allow user to pass a promise onInit (when useAsyncReducer supports this)
  onInit?: (opts: { formState: FormState<F> }) => FormState<F> | void;
  /** Optional, defines what should happen on a form reset event */
  onReset?: (opts: { formState: FormState<F> }) => MaybePromise<FormState<F> | void>;
  /** Optional, defines what should happen on a form submit event where no errors are present in the form */
  onSubmit?: (opts: {
    initialFormState: FormState<F>;
    formState: FormState<F>;
    formValues: FormValues<F>;
  }) => MaybePromise<FormState<F> | void>;
  /** Optional, defines what should happen on any form submit event, even if errors are present in the form */
  submitEffect?: (opts: {
    initialFormState: FormState<F>;
    formState: FormState<F>;
    formValues: FormValues<F>;
  }) => MaybePromise<FormState<F> | void>;
}

export type FormStateField<
  RawValue = unknown,
  Value = unknown,
  Many extends FieldMany = false,
  Validation extends FieldValidation<Value> = FieldValidation,
  State extends FieldState = FieldState,
  Options extends object = object,
> = {
  field: Field<RawValue, Value, Many, Validation, State, Options>;
  value: TypeFromMany<Value | null, (Value | null)[], Many>;
  touched: TypeFromMany<boolean, boolean[], Many>;
  error: TypeFromMany<string, string[], Many>;
  state: FieldState;
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
    infer State,
    infer _Options
  >
    ? OutputValue<Value, Many, Validation, State>
    : never;
};

export interface FormComponentProps {
  onReset: (e?: { preventDefault: () => void }) => void;
  onSubmit: (e?: { preventDefault: () => void }) => void;
}

export interface ButtonComponentProps {
  label: string;
  isDisabled: boolean;
  isLoading: boolean;
  type: 'submit' | 'reset' | 'button';
  onClick: (e?: { preventDefault: () => void }) => void;
}

export type FormProps<F extends Fields> = {
  [I in keyof F]: F[I] extends Field<
    infer RawValue,
    infer _Value,
    infer Many,
    infer _Validation,
    infer _State,
    infer Options
  >
    ? TypeFromMany<SingleProps<RawValue>, ManyProps<RawValue>, Many> & Options
    : never;
} & {
  form: FormComponentProps;
  submitButton: ButtonComponentProps;
  resetButton: ButtonComponentProps;
};
