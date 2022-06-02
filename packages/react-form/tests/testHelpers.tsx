import { ReactElement } from 'react';
import renderer from 'react-test-renderer';
import { Field, TextType, TextAreaType, SelectType, CheckType, NumberType } from '../src/lib/field';

export const matchSnapshot = (component: ReactElement): void =>
  expect(renderer.create(component).toJSON()).toMatchSnapshot();

export const minimalTextField: TextType = {
  type: Field.TEXT,
  label: 'Text Field',
};

export const minimalTextAreaField: TextAreaType = {
  type: Field.TEXT_AREA,
  label: 'Text Area Field',
};

export const minimalSelectField: SelectType = {
  type: Field.SELECT,
  label: 'Select Field',
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ],
};

export const minimalCheckField: CheckType = {
  type: Field.CHECK,
  label: 'Check Field',
};

export const minimalNumberField: NumberType = {
  type: Field.NUMBER,
  label: 'Number Field',
};
