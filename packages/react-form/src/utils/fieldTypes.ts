import { FormValue } from './helperTypes';
import {
  StringValidation,
  NumberValidation,
  BooleanValidation,
  SelectValidation,
  IValidation,
} from './validationTypes';

export enum FieldTypes {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
  CHECKBOX = 'CHECKBOX',
  NUMBER = 'NUMBER',
}

export type IField =
  | ITextField
  | ITextAreaField
  | ISelectField
  | ICheckBoxField
  | INumberField;

// Unique properties of the fields

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

export interface ICheckBox {}

export interface INumber {
  placeholder?: number;
}

// Interfaces used by the user to declare fields in their forms

interface IFieldBase<
  T extends FieldTypes,
  U extends FormValue,
  V extends IValidation,
> {
  type: T;
  label: string;
  description?: string;
  initialValue?: U;
  validation?: V;
}

export interface ITextField
  extends IFieldBase<FieldTypes.TEXT, string, StringValidation>,
    IText {}

export interface ITextAreaField
  extends IFieldBase<FieldTypes.TEXTAREA, string, StringValidation>,
    ITextArea {}

export interface ISelectField
  extends IFieldBase<FieldTypes.SELECT, string, SelectValidation>,
    ISelect {}

export interface ICheckBoxField
  extends IFieldBase<FieldTypes.CHECKBOX, boolean, BooleanValidation>,
    ICheckBox {}

export interface INumberField
  extends IFieldBase<FieldTypes.NUMBER, number, NumberValidation>,
    ICheckBox {}
