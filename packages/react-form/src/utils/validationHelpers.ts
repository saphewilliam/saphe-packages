import { FieldTypes } from '..';
import { IField } from './fieldTypes';
import { getDefaultFieldValue } from './formHelpers';
import { StringValidation } from './validationTypes';

export function validateField(
  field: IField | undefined,
  value: string | undefined,
): string {
  if (field === undefined || value === undefined || !field.validation)
    return '';

  // Required check
  if (field.validation.required && value === getDefaultFieldValue(field))
    return field.validation.required;

  // Type-specific checks
  let error = '';
  switch (field.type) {
    case FieldTypes.TEXT:
    case FieldTypes.TEXTAREA:
      error = validateString(field.validation as StringValidation, value);
      break;
    case FieldTypes.NUMBER:
      // error = validateNumber(field.validation as NumberValidation, value);
      error = validateNumber();
      break;
    case FieldTypes.SELECT:
    case FieldTypes.CHECKBOX:
      break;
  }
  if (error) return error;

  // Finally, run the custom validate function
  if (field.validation.validate) {
    Promise.resolve(field.validation.validate(value))
      .then((e) => (error = e))
      .catch((e) => (error = e));
  }

  return error;
}

function validateString(validation: StringValidation, value: string): string {
  // Length check
  const l = validation.length;
  if (l)
    if (
      ((l as { exact: number }).exact !== undefined &&
        (l as { exact: number }).exact !== value.length) ||
      ((l as { min: number }).min !== undefined &&
        (l as { min: number }).min > value.length) ||
      ((l as { max: number }).max !== undefined &&
        (l as { max: number }).max < value.length)
    )
      return l.message;

  // Regex check
  if (validation.match)
    if (value.match(validation.match.regex)) return validation.match.message;

  return '';
}

// function validateNumber(validation: NumberValidation, value: string): string {
function validateNumber(): string {
  return '';
}
