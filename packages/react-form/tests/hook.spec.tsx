import useForm, { FieldTypes, ValidationModes } from '@saphe/react-form';
import { render } from '@testing-library/react';
import React from 'react';

describe('kitchen sink', () => {
  it('accepts all desired fields', () => {
    const { Form } = useForm({
      /** Required, necessary for the use of IDs **/
      name: 'contactForm',

      /** Required, defines the field pack used for this form **/
      // fieldPack: BootstrapFieldPack,

      /** Required, declares the fields of the form **/
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

      /** Optional, adds a recaptcha check to the form **/
      recaptcha: {
        siteKey: process.env.RECAPTCHA_SITE_KEY ?? '',
        locale: 'en',
        errorMessage: 'Please confirm you are not a robot',
      },

      /** Optional, defines the he global form validation mode **/
      validationMode: ValidationModes.AFTER_BLUR,

      /** Required, the function that fires when the user presses the submit button **/
      onSubmit: async (formValues, { recaptchaToken }) => {
        // eslint-disable-next-line no-console
        console.log(formValues, recaptchaToken);
      },
    });

    render(<Form />);
  });
});
