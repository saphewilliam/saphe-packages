import {
  StringValidation,
  NumberValidation,
  BooleanValidation,
  SelectValidation,
  ValidationType,
} from './validationTypes';

/** Used by the consumer to declare the field type */
export enum Field {
  TEXT = 'TEXT',
  TEXT_AREA = 'TEXT_AREA',
  SELECT = 'SELECT',
  CHECK = 'CHECK',
  NUMBER = 'NUMBER',
}

/** Field generelization type */
export type FieldType = TextType | TextAreaType | SelectType | CheckType | NumberType;

// Unique properties of the different fields
export interface IText {
  placeholder?: string;
}

export interface ITextArea {
  placeholder?: string;
  rows?: number;
}

export interface ISelect {
  placeholder?: string;
  options: { label: string; value: string }[];
}

export interface ICheck {}

export interface INumber {
  placeholder?: string;
}

// Types used by the user to declare fields
interface FieldBase<
  Type extends Field,
  Value extends string | boolean | number | File,
  Validation extends ValidationType,
> {
  type: Type;
  label: string;
  description?: string;
  initialValue?: Value;
  validation?: Validation;
}

export type TextType = FieldBase<Field.TEXT, string, StringValidation> & IText;

export type TextAreaType = FieldBase<Field.TEXT_AREA, string, StringValidation> & ITextArea;

export type SelectType = FieldBase<Field.SELECT, string, SelectValidation> & ISelect;

export type CheckType = FieldBase<Field.CHECK, boolean, BooleanValidation> & ICheck;

export type NumberType = FieldBase<Field.NUMBER, number, NumberValidation> & INumber;
