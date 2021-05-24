import { ReactElement } from 'react';
import {
  FormFieldContainerProps,
  SubmitButtonProps,
  TextFieldProps,
  TextAreaFieldProps,
  SelectFieldProps,
  CheckBoxFieldProps,
  NumberFieldProps,
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

export type HTMLField =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | HTMLSelectElement // FIXME checkbox element
  | HTMLSelectElement; // FIXME number element

export interface Fields {
  [fieldName: string]: IField;
}

export type FormValue = string | boolean | number | null;

export type FieldValue<T extends IField> = T extends ITextField
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
  SubmitButton?: (props: SubmitButtonProps) => ReactElement;
  FormFieldContainer?: (props: FormFieldContainerProps) => ReactElement;
  [FieldTypes.TEXT]?: (props: TextFieldProps) => ReactElement;
  [FieldTypes.TEXTAREA]?: (props: TextAreaFieldProps) => ReactElement;
  [FieldTypes.SELECT]?: (props: SelectFieldProps) => ReactElement;
  [FieldTypes.CHECKBOX]?: (props: CheckBoxFieldProps) => ReactElement;
  [FieldTypes.NUMBER]?: (props: NumberFieldProps) => ReactElement;
}
