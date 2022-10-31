import { FieldMany, FieldState } from './types';
import { DefineValue } from './util';
import { FieldValidation } from './validation';
import { Plugin } from './plugin';

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
  _RawValue = unknown,
  Value = unknown,
  Many extends FieldMany = false,
  // TODO aaaaaah
  Validation extends object = object,
  State extends FieldState = FieldState,
  Options extends object = object,
  // TODO why can't I just use Many?
> = { plugin: Plugin<unknown, unknown, false, object, object>; many?: boolean } & Omit<
  FieldOptions<Value, Many, Validation, State>,
  'many'
> &
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
