import { ReactNode } from 'react';
import {
  FieldType,
  TextType,
  IText,
  TextAreaType,
  ITextArea,
  SelectType,
  ISelect,
  CheckType,
  ICheck,
  NumberType,
  INumber,
} from './field';
import { FieldValue } from './util';

// Types used by the consumer as props for self-implemented field components
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

export interface FieldContainerProps {
  children: ReactNode;
}
