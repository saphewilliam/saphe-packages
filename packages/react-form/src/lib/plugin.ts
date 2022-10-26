import { FieldMany, FieldState, FieldOptions, Field } from './field';
import { FieldValidation } from './validation';

/** Utility type used to define a custom field plugin */
export interface FieldPlugin<
  RawValue,
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value, Many>,
  State extends FieldState,
  _Options extends object,
> {
  defaultInitialValue: Value | null;
  /** Define how to parse a single raw value to an internal value */
  parse(value: RawValue): Value | null;
  /** Define how to display a single internal value in the raw input */
  serialize(value: Value | null): RawValue;
  /** Define how to validate an internal value. The string returned is the error message shown. '' is no error message */
  validate(value: Value | null, validation: Validation, state: State): string;
  /** The component that renders // TODO do you even want this? */
  // component(props: Props<RawValue> & Options): ReactElement;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type RawValueFromFieldPlugin<Plugin extends FieldPlugin<any, any, any, any, any, any>> =
  Plugin extends FieldPlugin<infer RawValue, any, any, any, any, any> ? RawValue : never;

export type ValueFromFieldPlugin<Plugin extends FieldPlugin<any, any, any, any, any, any>> =
  Plugin extends FieldPlugin<any, infer Value, any, any, any, any> ? Value : never;

export type ManyFromFieldPlugin<Plugin extends FieldPlugin<any, any, any, any, any, any>> =
  Plugin extends FieldPlugin<any, any, infer Many, any, any, any> ? Many : never;

export type ValidationFromFieldPlugin<Plugin extends FieldPlugin<any, any, any, any, any, any>> =
  Plugin extends FieldPlugin<any, any, any, infer Validation, any, any> ? Validation : never;

export type StateFromFieldPlugin<Plugin extends FieldPlugin<any, any, any, any, any, any>> =
  Plugin extends FieldPlugin<any, any, any, any, infer State, any> ? State : never;

export type OptionsFromFieldPlugin<Plugin extends FieldPlugin<any, any, any, any, any, any>> =
  Plugin extends FieldPlugin<any, any, any, any, any, infer Options> ? Options : never;

/** How the user defines a plugins object */
export type Plugins = {
  fields: Record<string, FieldPlugin<any, any, any, any, any, any>>;
};
/* eslint-enable */

/** Type that uses the defined plugins to allow the user to define fields */
export type FieldsBuilder<P extends Plugins> = {
  field: {
    [K in keyof P['fields']]: <
      Many extends ManyFromFieldPlugin<P['fields'][K]>,
      Validation extends FieldValidation<ValueFromFieldPlugin<P['fields'][K]>, Many>,
      State extends StateFromFieldPlugin<P['fields'][K]>,
    >(
      t: FieldOptions<
        ValueFromFieldPlugin<P['fields'][K]>,
        Many,
        Validation /* TODO & ValidationFromFieldPlugin<P['fields'][K]>*/,
        State
      > &
        OptionsFromFieldPlugin<P['fields'][K]>,
    ) => Field<
      RawValueFromFieldPlugin<P['fields'][K]>,
      ValueFromFieldPlugin<P['fields'][K]>,
      Many,
      Validation,
      State,
      OptionsFromFieldPlugin<P['fields'][K]>
    >;
  };
};

export const textFieldPlugin: FieldPlugin<
  string,
  string,
  FieldMany,
  FieldValidation<string, FieldMany>, // TODO StringValidation,
  FieldState,
  { placeholder?: string }
> = {
  defaultInitialValue: null,
  parse: (value) => value || null,
  serialize: (value) => value ?? '',
  validate: () => '',
};

export const numberFieldPlugin: FieldPlugin<
  string,
  number,
  FieldMany,
  FieldValidation<number, FieldMany>, // TODO NumberValidation,
  FieldState,
  { placeholder?: string }
> = {
  defaultInitialValue: null,
  parse: (value) => {
    const parsedValue = parseFloat(value);
    return !isNaN(parsedValue) ? parsedValue : null;
  },
  serialize: (value) => value?.toString() ?? '',
  validate: () => '',
};

// TODO test other examples
// const checkBoxPlugin: FieldPlugin<boolean, boolean> = {};
// const addressPlugin: FieldPlugin<{ streetName: string; houseNumber: number }> = {};
// const recaptchaPlugin: FieldPlugin<never, string> = {};
// const noticePlugin: FieldPlugin<never, never> = {};
