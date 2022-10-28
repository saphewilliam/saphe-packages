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

export const validateField = (field: any, value: any): string => {
  if (!field.validation) return '';

  // Required check
  if (
    field.validation.required &&
    JSON.stringify(value) === JSON.stringify(field.plugin.initialValue)
  )
    return field.validation.required;

  // TODO
  // Plugin-specific validation options
  const pluginError = field.plugin.validate(value, field.validation, 'enabled');
  if (pluginError !== '') return pluginError;

  // Custom validate function
  if (field.validation.validate) {
    const validateResult = field.validation.validate(value);
    if (validateResult !== '') return validateResult;
  }

  return '';
};
