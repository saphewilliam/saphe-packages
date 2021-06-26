import { ReactElement } from 'react';
import { Field, FieldType, CheckType, NumberType } from './fieldTypes';
import {
  TextProps,
  TextAreaProps,
  SelectProps,
  CheckProps,
  NumberProps,
  FormFieldContainerProps,
  SubmitButtonProps,
} from './propTypes';

export type AddFieldPack<T> = T & { fieldPack?: FieldPack };

export interface Fields {
  [fieldName: string]: FieldType;
}

// TODO embed null into this type
export type FieldValue<T extends FieldType> = T extends CheckType
  ? boolean
  : T extends NumberType
  ? number
  : string;

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
  [Field.TEXT]?: (props: TextProps) => ReactElement;
  [Field.TEXT_AREA]?: (props: TextAreaProps) => ReactElement;
  [Field.SELECT]?: (props: SelectProps) => ReactElement;
  [Field.CHECK]?: (props: CheckProps) => ReactElement;
  [Field.NUMBER]?: (props: NumberProps) => ReactElement;
}
