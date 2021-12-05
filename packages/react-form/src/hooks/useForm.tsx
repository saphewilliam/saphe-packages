import React, { useState, FormEvent, useEffect } from 'react';
import { Props } from '..';
import Form from '../components/Form';
import FieldContainer from '../components/helpers/FieldContainer';
import SubmitButton from '../components/helpers/SubmitButton';
import useRecaptcha from '../hooks/useRecaptcha';
import { FieldType } from '../lib/field';
import {
  getInitialFormErrorsState,
  getInitialFormTouchedState,
  getInitialFormValuesState,
} from '../lib/form';
import { Config, State } from '../lib/hook';
import { SubmitButtonProps } from '../lib/props';
import { Fields, FieldValue, FormErrors, FormTouched, FormValues, AddFieldPack } from '../lib/util';
import { validateField, ValidationMode } from '../lib/validation';

export default function useForm<T extends Fields>(config: Config<T>): State {
  const {
    name,
    fieldPack,
    validationMode = ValidationMode.AFTER_BLUR,
    recaptcha,
    submitButton,
    onSubmit,
  } = config;

  const [fields, setFields] = useState<T>(config.fields);

  // TODO rewrite with useReducer and extract handle functions?
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<FormTouched<T>>(getInitialFormTouchedState(config.fields));
  const [errors, setErrors] = useState<FormErrors<T>>(getInitialFormErrorsState(config.fields));
  const [values, setValues] = useState<FormValues<T>>(getInitialFormValuesState(config.fields));

  const { Recaptcha, recaptchaToken } = useRecaptcha(recaptcha);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Form validation
    let canSubmit = true;
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    for (const [fieldName, field] of Object.entries(fields)) {
      const error = validateField(field, values[fieldName]);
      if (error !== '') canSubmit = false;
      newErrors[fieldName] = error;
      newTouched[fieldName] = true;
    }
    if (!canSubmit) {
      setErrors(newErrors as FormErrors<T>);
      setTouched(newTouched as FormTouched<T>);
      return;
    }

    // Catch recaptcha errors
    if (recaptcha && !recaptchaToken) {
      recaptcha.onError();
      return;
    }

    // Fire custom submit function
    if (onSubmit) {
      setIsSubmitting(true);
      Promise.resolve(onSubmit(values, { recaptchaToken })).then(() => setIsSubmitting(false));
    }
  };

  const handleFieldChange = <T extends FieldType>(
    targetValue: FieldValue<T>,
    fieldName: string,
  ) => {
    let error = validateField(fields[fieldName], targetValue);
    const fieldValidationMode = fields[fieldName]?.validation?.mode;
    const shouldValidate =
      // Either the local or global validation mode is ON_CHANGE
      fieldValidationMode === ValidationMode.ON_CHANGE ||
      (fieldValidationMode === undefined && validationMode === ValidationMode.ON_CHANGE) ||
      // Or either the local or global validation mode is AFTER_BLUR and a field has been touched
      ((fieldValidationMode === ValidationMode.AFTER_BLUR ||
        (fieldValidationMode === undefined && validationMode === ValidationMode.AFTER_BLUR)) &&
        touched[fieldName]);

    if (!shouldValidate) error = '';

    setErrors({ ...errors, [fieldName]: error });
    setValues({ ...values, [fieldName]: targetValue });
  };

  const handleFieldBlur = (fieldName: string) => {
    let error = validateField(fields[fieldName], values[fieldName]);
    const fieldValidationMode = fields[fieldName]?.validation?.mode;
    const shouldValidate =
      fieldValidationMode === ValidationMode.ON_BLUR ||
      (fieldValidationMode === undefined && validationMode === ValidationMode.ON_BLUR) ||
      fieldValidationMode === ValidationMode.AFTER_BLUR ||
      (fieldValidationMode === undefined && validationMode === ValidationMode.AFTER_BLUR);

    if (!shouldValidate) error = '';

    setErrors({ ...errors, [fieldName]: error });
    setTouched({ ...touched, [fieldName]: true });
  };

  const submitButtonProps: AddFieldPack<Props.SubmitButtonProps> = {
    label: submitButton?.label ?? 'Submit',
    submittingLabel: submitButton?.submittingLabel ?? submitButton?.label ?? 'Submitting...',
    disabled: Object.values(errors).reduce<boolean>((prev, curr) => prev || curr !== '', false),
    fieldPack,
    isSubmitting,
  };

  useEffect(() => {
    if (JSON.stringify(config.fields) !== JSON.stringify(fields)) {
      setFields(config.fields);
      setTouched(getInitialFormTouchedState(config.fields, touched));
      setErrors(getInitialFormErrorsState(config.fields, errors));
      setValues(getInitialFormValuesState(config.fields, values));
    }
  }, [config.fields]);

  return {
    form: (
      <Form
        name={name}
        fields={fields}
        fieldPack={fieldPack}
        touched={touched}
        errors={errors}
        values={values}
        onSubmit={handleSubmit}
        onFieldBlur={handleFieldBlur}
        onFieldChange={handleFieldChange}
      >
        {recaptcha && (
          <FieldContainer fieldPack={fieldPack}>
            <Recaptcha />
          </FieldContainer>
        )}

        {!submitButton?.hidden && <SubmitButton {...submitButtonProps} />}
      </Form>
    ),
    submitButton: (
      <SubmitButton
        {...submitButtonProps}
        onClick={handleSubmit as never as SubmitButtonProps['onClick']}
      />
    ),
  };
}
