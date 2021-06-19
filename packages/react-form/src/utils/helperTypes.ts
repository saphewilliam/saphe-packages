import { ReactElement } from 'react';
import {
  ITextField,
  ITextAreaField,
  ISelectField,
  ICheckBoxField,
  INumberField,
  IField,
  FieldTypes,
} from './fieldTypes';
import {
  FormFieldContainerProps,
  SubmitButtonProps,
  TextFieldProps,
  TextAreaFieldProps,
  SelectFieldProps,
  CheckBoxFieldProps,
  NumberFieldProps,
} from './propTypes';

export type AddFieldPack<T> = T & { fieldPack?: FieldPack };

export type HTMLField =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export interface Fields {
  [fieldName: string]: IField;
}

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

// From https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type SubType<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
  }[keyof Base]
>;

export type FormValues<T extends Fields> = {
  [P in keyof T]?: FieldValue<T[P]>;
} &
  {
    [P in keyof SubType<T, { validation: { required: string } }>]: FieldValue<
      T[P]
    >;
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
