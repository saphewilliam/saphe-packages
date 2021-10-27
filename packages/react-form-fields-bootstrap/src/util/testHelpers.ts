import useForm, { Field } from '@saphe/react-form';
import { renderHook } from '@testing-library/react-hooks';
import { ReactElement } from 'react';
import { BootstrapFieldPack } from '..';

interface FormState {
  Form: () => ReactElement;
}

export const renderForm = (hook: () => FormState): (() => ReactElement) =>
  renderHook(hook).result.current.Form;

export const minimalTextFieldForm = (props?: {
  description?: string;
}): FormState =>
  useForm({
    name: 'minimalTextFieldForm',
    fieldPack: BootstrapFieldPack,
    fields: {
      textField: {
        type: Field.TEXT,
        label: 'Text Field',
        description: props?.description,
        // validation: {
        //   required:
        // }
      },
    },
  });

export const minimalTextAreaFieldForm = (props?: {
  description?: string;
}): FormState =>
  useForm({
    name: 'minimalTextAreaFieldForm',
    fieldPack: BootstrapFieldPack,
    fields: {
      textAreaField: {
        type: Field.TEXT_AREA,
        label: 'Textarea Field',
        description: props?.description,
      },
    },
  });

export const minimalSelectFieldForm = (props?: {
  description?: string;
}): FormState =>
  useForm({
    name: 'minimalSelectFieldForm',
    fieldPack: BootstrapFieldPack,
    fields: {
      selectField: {
        type: Field.SELECT,
        label: 'Select Field',
        description: props?.description,
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
  });

export const minimalCheckBoxFieldForm = (props?: {
  description?: string;
}): FormState =>
  useForm({
    name: 'minimalCheckBoxFieldForm',
    fieldPack: BootstrapFieldPack,
    fields: {
      checkBoxField: {
        type: Field.CHECK,
        label: 'Checkbox Field',
        description: props?.description,
      },
    },
  });

export const minimalNumberFieldForm = (props?: {
  description?: string;
}): FormState =>
  useForm({
    name: 'minimalNumberFieldForm',
    fieldPack: BootstrapFieldPack,
    fields: {
      numberField: {
        type: Field.NUMBER,
        label: 'Number Field',
        description: props?.description,
      },
    },
  });
