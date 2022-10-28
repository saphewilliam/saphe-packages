import { renderHook } from '@testing-library/react';
import { act } from 'react-test-renderer';
import useForm from '../src';
import { textFieldPlugin } from '../src/lib/plugins';

const plugins = {
  fields: {
    text: textFieldPlugin,
  },
};

describe('Validation', () => {
  const textRequired = 'textReq is required!';
  const manyTextRequired = 'manyTextReq is also required!';
  const compare = (
    errors: Record<string, string | string[]>,
    textReq = '',
    manyTextReq0 = '',
    manyTextReq1 = '',
  ) => {
    expect(errors.text).toBe('');
    expect(errors.manyText?.[0]).toBe('');
    expect(errors.manyText?.[1]).toBe('');
    expect(errors.textReq).toBe(textReq);
    expect(errors.manyTextReq?.[0]).toBe(manyTextReq0);
    expect(errors.manyTextReq?.[1]).toBe(manyTextReq1);
  };

  it('validates a field after blur on change by default', () => {
    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.field.text({}),
          manyText: t.field.text({ many: true, initialValue: [null, null] }),
          textReq: t.field.text({ validation: { required: textRequired } }),
          manyTextReq: t.field.text({
            many: true,
            validation: { required: manyTextRequired },
            initialValue: [null, null],
          }),
        }),
      }),
    );

    act(() => {
      result.current.controls.text.onBlur();
      result.current.controls.manyText.fields[0]?.onBlur();
      result.current.controls.manyText.fields[1]?.onBlur();
      result.current.controls.textReq.onChange('');
      result.current.controls.manyTextReq.fields[0]?.onChange('');
      result.current.controls.manyTextReq.fields[1]?.onChange('');
    });

    compare(result.current.errors);
    act(() => result.current.controls.textReq.onBlur());
    compare(result.current.errors, textRequired);
    act(() => result.current.controls.manyTextReq.fields[0]?.onBlur());
    compare(result.current.errors, textRequired, manyTextRequired);
    act(() => result.current.controls.manyTextReq.fields[1]?.onBlur());
    compare(result.current.errors, textRequired, manyTextRequired, manyTextRequired);
    act(() => result.current.controls.textReq.onChange('Hello'));
    compare(result.current.errors, '', manyTextRequired, manyTextRequired);
    act(() => {
      result.current.controls.textReq.onChange('');
      result.current.controls.manyTextReq.fields[0]?.onChange('Hello');
    });
    compare(result.current.errors, textRequired, '', manyTextRequired);
  });

  it('validates all fields on submit', async () => {
    const preventDefault = jest.fn();

    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.field.text({}),
          manyText: t.field.text({ many: true, initialValue: [null, null] }),
          textReq: t.field.text({ validation: { required: textRequired } }),
          manyTextReq: t.field.text({
            many: true,
            validation: { required: manyTextRequired },
            initialValue: [null, null],
          }),
        }),
      }),
    );

    compare(result.current.errors);
    await act(
      () =>
        new Promise((resolve) => {
          result.current.helpers.formControl.onSubmit({ preventDefault });
          resolve();
        }),
    );
    compare(result.current.errors, textRequired, manyTextRequired, manyTextRequired);
    act(() => result.current.controls.textReq.onChange('Hello'));
    compare(result.current.errors, '', manyTextRequired, manyTextRequired);
    act(() => {
      result.current.controls.textReq.onChange('');
      result.current.controls.manyTextReq.fields[0]?.onChange('Hello');
    });
    compare(result.current.errors, textRequired, '', manyTextRequired);
  });

  it.todo('respects global and local validation modes');
  it.todo('uses custom plugin validation options');

  it('uses a custom validation if provided', () => {
    const correct = 'Correct';
    const error = 'Error';

    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.field.text({
            validation: { validate: (value) => (value === correct ? '' : error) },
          }),
          manyText: t.field.text({
            many: true,
            initialValue: [null, null],
            validation: { validate: (value) => (value === correct ? '' : error) },
          }),
        }),
      }),
    );

    expect(result.current.errors.text).toBe('');
    expect(result.current.errors.manyText[0]).toBe('');
    expect(result.current.errors.manyText[1]).toBe('');

    act(() => {
      result.current.controls.text.onBlur();
      result.current.controls.manyText.fields[1]?.onBlur();
    });

    expect(result.current.errors.text).toBe(error);
    expect(result.current.errors.manyText[0]).toBe('');
    expect(result.current.errors.manyText[1]).toBe(error);

    act(() => {
      result.current.controls.text.onChange('Something random');
      result.current.controls.manyText.fields[1]?.onChange(correct);
    });

    expect(result.current.errors.text).toBe(error);
    expect(result.current.errors.manyText[0]).toBe('');
    expect(result.current.errors.manyText[1]).toBe('');
  });
});
