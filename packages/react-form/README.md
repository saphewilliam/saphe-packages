# @saphe/react-form

**⚠️ Currently in development - _Not all functionality described in these docs is implemented yet_**

A lightweight, declarative, type-safe form engine for React apps. Best practices are the default. Form validation is built in with the typechecking.

## TODOs

- [ ] Better testing suite
- [ ] Scale recaptcha badge down when viewing on smaller screens like [this](https://geekgoddess.com/how-to-resize-the-google-nocaptcha-recaptcha/) or [this](https://developers.google.com/recaptcha/docs/display#render_param)
- [ ] Submit should set `touched` on all form items to true
- [ ] Give the form a name and prefix all id's with that name
- [ ] Create Bootstrap, MaterialCSS and ChackraUI packs and the ability to create your own pack in the same way
- [ ] Add FormFieldContainer and SubmitButton as part of a pack
- [ ] Disallow unkown properties of the useForm config
- [ ] Field modifiers (transform a string to uppercase or round a number (floor or ceil))

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
- CHECKBOX
- NUMBER
- More to come... 
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
import useForm, { FieldTypes, ValidationModes } from '@saphe/react-form';
import BootstrapFieldPack from '@saphe/react-form-fields-bootstrap';

const { Form } = useForm({

  /** Required, the name of this form. Necessary for the use of IDs */
  name: 'contactForm',

  /** Optional, defines the form fields used for this form */
  fieldPack: BootstrapFieldPack,

  /** Optional, defines the global form validation mode. Defaults to `ValidationModes.AFTER_BLUR` */
  validationMode: ValidationModes.AFTER_BLUR,

  /** Required, declares the fields of the form */
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

  /** Optional, adds a recaptcha check to the form */
  recaptcha: {
    siteKey: process.env.RECAPTCHA_SITE_KEY,
    locale: 'en',
    errorMessage: 'Please confirm you are not a robot',
  },

  /** Required, the void function that fires on a form submission event */
  onSubmit: async (formValues, { recaptchaToken }) => {
    console.log(formValues, recaptchaToken);
  },
});
```

## Contributing
// TODO
