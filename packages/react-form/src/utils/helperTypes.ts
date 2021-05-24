import { ReactElement } from 'react';
import {
  CheckBoxFieldProps,
  NumberFieldProps,
  SelectFieldProps,
  TextAreaFieldProps,
  TextFieldProps,
} from './fieldPropTypes';
import {
  ITextField,
  ITextAreaField,
  ISelectField,
  ICheckBoxField,
  INumberField,
  IField,
  FieldTypes,
} from './fieldTypes';

export interface Fields {
  [fieldName: string]: IField;
}

export type FormValue = string | boolean | number;

type FieldValue<T extends IField> = T extends ITextField
  ? string
  : T extends ITextAreaField
  ? string
  : T extends ISelectField
  ? string
  : T extends ICheckBoxField
  ? boolean
  : T extends INumberField
  ? number
  : 'Unkown Form Field';

// TODO Make it so that required fields are not optional
export type FormValues<T extends Fields> = {
  [P in keyof T]?: FieldValue<T[P]>;
};

export interface FieldPack {
  [FieldTypes.TEXT]?: (props: TextFieldProps) => ReactElement;
  [FieldTypes.TEXTAREA]?: (props: TextAreaFieldProps) => ReactElement;
  [FieldTypes.SELECT]?: (props: SelectFieldProps) => ReactElement;
  [FieldTypes.CHECKBOX]?: (props: CheckBoxFieldProps) => ReactElement;
  [FieldTypes.NUMBER]?: (props: NumberFieldProps) => ReactElement;
}
