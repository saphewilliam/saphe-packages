import { ReactElement } from 'react';
import {
  CheckType,
  Field,
  FieldType,
  NumberType,
  SelectType,
  TextAreaType,
  TextType,
} from './field';
import {
  TextProps,
  TextAreaProps,
  SelectProps,
  CheckProps,
  NumberProps,
  SubmitButtonProps,
  FieldContainerProps,
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
  : T extends TextType
  ? string
  : T extends TextAreaType
  ? string
  : T extends SelectType
  ? string
  : string;

// More crude representation of a field type
export type FieldValueCrude = string | boolean | number | null | File;

// From https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type SubType<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
  }[keyof Base]
>;

// Object representing the values in the form
export type FormValues<T extends Fields> = {
  [P in keyof T]?: FieldValue<T[P]>;
} & {
  [P in keyof SubType<T, { validation: { required: string } } | { type: Field.CHECK }>]: FieldValue<
    T[P]
  >;
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
  SubmitButton?: (props: SubmitButtonProps) => ReactElement;
  FieldContainer?: (props: FieldContainerProps) => ReactElement;
}
