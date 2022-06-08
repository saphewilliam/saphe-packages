import { useEffect } from 'react';
import { Props } from '..';
import Form from '../components/Form';
import FieldContainer from '../components/helpers/FieldContainer';
import SubmitButton from '../components/helpers/SubmitButton';
import useRecaptcha from '../hooks/useRecaptcha';
import { FieldType } from '../lib/field';
import { Config, State } from '../lib/hook';
import { Fields, AddFieldPack, stringify, FieldValue } from '../lib/util';
import useFormState from './useFormState';

export default function useForm<T extends Fields>(config: Config<T>): State {
  const { name, fieldPack, recaptcha, submitButton, onBlur, onChange } = config;

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

  const handleBlur = (fieldName: string) => {
    actions.blurSync(fieldName);
    if (onBlur) actions.blur(fieldName);
  };

  const handleChange = (fieldName: string, targetValue: FieldValue<FieldType>) => {
    actions.changeSync(fieldName, targetValue);
    if (onChange) actions.change(fieldName);
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
  }, [actions, config.fields, state.fields]);

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
        onFieldBlur={handleBlur}
        onFieldChange={handleChange}
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
