import { FieldMany } from './field';
import { FieldValidation } from './validation';

/** Value that may be a promise, or not */
export type MaybePromise<T> = T | Promise<T>;

/** Utility value type used to generate the submit field type */
export type OutputValue<
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value>,
> = ManyOutputValue<RequiredOutputValue<Value, Validation>, Many>;

/** Utility value type used for defining fields */
export type DefineValue<Value, Many extends FieldMany> = ManyOutputValue<
  RequiredOutputValue<Value, { required: undefined }>,
  Many
>;

/** Utility value type for internal use */
export type InternalValue<Value> = (Value | null)[] | (Value | null);

type ManyOutputValue<Value, Many extends FieldMany> = boolean extends Many
  ? Value
  : Many extends true
  ? Value[]
  : Value;

type RequiredOutputValue<Value, Validation extends FieldValidation<Value>> = Validation extends {
  required: string;
}
  ? Value
  : Value | null;
