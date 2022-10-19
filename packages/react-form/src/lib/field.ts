import { DefineValue, MaybePromise } from './util';
import { ValidationMode } from './validation';

export type FieldState = 'enabled' | 'loading' | 'disabled' | 'hidden';
export type FieldMany = boolean;
export type FieldValidation<Value, Many extends FieldMany> = {
  mode?: ValidationMode;
  required?: string;
  validate?: (value: DefineValue<Value, Many>) => MaybePromise<string>;
};

export type Field = { todo: string };

export type FieldSet<F extends Fields | unknown> = { fields: F };

export type Fields = Record<string, Field>;

export type FieldsOrFieldSets = Record<string, Field | FieldSet<unknown>>;

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
