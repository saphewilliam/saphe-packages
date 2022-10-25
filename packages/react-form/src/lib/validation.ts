import { FieldMany } from './field';
import { DefineValue, MaybePromise } from './util';

/** When the field/form is validated. */
export enum ValidationMode {
  ON_CHANGE = 'ON_CHANGE',
  ON_BLUR = 'ON_BLUR',
  AFTER_BLUR = 'AFTER_BLUR',
  ON_SUBMIT = 'ON_SUBMIT',
}

/** Base Field validation type */
export type FieldValidation<Value, Many extends FieldMany> = {
  mode?: ValidationMode;
  required?: string;
  validate?: (value: DefineValue<Value, Many>) => MaybePromise<string>;
};
