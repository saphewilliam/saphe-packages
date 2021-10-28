import { Field, FieldType } from './fieldTypes';
import { Fields, FieldValue, FormValues } from './helperTypes';

export interface FormState<T extends Fields> {
  touched: Record<string, boolean>;
  errors: Record<string, string>;
  values: FormValues<T>;
}

export const getFieldStyle = (error: string): Record<string, string> => ({
  borderStyle: 'solid',
  borderWidth: '1px',
  borderRadius: '3px',
  borderColor: error ? 'red' : '#767676',
  marginBottom: '3px',
});

export function getDefaultFieldValue<T extends FieldType>(field: T): FieldValue<T> {
  switch (field.type) {
    case Field.TEXT:
    case Field.TEXT_AREA:
    case Field.SELECT:
    case Field.NUMBER:
      return '' as FieldValue<T>;
    case Field.CHECK:
      return false as FieldValue<T>;
  }
}

export function getInitialFormState<T extends Fields>(fields: T): FormState<T> {
  const touched: Record<string, boolean> = {};
  const errors: Record<string, string> = {};
  const values: Record<string, string | boolean | number | File> = {};

  for (const [fieldName, field] of Object.entries(fields)) {
    values[fieldName] = field.initialValue ?? getDefaultFieldValue(field);
    touched[fieldName] = false;
    errors[fieldName] = '';
  }

  return { touched, errors, values: values as FormValues<T> };
}

export function formatFieldValue<T extends FieldType>(
  field: T | undefined,
  stringValue: string,
): FieldValue<T> {
  if (field === undefined) throw new Error(`Undefined field could not be decoded`);
  switch (field.type) {
    case Field.TEXT:
    case Field.TEXT_AREA:
    case Field.SELECT:
      return stringValue as FieldValue<T>;
    case Field.CHECK:
      return (stringValue === 'true') as FieldValue<T>;
    case Field.NUMBER:
      return parseFloat(stringValue) as FieldValue<T>;
  }
}
