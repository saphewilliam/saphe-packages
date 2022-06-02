import { useAsyncReducer } from '../src';
import { act, renderHook } from '@testing-library/react';

describe('useAsyncReducer', () => {
  it('generates typescript errors on incorrect or missing action types', () => {
    renderHook(() =>
      useAsyncReducer(
        { hi: 'mom' },
        {
          // @ts-expect-error Missing return type
          // eslint-disable-next-line @typescript-eslint/no-empty-function
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

    const actionResult = await act(() => new Promise((r) => r(result.current.actions.add(1))));
    const actionResultSync = await act(() => result.current.actions.addSync(1));

    expect(typeof actionResult).toBe('undefined');
    expect(typeof actionResultSync).toBe('undefined');
    expect(typeof result.current.state.count).toBe('number');

    // @ts-expect-error Incorrect state key
    result.current.state.hi;
    // @ts-expect-error Incorrect actions key
    result.current.actions.reset;

    // eslint-disable-next-line no-constant-condition
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

  it('catches an error in a sync action', () => {
    const { result } = renderHook(() =>
      useAsyncReducer(
        { count: 0 },
        {
          increment: (state, n?: number) => ({ count: state.count + (n ?? 1) }),
          error: () => {
            throw Error('Sync test error');
          },
        },
      ),
    );

    act(() => {
      result.current.actions.increment();
      result.current.actions.increment(3);
      result.current.actions.error();
      result.current.actions.increment(2);
    });

    // Expect all actions to have been carried out, but the error message to have been recorded
    expect(result.current.state.count).toBe(6);
    expect(result.current.error?.message).toBe('Error: Sync test error');
    expect(result.current.error?.action.actionName).toBe('error');
    expect(result.current.error?.action.args.length).toBe(0);
    expect(result.current.error?.pendingActions.length).toBe(0);
  });

  it('catches an error in an async action', async () => {
    const { result } = renderHook(() =>
      useAsyncReducer(
        { count: 0 },
        {
          increment: async (state, n?: number) => ({ count: state.count + (n ?? 1) }),
          error: async () => {
            throw Error('Async test error');
          },
        },
      ),
    );

    await act(
      () =>
        new Promise((r) => {
          result.current.actions.increment();
          result.current.actions.increment(3);
          result.current.actions.error();
          result.current.actions.increment(2);
          r();
        }),
    );

    // Expect the queue to have halted after the error
    expect(result.current.state.count).toBe(4);
    expect(result.current.error?.message).toBe('Error: Async test error');
    expect(result.current.error?.action.actionName).toBe('error');
    expect(result.current.error?.action.args.length).toBe(0);
    expect(result.current.error?.pendingActions.length).toBe(1);
    expect(result.current.error?.pendingActions[0]?.actionName).toBe('increment');
    expect(result.current.error?.pendingActions[0]?.args.length).toBe(1);
    expect(result.current.error?.pendingActions[0]?.args[0]).toBe(2);
  });

  it('exposes option to rerun queue after failed action', async () => {
    let shouldFail = true;

    const { result } = renderHook(() =>
      useAsyncReducer(
        { count: 0 },
        {
          increment: async (state) => ({ count: state.count + 1 }),
          error: async () => {
            if (shouldFail) throw Error('Test error');
            return { count: 0 };
          },
        },
      ),
    );

    await act(
      () =>
        new Promise<void>((r) => {
          result.current.actions.increment();
          result.current.actions.increment();
          result.current.actions.error();
          result.current.actions.increment();
          r();
        }),
    );

    // Expect the queue to have halted after the error
    expect(result.current.state.count).toBe(2);
    shouldFail = false;

    await act(
      () =>
        new Promise<void>((r) => {
          result.current.error?.runFailedAction();
          r();
        }),
    );

    // Expect only the failed action to have run
    expect(result.current.state.count).toBe(0);

    await act(
      () =>
        new Promise<void>((r) => {
          result.current.error?.runPendingActions();
          r();
        }),
    );

    // Expect only the pending action to have run
    expect(result.current.state.count).toBe(1);

    await act(
      () =>
        new Promise<void>((r) => {
          result.current.error?.runAllActions();
          r();
        }),
    );

    // Expect all pending actions to have run
    expect(result.current.state.count).toBe(1);
  });
});
