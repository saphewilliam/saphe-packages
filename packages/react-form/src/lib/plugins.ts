import { FieldMany, PropsFromPlugin, SinglePropsFromPlugin, ManyPropsFromPlugin } from './types';
import {
  NumberValidation,
  StringValidation,
  validateEmailField,
  validateNumberField,
  validateStringField,
} from './validation';
import type { Plugin } from './plugin';

type None = object;

export type UnknownProps = PropsFromPlugin<typeof unknownPlugin>;
export type SingleUnknownProps = SinglePropsFromPlugin<typeof unknownPlugin>;
export type ManyUnknownProps = ManyPropsFromPlugin<typeof unknownPlugin>;
export const unknownPlugin: Plugin<unknown, unknown, FieldMany, None, None> = {};

export type ObjectProps = PropsFromPlugin<typeof objectPlugin>;
export type SingleObjectProps = SinglePropsFromPlugin<typeof objectPlugin>;
export type ManyObjectProps = ManyPropsFromPlugin<typeof objectPlugin>;
export const objectPlugin: Plugin<
  Record<string, unknown>,
  Record<string, unknown>,
  FieldMany,
  None,
  None
> = { initialValue: {} };

export type TextProps = PropsFromPlugin<typeof textPlugin>;
export type SingleTextProps = SinglePropsFromPlugin<typeof textPlugin>;
export type ManyTextProps = ManyPropsFromPlugin<typeof textPlugin>;
export const textPlugin: Plugin<
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

export type TextAreaProps = PropsFromPlugin<typeof textAreaPlugin>;
export type SingleTextAreaProps = SinglePropsFromPlugin<typeof textAreaPlugin>;
export type ManyTextAreaProps = ManyPropsFromPlugin<typeof textAreaPlugin>;
export const textAreaPlugin: Plugin<
  string,
  string,
  FieldMany,
  StringValidation,
  { placeholder?: string; rows?: number }
> = textPlugin;

export type NumberProps = PropsFromPlugin<typeof numberPlugin>;
export type SingleNumberProps = SinglePropsFromPlugin<typeof numberPlugin>;
export type ManyNumberProps = ManyPropsFromPlugin<typeof numberPlugin>;
export const numberPlugin: Plugin<
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

export type SelectProps = PropsFromPlugin<typeof selectPlugin>;
export type SingleSelectProps = SinglePropsFromPlugin<typeof selectPlugin>;
export type ManySelectProps = ManyPropsFromPlugin<typeof selectPlugin>;
export const selectPlugin: Plugin<
  string,
  string,
  FieldMany,
  None,
  { placeholder?: string; options: { value: string; label?: string }[] }
> = {
  // TODO validate that the given string is one of the provided options
  parse: (value) => value || null,
  serialize: (value) => value ?? '',
  validate: () => '',
};

export type RadioProps = PropsFromPlugin<typeof radioPlugin>;
export type SingleRadioProps = SinglePropsFromPlugin<typeof radioPlugin>;
export type ManyRadioProps = ManyPropsFromPlugin<typeof radioPlugin>;
export const radioPlugin: Plugin<
  string | null,
  string,
  FieldMany,
  None,
  { options: { value: string; label?: string }[] }
> = {
  // TODO validate that the given string is one of the provided options
  parse: (value) => value || null,
  serialize: (value) => value ?? '',
  validate: () => '',
};

export type SwitchProps = PropsFromPlugin<typeof switchPlugin>;
export type SingleSwitchProps = SinglePropsFromPlugin<typeof switchPlugin>;
export type ManySwithProps = ManyPropsFromPlugin<typeof switchPlugin>;
export const switchPlugin: Plugin<boolean, boolean, FieldMany, None, None> = {
  initialValue: false,
};

export type CheckProps = PropsFromPlugin<typeof checkPlugin>;
export type SingleCheckProps = SinglePropsFromPlugin<typeof checkPlugin>;
export type ManyCheckProps = ManyPropsFromPlugin<typeof checkPlugin>;
export const checkPlugin: Plugin<
  boolean | 'indeterminate',
  boolean | 'indeterminate',
  FieldMany,
  None,
  None
> = {
  initialValue: false,
};

export type EmailProps = PropsFromPlugin<typeof emailPlugin>;
export type SingleEmailProps = SinglePropsFromPlugin<typeof emailPlugin>;
export type ManyEmailProps = ManyPropsFromPlugin<typeof emailPlugin>;
export const emailPlugin: Plugin<
  string,
  string,
  FieldMany,
  StringValidation,
  { placeholder?: string }
> = {
  ...textPlugin,
  validate: validateEmailField,
};

export type SliderProps = PropsFromPlugin<typeof sliderPlugin>;
export type SingleSliderProps = SinglePropsFromPlugin<typeof sliderPlugin>;
export type ManySliderProps = ManyPropsFromPlugin<typeof sliderPlugin>;
export const sliderPlugin: Plugin<
  string,
  number,
  FieldMany,
  None,
  { min: number; max: number; step?: number }
> = {
  parse: numberPlugin.parse,
  serialize: numberPlugin.serialize,
};

export type FileProps = PropsFromPlugin<typeof filePlugin>;
export type SingleFileProps = SinglePropsFromPlugin<typeof filePlugin>;
export type ManyFileProps = ManyPropsFromPlugin<typeof filePlugin>;
export const filePlugin: Plugin<File | null, File, FieldMany, None, None> = {};

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
