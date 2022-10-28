import { FieldMany, FieldState } from './field';
import { FieldPlugin } from './fieldPlugin';
import { FieldValidation } from './validation';

export const textFieldPlugin: FieldPlugin<
  string,
  string,
  FieldMany,
  FieldValidation<string>, // TODO StringValidation
  FieldState,
  { placeholder?: string }
> = {
  initialValue: null,
  parse: (value) => value || null,
  serialize: (value) => value ?? '',
  validate: () => '',
};

export const textAreaFieldPlugin: FieldPlugin<
  string,
  string,
  FieldMany,
  FieldValidation<string>, // TODO StringValidation
  FieldState,
  { placeholder?: string; rows?: number }
> = {
  initialValue: null,
  parse: (value) => value || null,
  serialize: (value) => value ?? '',
  validate: () => '',
};

export const numberFieldPlugin: FieldPlugin<
  string,
  number,
  FieldMany,
  FieldValidation<number>, // TODO NumberValidation
  FieldState,
  { placeholder?: string }
> = {
  initialValue: null,
  parse: (value) => {
    const parsedValue = parseFloat(value);
    return !isNaN(parsedValue) ? parsedValue : null;
  },
  serialize: (value) => value?.toString() ?? '',
  validate: () => '',
};

export const selectFieldPlugin: FieldPlugin<
  string,
  string,
  FieldMany,
  FieldValidation<string>, // TODO SelectValidation
  FieldState,
  { placeholder?: string; options: { value: string; label?: string }[] }
> = {
  initialValue: null,
  parse: (value) => value || null,
  serialize: (value) => value ?? '',
  validate: () => '',
};

// TODO test other examples
// const checkBoxPlugin: FieldPlugin<boolean, boolean> = {};
// const addressPlugin: FieldPlugin<{ streetName: string; houseNumber: number }> = {};
// const recaptchaPlugin: FieldPlugin<never, string> = {};
// const noticePlugin: FieldPlugin<never, never> = {};
