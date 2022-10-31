import { Field, FieldOptions, Fields } from './field';
import {
  Plugins,
  ManyFromPlugin,
  OptionsFromPlugin,
  RawValueFromPlugin,
  ValueFromPlugin,
  ValidationFromPlugin,
} from './plugin';
import { ManyProps, Props } from './props';
import { MaybePromise, OutputValue, TypeFromMany } from './util';
import { FieldValidation } from './validation';
import { UseAsyncReducerTypes } from '@saphe/react-use';

// TODO defineField -esc helper functions for better code splitting
// TODO extract props from plugin for defining components

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

/** Type that uses the defined plugins to allow the user to define fields */
export type FieldsBuilder<P extends Plugins> = {
  [K in keyof P]: <
    Many extends ManyFromPlugin<P[K]>,
    Validation extends ValidationFromPlugin<P[K]>,
    State extends FieldState,
  >(
    t: FieldOptions<ValueFromPlugin<P[K]>, Many, Validation, State> & OptionsFromPlugin<P[K]>,
  ) => Field<
    RawValueFromPlugin<P[K]>,
    ValueFromPlugin<P[K]>,
    Many,
    Validation,
    State,
    OptionsFromPlugin<P[K]>
  >;
};

interface ButtonConfig {
  /** Optional, the text displayed on the button */
  label?: string;
  /** Optional, the text displayed on the button while the form is performing the action */
  loadingLabel?: string;
}

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
  /** Optional, configures the form's submit button */
  submitButton?: ButtonConfig;
  /** Optional, configures the form's reset button */
  resetButton?: ButtonConfig;
  /** Optional, synchronous function that fires on a form field change event */
  onChange?: (
    formState: FormState<F>,
    // TODO enumerate all possible form values
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
  /** Optional, defines what should happen when the form state is initialized */
  // TODO allow user to pass a promise onInit (when useAsyncReducer supports this)
  onInit?: (initialFormState: FormState<F>) => FormState<F> | void;
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
  value: OutputValue<Value, Many, Validation, State>;
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
    onClick: (e?: { preventDefault: () => void }) => void;
  };
};
