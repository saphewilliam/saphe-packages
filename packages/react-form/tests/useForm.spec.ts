import { numberFieldPlugin, textFieldPlugin } from '../src/lib/plugins';
import { renderHook } from '@testing-library/react';
import useForm from '../src';
import { act } from 'react-test-renderer';

const plugins = {
  fields: {
    text: textFieldPlugin,
    number: numberFieldPlugin,
  },
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
          text: t.field.text({
            label: textLabel,
            description: textDescription,
            initialValue: textInitialValue,
            placeholder: textPlaceholder,
          }),
          textMany: t.field.text({
            many: true,
          }),
        }),
      }),
    );

    expect(result.current.controls.text.id).toBe(':r0:text');
    expect(result.current.controls.text.name).toBe(':r0:text');
    expect(result.current.controls.text.label).toBe(textLabel);
    expect(result.current.controls.text.description).toBe(textDescription);
    expect(result.current.controls.text.value).toBe(textInitialValue);
    expect(result.current.controls.text.placeholder).toBe(textPlaceholder);
    // TODO
    expect(result.current.controls.text.isDisabled).toBeFalsy();
    // TODO
    expect(result.current.controls.text.isHidden).toBeFalsy();
    expect(result.current.controls.text.error).toBe('');
    expect(result.current.controls.text.many).toBeFalsy();

    expect(result.current.fields.text.description).toBe(textDescription);
    // TODO
    expect(result.current.fields.text.fieldState).toBe(undefined);
    expect(result.current.fields.text.initialValue).toBe(textInitialValue);
    expect(result.current.fields.text.label).toBe(textLabel);
    expect(result.current.fields.text.many).toBeFalsy();
    expect(result.current.fields.text.placeholder).toBe(textPlaceholder);

    expect(result.current.controls.textMany.fields[0]?.id).toBe(':r0:textMany0');
    expect(result.current.controls.textMany.fields[0]?.name).toBe(':r0:textMany0');
    expect(result.current.controls.textMany.label).toBe('Text Many');
    expect(result.current.controls.textMany.description).toBe('');
    expect(result.current.controls.textMany.fields[0]?.value).toBe('');
    expect(result.current.controls.textMany.placeholder).toBeUndefined();
    // TODO
    expect(result.current.controls.textMany.fields[0]?.isDisabled).toBeFalsy();
    // TODO
    expect(result.current.controls.textMany.fields[0]?.isHidden).toBeFalsy();
    expect(result.current.controls.textMany.fields[0]?.error).toBe('');
    expect(result.current.controls.textMany.many).toBeTruthy();

    expect(result.current.fields.textMany.description).toBeUndefined();
    // TODO
    expect(result.current.fields.textMany.fieldState).toBe(undefined);
    expect(result.current.fields.textMany.initialValue).toBeUndefined();
    expect(result.current.fields.textMany.label).toBeUndefined();
    expect(result.current.fields.textMany.many).toBeTruthy();
    expect(result.current.fields.textMany.placeholder).toBeUndefined();

    expect(result.current.values.text).toBe(textInitialValue);
    expect(result.current.values.textMany).toBeNull();
  });

  it('fires an onChange event and changeEffect on a field change event', () => {
    const onChange = jest.fn();
    const changeEffect = jest.fn();

    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.field.text({}),
          number: t.field.number({}),
          manyText: t.field.text({ many: true, initialValue: [null, null] }),
        }),
        onChange,
        changeEffect,
      }),
    );

    const textValue = 'Hi, mom!';
    act(() => result.current.controls.text.onChange(textValue));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(changeEffect).toHaveBeenCalledTimes(1);
    expect(result.current.values.text).toBe(textValue);
    expect(result.current.controls.text.value).toBe(textValue);

    const numberValue = '42';
    act(() => result.current.controls.number.onChange(numberValue));
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(changeEffect).toHaveBeenCalledTimes(2);
    expect(result.current.values.number).toBe(parseInt(numberValue));
    expect(result.current.controls.number.value).toBe(numberValue);

    const textValue0 = 'Value 0';
    const textValue1 = 'Value 1';
    act(() => result.current.controls.manyText.fields[0]?.onChange(textValue0));
    act(() => result.current.controls.manyText.fields[1]?.onChange(textValue1));
    expect(onChange).toHaveBeenCalledTimes(4);
    expect(changeEffect).toHaveBeenCalledTimes(4);
    expect(result.current.values.manyText[0]).toBe(textValue0);
    expect(result.current.values.manyText[1]).toBe(textValue1);
    expect(result.current.controls.manyText.fields[0]?.value).toBe(textValue0);
    expect(result.current.controls.manyText.fields[1]?.value).toBe(textValue1);

    // TODO test async change effect
    // TODO test returning new state
  });

  it('fires an onBlur event and blurEffect on a field blur event', () => {
    const onBlur = jest.fn();
    const blurEffect = jest.fn();

    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.field.text({}),
          manyText: t.field.text({ many: true, initialValue: [null, null] }),
        }),
        onBlur,
        blurEffect,
      }),
    );

    expect(result.current.touched.text).toBeFalsy();
    expect(result.current.touched.manyText[0]).toBeFalsy();
    expect(result.current.touched.manyText[1]).toBeFalsy();

    act(() => result.current.controls.text.onBlur());
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(blurEffect).toHaveBeenCalledTimes(1);
    expect(result.current.touched.text).toBeTruthy();
    expect(result.current.touched.manyText[0]).toBeFalsy();
    expect(result.current.touched.manyText[1]).toBeFalsy();

    act(() => result.current.controls.manyText.fields[0]?.onBlur());
    expect(onBlur).toHaveBeenCalledTimes(2);
    expect(blurEffect).toHaveBeenCalledTimes(2);
    expect(result.current.touched.text).toBeTruthy();
    expect(result.current.touched.manyText[0]).toBeTruthy();
    expect(result.current.touched.manyText[1]).toBeFalsy();

    // TODO test async blur effect
    // TODO test returning new state
  });

  it('fires an onSubmit event on a form submit event', async () => {
    const onSubmit = jest.fn();
    const preventDefault = jest.fn();

    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.field.text({}),
          manyText: t.field.text({ many: true }),
        }),
        onSubmit,
      }),
    );

    expect(result.current.touched.text).toBeFalsy();
    expect(result.current.touched.manyText[0]).toBeFalsy();

    await act(
      () =>
        new Promise((resolve) => {
          result.current.helpers.submitButtonControl.onClick({ preventDefault });
          resolve();
        }),
    );
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(result.current.touched.text).toBeTruthy();
    expect(result.current.touched.manyText[0]).toBeTruthy();

    // TODO text async submit method
    // TODO test returning new state
  });
});
