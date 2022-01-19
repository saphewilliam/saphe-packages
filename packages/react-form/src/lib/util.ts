import { ReactElement } from 'react';
import { CheckType, Field, FieldType, FileType, NumberType } from './field';
import {
  TextProps,
  TextAreaProps,
  SelectProps,
  CheckProps,
  NumberProps,
  SubmitButtonProps,
  FieldContainerProps,
  PasswordProps,
  EmailProps,
  FileProps,
} from './props';

export type AddFieldPack<T> = T & { fieldPack?: FieldPack };

// Used by the consumer to declare a set of fields
export interface Fields {
  [fieldName: string]: FieldType;
}

// Find the field value of a field type
export type FieldValue<T extends FieldType> = T extends CheckType
  ? boolean
  : T extends NumberType
  ? number | null
  : T extends FileType
  ? File | null
  : string | null;

export type RequiredFieldValue<T extends FieldType> = T extends CheckType
  ? boolean
  : T extends NumberType
  ? number
  : T extends FileType
  ? File
  : string;

// Crude representation of a field type (avoid using if possible)
export type FieldValueCrude = string | boolean | number | File | null;

// From https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type SubType<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
  }[keyof Base]
>;

// Object representing the values in the form
export type FormValues<T extends Fields> = {
  [P in keyof T]: FieldValue<T[P]>;
} & {
  [P in keyof SubType<T, { validation: { required: string } }>]: RequiredFieldValue<T[P]>;
};

export type FormTouched<T extends Fields> = {
  [P in keyof T]: boolean;
};

export type FormErrors<T extends Fields> = {
  [P in keyof T]: string;
};

// Interface used for defining a field component pack
export interface FieldPack {
  [Field.TEXT]?: (props: TextProps) => ReactElement;
  [Field.TEXT_AREA]?: (props: TextAreaProps) => ReactElement;
  [Field.SELECT]?: (props: SelectProps) => ReactElement;
  [Field.CHECK]?: (props: CheckProps) => ReactElement;
  [Field.NUMBER]?: (props: NumberProps) => ReactElement;
  [Field.PASSWORD]?: (props: PasswordProps) => ReactElement;
  [Field.EMAIL]?: (props: EmailProps) => ReactElement;
  [Field.FILE]?: (props: FileProps) => ReactElement;
  SubmitButton?: (props: SubmitButtonProps) => ReactElement;
  FieldContainer?: (props: FieldContainerProps) => ReactElement;
}
