/** When the field is validated. */
export enum ValidationMode {
  ON_CHANGE = 'ON_CHANGE',
  ON_BLUR = 'ON_BLUR',
  AFTER_BLUR = 'AFTER_BLUR',
  ON_SUBMIT = 'ON_SUBMIT',
}

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
