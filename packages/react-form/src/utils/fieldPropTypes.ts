import { ChangeEvent, FocusEvent } from 'react';
import { ISelect, IText, ITextArea, ICheckBox, INumber } from './fieldTypes';
import { FormValue } from './helperTypes';

type HTMLField =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | HTMLSelectElement // FIXME checkbox element
  | HTMLSelectElement; // FIXME checkbox element

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

export type TextFieldProps = IText & FieldPropsBase<string, HTMLInputElement>;

export type TextAreaFieldProps = ITextArea &
  FieldPropsBase<string, HTMLTextAreaElement>;

export type SelectFieldProps = ISelect &
  FieldPropsBase<string, HTMLSelectElement>;

export type CheckBoxFieldProps = ICheckBox &
  FieldPropsBase<boolean, HTMLInputElement>;

export type NumberFieldProps = INumber &
  FieldPropsBase<number, HTMLInputElement>;
