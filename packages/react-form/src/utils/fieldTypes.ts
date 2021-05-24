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
  Type extends FieldTypes,
  Value extends FormValue,
  Validation extends IValidation,
> {
  type: Type;
  label: string;
  description?: string;
  initialValue?: Value;
  validation?: Validation;
}

export type ITextField = IFieldBase<FieldTypes.TEXT, string, StringValidation> &
  IText;

export type ITextAreaField = IFieldBase<
  FieldTypes.TEXTAREA,
  string,
  StringValidation
> &
  ITextArea;

export type ISelectField = IFieldBase<
  FieldTypes.SELECT,
  string,
  SelectValidation
> &
  ISelect;

export type ICheckBoxField = IFieldBase<
  FieldTypes.CHECKBOX,
  boolean,
  BooleanValidation
> &
  ICheckBox;

export type INumberField = IFieldBase<
  FieldTypes.NUMBER,
  number,
  NumberValidation
> &
  ICheckBox;
