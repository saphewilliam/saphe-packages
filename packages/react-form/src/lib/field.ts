import { DefineValue } from './util';
import { FieldValidation } from './validation';

export type FieldState = 'enabled' | 'loading' | 'disabled' | 'hidden';
export type FieldMany = boolean;

export type Field<
  Value,
  Many extends FieldMany,
  _Validation extends FieldValidation<Value, Many>,
> = { todo: string };

export type Fields<
  Many extends FieldMany = false,
  // TODO
  // @ts-expect-error Somehow this works
  Validation extends FieldValidation<unknown, Many> = unknown,
> = Record<string, Field<unknown, Many, Validation>>;

export interface FieldOptions<
  Value,
  Many extends FieldMany,
  Validation extends FieldValidation<Value, Many>,
  State extends FieldState,
> {
  label?: string;
  description?: string;
  many?: Many;
  validation?: Validation;
  initialValue?: DefineValue<Value, Many>;
  fieldState?: State; // TODO | (formState) => State;
}
