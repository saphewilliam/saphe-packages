import useForm, { FieldState, textAreaFieldPlugin, textFieldPlugin, ValidationMode } from '../src';
import { renderHook } from '@testing-library/react';

describe('textFieldPlugin', () => {
  it('accepts all intended options', () => {
    renderHook(() =>
      useForm(
        { text: textFieldPlugin },
        {
          fields: (t) => ({
            text: t.text({
              many: true,
              label: 'Name',
              description: 'This is a text field',
              initialValue: ['Name 1', null],
              initialState: FieldState.LOADING,
              placeholder: 'John Doe',
              validation: {
                mode: ValidationMode.ON_SUBMIT,
                length: { lt: 10, message: 'Your name is too long!' },
                match: {
                  pattern: /[A-Z][a-z]*\s[A-Z][a-z]*/gm,
                  message: 'Please enter your first and last name',
                },
                required: 'Please enter a name',
                validate: (value) => (value !== 'Nicolas Cage' ? 'Your name is incorrect' : ''),
              },
            }),
          }),
        },
      ),
    );
  });
});

describe('textAreaFieldPlugin', () => {
  renderHook(() =>
    useForm(
      { textArea: textAreaFieldPlugin },
      {
        fields: (t) => ({
          textArea: t.textArea({
            many: false,
            label: 'Message',
            description: 'We will try to answer within 365 business days!',
            // TODO test bug where initialValue is null, but plugin initialValue is not
            initialValue: null,
            initialState: FieldState.ENABLED,
            placeholder: 'Your message here...',
            rows: 10,
            validation: {
              mode: ValidationMode.ON_CHANGE,
              required: 'Please enter a message',
              length: { lte: 255, message: 'Your message is too long!' },
              match: {
                pattern: /^Dear\s/gm,
                message: 'Your message should start with "Dear"',
              },
              validate: (value) =>
                value !== 'Dear Nicolas Cage' ? 'Your message is incorrect' : '',
            },
          }),
        }),
      },
    ),
  );
});
