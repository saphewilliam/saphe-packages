import { Field, FieldType } from './field';
import { getDefaultFieldValue } from './form';
import { FieldValue } from './util';

export enum ValidationMode {
  ON_CHANGE = 'ON_CHANGE',
  ON_BLUR = 'ON_BLUR',
  AFTER_BLUR = 'AFTER_BLUR',
  ON_SUBMIT = 'ON_SUBMIT',
}

export type ValidationType =
  | StringValidation
  | NumberValidation
  | BooleanValidation
  | SelectValidation;

interface ValidationBase<T extends string | boolean | number | File> {
  mode?: ValidationMode;
  required?: string;
  validate?: (value: T) => string | Promise<string>;
}

type NumberValueValidation = (
  | { exact: number }
  | { gte: number }
  | { lte: number }
  | { gt: number }
  | { lt: number }
  | { gte: number; lte: number }
  | { gte: number; lt: number }
  | { gt: number; lte: number }
  | { gt: number; lt: number }
) & { message: string };

export interface StringValidation extends ValidationBase<string> {
  length?: NumberValueValidation;
  match?: { regex: RegExp; message: string };
}

export interface NumberValidation extends ValidationBase<number> {
  value?: NumberValueValidation;
  integer?: string;
}

export type BooleanValidation = ValidationBase<boolean>;

export type SelectValidation = ValidationBase<string>;

export function validateField<T extends FieldType>(
  field: FieldType | undefined,
  value: FieldValue<T> | undefined,
): string {
  if (field === undefined || value === undefined || !field.validation) return '';

  // Required check
  if (field.validation.required && value === getDefaultFieldValue(field))
    return field.validation.required;

  // Type-specific checks
  let error = '';
  switch (field.type) {
    case Field.TEXT:
    case Field.TEXT_AREA:
      error = validateStringField(value as string, field.validation as StringValidation);
      break;
    case Field.NUMBER:
      error = validateNumberField(value as number, field.validation as NumberValidation);
      break;
    case Field.SELECT:
    case Field.CHECK:
      break;
  }
  if (error) return error;

  // Finally, run the custom validate function
  if (field.validation.validate) {
    // FIXME Why is value being evaluated to never?
    Promise.resolve(field.validation.validate(value as never))
      .then((e) => (error = e))
      .catch((e) => (error = e));
  }

  return error;
}

function validateNumberValue(n: number, v: NumberValueValidation): string {
  if (
    ((v as { exact: number }).exact !== undefined && n !== (v as { exact: number }).exact) ||
    ((v as { lt: number }).lt !== undefined && n < (v as { lt: number }).lt) ||
    ((v as { lte: number }).lte !== undefined && n <= (v as { lte: number }).lte) ||
    ((v as { gt: number }).gt !== undefined && n > (v as { gt: number }).gt) ||
    ((v as { gte: number }).gte !== undefined && n >= (v as { gte: number }).gte)
  )
    return v.message;

  return '';
}

function validateStringField(value: string, validation: StringValidation): string {
  // Length check
  if (validation.length) {
    const message = validateNumberValue(value.length, validation.length);
    if (message !== '') return message;
  }

  // Regex check
  if (validation.match && value.match(validation.match.regex)) return validation.match.message;

  return '';
}

function validateNumberField(value: number, validation: NumberValidation): string {
  // Value check
  if (validation.value) {
    const message = validateNumberValue(value, validation.value);
    if (message !== '') return message;
  }

  // Integer check
  if (validation.integer && !Number.isInteger(value)) return validation.integer;

  return '';
}
