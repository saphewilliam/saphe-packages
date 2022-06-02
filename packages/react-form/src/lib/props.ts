import { ReactNode } from 'react';
import * as F from './field';
import { FieldValue } from './util';

// Types used by the consumer as props for self-implemented field components
export interface PropsBase<T extends F.FieldType> {
  id: string;
  name: string;
  label: string;
  description: string;
  describedBy: string;
  disabled: boolean;
  error: string;
  value: FieldValue<T>;
  onChange: (targetValue: FieldValue<T>) => void;
  onBlur: () => void;
}

export type TextProps = PropsBase<F.TextType> & F.IText;
export type TextAreaProps = PropsBase<F.TextAreaType> & F.ITextArea;
export type SelectProps = PropsBase<F.SelectType> & F.ISelect;
export type CheckProps = PropsBase<F.CheckType> & F.ICheck;
export type NumberProps = PropsBase<F.NumberType> & F.INumber;
export type PasswordProps = PropsBase<F.PasswordType> & F.IPassword;
export type NewPasswordProps = PropsBase<F.NewPasswordType> & F.INewPassword;
export type EmailProps = PropsBase<F.EmailType> & F.IEmail;
export type FileProps = PropsBase<F.FileType> & F.IFile;
export type ColorProps = PropsBase<F.ColorType> & F.IColor;
export type DateProps = PropsBase<F.DateType> & F.IDate;
export type TimeProps = PropsBase<F.TimeType> & F.ITime;
export type DateTimeProps = PropsBase<F.DateTimeType> & F.IDateTime;
export type MonthProps = PropsBase<F.MonthType> & F.IMonth;

export interface SubmitButtonProps {
  isLoading: boolean;
  label: string;
  disabled: boolean;
  type: 'submit' | 'button';
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface FieldContainerProps {
  children: ReactNode;
}
