import { useAsyncReducer } from './useAsyncReducer';
import { act, renderHook } from '@testing-library/react';

describe('useAsyncReducer', () => {
  it('errors on incorrect or missing action type', () => {
    renderHook(() =>
      useAsyncReducer(
        { hi: 'mom' },
        {
          // @ts-expect-error Missing return type
          missingReturn: () => {},
          // @ts-expect-error Incorrect return key
          incorrectReturnKey: () => ({}),
          // @ts-expect-error Incorrect return key
          incorrectReturnKey: () => ({ hey: 'mom' }),
          // @ts-expect-error Incorrect return value
          incorrectReturnValue: () => ({ hi: 10 }),
          // @ts-expect-error Incorrect state parameter type
          incorrectParameter: (state: string) => ({ hi: state }),
          // @ts-expect-error Incorrect state key
          incorrectStateType: (state) => ({ hi: 'mom', test: state.hey }),
          correctNoState: () => ({ hi: 'mom' }),
          correctWithState: (state) => ({ hi: state.hi }),
          correctWithParam: (state, str: string) => ({ hi: state.hi + str }),
        },
      ),
    );
  });

  it('generates type-safe `actions` and `state` objects', async () => {
    const { result } = renderHook(() =>
      useAsyncReducer(
        { count: 0 },
        {
          add: async (state, n: number) => ({ count: state.count + n }),
          addSync: (state, n: number) => ({ count: state.count + n }),
          subtract: async (state, n: number) => ({ count: state.count - n }),
          subtractSync: (state, n: number) => ({ count: state.count - n }),
        },
      ),
    );

    const actionResult = await act(
      () => new Promise((r) => r(result.current.actions.add(1))),
    );
    const actionResultSync = await act(() => result.current.actions.addSync(1));

    expect(typeof actionResult).toBe('undefined');
    expect(typeof actionResultSync).toBe('undefined');
    expect(typeof result.current.state.count).toBe('number');

    // @ts-expect-error Incorrect state key
    result.current.state.hi;
    // @ts-expect-error Incorrect actions key
    result.current.actions.reset;

    if (false) {
      // @ts-expect-error Missing parameter type
      result.current.actions.add();
      // @ts-expect-error Incorrect parameter type
      result.current.actions.add('hi');
      // @ts-expect-error Too many parameters
      result.current.actions.add(1, 2);
    }
  });

  it('initialises state', () => {
    const { result } = renderHook(() => useAsyncReducer({ hi: 'mom' }, {}));
    expect(result.current.state.hi).toBe('mom');
  });
});
