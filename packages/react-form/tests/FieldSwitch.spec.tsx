import React from 'react';
import FieldSwitch, { Props } from '../src/components/FieldSwitch';
import { FieldType } from '../src/lib/field';
import {
  matchSnapshot,
  minimalCheckField,
  minimalNumberField,
  minimalSelectField,
  minimalTextAreaField,
  minimalTextField,
} from './testHelpers';

const dummyProps: Omit<Props<FieldType>, 'field' | 'value'> = {
  formName: 'formName',
  name: 'fieldName',
  error: '',
  onChange: jest.fn(),
  onBlur: jest.fn(),
};

describe('Field', () => {
  it('renders a text field correctly', () => {
    matchSnapshot(<FieldSwitch field={minimalTextField} value="" {...dummyProps} />);
    matchSnapshot(
      <FieldSwitch
        field={{ ...minimalTextField, description: 'description' }}
        value=""
        {...dummyProps}
        error="error"
      />,
    );
  });

  it('renders a text area field correctly', () => {
    matchSnapshot(<FieldSwitch field={minimalTextAreaField} value="" {...dummyProps} />);
    matchSnapshot(
      <FieldSwitch
        field={{
          ...minimalTextAreaField,
          description: 'description',
          rows: 12,
        }}
        value=""
        {...dummyProps}
        error="error"
      />,
    );
  });

  it('renders a select field correctly', () => {
    matchSnapshot(<FieldSwitch field={minimalSelectField} value="" {...dummyProps} />);
    matchSnapshot(
      <FieldSwitch
        field={{
          ...minimalSelectField,
          description: 'description',
          placeholder: 'placeholder',
        }}
        value=""
        {...dummyProps}
        error="error"
      />,
    );
  });

  it('renders a check field correctly', () => {
    matchSnapshot(<FieldSwitch field={minimalCheckField} value={false} {...dummyProps} />);
    matchSnapshot(
      <FieldSwitch
        field={{ ...minimalCheckField, description: 'description' }}
        value={false}
        {...dummyProps}
        error="error"
      />,
    );
  });

  it('renders a number field correctly', () => {
    matchSnapshot(<FieldSwitch field={minimalNumberField} value={10} {...dummyProps} />);
    matchSnapshot(
      <FieldSwitch
        field={{ ...minimalNumberField, description: 'description' }}
        value={10}
        {...dummyProps}
        error="error"
      />,
    );
  });
});
