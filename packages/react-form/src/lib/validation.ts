import { FieldState, ValidationMode } from './types';

/** Base Field validation type */
export type FieldValidation<Value> = {
  /** Optional (default: `config.validate.validationMode`), when in the form lifecycle the field is validated */
  mode?: ValidationMode;
  // TODO allow user to manually mark a field as not-required
  required?: string /* | false */;
  // TODO allow the user to supply an async validate function
  /** Optional, custom validation function */
  validate?: (value: Value | null) => string /* MaybePromise<string>*/;
};

export const validateField = (field: any, fieldState: FieldState, value: any): string => {
  if (!field.validation || fieldState !== FieldState.ENABLED) return '';

  // Required check
  if (
    field.validation.required &&
    JSON.stringify(value) === JSON.stringify(field.plugin.initialValue)
  )
    return field.validation.required;

  // TODO
  // Plugin-specific validation options
  const pluginError = field.plugin.validate(value, field.validation);
  if (pluginError !== '') return pluginError;

  // Custom validate function
  if (field.validation.validate) {
    const validateResult = field.validation.validate(value);
    if (validateResult !== '') return validateResult;
  }

  return '';
};

export type NumberValueValidation = (
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

export interface StringValidation extends FieldValidation<string> {
  length?: NumberValueValidation;
  match?: { pattern: RegExp; message: string };
}

export interface NumberValidation extends FieldValidation<number> {
  value?: NumberValueValidation;
  integer?: string;
}

export function validateNumberValue(n: number, v: NumberValueValidation): string {
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

export function validateStringField(value: string | null, validation: StringValidation) {
  // Length check
  if (validation.length) {
    const message = validateNumberValue((value ?? '').length, validation.length);
    if (message !== '') return message;
  }

  // Regex check
  if (validation.match && !(value ?? '').match(validation.match.pattern))
    return validation.match.message;

  return '';
}

export function validateNumberField(value: number | null, validation: NumberValidation) {
  // Value check
  if (validation.value) {
    if (value === null) return validation.value.message;
    const message = validateNumberValue(value, validation.value);
    if (message !== '') return message;
  }

  // Integer check
  if (validation.integer && !Number.isInteger(value)) return validation.integer;

  return '';
}

// export interface EmailValidation extends ValidationBase<string> {
//   length?: NumberValueValidation;
//   isValidEmail?: string;
// }

// export interface FileValidation extends ValidationBase<File> {
//   size?: NumberValueValidation;
// }

// export interface EmailValidation extends ValidationBase<string> {
//   length?: NumberValueValidation;
//   isValidEmail?: string;
// }

// export interface FileValidation extends ValidationBase<File> {
//   size?: NumberValueValidation;
// }

// function validateEmailField(value: string | null, validation: EmailValidation): string {
//   return validateStringField(value, {
//     ...validation,
//     match: {
//       message: validation.isValidEmail ?? '',
//       regex:
//         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//     },
//   });
// }

// function validateColorField(value: string | null, validation: ColorValidation): string {
//   if (/^#([0-9a-f]{3}){1,2}$/i.test(value ?? '') && validation.required) return validation.required;
//   return '';
// }

// function validateFileField(value: File | null, validation: FileValidation): string {
//   if (validation.size) {
//     if (value === null) return validation.size.message;
//     return validateNumberValue(value.size, validation.size);
//   }
//   return '';
// }
