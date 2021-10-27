import { ReactNode } from 'react';
import {
  CheckType,
  FieldType,
  ICheck,
  INumber,
  ISelect,
  IText,
  ITextArea,
  NumberType,
  SelectType,
  TextAreaType,
  TextType,
} from './fieldTypes';
import { FieldValue } from './helperTypes';

export interface PropsBase<T extends FieldType> {
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

export type TextProps = PropsBase<TextType> & IText;
export type TextAreaProps = PropsBase<TextAreaType> & ITextArea;
export type SelectProps = PropsBase<SelectType> & ISelect;
export type CheckProps = PropsBase<CheckType> & ICheck;
export type NumberProps = PropsBase<NumberType> & INumber;

export interface SubmitButtonProps {
  isSubmitting: boolean;
}

export interface FormFieldContainerProps {
  children: ReactNode;
}
