import { FieldState } from './fieldState';
import { DefineValue } from './util';
import { FieldValidation } from './validation';

export type FieldMany = boolean;

export type Field<
  _RawValue,
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value>,
  Options extends object,
  // TODO why can't I just use Many?
  // TODO plugin: any
> = { plugin: any; many?: boolean } & Omit<FieldOptions<Value, Many, Validation>, 'many'> & Options;

export type Fields<
  Many extends FieldMany = false,
  // TODO
  // @ts-expect-error Somehow this works
  Validation extends FieldValidation<unknown> = unknown,
  // TODO
  // @ts-expect-error Somehow this works
  Options extends object = unknown,
> = Record<string, Field<unknown, unknown, Many, Validation, Options>>;

export interface FieldOptions<
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value>,
> {
  label?: string;
  description?: string;
  many?: Many;
  validation?: Validation;
  initialValue?: DefineValue<Value, Many>;
  state?: FieldState<any>;
}
