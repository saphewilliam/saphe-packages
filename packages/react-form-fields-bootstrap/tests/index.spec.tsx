import useForm, { FieldTypes } from '@saphe/react-form';
import { renderHook } from '@testing-library/react-hooks';
import renderer from 'react-test-renderer';
import React from 'react';
import { BootstrapFieldPack } from '../src/index';
import { render } from '@testing-library/react';

describe('The field pack', () => {
  it('renders a minimal text field', () => {
    const {
      result: {
        current: { Form },
      },
    } = renderHook(() =>
      useForm({
        name: 'minimalTextFieldForm',
        fieldPack: BootstrapFieldPack,
        fields: {
          textField: {
            type: FieldTypes.TEXT,
            label: 'Text Field',
          },
        },
        onSubmit: () => console.log(),
      }),
    );
    
    expect(renderer.create(<Form />).toJSON()).toMatchSnapshot()
  });

  it('renders a minimal textarea field', () => {
    const {
      result: {
        current: { Form },
      },
    } = renderHook(() =>
      useForm({
        name: 'minimalTextareaFieldForm',
        fieldPack: BootstrapFieldPack,
        fields: {
          textField: {
            type: FieldTypes.TEXTAREA,
            label: 'Textarea Field',
          },
        },
        onSubmit: () => console.log(),
      }),
    );
    
    expect(renderer.create(<Form />).toJSON()).toMatchSnapshot()
  });

  it('renders a minimal select field', () => {
    const {
      result: {
        current: { Form },
      },
    } = renderHook(() =>
      useForm({
        name: 'minimalSelectFieldForm',
        fieldPack: BootstrapFieldPack,
        fields: {
          textField: {
            type: FieldTypes.SELECT,
            label: 'Select Field',
            options: [
              {
                label: 'Option 1',
                value: 'option-1',
              },
              {
                label: 'Option 2',
                value: 'option-2',
              },
            ],
          },
        },
        onSubmit: () => console.log(),
      }),
    );

    expect(renderer.create(<Form />).toJSON()).toMatchSnapshot()
  });

  it('renders a minimal checkbox field', () => {
    const {
      result: {
        current: { Form },
      },
    } = renderHook(() =>
      useForm({
        name: 'minimalCheckboxFieldForm',
        fieldPack: BootstrapFieldPack,
        fields: {
          textField: {
            type: FieldTypes.CHECKBOX,
            label: 'Checkbox Field',
          },
        },
        onSubmit: () => console.log(),
      }),
    );
    
    expect(renderer.create(<Form />).toJSON()).toMatchSnapshot()
  });
});
