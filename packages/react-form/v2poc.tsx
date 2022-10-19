import { ReactElement } from 'react';
import { StringValidation } from './src/lib/validation';

// TODO Form<in out T>

// TODO type modifiers (tosnake plugin?)

// TODO field modifiers (tocaps, strip, etc)

// TODO disable fields on loading

// TODO require one of two fields to be set

// TODO localisation

// TODO defineForm() esc helper functions

// TODO form buttons

type MaybePromise<T> = T | Promise<T>;

type FieldPropsBase<Value> = {
  id: string;
  name: string;
  value: Value;
  error: string;
  disabled: boolean;
  describedBy: string;
  onChange: (targetValue: Value) => void;
  onBlur: () => void;
};

type ComponentPropsBase = {
  label: string;
  description: string;
};

export type Props<Value> = ComponentPropsBase & FieldPropsBase<Value>;
export type ManyProps<Value> = ComponentPropsBase & { fields: FieldPropsBase<Value>[] };

export enum ValidationMode {
  ON_CHANGE = 'ON_CHANGE',
  ON_BLUR = 'ON_BLUR',
  AFTER_BLUR = 'AFTER_BLUR',
  ON_SUBMIT = 'ON_SUBMIT',
}

export type FieldState = 'enabled' | 'loading' | 'disabled' | 'hidden';
export type FieldMany = boolean;
export type FieldValidation<Value, Many extends FieldMany> = {
  mode?: ValidationMode;
  required?: string;
  validate?: (value: ManyInternalValue<Value, Many>) => MaybePromise<string>;
};

export type InternalValue<
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value, Many>,
> = ManyInternalValue<RequiredInternalValue<Value, Many, Validation>, Many>;
export type ManyInternalValue<Value, Many extends FieldMany> = Many extends true ? Value[] : Value;
export type RequiredInternalValue<
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value, Many>,
> = Validation extends {
  required: string;
}
  ? Value
  : Value | null;

export interface FieldOptions<
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value, Many>,
  State extends FieldState,
> {
  label?: string;
  description?: string;
  many?: Many;
  validation?: Validation;
  initialValue?: ManyInternalValue<Value, Many>;
  fieldState?: State;
}

interface FieldPlugin<
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value, Many>,
  State extends FieldState,
  Options extends object,
> {
  parse(value: Value): InternalValue<Value, Many, Validation>;
  validate(value: InternalValue<Value, Many, Validation>, validation: Validation): string;
  component(props: Props<Value> & Options): ReactElement;
}

const makeFieldPlugin = <
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value, Many>,
  State extends FieldState,
  Options extends object,
>(
  plugin: FieldPlugin<Value, Many, Validation, State, Options>,
) => plugin;

const textFieldPlugin = makeFieldPlugin<
  string,
  FieldMany, // TODO test with only true or only false
  StringValidation,
  FieldState, // TODO test with subset of types
  { placeholder?: string }
>({
  component: ({ label }) => <h1>{label}</h1>,
  parse: (value) => (Array.isArray(value) ? value.map((v) => v || null) : value || null),
  validate: (value) => (Array.isArray(value) ? value.reduce<string>((prev) => prev, '') : ''),
});

// TODO test other examples
// const numberPlugin: FieldPlugin<string, number | null> = {};
// const checkBoxPlugin: FieldPlugin<boolean, boolean> = {};
// const addressPlugin: FieldPlugin<{ streetName: string; houseNumber: number }> = {};
// const recaptchaPlugin: FieldPlugin<never, string> = {};
// const noticePlugin: FieldPlugin<never, never> = {};

type Plugins = {
  fields: Record<string, FieldPlugin<any, any, any, any, any>>;
};
type Field = any;
type Fields = Record<string, Field>;

const plugins = {
  fields: {
    text: textFieldPlugin,
  },
};

type ValueFromFieldPlugin<Plugin extends FieldPlugin<any, any, any, any, any>> =
  Plugin extends FieldPlugin<infer Value, any, any, any, any> ? Value : never;

type FieldManyFromFieldPlugin<Plugin extends FieldPlugin<any, any, any, any, any>> =
  Plugin extends FieldPlugin<any, infer Many, any, any, any> ? Many : never;

type FieldValidationFromFieldPlugin<Plugin extends FieldPlugin<any, any, any, any, any>> =
  Plugin extends FieldPlugin<any, any, infer Validation, any, any> ? Validation : never;

type FieldStateFromFieldPlugin<Plugin extends FieldPlugin<any, any, any, any, any>> =
  Plugin extends FieldPlugin<any, any, any, infer State, any> ? State : never;

type FieldOptionsFromFieldPlugin<Plugin extends FieldPlugin<any, any, any, any, any>> =
  Plugin extends FieldPlugin<any, any, any, any, infer Options> ? Options : never;

type FormBuilder<P extends Plugins> = {
  field: {
    [K in keyof P['fields']]: <
      Many extends FieldManyFromFieldPlugin<P['fields'][K]>,
      Validation extends FieldValidationFromFieldPlugin<P['fields'][K]>,
      State extends FieldStateFromFieldPlugin<P['fields'][K]>,
    >(
      t: FieldOptions<ValueFromFieldPlugin<P['fields'][K]>, Many, Validation, State> &
        FieldOptionsFromFieldPlugin<P['fields'][K]>,
    ) => Field;
  };
  fieldSet: (opts: { label?: string; description?: string; fields: Fields }) => FieldSet;
};

interface FormState {
  fields: { name: string; value: any; internalValue: any; touched: boolean; error: string };
}

interface FormConfig<P extends Plugins, F extends Fields /*or fieldsets? */> {
  fields: (t: FormBuilder<P>) => F;
  changeEffect?: (formState: any, fieldName: string, fieldIndex: number) => MaybePromise<FormState>;
  blurEffect?: (formState: any, fieldName: string, fieldIndex: number) => MaybePromise<FormState>;
  onSubmit?: (formState: any) => MaybePromise<FormState>;
}

function useForm<P extends Plugins, F extends Fields>(
  plugins: P,
  config: FormConfig<P, F>,
): FormState {
  return {};
}

const form = useForm(plugins, {
  fields: (t) => ({
    text: t.field.text({
      validation: {},
      // many: true,
      initialValue: ['hello'],
    }),
    others: t.fieldSet({
      fields: {
        anotherText: t.field.text({ many: true }),
      },
    }),
  }),
});
