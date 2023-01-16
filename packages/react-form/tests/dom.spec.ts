export default {};

describe('DOM', () => {
  it.todo('should manipulate DOM elements correctly');
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

  // TODO test kitchen sink
  // const {
  //   result: {
  //     current: { Form },
  //   },
  // } = renderHook(() =>
  //   useForm({
  //     name: 'contactForm',
  //     fields: {
  //       name: {
  //         type: FieldTypes.TEXT,
  //         label: 'Name',
  //         description: 'Please enter your full name',
  //         placeholder: 'Enter your name...',
  //         validation: {
  //           required: 'Name is a required field',
  //           validate: async (value) => {
  //             if (value === 'Rick Astley') return '';
  //             else return 'This value did not pass the vibe check';
  //           },
  //         },
  //       },
  //       subject: {
  //         type: FieldTypes.SELECT,
  //         label: 'Subject',
  //         placeholder: 'Choose a subject from the list...',
  //         options: [
  //           { label: 'Meeting', value: '1' },
  //           { label: 'Quote', value: '2' },
  //           { label: 'Other', value: '3' },
  //         ],
  //         validation: {
  //           required: 'Subject is a required field',
  //         },
  //       },
  //       message: {
  //         type: FieldTypes.TEXTAREA,
  //         label: 'Message',
  //         initialValue: '5 stars!',
  //         validation: {
  //           required: 'Message is a required field',
  //         },
  //       },
  //     },
  //     recaptcha: {
  //       siteKey: process.env.RECAPTCHA_SITE_KEY ?? '',
  //       locale: 'en',
  //       errorMessage: 'Please confirm you are not a robot',
  //     },
  //     validationMode: ValidationModes.AFTER_BLUR,
  //     onSubmit: async (formValues, { recaptchaToken }) => {
  //       // eslint-disable-next-line no-console
  //       console.log(formValues, recaptchaToken);
  //     },
  //   }),
  // );
});
