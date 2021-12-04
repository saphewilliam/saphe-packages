import { FieldValueCrude } from './util';
import {
  StringValidation,
  NumberValidation,
  BooleanValidation,
  SelectValidation,
  ValidationType,
} from './validation';

// Used by the consumer to declare the field type
export enum Field {
  TEXT = 'TEXT',
  TEXT_AREA = 'TEXT_AREA',
  SELECT = 'SELECT',
  CHECK = 'CHECK',
  NUMBER = 'NUMBER',

  // FILE = "FILE",
  // RADIO = "RADIO",
  // DATE = "DATE",
  // DATETIME = "DATETIME",
  // TIME = "TIME",
  // RANGE = "RANGE",
  // RATING = "RATING",
  // EMAIL = "EMAIL",
  // PASSWORD = "PASSWORD",
  // NEW_PASSWORD = "NEW_PASSWORD",
  // PHONE = "PHONE",
  // COLOR = "COLOR",
  // CRSF = "CRSF",
  // NOTICE = "NOTICE",
}

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
  options: { value: string; label?: string }[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICheck {}

export interface INumber {
  placeholder?: string;
}

// Types used by the consumer to declare fields
interface FieldBase<
  Type extends Field,
  Value extends FieldValueCrude,
  Validation extends ValidationType,
> {
  type: Type;
  label?: string;
  description?: string;
  initialValue?: Value;
  validation?: Validation;
}

export type FieldType = TextType | TextAreaType | SelectType | CheckType | NumberType;

export type TextType = FieldBase<Field.TEXT, string, StringValidation> & IText;
export type TextAreaType = FieldBase<Field.TEXT_AREA, string, StringValidation> & ITextArea;
export type SelectType = FieldBase<Field.SELECT, string, SelectValidation> & ISelect;
export type CheckType = FieldBase<Field.CHECK, boolean, BooleanValidation> & ICheck;
export type NumberType = FieldBase<Field.NUMBER, number | null, NumberValidation> & INumber;
