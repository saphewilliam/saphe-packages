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

export type NumberValue = (
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
  length?: NumberValue;
  match?: { regex: RegExp; message: string };
}

export interface NumberValidation extends ValidationBase<number> {
  value?: NumberValue;
  integer?: string;
}

export interface BooleanValidation extends ValidationBase<boolean> {}

export interface SelectValidation extends ValidationBase<string> {}
