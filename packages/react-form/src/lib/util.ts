import { FieldMany } from './field';
import { FieldValidation } from './validation';

/** Value that may be a promise, or not */
export type MaybePromise<T> = T | Promise<T>;

/** Deduce output type based on a Many value */
export type TypeFromMany<T, ManyT, Many extends FieldMany> = boolean extends Many
  ? T
  : Many extends true
  ? ManyT
  : T;

/** Decude output type based on Validation (required) value */
export type TypeFromRequired<T, Validation extends FieldValidation<T>> = Validation extends {
  required: string;
}
  ? T
  : T | null;

/** Utility type used to generate the `value` type in the form state */
export type OutputValue<
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value>,
> = TypeFromMany<TypeFromRequired<Value, Validation>, TypeFromRequired<Value, Validation>[], Many>;

/** Utility value type used for defining fields */
export type DefineValue<Value, Many extends FieldMany> = TypeFromMany<
  Value | null,
  (Value | null)[],
  Many
>;
