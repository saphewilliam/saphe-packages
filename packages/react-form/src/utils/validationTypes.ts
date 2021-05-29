import { FormValue } from './helperTypes';

export enum ValidationModes {
  ON_CHANGE = 'ON_CHANGE',
  ON_BLUR = 'ON_BLUR',
  AFTER_BLUR = 'AFTER_BLUR',
  ON_SUBMIT = 'ON_SUBMIT',
}

export type IValidation =
  | StringValidation
  | NumberValidation
  | BooleanValidation
  | SelectValidation;

interface ValidationBase<T extends FormValue> {
  mode?: ValidationModes;
  required?: string;
  validate?: (value: T) => string | Promise<string>;
}

export interface StringValidation extends ValidationBase<string> {
  length?: (
    | { exact: number }
    | { min: number; max: number }
    | { min: number }
    | { max: number }
  ) & { message: string };
  matches?: { regex: RegExp; message: string };
}

export interface NumberValidation extends ValidationBase<number> {
  value?: (
    | { exact: number }
    | { min: number; max: number }
    | { min: number; lt: number }
    | { gt: number; max: number }
    | { gt: number; lt: number }
    | { min: number }
    | { max: number }
    | { gt: number }
    | { lt: number }
  ) & { message: string };
  integer?: string;
}

export interface BooleanValidation extends ValidationBase<boolean> {}

export interface SelectValidation extends ValidationBase<string> {}
