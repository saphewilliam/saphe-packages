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
  DateValidation,
} from './validation';

// Used by the consumer to declare the field type
export enum Field {
  TEXT = 'TEXT',
  TEXT_AREA = 'TEXT_AREA',
  SELECT = 'SELECT',
  CHECK = 'CHECK',
  NUMBER = 'NUMBER',
  PASSWORD = 'PASSWORD',
  NEW_PASSWORD = 'NEW_PASSWORD',
  EMAIL = 'EMAIL',
  FILE = 'FILE',
  COLOR = 'COLOR',
  DATE = 'DATE',
  TIME = 'TIME',
  DATE_TIME = 'DATE_TIME',
  MONTH = 'MONTH',

  // IMAGE = 'IMAGE',
  // RADIO = 'RADIO',
  // RANGE = 'RANGE',
  // PHONE = 'PHONE',
  // RATING = 'RATING',
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

export interface INewPassword {
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDate {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITime {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDateTime {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMonth {}

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

export type TextType = FieldBase<Field.TEXT, string, StringValidation> & IText;
export type TextAreaType = FieldBase<Field.TEXT_AREA, string, StringValidation> & ITextArea;
export type SelectType = FieldBase<Field.SELECT, string, SelectValidation> & ISelect;
export type CheckType = FieldBase<Field.CHECK, boolean, BooleanValidation> & ICheck;
export type NumberType = FieldBase<Field.NUMBER, number, NumberValidation> & INumber;
export type PasswordType = FieldBase<Field.PASSWORD, string, StringValidation> & IPassword;
export type NewPasswordType = FieldBase<Field.NEW_PASSWORD, string, StringValidation> &
  INewPassword;
export type EmailType = FieldBase<Field.EMAIL, string, EmailValidation> & IPassword;
export type FileType = FieldBase<Field.FILE, File, FileValidation> & IFile;
export type ColorType = FieldBase<Field.COLOR, string, ColorValidation> & IColor;
export type DateType = FieldBase<Field.DATE, Date, DateValidation> & IDate;
export type TimeType = FieldBase<Field.TIME, Date, DateValidation> & ITime;
export type DateTimeType = FieldBase<Field.DATE_TIME, Date, DateValidation> & IDateTime;
export type MonthType = FieldBase<Field.MONTH, Date, DateValidation> & IMonth;

export type FieldType =
  | TextType
  | TextAreaType
  | SelectType
  | CheckType
  | NumberType
  | PasswordType
  | NewPasswordType
  | EmailType
  | FileType
  | ColorType
  | DateType
  | TimeType
  | DateTimeType
  | MonthType;
