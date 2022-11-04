import type { Plugin } from './plugin';
import { FieldMany } from './types';
import {
  NumberValidation,
  StringValidation,
  validateNumberField,
  validateStringField,
} from './validation';

type None = Record<string, never>;

export const textFieldPlugin: Plugin<
  string,
  string,
  FieldMany,
  StringValidation,
  { placeholder?: string }
> = {
  parse: (value) => value || null,
  serialize: (value) => value ?? '',
  validate: validateStringField,
};

export const textAreaFieldPlugin: Plugin<
  string,
  string,
  FieldMany,
  StringValidation,
  { placeholder?: string; rows?: number }
> = {
  parse: (value) => value || null,
  serialize: (value) => value ?? '',
  validate: validateStringField,
};

export const numberFieldPlugin: Plugin<
  string,
  number,
  FieldMany,
  NumberValidation,
  { placeholder?: string }
> = {
  parse: (value) => {
    const parsedValue = parseFloat(value);
    return !isNaN(parsedValue) ? parsedValue : null;
  },
  serialize: (value) => value?.toString() ?? '',
  validate: validateNumberField,
};

export const selectFieldPlugin: Plugin<
  string,
  string,
  FieldMany,
  None,
  { placeholder?: string; options: { value: string; label?: string }[] }
> = {
  parse: (value) => value || null,
  serialize: (value) => value ?? '',
  validate: () => '',
};

export const checkFieldPlugin: Plugin<boolean | null, boolean, FieldMany, None, None> = {
  initialValue: false,
};

// TODO test other examples
// const addressPlugin: FieldPlugin<{ streetName: string; houseNumber: number }> = {};
// const recaptchaPlugin: FieldPlugin<never, string> = {};
// const noticePlugin: FieldPlugin<never, never> = {};

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
