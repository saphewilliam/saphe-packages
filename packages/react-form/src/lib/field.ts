import { FieldValueCrude } from './util';
import {
  StringValidation,
  NumberValidation,
  BooleanValidation,
  SelectValidation,
  ValidationType,
  EmailValidation,
  FileValidation,
  ColorValidation,
} from './validation';

// Used by the consumer to declare the field type
export enum Field {
  TEXT = 'TEXT',
  TEXT_AREA = 'TEXT_AREA',
  SELECT = 'SELECT',
  CHECK = 'CHECK',
  NUMBER = 'NUMBER',
  PASSWORD = 'PASSWORD',
  EMAIL = 'EMAIL',
  FILE = 'FILE',
  COLOR = 'COLOR',

  // RADIO = 'RADIO',
  // DATE = 'DATE',
  // DATETIME = 'DATETIME',
  // TIME = 'TIME',
  // RANGE = 'RANGE',
  // RATING = 'RATING',
  // NEW_PASSWORD = 'NEW_PASSWORD',
  // PHONE = 'PHONE',
  // CRSF = 'CRSF',
  // NOTICE = 'NOTICE',
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

export interface IPassword {
  placeholder?: string;
}

export interface IEmail {
  placeholder?: string;
}

export interface IFile {
  multiple?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IColor {}

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
  // TODO
  // fieldState?: FieldState | ((formState) => FieldState);
}

export type FieldType =
  | TextType
  | TextAreaType
  | SelectType
  | CheckType
  | NumberType
  | PasswordType
  | EmailType
  | FileType
  | ColorType;

export type TextType = FieldBase<Field.TEXT, string, StringValidation> & IText;
export type TextAreaType = FieldBase<Field.TEXT_AREA, string, StringValidation> & ITextArea;
export type SelectType = FieldBase<Field.SELECT, string, SelectValidation> & ISelect;
export type CheckType = FieldBase<Field.CHECK, boolean, BooleanValidation> & ICheck;
export type NumberType = FieldBase<Field.NUMBER, number, NumberValidation> & INumber;
export type PasswordType = FieldBase<Field.PASSWORD, string, StringValidation> & IPassword;
export type EmailType = FieldBase<Field.EMAIL, string, EmailValidation> & IPassword;
export type FileType = FieldBase<Field.FILE, File, FileValidation> & IFile;
export type ColorType = FieldBase<Field.COLOR, string, ColorValidation> & IColor;
