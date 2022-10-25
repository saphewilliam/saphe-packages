import { DefineValue } from './util';
import { FieldValidation } from './validation';

export type FieldState = 'enabled' | 'loading' | 'disabled' | 'hidden';
export type FieldMany = boolean;

export type Field<
  Value = unknown,
  Many extends FieldMany | unknown = unknown,
  _Validation extends FieldValidation<Value, Many> = Record<string, never>,
> = { many: Many };

export type FieldSet<F extends Fields> = { fields: F };

export type Fields = Record<string, Field>;

export type FieldsOrFieldSets<F extends Fields> = Record<string, Field | FieldSet<F>>;

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

export interface FieldSetOptions<F extends Fields> {
  label?: string;
  description?: string;
  // TODO many?: boolean;
  fields: F;
}
