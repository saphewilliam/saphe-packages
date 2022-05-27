import { useAsyncReducer, Util } from '@saphe/react-use';
import { useMemo } from 'react';
import { Config, ValidationMode } from '..';
import { FieldType } from '../lib/field';
import {
  getInitialFormErrorsState,
  getInitialFormTouchedState,
  getInitialFormValuesState,
} from '../lib/form';
import { Fields, FieldValue, FormErrors, FormTouched, FormValues } from '../lib/util';
import { validateField } from '../lib/validation';

export interface FormState<T extends Fields> {
  fields: T;
  touched: FormTouched<T>;
  errors: FormErrors<T>;
  values: FormValues<T>;
}

export default function useFormState<T extends Fields>(
  config: Config<T>,
  recaptchaToken: string | undefined,
) {
  const initialState: FormState<T> = useMemo(
    () => ({
      fields: config.fields,
      touched: getInitialFormTouchedState(config.fields),
      errors: getInitialFormErrorsState(config.fields),
      values: getInitialFormValuesState(config.fields),
    }),
    [config.fields],
  );

  const { recaptcha, onChange, onSubmit, validationMode = ValidationMode.AFTER_BLUR } = config;

  return useAsyncReducer(initialState, {
    reset: () => initialState,
    blur: (prevState, fieldName: string) => {
      const field = prevState.fields[fieldName];
      if (!field) return prevState;

      const fieldValidationMode = field.validation?.mode;
      const targetValue = prevState.values[fieldName as keyof typeof prevState.values];
      const error = validateField(field, targetValue);

      const shouldValidate =
        // Either the local or global validation mode is ON_BLUR
        fieldValidationMode === ValidationMode.ON_BLUR ||
        (fieldValidationMode === undefined && validationMode === ValidationMode.ON_BLUR) ||
        // Or either the local or global validation mode is AFTER_BLUR
        fieldValidationMode === ValidationMode.AFTER_BLUR ||
        (fieldValidationMode === undefined && validationMode === ValidationMode.AFTER_BLUR);

      return {
        ...prevState,
        errors: { ...prevState.errors, [fieldName]: shouldValidate ? error : '' },
        touched: { ...prevState.touched, [fieldName]: true },
      };
    },
    // TODO dispatch multiple changes at once?
    change: async (prevState, fieldName: string, targetValue: FieldValue<FieldType>) => {
      const field = prevState.fields[fieldName];
      if (!field) return prevState;

      const values = {
        ...prevState.values,
        [fieldName]:
          'multiple' in field && field.multiple && targetValue === null
            ? []
            : 'multiple' in field && field.multiple && !(targetValue && Array.isArray(targetValue))
            ? [targetValue]
            : targetValue,
      };

      const error = validateField(field, targetValue);
      const fieldValidationMode = field.validation?.mode;
      const shouldValidate =
        // Either the local or global validation mode is ON_CHANGE
        fieldValidationMode === ValidationMode.ON_CHANGE ||
        (fieldValidationMode === undefined && validationMode === ValidationMode.ON_CHANGE) ||
        // Or either the local or global validation mode is AFTER_BLUR and a field has been touched
        ((fieldValidationMode === ValidationMode.AFTER_BLUR ||
          (fieldValidationMode === undefined && validationMode === ValidationMode.AFTER_BLUR)) &&
          prevState.touched[fieldName]);

      if (onChange) {
        const onChangeResult = onChange(values);
        if (Util.isPromise(onChangeResult)) await onChangeResult;
      }

      return {
        ...prevState,
        values,
        errors: { ...prevState.errors, [fieldName]: shouldValidate ? error : '' },
      };
    },
    submit: async (prevState) => {
      // Form validation
      let canSubmit = true;
      const newErrors: Record<string, string> = {};
      const newTouched: Record<string, boolean> = {};
      for (const [fieldName, field] of Object.entries(prevState.fields)) {
        const error = validateField(
          field,
          prevState.values[fieldName as keyof typeof prevState.values],
        );
        if (error !== '') canSubmit = false;
        newErrors[fieldName] = error;
        newTouched[fieldName] = true;
      }

      if (!canSubmit)
        return {
          ...prevState,
          errors: newErrors as FormErrors<T>,
          touched: newTouched as FormTouched<T>,
        };

      // Catch recaptcha errors
      if (recaptcha && !recaptchaToken) {
        recaptcha.onError();
        return prevState;
      }

      // Fire custom submit function
      if (onSubmit) {
        const onSubmitResult = onSubmit(prevState.values, { recaptchaToken });
        if (Util.isPromise(onSubmitResult)) await onSubmitResult;
      }

      return prevState;
    },
  });
}
