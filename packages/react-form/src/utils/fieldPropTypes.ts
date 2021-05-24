import { ChangeEvent, FocusEvent, ReactElement } from 'react';
import { ISelect, IText, ITextArea, ICheckBox, INumber } from './fieldTypes';
import { FormValue, HTMLField } from './helperTypes';

interface FieldPropsBase<T extends FormValue, E extends HTMLField> {
  id: string;
  name: string;
  label: string;
  description?: string;
  disabled?: boolean;
  error: string;
  value: T;
  onChange: (e: ChangeEvent<E>) => void;
  onBlur: (e: FocusEvent<E>) => void;
}

export interface SubmitButtonProps {
  isSubmitting: boolean;
}

export interface FormFieldContainerProps {
  children: ReactElement;
}

export type TextFieldProps = IText & FieldPropsBase<string, HTMLInputElement>;

export type TextAreaFieldProps = ITextArea &
  FieldPropsBase<string, HTMLTextAreaElement>;

export type SelectFieldProps = ISelect &
  FieldPropsBase<string, HTMLSelectElement>;

export type CheckBoxFieldProps = ICheckBox &
  FieldPropsBase<boolean, HTMLInputElement>;

export type NumberFieldProps = INumber &
  FieldPropsBase<number, HTMLInputElement>;
