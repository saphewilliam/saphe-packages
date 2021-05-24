import { FieldTypes } from '..';
import { IField } from './fieldTypes';
import { FormValue, Fields, FormValues } from './helperTypes';

export interface FormState<T extends Fields> {
  touched: Record<string, boolean>;
  errors: Record<string, string>;
  values: FormValues<T>;
}

export function getDefaultFieldValue(field: IField): FormValue {
  switch (field.type) {
    case FieldTypes.TEXT:
    case FieldTypes.TEXTAREA:
      return '';
    case FieldTypes.SELECT:
      return '-1';
    case FieldTypes.CHECKBOX:
      return false;
    case FieldTypes.NUMBER:
      return null;
  }
}

export function getInitialFormState<T extends Fields>(fields: T): FormState<T> {
  const touched: Record<string, boolean> = {};
  const errors: Record<string, string> = {};
  const values: Record<string, FormValue> = {};

  for (const [fieldName, field] of Object.entries(fields)) {
    values[fieldName] = field.initialValue ?? getDefaultFieldValue(field);
    touched[fieldName] = false;
    errors[fieldName] = '';
  }

  return { touched, errors, values: values as FormValues<T> };
}

export function formatFieldValue(
  field: IField | undefined,
  stringValue: string,
): FormValue {
  if (field === undefined)
    throw new Error(`Undefined field could not be decoded`);
  switch (field.type) {
    case FieldTypes.TEXT:
    case FieldTypes.TEXTAREA:
    case FieldTypes.SELECT:
      return stringValue;
    case FieldTypes.CHECKBOX:
      return stringValue === 'true';
    case FieldTypes.NUMBER:
      return parseFloat(stringValue);
  }
}

export function validateField(
  field: IField | undefined,
  value: FormValue | undefined,
): string {
  if (field === undefined) return '';

  // TODO run rules to validate a field
  console.log(value);

  // Check if the field is required
  // if (
  //   field.validation?.required !== undefined &&
  //   (!value || value === getDefaultValue(field))
  // )
  //   return field.validation.required;

  return '';
}
