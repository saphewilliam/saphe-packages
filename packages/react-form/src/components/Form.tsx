import React, { Dispatch, FormEvent, ReactElement, SetStateAction, useState } from 'react';
import { Config as HookConfig } from '../hooks/useForm';
import useRecaptcha from '../hooks/useRecaptcha';
import { FieldType } from '../utils/fieldTypes';
import { FormState, getInitialFormState, getDefaultFieldValue } from '../utils/formHelpers';
import { Fields, FieldValue } from '../utils/helperTypes';
import { validateField } from '../utils/validationHelpers';
import { ValidationMode } from '../utils/validationTypes';
import FieldSwitch from './FieldSwitch';
import FormFieldContainer from './helpers/FormFieldContainer';
import SubmitButton from './helpers/SubmitButton';

interface Props<T extends Fields> extends HookConfig<T> {
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let canSubmit = true;
    const errors: Record<string, string> = {};
    const touched: Record<string, boolean> = {};
    for (const [fieldName, field] of Object.entries(fields)) {
      const error = validateField(field, formState.values[fieldName]);
      errors[fieldName] = error;
      touched[fieldName] = true;
      if (error !== '') canSubmit = false;
    }

    if (!canSubmit) setFormState({ ...formState, errors, touched });
    else if (!!recaptcha && !recaptchaToken) recaptcha.onError();
    else if (onSubmit) {
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
    <form onSubmit={(e) => handleSubmit(e)}>
      {Object.keys(fields).map((fieldName, index) => {
        const field = fields[fieldName];
        const fieldId = `${name}${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)}`;
        if (field === undefined) return <div />;
        return (
          <FieldSwitch
            key={index}
            field={field}
            fieldPack={fieldPack}
            id={fieldId}
            name={fieldName}
            label={field.label}
            description={field.description ?? ''}
            describedBy={`${fieldId}Description`}
            disabled={false} // TODO make this variable
            error={formState.errors[fieldName] ?? ''}
            value={
              formState.values[fieldName]?.toString() ?? getDefaultFieldValue(field).toString()
            }
            onChange={(targetValue) => handleChange(targetValue, fieldName)}
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
