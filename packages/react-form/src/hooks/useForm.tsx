import React, { useState, FormEvent, useEffect, useReducer, useMemo } from 'react';
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
import {
  Fields,
  FieldValue,
  FormErrors,
  FormTouched,
  FormValues,
  AddFieldPack,
  stringify,
} from '../lib/util';
import { validateField, ValidationMode } from '../lib/validation';

interface FormState<T extends Fields> {
  fields: T;
  touched: FormTouched<T>;
  errors: FormErrors<T>;
  values: FormValues<T>;
}

type Action =
  | { type: 'change'; payload: { targetValue: FieldValue<FieldType>; fieldName: string } }
  | { type: 'blur'; payload: { fieldName: string } }
  | { type: 'submit' }
  | { type: 'reset' };

export default function useForm<T extends Fields>(config: Config<T>): State {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    name,
    fieldPack,
    recaptcha,
    submitButton,
    onSubmit,
    validationMode = ValidationMode.AFTER_BLUR,
  } = config;

  const initialState: FormState<T> = useMemo(
    () => ({
      fields: config.fields,
      touched: getInitialFormTouchedState(config.fields),
      errors: getInitialFormErrorsState(config.fields),
      values: getInitialFormValuesState(config.fields),
    }),
    [config.fields],
  );

  const { Recaptcha, recaptchaToken } = useRecaptcha(recaptcha);

  const [formState, dispatchFormState] = useReducer((state: FormState<T>, action: Action) => {
    switch (action.type) {
      case 'change': {
        const { fieldName, targetValue } = action.payload;
        const field = state.fields[fieldName];
        if (!field) return state;

        let error = validateField(field, targetValue);
        const fieldValidationMode = field.validation?.mode;
        const shouldValidate =
          // Either the local or global validation mode is ON_CHANGE
          fieldValidationMode === ValidationMode.ON_CHANGE ||
          (fieldValidationMode === undefined && validationMode === ValidationMode.ON_CHANGE) ||
          // Or either the local or global validation mode is AFTER_BLUR and a field has been touched
          ((fieldValidationMode === ValidationMode.AFTER_BLUR ||
            (fieldValidationMode === undefined && validationMode === ValidationMode.AFTER_BLUR)) &&
            state.touched[fieldName]);

        if (!shouldValidate) error = '';
        return {
          ...state,
          errors: { ...state.errors, [fieldName]: error },
          values: {
            ...state.values,
            [fieldName]:
              'multiple' in field && field.multiple && targetValue === null
                ? []
                : 'multiple' in field &&
                  field.multiple &&
                  !(targetValue && Array.isArray(targetValue))
                ? [targetValue]
                : targetValue,
          },
        };
      }

      case 'blur': {
        const { fieldName } = action.payload;

        let error = validateField(
          state.fields[fieldName],
          state.values[fieldName as keyof typeof state.values],
        );
        const fieldValidationMode = state.fields[fieldName]?.validation?.mode;
        const shouldValidate =
          // Either the local or global validation mode is ON_BLUR
          fieldValidationMode === ValidationMode.ON_BLUR ||
          (fieldValidationMode === undefined && validationMode === ValidationMode.ON_BLUR) ||
          // Or either the local or global validation mode is AFTER_BLUR
          fieldValidationMode === ValidationMode.AFTER_BLUR ||
          (fieldValidationMode === undefined && validationMode === ValidationMode.AFTER_BLUR);

        if (!shouldValidate) error = '';
        return {
          ...state,
          errors: { ...state.errors, [fieldName]: error },
          touched: { ...state.touched, [fieldName]: true },
        };
      }

      case 'submit': {
        // Form validation
        let canSubmit = true;
        const newErrors: Record<string, string> = {};
        const newTouched: Record<string, boolean> = {};
        for (const [fieldName, field] of Object.entries(state.fields)) {
          const error = validateField(field, state.values[fieldName as keyof typeof state.values]);
          if (error !== '') canSubmit = false;
          newErrors[fieldName] = error;
          newTouched[fieldName] = true;
        }
        if (!canSubmit)
          return {
            ...state,
            errors: newErrors as FormErrors<T>,
            touched: newTouched as FormTouched<T>,
          };

        // Catch recaptcha errors
        if (recaptcha && !recaptchaToken) {
          recaptcha.onError();
          return state;
        }

        // Fire custom submit function
        if (onSubmit) {
          setIsSubmitting(true);
          Promise.resolve(onSubmit(state.values, { recaptchaToken })).then(() =>
            setIsSubmitting(false),
          );
        }

        return state;
      }

      case 'reset':
        return initialState;
    }
  }, initialState);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatchFormState({ type: 'submit' });
  };

  const submitButtonProps: AddFieldPack<Props.SubmitButtonProps> = {
    label: submitButton?.label ?? 'Submit',
    submittingLabel: submitButton?.submittingLabel ?? submitButton?.label ?? 'Submitting...',
    disabled: Object.values(formState.errors).reduce<boolean>(
      (prev, curr) => prev || curr !== '',
      false,
    ),
    fieldPack,
    isSubmitting,
  };

  useEffect(() => {
    if (stringify(config.fields) !== stringify(formState.fields))
      dispatchFormState({ type: 'reset' });
  }, [config.fields]);

  return {
    form: (
      <Form
        name={name}
        fields={formState.fields}
        fieldPack={fieldPack}
        touched={formState.touched}
        errors={formState.errors}
        values={formState.values}
        onSubmit={handleSubmit}
        onFieldBlur={(fieldName: string) =>
          dispatchFormState({ type: 'blur', payload: { fieldName } })
        }
        onFieldChange={(targetValue: FieldValue<FieldType>, fieldName: string) =>
          dispatchFormState({ type: 'change', payload: { targetValue, fieldName } })
        }
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
        key={`${name}SubmitButton`}
        onClick={handleSubmit as never as SubmitButtonProps['onClick']}
      />
    ),
  };
}
