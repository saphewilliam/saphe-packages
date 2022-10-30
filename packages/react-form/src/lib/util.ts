import { FieldMany, FieldState } from './types';
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

export type TypeFromFieldState<T, EnabledT, State extends FieldState> = FieldState extends State
  ? EnabledT
  : State extends FieldState.ENABLED
  ? EnabledT
  : T;

/** Utility type used to generate the `value` type in the form state */
export type OutputValue<
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value>,
  State extends FieldState = FieldState.ENABLED,
> = TypeFromFieldState<
  TypeFromMany<Value | null, (Value | null)[], Many>,
  TypeFromMany<TypeFromRequired<Value, Validation>, TypeFromRequired<Value, Validation>[], Many>,
  State
>;

/** Utility value type used for defining fields */
export type DefineValue<Value, Many extends FieldMany> = TypeFromMany<
  Value | null,
  (Value | null)[],
  Many
>;
