import { ChangeEvent, FocusEvent } from 'react';

export enum FieldTypes {
  TEXT,
  TEXTAREA,
  SELECT,
}

export enum FormStyles {
  BOOTSTRAP,
  MATERIAL,
}

export enum ValidationModes {
  ON_CHANGE,
  ON_BLUR,
  AFTER_BLUR,
  ON_SUBMIT,
}

// Unique properties of the fields

interface IText {
  placeholder?: FieldValue<ITextField>;
}

interface ITextArea {
  placeholder?: FieldValue<ITextAreaField>;
  rows?: number;
}

interface ISelect {
  placeholder?: FieldValue<ISelectField>;
  options: { label: string; value: FieldValue<ISelectField> }[];
}

// Interfaces used by the user to declare fields

interface IFieldBase {
  label: string;
  description?: string;
  validation?: {
    // mode?: ValidationModes;
    required?: string;
  };
}

export interface ITextField extends IFieldBase, IText {
  type: FieldTypes.TEXT;
  initialValue?: FieldValue<ITextField>;
}

export interface ITextAreaField extends IFieldBase, ITextArea {
  type: FieldTypes.TEXTAREA;
  initialValue?: FieldValue<ITextAreaField>;
}

export interface ISelectField extends IFieldBase, ISelect {
  type: FieldTypes.SELECT;
  initialValue?: FieldValue<ISelectField>;
}

// Interfaces used by a developer to develop field components

export interface FieldProps<T extends IField, E extends HTMLField> {
  name: string;
  label: string;
  description?: string;
  error: string;
  value: FieldValue<T>;
  onChange: (e: ChangeEvent<E>) => void;
  onBlur: (e: FocusEvent<E>) => void;
}

export type TextFieldProps = IText & FieldProps<ITextField, HTMLInputElement>;

export type TextAreaFieldProps = ITextArea &
  FieldProps<ITextAreaField, HTMLTextAreaElement>;

export type SelectFieldProps = ISelect &
  FieldProps<ISelectField, HTMLSelectElement>;

// Helpers

export type HTMLField =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;
export type IField = ITextField | ITextAreaField | ISelectField;

export interface Fields {
  [fieldName: string]: IField;
}

export type FieldValue<T extends IField> = T extends ITextField
  ? string
  : T extends ITextAreaField
  ? string
  : T extends ISelectField
  ? string
  : 'Unkown Form Field';

export type FormValues<T extends Fields> = {
  [P in keyof T]: FieldValue<T[P]>;
};
