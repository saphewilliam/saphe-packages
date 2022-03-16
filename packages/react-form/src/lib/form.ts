import { Field, FieldType } from './field';
import { Fields, FieldValue, FieldValueCrude, FormErrors, FormTouched, FormValues } from './util';

export const getFieldStyle = (error: string): Record<string, string> => ({
  borderStyle: 'solid',
  borderWidth: '1px',
  borderRadius: '3px',
  borderColor: error ? 'red' : '#767676',
  marginBottom: '3px',
});

export function getDefaultFieldValue<T extends FieldType>(field: T): FieldValue<T> {
  // TODO remove multiple in field
  if ('multiple' in field && field.multiple) return [] as unknown as FieldValue<T>;
  if (field.type === Field.CHECK) return false as FieldValue<T>;
  return null as FieldValue<T>;
}

export function getInitialFormTouchedState<T extends Fields>(
  fields: T,
  prevTouched: Record<string, boolean> = {},
): FormTouched<T> {
  const touched: Record<string, boolean> = {};
  for (const fieldName of Object.keys(fields)) touched[fieldName] = prevTouched[fieldName] ?? false;
  return touched as FormTouched<T>;
}

export function getInitialFormErrorsState<T extends Fields>(
  fields: T,
  prevErrors: Record<string, string> = {},
): FormErrors<T> {
  const errors: Record<string, string> = {};
  for (const fieldName of Object.keys(fields)) errors[fieldName] = prevErrors[fieldName] ?? '';
  return errors as FormErrors<T>;
}

export function getInitialFormValuesState<T extends Fields>(
  fields: T,
  prevValues: Record<string, FieldValueCrude> = {},
): FormValues<T> {
  const values: Record<string, FieldValueCrude> = {};
  for (const [fieldName, field] of Object.entries(fields)) {
    values[fieldName] = prevValues[fieldName] ?? field.initialValue ?? getDefaultFieldValue(field);
  }

  return values as FormValues<T>;
}
