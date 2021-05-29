import { ChangeEvent, FocusEvent, ReactNode } from 'react';
import { ISelect, IText, ITextArea, ICheckBox, INumber } from './fieldTypes';
import { HTMLField } from './helperTypes';

interface FieldPropsBase<T extends HTMLField> {
  id: string;
  name: string;
  label: string;
  describedBy: string;
  description?: string;
  disabled?: boolean;
  error: string;
  value: string;
  onChange: (e: ChangeEvent<T>) => void;
  onBlur: (e: FocusEvent<T>) => void;
}

export interface SubmitButtonProps {
  isSubmitting: boolean;
}

export interface FormFieldContainerProps {
  children: ReactNode;
}

export type TextFieldProps = IText & FieldPropsBase<HTMLInputElement>;

export type TextAreaFieldProps = ITextArea &
  FieldPropsBase<HTMLTextAreaElement>;

export type SelectFieldProps = ISelect & FieldPropsBase<HTMLSelectElement>;

export type CheckBoxFieldProps = ICheckBox & FieldPropsBase<HTMLInputElement>;

export type NumberFieldProps = INumber & FieldPropsBase<HTMLInputElement>;
