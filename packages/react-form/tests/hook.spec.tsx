import useForm, { FieldTypes, ValidationModes } from '@saphe/react-form';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

describe('kitchen sink', () => {
  it('accepts all desired fields', () => {
    const {
      result: {
        current: { Form },
      },
    } = renderHook(() =>
      useForm({
        name: 'contactForm',
        fields: {
          name: {
            type: FieldTypes.TEXT,
            label: 'Name',
            description: 'Please enter your full name',
            placeholder: 'Enter your name...',
            validation: {
              required: 'Name is a required field',
              validate: async (value) => {
                if (value === 'Rick Astley') return '';
                else return 'This value did not pass the vibe check';
              },
            },
          },
          subject: {
            type: FieldTypes.SELECT,
            label: 'Subject',
            placeholder: 'Choose a subject from the list...',
            options: [
              { label: 'Meeting', value: '1' },
              { label: 'Quote', value: '2' },
              { label: 'Other', value: '3' },
            ],
            validation: {
              required: 'Subject is a required field',
            },
          },
          message: {
            type: FieldTypes.TEXTAREA,
            label: 'Message',
            initialValue: '5 stars!',
            validation: {
              required: 'Message is a required field',
            },
          },
        },
        recaptcha: {
          siteKey: process.env.RECAPTCHA_SITE_KEY ?? '',
          locale: 'en',
          errorMessage: 'Please confirm you are not a robot',
        },
        validationMode: ValidationModes.AFTER_BLUR,
        onSubmit: async (formValues, { recaptchaToken }) => {
          // eslint-disable-next-line no-console
          console.log(formValues, recaptchaToken);
        },
      }),
    );

    render(<Form />);
  });
});
