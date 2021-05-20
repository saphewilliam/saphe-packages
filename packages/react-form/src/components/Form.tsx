import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from 'react';
import {
  Fields,
  FieldTypes,
  FormValues,
  FormStyles,
  HTMLField,
  ValidationModes,
  FieldValue,
  IField,
} from '../utils/fieldTypes';
import Field from './Field';
import useRecaptcha, { RecaptchaConfig } from './useRecaptcha';

interface FormState<T extends Fields> {
  touched: Record<string, boolean>;
  errors: Record<string, string>;
  values: FormValues<T>;
}

interface Props<T extends Fields> {
  fields: T;
  onSubmit: (
    formValues: FormValues<T>,
    recaptchaToken: string,
  ) => void | Promise<void>;
  submitting: boolean;
  setSubmitting: Dispatch<SetStateAction<boolean>>;
  recaptcha?: RecaptchaConfig;
  validationMode?: ValidationModes;
  formStyle?: FormStyles;
}

function formatFieldValue<T extends IField>(
  field: IField | undefined,
  stringValue: string,
): FieldValue<T> {
  if (field === undefined)
    throw new Error(`Undefined field could not be decoded`);
  switch (field.type) {
    case FieldTypes.TEXT:
    case FieldTypes.TEXTAREA:
    case FieldTypes.SELECT:
      return stringValue as FieldValue<T>;
  }
}

function getDefaultValue<T extends IField>(field: IField): FieldValue<T> {
  switch (field.type) {
    case FieldTypes.TEXT:
    case FieldTypes.TEXTAREA:
      return '' as FieldValue<T>;
    case FieldTypes.SELECT:
      return '-1' as FieldValue<T>;
  }
}

function getInitialState<T extends Fields>(fields: T): FormState<T> {
  const touched: Record<string, boolean> = {};
  const errors: Record<string, string> = {};
  const values: Record<string, string | number | boolean> = {};

  for (const fieldName in fields) {
    const field = fields[fieldName] as IField;
    if (field === undefined) continue;

    values[fieldName] = getDefaultValue(field);
    touched[fieldName] = false;
    errors[fieldName] = '';
  }

  return { touched, errors, values: values as FormValues<T> };
}

function validateField<T extends IField>(
  field: IField | undefined,
  value: FieldValue<T> | undefined,
): string {
  if (field === undefined) return '';

  // Check if the field is required
  if (
    field.validation?.required !== undefined &&
    (!value || value === getDefaultValue(field))
  )
    return field.validation.required;

  return '';
}

function Form<T extends Fields>(props: Props<T>): JSX.Element {
  const {
    fields,
    onSubmit,
    submitting,
    setSubmitting,
    recaptcha,
    validationMode = ValidationModes.AFTER_BLUR,
    formStyle = FormStyles.BOOTSTRAP,
  } = props;

  const [formState, setFormState] = useState<FormState<T>>(
    getInitialState(fields),
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

    if (!canSubmit) {
      setFormState({
        ...formState,
        errors,
      });
    } else if (!!recaptcha && !recaptchaToken) {
      alert(recaptcha.errorMessage);
    } else {
      setSubmitting(true);
      await onSubmit(formState.values, recaptchaToken ?? '');
      setSubmitting(false);
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
        if (field === undefined) return <></>;
        return (
          <Field
            key={index}
            field={field}
            name={fieldName}
            formStyle={formStyle}
            error={formState.errors[fieldName] ?? ''}
            value={formState.values[fieldName] ?? getDefaultValue(field)}
            onChange={(e) => handleChange(e, fieldName)}
            onBlur={() => handleBlur(fieldName)}
          />
        );
      })}

      <Recaptcha />

      <button type="submit" disabled={submitting} className="btn btn-primary">
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

export default Form;
