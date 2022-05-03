/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useRef, useState } from 'react';

export function isPromise<T>(obj: any): obj is Promise<T> {
  return String(obj) === '[object Promise]';
}

/** Object used to define the reducer's actions. The first argument is the current state and all following arguments are user-defined. */
export type InputActions<S> = { [key: string]: (currentState: S, ...args: any) => Promise<S> | S };

/** Object used to consume the reducer's actions. The parameters are inferred from the input actions object, dropping the first argument (current state). */
export type OutputActions<S, A extends InputActions<S>> = {
  [P in keyof A]: (...args: Parameters<A[P]> extends [any, ...infer U] ? U : never) => void;
};

export interface Error<S = any> {
  message: string;
  action: Action<S>;
  pendingActions: Action<S>[];
}

interface Action<S> {
  actionName: string;
  action: (...args: any) => Promise<S> | S;
  args: any[];
}

export interface State<S, A extends InputActions<S>> {
  state: S;
  actions: OutputActions<S, A>;
  isLoading: boolean;
  error: Error<S> | null;
}

export default function useAsyncReducer<S, A extends InputActions<S>>(
  // TODO Support promise and function initial state
  initialState: S,
  actions: A,
): State<S, A> {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<S>(initialState);
  const [error, setError] = useState<Error<S> | null>(null);

  const { current: queue } = useRef<Action<S>[]>([]);
  let { current: currentState } = useRef<S>(initialState);
  let { current: currentIsLoading } = useRef(false);

  const popQueue = useCallback(() => {
    const currentAction = queue.shift();
    currentIsLoading = currentAction !== undefined;
    setIsLoading(currentIsLoading);

    const evaluateQueue = (s: S) => {
      currentState = s;
      setState(currentState);
      if (queue.length === 0) {
        currentIsLoading = false;
        setIsLoading(currentIsLoading);
      } else popQueue();
    };

    const abortQueue = (e: any) => {
      currentIsLoading = false;
      setIsLoading(currentIsLoading);
      if (currentAction)
        setError({
          message: String(e),
          action: currentAction,
          pendingActions: queue,
        });
    };

    if (currentAction !== undefined) {
      try {
        const returnVal = currentAction.action(currentState, ...currentAction.args);
        if (isPromise(returnVal)) returnVal.then(evaluateQueue).catch(abortQueue);
        else evaluateQueue(returnVal);
      } catch (e) {
        abortQueue(e);
      }
    }
  }, [queue]);

  const pushQueue = useCallback(
    (action: Action<S>) => {
      queue.push(action);
      if (!currentIsLoading) popQueue();
    },
    [queue, currentIsLoading, popQueue],
  );

  /** An actions object that proxies the user-defined actions */
  const outputActions: OutputActions<S, A> = useMemo(
    () =>
      Object.entries(actions).reduce(
        (prev, [actionName, action]) => ({
          ...prev,
          // Push the user-defined action to the queue when it is called from outside the hook
          [actionName]: (...args) => pushQueue({ actionName, action, args }),
        }),
        {} as OutputActions<S, A>,
      ),
    [actions],
  );

  return { actions: outputActions, isLoading, state, error };
}
