import React from 'react';
import Field from '../src/components/FieldSwitch';
import {
  matchSnapshot,
  minimalCheckBoxField,
  minimalNumberField,
  minimalSelectField,
  minimalTextAreaField,
  minimalTextField,
} from './testHelpers';

const dummyProps = {
  id: 'formNameFieldName',
  name: 'fieldName',
  label: 'Field Label',
  description: '',
  describedBy: 'formNameFieldNameDescription',
  disabled: false,
  error: '',
  value: '',
  onChange: jest.fn(),
  onBlur: jest.fn(),
};

describe('Field', () => {
  it('renders a text field correctly', () => {
    matchSnapshot(<Field field={minimalTextField} {...dummyProps} />);
    matchSnapshot(
      <Field
        field={{ ...minimalTextField, description: 'description' }}
        {...dummyProps}
        error="error"
      />,
    );
  });

  it('renders a text area field correctly', () => {
    matchSnapshot(<Field field={minimalTextAreaField} {...dummyProps} />);
    matchSnapshot(
      <Field
        field={{
          ...minimalTextAreaField,
          description: 'description',
          rows: 12,
        }}
        {...dummyProps}
        error="error"
      />,
    );
  });

  it('renders a select field correctly', () => {
    matchSnapshot(<Field field={minimalSelectField} {...dummyProps} />);
    matchSnapshot(
      <Field
        field={{
          ...minimalSelectField,
          description: 'description',
          placeholder: 'placeholder',
        }}
        {...dummyProps}
        error="error"
      />,
    );
  });

  it('renders a checkbox field correctly', () => {
    matchSnapshot(
      <Field field={minimalCheckBoxField} {...dummyProps} value={false} />,
    );
    matchSnapshot(
      <Field
        field={{ ...minimalCheckBoxField, description: 'description' }}
        {...dummyProps}
        value={false}
        error="error"
      />,
    );
  });

  it('renders a number field correctly', () => {
    matchSnapshot(
      <Field field={minimalNumberField} {...dummyProps} value={10} />,
    );
    matchSnapshot(
      <Field
        field={{ ...minimalNumberField, description: 'description' }}
        {...dummyProps}
        value={10}
        error="error"
      />,
    );
  });
});
