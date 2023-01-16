import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isPromise } from '../lib/util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Args = any[];

/** Object used to define the reducer's actions. The first argument is the current state and all following arguments are user-defined. */
export type InputActions<S> = {
  [key: string]: (currentState: S, ...args: Args) => Promise<S> | S;
};

/** Object used to consume the reducer's actions. The parameters are inferred from the input actions object, dropping the first argument (current state). */
export type OutputActions<S, A extends InputActions<S>> = {
  [P in keyof A]: (...args: Parameters<A[P]> extends [S, ...infer U] ? U : never) => void;
};

export interface Error<S> {
  message: string;
  action: Action<S>;
  pendingActions: Action<S>[];
  runFailedAction: () => void;
  runPendingActions: () => void;
  runAllActions: () => void;
}

export interface Action<S> {
  name: string;
  func: (...args: Args) => Promise<S> | S;
  args: Args;
}

export interface State<S, A extends InputActions<S>> {
  state: S;
  actions: OutputActions<S, A>;
  isLoading: boolean;
  error: Error<S> | null;
}

export function useAsyncReducer<S, A extends InputActions<S>>(
  // TODO Support promise and function lazy loading initial state
  initialState: S,
  inputActions: A,
): State<S, A> {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<S>(initialState);
  const [initialStateStore, setInitialStateStore] = useState(initialState);
  const [error, setError] = useState<Error<S> | null>(null);

  let { current: currentState } = useRef<S>(initialState);
  let { current: queue } = useRef<Action<S>[]>([]);
  let { current: queueIsProcessing } = useRef(false);
  let { current: currentIsLoading } = useRef(false);

  /** Process an item from the queue */
  const popQueue = useCallback(() => {
    const currentAction = queue.shift();
    queueIsProcessing = currentAction !== undefined;

    const evaluateQueue = (s: S) => {
      currentState = s;
      setState(currentState);
      if (queue.length === 0) {
        queueIsProcessing = false;
        if (currentIsLoading) setIsLoading(false);
      } else popQueue();
    };

    const runActions = (a: Action<S>[]) => {
      queue = [...a];
      popQueue();
    };

    const abortQueue = <E>(e: E) => {
      const pendingActions = [...queue];
      if (currentAction)
        setError({
          message: String(e),
          action: currentAction,
          pendingActions,
          runFailedAction: () => runActions([currentAction]),
          runPendingActions: () => runActions(pendingActions),
          runAllActions: () => runActions([currentAction, ...pendingActions]),
        });
      queue = [];
      queueIsProcessing = false;
      if (currentIsLoading) setIsLoading(false);
    };

    if (currentAction !== undefined) {
      try {
        const returnVal = currentAction.func(currentState, ...currentAction.args);
        if (isPromise(returnVal)) {
          returnVal.then(evaluateQueue).catch(abortQueue);
          currentIsLoading = true;
          if (!isLoading) {
            setIsLoading(currentIsLoading);
          }
        } else evaluateQueue(returnVal);
      } catch (e) {
        abortQueue(e);
      }
    }
  }, [queue]);

  /** Push an action to the queue */
  const pushQueue = useCallback(
    (action: Action<S>) => {
      queue.push(action);
      if (!queueIsProcessing) popQueue();
    },
    [queue, queueIsProcessing, popQueue],
  );

  /** An actions object that proxies the user-defined actions */
  const actions: OutputActions<S, A> = useMemo(
    () =>
      Object.entries(inputActions).reduce(
        // Push the user-defined action to the queue when it is called from outside the hook
        (prev, [name, func]) => ({ ...prev, [name]: (...args) => pushQueue({ name, func, args }) }),
        {} as OutputActions<S, A>,
      ),
    [inputActions, pushQueue],
  );

  /** If initial state is changed, reset the hook state */
  useEffect(() => {
    // TODO figure out a way to test this
    /* istanbul ignore next */
    if (JSON.stringify(initialState) !== JSON.stringify(initialStateStore)) {
      setInitialStateStore(initialState);
      pushQueue({ name: 'Set initial state', args: [], func: () => initialState });
    }
  }, [initialState]);

  return { actions, isLoading, state, error };
}
