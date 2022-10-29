import { FieldMany } from './field';
import { State } from './fieldState';
import { FieldValidation } from './validation';

/** Utility type used to define a custom field plugin */
export interface Plugin<
  RawValue,
  Value,
  _Many extends FieldMany,
  Validation extends FieldValidation<Value>,
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
