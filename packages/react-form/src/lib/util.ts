import { FieldMany, FieldValidation } from './field';

/** Value that may be a promise, or not */
export type MaybePromise<T> = T | Promise<T>;

/** Utility value type used to generate the submit field type */
export type OutputValue<
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value, Many>,
> = ManyOutputValue<RequiredOutputValue<Value, Many, Validation>, Many>;

/** Utility value type used for defining fields */
export type DefineValue<Value, Many extends FieldMany> = ManyOutputValue<
  RequiredOutputValue<Value, Many, { required: undefined }>,
  Many
>;

/** Utility value type for internal use */
export type InternalValue<Value> = (Value | null)[] | (Value | null);

type ManyOutputValue<Value, Many extends FieldMany> = boolean extends Many
  ? Value
  : Many extends true
  ? Value[]
  : Value;

type RequiredOutputValue<
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value, Many>,
> = Validation extends {
  required: string;
}
  ? Value
  : Value | null;
