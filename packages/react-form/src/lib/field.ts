import { FieldMany, FieldState } from './types';
import { DefineValue } from './util';
import { FieldValidation } from './validation';

export type Fields<
  Many extends FieldMany = false,
  // TODO
  // @ts-expect-error Somehow this works
  Validation extends FieldValidation<unknown> = unknown,
  // TODO
  // @ts-expect-error Somehow this works
  State extends FieldState = unknown,
  // TODO
  // @ts-expect-error Somehow this works
  Options extends object = unknown,
> = Record<string, Field<unknown, unknown, Many, Validation, State, Options>>;

export type Field<
  _RawValue,
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value>,
  State extends FieldState,
  Options extends object,
  // TODO why can't I just use Many?
  // TODO plugin: any
> = { plugin: any; many?: boolean } & Omit<FieldOptions<Value, Many, Validation, State>, 'many'> &
  Options;

export interface FieldOptions<
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value>,
  State extends FieldState,
> {
  label?: string;
  description?: string;
  many?: Many;
  validation?: Validation;
  initialValue?: DefineValue<Value, Many>;
  initialState?: State;
}
