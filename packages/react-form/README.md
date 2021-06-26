# @saphe/react-form

**⚠️ Currently in development**

A lightweight, declarative, type-safe form engine for React apps. Best practices are the default. Form validation is built in with the typechecking.

## TODOs

- [x] Eliminate native change and blur events in favor of minimalized custom ones so all intermediate values can be native types
- [ ] Support lists of values
- [ ] Support form layouts (advanced form field container with layout grid)
- [ ] Field modifiers (transform a string to uppercase or round a number (floor or ceil))
- [ ] Support localization out of the box
- [ ] Create supported field packs:
  - [x] Bootstrap
  - [ ] TailwindCSS
  - [ ] MaterialCSS
  - [ ] ChackraUI

## Getting Started

### Install

Using yarn:

```sh
yarn add @saphe/react-form
```

or using npm:

```sh
npm install @saphe/react-form
```

## Docs

### Field Types

- TEXT
- TEXTAREA
- SELECT
- CHECK
- NUMBER
- More to come...
  - FILE
  - RADIO
  - DATE
  - DATETIME
  - TIME
  - RANGE
  - RATING
  - EMAIL
  - PASSWORD
  - PHONE
  - COLOR
  - CRSF
  - NOTICE

### Validation Modes

Mode|Behavior
-|-
`ValidationModes.AFTER_BLUR` **(default)**|Don't validate a field until it has been blurred once, then validate it on change
`ValidationModes.ON_CHANGE`|Validate a field with every change
`ValidationModes.ON_BLUR`|Only validate the field once a user is done typing
`ValidationModes.ON_SUBMIT`|The field will only validate in the event of a form submission

You can assign a global validation mode by assigning it to the config object suppied to `useForm`. You can also assign field-specific validation modes by assigning them to the field config. The local validation modes take presidence over the global ones.

```ts
const form = useForm({
  // ...other form config
  validationMode: ValidationModes.ON_BLUR,
  fields: {
    fieldExample: {
      // ...other field config
      validation: {
        mode: ValidationModes.ON_CHANGE,
      },
    },
  },
});
```

### Kitchen Sink
```ts
import useForm, { Field, ValidationMode } from '@saphe/react-form';
import BootstrapFieldPack from '@saphe/react-form-fields-bootstrap';

const { Form } = useForm({

  /** Required, the name of this form. Necessary for the use of IDs */
  name: 'contactForm',

  /** Required, declares the fields of the form */
  fields: {
    name: {
      type: Field.TEXT,
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
      type: Field.SELECT,
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
      type: Field.TEXTAREA,
      label: 'Message',
      initialValue: '5 stars!',
      validation: {
        required: 'Message is a required field',
      },
    },
  },

  /** Optional, defines the form fields used for this form */
  fieldPack: BootstrapFieldPack,

  /** Optional, defines the global form validation mode. Defaults to `ValidationMode.AFTER_BLUR` */
  validationMode: ValidationMode.AFTER_BLUR,

  /** Optional, adds a recaptcha check to the form */
  recaptcha: {
    siteKey: process.env.RECAPTCHA_SITE_KEY,
    locale: 'en',
    onError: () => alert('Please confirm you are not a robot'),
  },

  /** Optional, the void function that fires on a form submission event */
  onSubmit: async (formValues, { recaptchaToken }) => {
    console.log(formValues, recaptchaToken);
  },
});
```

## Contributing
// TODO
