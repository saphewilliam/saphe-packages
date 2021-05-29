import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  ReactElement,
  SetStateAction,
  useState,
} from 'react';
import { Config as HookConfig } from '../hooks/useForm';
import useRecaptcha from '../hooks/useRecaptcha';
import {
  FormState,
  getInitialFormState,
  validateField,
  formatFieldValue,
  getDefaultFieldValue,
} from '../utils/formHelpers';
import { Fields, HTMLField } from '../utils/helperTypes';
import { ValidationModes } from '../utils/validationTypes';
import Field from './Field';
import FormFieldContainer from './FormFieldContainer';
import SubmitButton from './SubmitButton';

interface Props<T extends Fields> extends HookConfig<T> {
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
}

export default function Form<T extends Fields>(props: Props<T>): ReactElement {
  const {
    name,
    fieldPack,
    validationMode = ValidationModes.AFTER_BLUR,
    fields,
    recaptcha,
    onSubmit,
    isSubmitting,
    setIsSubmitting,
  } = props;

  const [formState, setFormState] = useState<FormState>(
    getInitialFormState(fields),
  );
  const { Recaptcha, recaptchaToken } = useRecaptcha(recaptcha);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let canSubmit = true;
    const errors: Record<string, string> = {};
    for (const [fieldName, field] of Object.entries(fields)) {
      const error = validateField(field, formState.values[fieldName]);
      errors[fieldName] = error;
      if (error !== '') canSubmit = false;
    }

    if (!canSubmit) setFormState({ ...formState, errors });
    else if (!!recaptcha && !recaptchaToken)
      console.error(recaptcha.errorMessage);
    else {
      setIsSubmitting(true);
      // TODO formState.values parse to desired output format
      // await onSubmit(formState.values, { recaptchaToken });
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLField>, fieldName: string) => {
    let error = formState.errors[fieldName] ?? '';
    if (
      validationMode === ValidationModes.ON_CHANGE ||
      (validationMode === ValidationModes.AFTER_BLUR &&
        formState.touched[fieldName])
    )
      error = validateField(
        fields[fieldName],
        formatFieldValue(fields[fieldName], e.target.value),
      );

    setFormState({
      ...formState,
      errors: {
        ...formState.errors,
        [fieldName]: error,
      },
      values: {
        ...formState.values,
        [fieldName]: formatFieldValue(fields[fieldName], e.target.value),
      },
    });
  };

  const handleBlur = (fieldName: string) => {
    let error = formState.errors[fieldName] ?? '';
    if (
      validationMode === ValidationModes.ON_BLUR ||
      validationMode === ValidationModes.AFTER_BLUR
    )
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
    <form onSubmit={(e) => handleSubmit(e)}>
      {Object.keys(fields).map((fieldName, index) => {
        const field = fields[fieldName];
        if (field === undefined) return <div />;
        return (
          <Field
            key={index}
            id={`${name}${fieldName.charAt(0).toUpperCase()}${fieldName.slice(
              1,
            )}`}
            field={field}
            fieldPack={fieldPack}
            name={fieldName}
            error={formState.errors[fieldName] ?? ''}
            value={
              formState.values[fieldName]?.toString() ??
              getDefaultFieldValue(field).toString()
            }
            onChange={(e) => handleChange(e, fieldName)}
            onBlur={() => handleBlur(fieldName)}
          />
        );
      })}

      {recaptcha && (
        <FormFieldContainer fieldPack={fieldPack}>
          <Recaptcha />
        </FormFieldContainer>
      )}

      <SubmitButton {...{ isSubmitting, fieldPack }} />
    </form>
  );
}
