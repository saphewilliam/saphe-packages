import { ReactElement } from 'react';
import renderer from 'react-test-renderer';
import {
  FieldTypes,
  INumberField,
  ISelectField,
  ITextAreaField,
  ICheckBoxField,
  ITextField,
} from '../src/utils/fieldTypes';

export const matchSnapshot = (component: ReactElement): void =>
  expect(renderer.create(component).toJSON()).toMatchSnapshot();

export const minimalTextField: ITextField = {
  type: FieldTypes.TEXT,
  label: 'Text Field',
};

export const minimalTextAreaField: ITextAreaField = {
  type: FieldTypes.TEXTAREA,
  label: 'Text Area Field',
};

export const minimalSelectField: ISelectField = {
  type: FieldTypes.SELECT,
  label: 'Select Field',
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ],
};

export const minimalCheckBoxField: ICheckBoxField = {
  type: FieldTypes.CHECKBOX,
  label: 'Checkbox Field',
};

export const minimalNumberField: INumberField = {
  type: FieldTypes.NUMBER,
  label: 'Number Field',
};
