import { numberFieldPlugin, textFieldPlugin } from '../src/lib/plugins';
import { renderHook } from '@testing-library/react';
import useForm, { FormStateField, State } from '../src';
import { act } from 'react-test-renderer';
import { expectTypeOf } from 'expect-type';
import { FieldValidation } from '../src/lib/validation';

const plugins = {
  text: textFieldPlugin,
  number: numberFieldPlugin,
};

describe('useForm', () => {
  it('provides type-safe input of form fields based on the provided plugins', () => {
    renderHook(() =>
      useForm(plugins, {
        fields: (t) => {
          // eslint-disable-next-line no-constant-condition
          if (false) {
            // @ts-expect-error Unknown plugin
            const _unknownPlugin = t.unknown({});
            // @ts-expect-error Unknown option
            const _unknownOption = t.text({ unknown: 'test' });
            // @ts-expect-error Incorrect initial value type
            const _incorrectType = t.text({ initialValue: 10 });
            // @ts-expect-error Many is undefined, it should not accept an array by default
            const _manyUndefined = t.text({ initialValue: ['Array of strings'] });
            // @ts-expect-error Many is false, it should not accept an array
            const _manyFalse = t.text({ many: false, initialValue: ['Array of strings'] });
            // @ts-expect-error Many is true, it should not accept a string
            const _manyTrue = t.text({ many: true, initialValue: 'String' });
            // @ts-expect-error Many is true, it should not accept null
            const _manyTrueNull = t.text({ many: true, initialValue: null });
          }

          return {
            exposeCustomOption: t.text({ placeholder: 'String' }),
            correctManyUndefined: t.text({ initialValue: 'String' }),
            correctManyFalse: t.text({ many: false, initialValue: 'String' }),
            correctManyTrue: t.text({ many: true, initialValue: ['Array of strings'] }),
            manyUndefinedNull: t.text({ initialValue: null }),
            manyFalseNull: t.text({ many: false, initialValue: null }),
            manyTrueNullArray: t.text({ many: true, initialValue: [null] }),

            validation: t.text({
              validation: {
                validate: (value) => {
                  expectTypeOf(value).toEqualTypeOf<string | null>();
                  return '';
                },
              },
            }),
            // TODO
            // exposeCustomValidation: t.field.text({ validation: {length} }),
          };
        },
      }),
    );
  });

  it('generates a type-safe submit action based on the specified form fields', () => {
    renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.text({}),
          textNotMany: t.text({ many: false }),
          textMany: t.text({ many: true }),
          textReq: t.text({ validation: { required: 'req' } }),
          textReqNotMany: t.text({ many: false, validation: { required: 'req' } }),
          textReqMany: t.text({ many: true, validation: { required: 'req' } }),
        }),
        onSubmit(formState) {
          expectTypeOf(formState).not.toBeAny();
          expectTypeOf(formState).not.toHaveProperty('random');
          expectTypeOf(formState.text.value).toEqualTypeOf<string | null>();
          expectTypeOf(formState.textNotMany.value).toEqualTypeOf<string | null>();
          expectTypeOf(formState.textMany.value).toEqualTypeOf<(string | null)[]>();
          expectTypeOf(formState.textReq.value).toEqualTypeOf<string>();
          expectTypeOf(formState.textReqNotMany.value).toEqualTypeOf<string>();
          expectTypeOf(formState.textReqMany.value).toEqualTypeOf<string[]>();
        },
      }),
    );
  });

  it('passes props and settings down to fields', () => {
    const textLabel = 'Text Label';
    const textDescription = 'This is the description!';
    const textInitialValue = 'Initial Value';
    const textPlaceholder = 'This is the placeholder';

    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.text({
            label: textLabel,
            description: textDescription,
            initialValue: textInitialValue,
            placeholder: textPlaceholder,
            state: State.DISABLED,
          }),
          textMany: t.text({ many: true }),
        }),
      }),
    );

    expect(result.current.props.text.id).toBe(':r0:text');
    expect(result.current.props.text.name).toBe(':r0:text');
    expect(result.current.props.text.label).toBe(textLabel);
    expect(result.current.props.text.description).toBe(textDescription);
    expect(result.current.props.text.value).toBe(textInitialValue);
    expect(result.current.props.text.placeholder).toBe(textPlaceholder);
    // TODO
    expect(result.current.props.text.isDisabled).toBeFalsy();
    // TODO
    expect(result.current.props.text.isHidden).toBeFalsy();
    expect(result.current.props.text.error).toBe('');
    expect(result.current.props.text.many).toBeFalsy();

    expect(result.current.state.text.field.description).toBe(textDescription);
    // TODO
    expect(result.current.state.text.field.state).toBe(State.DISABLED);
    expect(result.current.state.text.field.initialValue).toBe(textInitialValue);
    expect(result.current.state.text.field.label).toBe(textLabel);
    expect(result.current.state.text.field.many).toBeFalsy();
    expect(result.current.state.text.field.placeholder).toBe(textPlaceholder);

    expect(result.current.props.textMany.fields[0]?.id).toBe(':r0:textMany0');
    expect(result.current.props.textMany.fields[0]?.name).toBe(':r0:textMany0');
    expect(result.current.props.textMany.label).toBe('Text Many');
    expect(result.current.props.textMany.description).toBe('');
    expect(result.current.props.textMany.fields[0]?.value).toBe('');
    expect(result.current.props.textMany.placeholder).toBeUndefined();
    // TODO
    expect(result.current.props.textMany.fields[0]?.isDisabled).toBeFalsy();
    // TODO
    expect(result.current.props.textMany.fields[0]?.isHidden).toBeFalsy();
    expect(result.current.props.textMany.fields[0]?.error).toBe('');
    expect(result.current.props.textMany.many).toBeTruthy();

    expect(result.current.state.textMany.field.description).toBeUndefined();
    // TODO
    expect(result.current.state.textMany.field.state).toBe(undefined);
    expect(result.current.state.textMany.field.initialValue).toBeUndefined();
    expect(result.current.state.textMany.field.label).toBeUndefined();
    expect(result.current.state.textMany.field.many).toBeTruthy();
    expect(result.current.state.textMany.field.placeholder).toBeUndefined();

    expect(result.current.state.text.value).toBe(textInitialValue);
    expect(result.current.state.textMany.value).toEqual([null]);
  });

  it('fires an onChange event and changeEffect on a field change event', () => {
    const onChange = jest.fn();
    const changeEffect = jest.fn();

    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.text({}),
          number: t.number({}),
          manyText: t.text({ many: true, initialValue: [null, null] }),
        }),
        onChange,
        changeEffect,
      }),
    );

    const textValue = 'Hi, mom!';
    act(() => result.current.props.text.onChange(textValue));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(changeEffect).toHaveBeenCalledTimes(1);
    expect(result.current.state.text.value).toBe(textValue);
    expect(result.current.props.text.value).toBe(textValue);

    const numberValue = '42';
    act(() => result.current.props.number.onChange(numberValue));
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(changeEffect).toHaveBeenCalledTimes(2);
    expect(result.current.state.number.value).toBe(parseInt(numberValue));
    expect(result.current.props.number.value).toBe(numberValue);

    const textValue0 = 'Value 0';
    const textValue1 = 'Value 1';
    act(() => result.current.props.manyText.fields[0]?.onChange(textValue0));
    act(() => result.current.props.manyText.fields[1]?.onChange(textValue1));
    expect(onChange).toHaveBeenCalledTimes(4);
    expect(changeEffect).toHaveBeenCalledTimes(4);
    expect(result.current.state.manyText.value[0]).toBe(textValue0);
    expect(result.current.state.manyText.value[1]).toBe(textValue1);
    expect(result.current.props.manyText.fields[0]?.value).toBe(textValue0);
    expect(result.current.props.manyText.fields[1]?.value).toBe(textValue1);

    // TODO test async change effect
    // TODO test returning new state
  });

  it('fires an onBlur event and blurEffect on a field blur event', () => {
    const onBlur = jest.fn();
    const blurEffect = jest.fn();

    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.text({}),
          manyText: t.text({ many: true, initialValue: [null, null] }),
        }),
        onBlur,
        blurEffect,
      }),
    );

    expect(result.current.state.text.touched).toBeFalsy();
    expect(result.current.state.manyText.touched[0]).toBeFalsy();
    expect(result.current.state.manyText.touched[1]).toBeFalsy();

    act(() => result.current.props.text.onBlur());
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(blurEffect).toHaveBeenCalledTimes(1);
    expect(result.current.state.text.touched).toBeTruthy();
    expect(result.current.state.manyText.touched[0]).toBeFalsy();
    expect(result.current.state.manyText.touched[1]).toBeFalsy();

    act(() => result.current.props.manyText.fields[0]?.onBlur());
    expect(onBlur).toHaveBeenCalledTimes(2);
    expect(blurEffect).toHaveBeenCalledTimes(2);
    expect(result.current.state.text.touched).toBeTruthy();
    expect(result.current.state.manyText.touched[0]).toBeTruthy();
    expect(result.current.state.manyText.touched[1]).toBeFalsy();

    // TODO test async blur effect
    // TODO test returning new state
  });

  it('fires an onSubmit event on a form submit event', async () => {
    const onSubmit = jest.fn();
    const preventDefault = jest.fn();

    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.text({}),
          manyText: t.text({ many: true }),
        }),
        onSubmit,
      }),
    );

    expect(result.current.state.text.touched).toBeFalsy();
    expect(result.current.state.manyText.touched[0]).toBeFalsy();

    await act(
      () =>
        new Promise((resolve) => {
          result.current.props.submitButton.onClick({ preventDefault });
          resolve();
        }),
    );
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(result.current.state.text.touched).toBeTruthy();
    expect(result.current.state.manyText.touched[0]).toBeTruthy();

    // TODO text async submit method
    // TODO test returning new state
  });

  it('handles field state on every form state update', () => {
    const correct = 'Correct';

    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          // Possible field states are State.ENABLED, State.LOADING, State.DISABLED, State.HIDDEN
          // FieldState also accepts a function that takes the form state and returns either of these field states
          // A field state function fires on each form state update
          // Default state is `State.ENABLED`
          text: t.text({}),
          textConditional: t.text({
            state: (formState) => {
              expectTypeOf(formState).not.toHaveProperty('random');
              expectTypeOf(formState)
                .toHaveProperty('text')
                .toMatchTypeOf<
                  FormStateField<
                    string,
                    string,
                    false,
                    FieldValidation<string>,
                    { placeholder?: string | undefined }
                  >
                >();
              return formState.text.value === correct ? State.ENABLED : State.HIDDEN;
            },
          }),
          // If a field is not always enabled, then the type is `Value | null`, even if validation.required is supplied
          // A field is not validated if its state is not enabled
          textEnabled: t.text({ state: State.ENABLED }),
          textDisabled: t.text({ state: State.DISABLED }),
          textEnabledReq: t.text({
            state: State.ENABLED,
            validation: { required: 'This should show' },
          }),
          // Because this field state is never enabled, its value can only be the initial value, or the plugin's default initial value
          textDisabledReq: t.text({
            state: State.DISABLED,
            validation: { required: 'This should never show' },
          }),
          textHiddenInitialValue: t.text({
            initialValue: 'initialValue',
            state: State.HIDDEN,
          }),
        }),
        onSubmit(_formState, formValues) {
          expectTypeOf(formValues.text).toEqualTypeOf<string | null>();
          expectTypeOf(formValues.textConditional).toEqualTypeOf<string | null>();
          expectTypeOf(formValues.textEnabled).toEqualTypeOf<string | null>();
          expectTypeOf(formValues.textDisabled).toEqualTypeOf<null>();
          expectTypeOf(formValues.textEnabledReq).toEqualTypeOf<string>();
          expectTypeOf(formValues.textDisabledReq).toEqualTypeOf<null>();
          expectTypeOf(formValues.textHiddenInitialValue).toEqualTypeOf<'initialValue'>();
        },
      }),
    );

    expect(result.current.props.text.state).toBe(State.ENABLED);
    expect(result.current.props.textConditional.state).toBe(State.ENABLED);
    expect(result.current.props.textEnabled.state).toBe(State.ENABLED);
    expect(result.current.props.textDisabled.state).toBe(State.DISABLED);
    expect(result.current.props.textEnabledReq.state).toBe(State.ENABLED);
    expect(result.current.props.textEnabledReq.error).toBe('');
    expect(result.current.props.textDisabledReq.state).toBe(State.DISABLED);
    expect(result.current.props.textDisabledReq.error).toBe('');
    expect(result.current.props.textHiddenInitialValue.state).toBe(State.HIDDEN);
    expect(result.current.props.textHiddenInitialValue.value).toBe('initialValue');
  });
});
