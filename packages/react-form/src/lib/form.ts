import { Field, FieldType } from './field';
import { Fields, FieldValue, FieldValueCrude, FormErrors, FormTouched, FormValues } from './util';

export interface FormState<T extends Fields> {
  touched: FormTouched<T>;
  errors: FormErrors<T>;
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
      return '' as FieldValue<T>;
    case Field.NUMBER:
      return null as FieldValue<T>;
    case Field.CHECK:
      return false as FieldValue<T>;
  }
}

export function getInitialFormState<T extends Fields>(fields: T): FormState<T> {
  const touched: Record<string, boolean> = {};
  const errors: Record<string, string> = {};
  const values: Record<string, FieldValueCrude> = {};

  for (const [fieldName, field] of Object.entries(fields)) {
    touched[fieldName] = false;
    errors[fieldName] = '';
    values[fieldName] = field.initialValue ?? getDefaultFieldValue(field);
  }

  return { touched, errors, values } as FormState<T>;
}
