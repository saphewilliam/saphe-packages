import React, { Dispatch, SetStateAction, ReactElement, useState, FormEvent } from 'react';
import { Config } from '../hooks/useForm';
import useRecaptcha from '../hooks/useRecaptcha';
import { FieldType } from '../lib/field';
import { FormState, getDefaultFieldValue, getInitialFormState } from '../lib/form';
import { Fields, FieldValue, FormErrors, FormTouched } from '../lib/util';
import { validateField, ValidationMode } from '../lib/validation';
import FieldSwitch from './FieldSwitch';
import FieldContainer from './helpers/FieldContainer';
import SubmitButton from './helpers/SubmitButton';

interface Props<T extends Fields> extends Config<T> {
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
}

export default function Form<T extends Fields>(props: Props<T>): ReactElement {
  const {
    name,
    fieldPack,
    validationMode = ValidationMode.AFTER_BLUR,
    fields,
    recaptcha,
    onSubmit,
    isSubmitting,
    setIsSubmitting,
  } = props;

  const [formState, setFormState] = useState<FormState<T>>(getInitialFormState(fields));
  const { Recaptcha, recaptchaToken } = useRecaptcha(recaptcha);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Form validation
    let canSubmit = true;
    const errors: Record<string, string> = {};
    const touched: Record<string, boolean> = {};
    for (const [fieldName, field] of Object.entries(fields)) {
      const error = validateField(field, formState.values[fieldName]);
      if (error !== '') canSubmit = false;
      errors[fieldName] = error;
      touched[fieldName] = true;
    }
    if (!canSubmit) {
      setFormState({
        ...formState,
        errors: errors as FormErrors<T>,
        touched: touched as FormTouched<T>,
      });
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
      Promise.resolve(onSubmit(formState.values, { recaptchaToken }));
      setIsSubmitting(false);
    }
  };

  const handleChange = <T extends FieldType>(targetValue: FieldValue<T>, fieldName: string) => {
    let error = formState.errors[fieldName] ?? '';

    if (
      validationMode === ValidationMode.ON_CHANGE ||
      (validationMode === ValidationMode.AFTER_BLUR && formState.touched[fieldName])
    )
      error = validateField(fields[fieldName], targetValue);

    setFormState({
      ...formState,
      errors: {
        ...formState.errors,
        [fieldName]: error,
      },
      values: {
        ...formState.values,
        [fieldName]: targetValue,
      },
    });
  };

  const handleBlur = (fieldName: string) => {
    let error = formState.errors[fieldName] ?? '';
    if (validationMode === ValidationMode.ON_BLUR || validationMode === ValidationMode.AFTER_BLUR)
      error = validateField(fields[fieldName], formState.values[fieldName]);

    setFormState({
      ...formState,
      errors: {
        ...formState.errors,
        [fieldName]: error,
      },
      touched: {
        ...formState.touched,
        [fieldName]: true,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.entries(fields).map(([fieldName, field], idx) => {
        return (
          <FieldSwitch
            key={idx}
            formName={name}
            name={fieldName}
            field={field}
            fieldPack={fieldPack}
            error={formState.errors[fieldName] ?? ''}
            value={formState.values[fieldName] ?? getDefaultFieldValue(field)}
            onChange={(targetValue) => handleChange(targetValue, fieldName)}
            onBlur={() => handleBlur(fieldName)}
          />
        );
      })}

      {recaptcha && (
        <FieldContainer fieldPack={fieldPack}>
          <Recaptcha />
        </FieldContainer>
      )}

      <SubmitButton {...{ isSubmitting, fieldPack }} />
    </form>
  );
}
