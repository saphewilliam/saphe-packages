import { Field, FieldOptions } from './field';
import { FieldMany, FieldState } from './types';
import { FieldValidation } from './validation';

/** Utility type used to define a custom field plugin */
export interface Plugin<
  RawValue,
  Value,
  _Many extends FieldMany,
  Validation extends object,
  _Options extends object,
> {
  /** Optional (default: `null`), define the default initial value for this field, unless otherwise specified by the hook user */
  initialValue?: Value | null;
  /** Optional (default: `(value) => value`), define how to parse a single raw value to an internal value */
  parse?: (value: RawValue) => Value | null;
  /** Optional (default: `(value) => value`), define how to display a single internal value in the raw input */
  serialize?: (value: Value | null) => RawValue;
  /** Optional (default: `() => ''`), define how to validate an internal value. The string returned is the error message shown. '' is no error message */
  validate?: (value: Value | null, validation: Validation & FieldValidation<Value>) => string;
}

/** Type that uses the defined plugins to allow the user to define fields */
export type FieldsBuilder<P extends Plugins> = {
  [K in keyof P]: <
    Many extends ManyFromPlugin<P[K]>,
    Validation extends ValidationFromPlugin<P[K]> & FieldValidation<ValueFromPlugin<P[K]>>,
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

/* eslint-disable @typescript-eslint/no-explicit-any */
export type RawValueFromPlugin<P extends Plugin<any, any, any, any, any>> = P extends Plugin<
  infer RawValue,
  any,
  any,
  any,
  any
>
  ? RawValue
  : never;

export type ValueFromPlugin<P extends Plugin<any, any, any, any, any>> = P extends Plugin<
  any,
  infer Value,
  any,
  any,
  any
>
  ? Value
  : never;

export type ManyFromPlugin<P extends Plugin<any, any, any, any, any>> = P extends Plugin<
  any,
  any,
  infer Many,
  any,
  any
>
  ? Many
  : never;

export type ValidationFromPlugin<P extends Plugin<any, any, any, any, any>> = P extends Plugin<
  any,
  any,
  any,
  infer Validation,
  any
>
  ? Validation
  : never;

export type OptionsFromPlugin<P extends Plugin<any, any, any, any, any>> = P extends Plugin<
  any,
  any,
  any,
  any,
  infer Options
>
  ? Options
  : never;

/** How the user defines a plugins object */
export type Plugins = Record<string, Plugin<any, any, any, any, any>>;
/* eslint-enable */
