import { renderHook } from '@testing-library/react';
import { act } from 'react-test-renderer';
import useForm, { FormState } from '../src';
import { numberFieldPlugin, textFieldPlugin } from '../src/lib/plugins';
import { expectTypeOf } from 'expect-type';

const plugins = {
  text: textFieldPlugin,
  number: numberFieldPlugin,
};

describe('Validation', () => {
  const textRequired = 'textReq is required!';
  const manyTextRequired = 'manyTextReq is also required!';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const compare = (state: FormState<any>, textReq = '', manyTextReq0 = '', manyTextReq1 = '') => {
    expect(state.text?.error).toBe('');
    expect(state.manyText?.error[0]).toBe('');
    expect(state.manyText?.error[1]).toBe('');
    expect(state.textReq?.error).toBe(textReq);
    expect(state.manyTextReq?.error[0]).toBe(manyTextReq0);
    expect(state.manyTextReq?.error[1]).toBe(manyTextReq1);
  };

  it('validates a field after blur on change by default', () => {
    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.text({}),
          manyText: t.text({ many: true, initialValue: [null, null] }),
          textReq: t.text({ validation: { required: textRequired } }),
          manyTextReq: t.text({
            many: true,
            validation: { required: manyTextRequired },
            initialValue: [null, null],
          }),
        }),
      }),
    );

    act(() => {
      result.current.props.text.onBlur();
      result.current.props.manyText.fields[0]?.onBlur();
      result.current.props.manyText.fields[1]?.onBlur();
      result.current.props.textReq.onChange('');
      result.current.props.manyTextReq.fields[0]?.onChange('');
      result.current.props.manyTextReq.fields[1]?.onChange('');
    });

    compare(result.current.state);
    act(() => result.current.props.textReq.onBlur());
    compare(result.current.state, textRequired);
    act(() => result.current.props.manyTextReq.fields[0]?.onBlur());
    compare(result.current.state, textRequired, manyTextRequired);
    act(() => result.current.props.manyTextReq.fields[1]?.onBlur());
    compare(result.current.state, textRequired, manyTextRequired, manyTextRequired);
    act(() => result.current.props.textReq.onChange('Hello'));
    compare(result.current.state, '', manyTextRequired, manyTextRequired);
    act(() => {
      result.current.props.textReq.onChange('');
      result.current.props.manyTextReq.fields[0]?.onChange('Hello');
    });
    compare(result.current.state, textRequired, '', manyTextRequired);
  });

  it('validates all fields on submit', async () => {
    const preventDefault = jest.fn();

    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.text({}),
          manyText: t.text({ many: true, initialValue: [null, null] }),
          textReq: t.text({ validation: { required: textRequired } }),
          manyTextReq: t.text({
            many: true,
            validation: { required: manyTextRequired },
            initialValue: [null, null],
          }),
        }),
      }),
    );

    compare(result.current.state);
    await act(
      () =>
        new Promise((resolve) => {
          result.current.props.form.onSubmit({ preventDefault });
          resolve();
        }),
    );
    expect(preventDefault).toHaveBeenCalledTimes(1);
    compare(result.current.state, textRequired, manyTextRequired, manyTextRequired);
    act(() => result.current.props.textReq.onChange('Hello'));
    compare(result.current.state, '', manyTextRequired, manyTextRequired);
    act(() => {
      result.current.props.textReq.onChange('');
      result.current.props.manyTextReq.fields[0]?.onChange('Hello');
    });
    compare(result.current.state, textRequired, '', manyTextRequired);
  });

  it('uses a custom validation function if provided', () => {
    const correct = 'Correct';
    const error = 'Error';

    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.text({
            validation: { validate: (value) => (value === correct ? '' : error) },
          }),
          manyText: t.text({
            many: true,
            initialValue: [null, null],
            validation: { validate: (value) => (value === correct ? '' : error) },
          }),
        }),
      }),
    );

    expect(result.current.state.text.error).toBe('');
    expect(result.current.state.manyText.error[0]).toBe('');
    expect(result.current.state.manyText.error[1]).toBe('');

    act(() => {
      result.current.props.text.onBlur();
      result.current.props.manyText.fields[1]?.onBlur();
    });

    expect(result.current.state.text.error).toBe(error);
    expect(result.current.state.manyText.error[0]).toBe('');
    expect(result.current.state.manyText.error[1]).toBe(error);

    act(() => {
      result.current.props.text.onChange('Something random');
      result.current.props.manyText.fields[1]?.onChange(correct);
    });

    expect(result.current.state.text.error).toBe(error);
    expect(result.current.state.manyText.error[0]).toBe('');
    expect(result.current.state.manyText.error[1]).toBe('');
  });

  it.todo('respects global and local validation modes');

  it('uses custom plugin validation options', () => {
    const textMatchError = 'This string should match the pattern';
    const textLengthError = 'This string should meet the length requirements';
    const numberValueError = 'This number should meet the value requirements';

    const { result } = renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          textMatch: t.text({
            validation: { match: { pattern: /^\d\dab$/gm, message: textMatchError } },
          }),
          textLength: t.text({
            validation: { length: { exact: 10, message: textLengthError } },
          }),
          number: t.number({
            validation: { value: { gte: 3, lt: 6, message: numberValueError } },
          }),
          textError: t.text({
            // @ts-expect-error Number validation is not allowed on text fields
            validation: { value: { gte: 3, lt: 6, message: numberValueError } },
          }),
        }),
      }),
    );

    expectTypeOf(result.current.state.textMatch).not.toBeNever();
    expectTypeOf(result.current.state.textLength).not.toBeNever();
    expectTypeOf(result.current.state.number).not.toBeNever();
    expectTypeOf(result.current.props.textMatch).not.toBeNever();
    expectTypeOf(result.current.props.textLength).not.toBeNever();
    expectTypeOf(result.current.props.number).not.toBeNever();

    // TODO test validation behavior
  });
});
