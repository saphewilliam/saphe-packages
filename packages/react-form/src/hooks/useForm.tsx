import React, { useEffect } from 'react';
import { Props } from '..';
import Form from '../components/Form';
import FieldContainer from '../components/helpers/FieldContainer';
import SubmitButton from '../components/helpers/SubmitButton';
import useRecaptcha from '../hooks/useRecaptcha';
import { Config, State } from '../lib/hook';
import { Fields, AddFieldPack, stringify } from '../lib/util';
import useFormState from './useFormState';

export default function useForm<T extends Fields>(config: Config<T>): State {
  const { name, fieldPack, recaptcha, submitButton } = config;

  const { Recaptcha, recaptchaToken } = useRecaptcha(recaptcha);
  const formState = useFormState(config, recaptchaToken);
  const { state, actions, isLoading } = formState;

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    actions.submit();
  };

  const handleReset = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    actions.reset();
  };

  const submitButtonProps: AddFieldPack<Props.SubmitButtonProps> = {
    label: !isLoading
      ? submitButton?.label ?? 'Submit'
      : submitButton?.submittingLabel ?? submitButton?.label ?? 'Processing...',
    disabled: Object.values(state.errors).reduce<boolean>(
      (prev, curr) => prev || curr !== '',
      false,
    ),
    type: 'submit',
    fieldPack,
    isLoading,
  };

  useEffect(() => {
    if (stringify(config.fields) !== stringify(state.fields)) actions.reset();
  }, [config.fields]);

  return {
    formState,
    form: (
      <Form
        name={name}
        fields={state.fields}
        fieldPack={fieldPack}
        touched={state.touched}
        errors={state.errors}
        values={state.values}
        onSubmit={handleSubmit}
        onReset={handleReset}
        onFieldBlur={actions.blur}
        onFieldChange={actions.change}
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
        type="button"
        onClick={handleSubmit}
      />
    ),
  };
}
