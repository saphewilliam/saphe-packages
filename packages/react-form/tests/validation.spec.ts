import { renderHook } from '@testing-library/react';
import { act } from 'react-test-renderer';
import useForm, { FormState } from '../src';
import { textFieldPlugin } from '../src/lib/plugins';

const plugins = {
  text: textFieldPlugin,
};

describe('Validation', () => {
  const textRequired = 'textReq is required!';
  const manyTextRequired = 'manyTextReq is also required!';
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

  it.todo('respects global and local validation modes');
  it.todo('uses custom plugin validation options');

  it('uses a custom validation if provided', () => {
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
});
