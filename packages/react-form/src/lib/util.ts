import { ReactElement } from 'react';
import * as F from './field';
import * as P from './props';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stringify(source: any): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonReplacer = function (_: string, val: any) {
    if (typeof val === 'function') return val.toString();
    return val;
  };

  return JSON.stringify(source, jsonReplacer);
}

export type AddFieldPack<T> = T & { fieldPack?: FieldPack };

// Used by the consumer to declare a set of fields
export interface Fields {
  [fieldName: string]: F.FieldType;
}

// Find the field value of a field type
export type FieldValue<T extends F.FieldType> = T extends F.CheckType
  ? boolean
  : T extends F.NumberType
  ? number | null
  : T extends F.FileType
  ? File | File[] | null
  : T extends F.DateType
  ? Date | null
  : T extends F.TimeType
  ? Date | null
  : T extends F.DateTimeType
  ? Date | null
  : T extends F.MonthType
  ? Date | null
  : string | null;

export type OptionalFieldValue<T extends F.FieldType> = T extends F.CheckType
  ? boolean
  : T extends F.NumberType
  ? number | null
  : T extends F.FileType
  ? File | null
  : T extends F.DateType
  ? Date | null
  : T extends F.TimeType
  ? Date | null
  : T extends F.DateTimeType
  ? Date | null
  : T extends F.MonthType
  ? Date | null
  : string | null;

export type RequiredFieldValue<T extends F.FieldType> = T extends F.CheckType
  ? boolean
  : T extends F.NumberType
  ? number
  : T extends F.FileType
  ? File
  : T extends F.DateType
  ? Date
  : T extends F.TimeType
  ? Date
  : T extends F.DateTimeType
  ? Date
  : T extends F.MonthType
  ? Date
  : string;

// Crude representation of a field type (avoid using if possible)
export type FieldValueCrude = string | boolean | number | File | File[] | Date | null;

// From https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type SubType<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
  }[keyof Base]
>;

// Object representing the values in the form
export type FormValues<T extends Fields> = Omit<
  {
    [P in keyof T]: OptionalFieldValue<T[P]>;
  } & {
    [P in keyof SubType<T, { validation: { required: string } }>]: RequiredFieldValue<T[P]>;
  },
  keyof SubType<T, { multiple: boolean }>
> & {
  [P in keyof SubType<T, { multiple: boolean }>]: RequiredFieldValue<T[P]>[];
};

export type FormTouched<T extends Fields> = {
  [P in keyof T]: boolean;
};

export type FormErrors<T extends Fields> = {
  [P in keyof T]: string;
};

// Interface used for defining a field component pack
export interface FieldPack {
  [F.Field.TEXT]?: (props: P.TextProps) => ReactElement;
  [F.Field.TEXT_AREA]?: (props: P.TextAreaProps) => ReactElement;
  [F.Field.SELECT]?: (props: P.SelectProps) => ReactElement;
  [F.Field.CHECK]?: (props: P.CheckProps) => ReactElement;
  [F.Field.NUMBER]?: (props: P.NumberProps) => ReactElement;
  [F.Field.PASSWORD]?: (props: P.PasswordProps) => ReactElement;
  [F.Field.NEW_PASSWORD]?: (props: P.NewPasswordProps) => ReactElement;
  [F.Field.EMAIL]?: (props: P.EmailProps) => ReactElement;
  [F.Field.FILE]?: (props: P.FileProps) => ReactElement;
  [F.Field.COLOR]?: (props: P.ColorProps) => ReactElement;
  [F.Field.DATE]?: (props: P.DateProps) => ReactElement;
  [F.Field.TIME]?: (props: P.TimeProps) => ReactElement;
  [F.Field.DATE_TIME]?: (props: P.DateTimeProps) => ReactElement;
  [F.Field.MONTH]?: (props: P.MonthProps) => ReactElement;
  SubmitButton?: (props: P.SubmitButtonProps) => ReactElement;
  FieldContainer?: (props: P.FieldContainerProps) => ReactElement;
}
