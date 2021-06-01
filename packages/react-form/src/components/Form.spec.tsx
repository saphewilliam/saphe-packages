import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  minimalNumberField,
  minimalCheckBoxField,
  minimalSelectField,
  minimalTextAreaField,
  minimalTextField,
  matchSnapshot,
} from '../utils/testHelpers';
import Form from './Form';

const fields = {
  text: minimalTextField,
  textArea: minimalTextAreaField,
  select: minimalSelectField,
  checkBox: minimalCheckBoxField,
  number: minimalNumberField,
};

describe('Form', () => {
  it('renders', () => {
    matchSnapshot(
      <Form
        isSubmitting={false}
        setIsSubmitting={jest.fn()}
        name="testForm"
        fields={fields}
      />,
    );
  });

  it('submits', async () => {
    const setIsSubmittingMock = jest.fn();
    const onSubmitMock = jest.fn();

    render(
      <Form
        isSubmitting={false}
        setIsSubmitting={setIsSubmittingMock}
        onSubmit={onSubmitMock}
        name="testForm"
        fields={fields}
      />,
    );

    userEvent.click(screen.getByText('Submit'));
    expect(setIsSubmittingMock.mock.calls.length).toBe(2);

    // TODO uncomment
    // expect(onSubmitMock.mock.calls.length).toBe(1);
  });

  it('supports change events', () => {
    const setIsSubmittingMock = jest.fn();
    const onSubmitMock = jest.fn();

    render(
      <Form
        isSubmitting={false}
        setIsSubmitting={setIsSubmittingMock}
        onSubmit={onSubmitMock}
        name="testForm"
        fields={fields}
      />,
    );

    const textField = screen.getByLabelText('Text Field') as HTMLInputElement;
    userEvent.click(textField);
    userEvent.type(textField, 'Text input');
    expect(textField.value).toBe('Text input');

    const textAreaField = screen.getByLabelText(
      'Text Area Field',
    ) as HTMLTextAreaElement;
    userEvent.click(textAreaField);
    userEvent.type(textAreaField, 'Text area input');
    expect(textAreaField.value).toBe('Text area input');

    const selectField = screen.getByLabelText(
      'Select Field',
    ) as HTMLTextAreaElement;
    userEvent.selectOptions(selectField, 'option2');
    expect(selectField.value).toBe('option2');
  });

  // it('validates', () => {
  //   let isSubmitting = false
  //   const isSubmittingMock = jest.fn((x) => isSubmitting = x);
  //   const onSubmitMock = jest.fn();

  //   render(
  //     <Form
  //       isSubmitting={isSubmitting}
  //       setIsSubmitting={isSubmittingMock}
  //       onSubmit={onSubmitMock}
  //       name="testForm"
  //       fields={{
  //         text: minimalTextField,
  //         textArea: minimalTextAreaField,
  //         select: minimalSelectField,
  //         checkBox: minimalCheckBoxField,
  //         number: minimalNumberField,
  //       }}
  //     />,
  //   );

  //   const field = screen.getByLabelText('Text Field')
  //   fireEvent.change(field, { target: {value: 'test value'} });
  //   fireEvent.blur(field);
  // })
});
