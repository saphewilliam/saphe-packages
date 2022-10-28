import { FieldMany, FieldState, FieldOptions, Field } from './field';
import { FieldValidation } from './validation';

/** Utility type used to define a custom field plugin */
export interface Plugin<
  RawValue,
  Value,
  _Many extends FieldMany,
  Validation extends FieldValidation<Value>,
  State extends FieldState,
  _Options extends object,
> {
  initialValue: Value | null;
  /** Define how to parse a single raw value to an internal value */
  parse(value: RawValue): Value | null;
  /** Define how to display a single internal value in the raw input */
  serialize(value: Value | null): RawValue;
  /** Define how to validate an internal value. The string returned is the error message shown. '' is no error message */
  validate(value: Value | null, validation: Validation, state: State): string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type RawValueFromPlugin<P extends Plugin<any, any, any, any, any, any>> = P extends Plugin<
  infer RawValue,
  any,
  any,
  any,
  any,
  any
>
  ? RawValue
  : never;

export type ValueFromPlugin<P extends Plugin<any, any, any, any, any, any>> = P extends Plugin<
  any,
  infer Value,
  any,
  any,
  any,
  any
>
  ? Value
  : never;

export type ManyFromPlugin<P extends Plugin<any, any, any, any, any, any>> = P extends Plugin<
  any,
  any,
  infer Many,
  any,
  any,
  any
>
  ? Many
  : never;

export type ValidationFromPlugin<P extends Plugin<any, any, any, any, any, any>> = P extends Plugin<
  any,
  any,
  any,
  infer Validation,
  any,
  any
>
  ? Validation
  : never;

export type StateFromPlugin<P extends Plugin<any, any, any, any, any, any>> = P extends Plugin<
  any,
  any,
  any,
  any,
  infer State,
  any
>
  ? State
  : never;

export type OptionsFromPlugin<P extends Plugin<any, any, any, any, any, any>> = P extends Plugin<
  any,
  any,
  any,
  any,
  any,
  infer Options
>
  ? Options
  : never;

/** How the user defines a plugins object */
export type Plugins = Record<string, Plugin<any, any, any, any, any, any>>;
/* eslint-enable */

/** Type that uses the defined plugins to allow the user to define fields */
export type FieldsBuilder<P extends Plugins> = {
  [K in keyof P]: <
    Many extends ManyFromPlugin<P[K]>,
    Validation extends FieldValidation<ValueFromPlugin<P[K]>>,
    State extends StateFromPlugin<P[K]>,
  >(
    t: FieldOptions<
      ValueFromPlugin<P[K]>,
      Many,
      Validation /* TODO & ValidationFromFieldPlugin<P['fields'][K]>*/,
      State
    > &
      OptionsFromPlugin<P[K]>,
  ) => Field<
    RawValueFromPlugin<P[K]>,
    ValueFromPlugin<P[K]>,
    Many,
    Validation,
    State,
    OptionsFromPlugin<P[K]>
  >;
};
