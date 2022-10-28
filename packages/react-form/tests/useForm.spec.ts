import { numberFieldPlugin, textFieldPlugin } from '../src/lib/plugins';
import { renderHook } from '@testing-library/react';
import useForm from '../src';
import { act } from 'react-test-renderer';

const plugins = {
  text: textFieldPlugin,
  number: numberFieldPlugin,
};

describe('useForm', () => {
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
    expect(result.current.state.text.field.fieldState).toBe(undefined);
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
    expect(result.current.state.textMany.field.fieldState).toBe(undefined);
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
});
