import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Form from '../src/components/Form';
import {
  minimalNumberField,
  minimalCheckField,
  minimalSelectField,
  minimalTextAreaField,
  minimalTextField,
  matchSnapshot,
} from './testHelpers';

const fields = {
  text: minimalTextField,
  textArea: minimalTextAreaField,
  select: minimalSelectField,
  check: minimalCheckField,
  number: minimalNumberField,
};

describe('Form', () => {
  it.todo('tests');
  //   it('renders', () => {
  //     matchSnapshot(
  //       <Form isSubmitting={false} setIsSubmitting={jest.fn()} name="testForm" fields={fields} />,
  //     );
  //   });

  //   it('submits', async () => {
  //     const setIsSubmittingMock = jest.fn();
  //     const onSubmitMock = jest.fn();

  //     render(
  //       <Form
  //         isSubmitting={false}
  //         setIsSubmitting={setIsSubmittingMock}
  //         onSubmit={onSubmitMock}
  //         name="testForm"
  //         fields={fields}
  //       />,
  //     );

  //     userEvent.click(screen.getByText('Submit'));
  //     expect(onSubmitMock.mock.calls.length).toBe(1);
  //     expect(setIsSubmittingMock.mock.calls.length).toBe(2);
  //   });

  //   it('supports change events', () => {
  //     render(
  //       <Form
  //         isSubmitting={false}
  //         setIsSubmitting={jest.fn()}
  //         onSubmit={jest.fn()}
  //         name="testForm"
  //         fields={fields}
  //       />,
  //     );

  //     const textField = screen.getByLabelText('Text Field') as HTMLInputElement;
  //     userEvent.click(textField);
  //     userEvent.type(textField, 'Text input');
  //     expect(textField.value).toBe('Text input');

  //     const textAreaField = screen.getByLabelText('Text Area Field') as HTMLTextAreaElement;
  //     userEvent.click(textAreaField);
  //     userEvent.type(textAreaField, 'Text area input');
  //     expect(textAreaField.value).toBe('Text area input');

  //     const selectField = screen.getByLabelText('Select Field') as HTMLTextAreaElement;
  //     expect(selectField.value).toBe('');
  //     userEvent.selectOptions(selectField, 'option2');
  //     expect(selectField.value).toBe('option2');

  //     const numberField = screen.getByLabelText('Number Field') as HTMLInputElement;
  //     userEvent.type(numberField, '1234d');
  //     expect(numberField.value).toBe('1234');

  //     const checkField = screen.getByLabelText('Check Field') as HTMLInputElement;
  //     expect(checkField.checked).toBeFalsy();
  //     userEvent.click(checkField);
  //     expect(checkField.checked).toBeTruthy();
  //   });

  //   it('validates required fields', () => {
  //     const requiredText = 'This field is required';
  //     const required = {
  //       validation: {
  //         required: requiredText,
  //       },
  //     };

  //     render(
  //       <Form
  //         isSubmitting={false}
  //         setIsSubmitting={jest.fn()}
  //         onSubmit={jest.fn()}
  //         name="testForm"
  //         fields={{
  //           text: { ...minimalTextField, ...required },
  //           textArea: { ...minimalTextAreaField, ...required },
  //           select: { ...minimalSelectField, ...required },
  //           check: { ...minimalCheckField, ...required },
  //           number: { ...minimalNumberField, ...required },
  //         }}
  //       />,
  //     );

  //     const textErrorTestId = 'testFormTextError';
  //     const textField = screen.getByLabelText('Text Field');
  //     expect(screen.queryByTestId(textErrorTestId)).toBeNull();
  //     fireEvent.blur(textField);
  //     expect(screen.getByTestId(textErrorTestId).innerHTML).toBe(requiredText);

  //     // TODO other fields
  //   });

  //   it.todo('validates string');
});
