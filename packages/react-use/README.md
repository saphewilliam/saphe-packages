# @saphe/react-use

[![NPM version](https://img.shields.io/npm/v/@saphe/react-use?style=flat-square)](https://npmjs.com/@saphe/react-use)
[![NPM downloads](https://img.shields.io/npm/dt/@saphe/react-use?style=flat-square)](https://npmjs.com/@saphe/react-use)
[![License](https://img.shields.io/npm/l/@saphe/react-use?style=flat-square)](https://github.com/saphewilliam/saphe-packages/blob/main/LICENSE)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@saphe/react-use?style=flat-square)](https://bundlephobia.com/package/@saphe/react-use)
[![Dependencies](https://img.shields.io/librariesio/release/npm/@saphe/react-use?style=flat-square)](https://libraries.io/npm/%40saphe%2Freact-use/)
[![Code coverage](https://img.shields.io/codecov/c/github/saphewilliam/saphe-packages?style=flat-square&flag=react-use&logo=codecov&token=62N8FTE2CV)](https://codecov.io/gh/saphewilliam/saphe-packages)
[![Pull requests welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/saphewilliam/saphe-packages/blob/main/CONTRIBUTING.md)

A collection of tiny, useful, type-safe React hooks.

## Features

- ⚖️ Incredibly lightweight, only ~150 LOC per hook (including types),
- 🌳 Tree-shakable, only include in the bundle what is necessary,
- 👍 All hooks have a sophisticated type system powering them,
- ✔️ 100% test coverage,
- 0️⃣ 0 dependencies.

## Table of Contents

- [Getting Started](#getting-started)
  * [Install](#install)
- [useAsyncReducer](#useasyncreducer)
  * [Actions](#actions)
  * [Queue](#queue)
  * [Error handling](#error-handling)
- [useUrlParams](#useurlparams)
  * [Parameter config](#parameter-config)
  * [Next.JS integration](#nextjs-integration)

## Getting Started

### Install

```sh
pnpm add @saphe/react-use
# or
yarn add @saphe/react-use
# or
npm install @saphe/react-use
```

<!-- END AUTO-GENERATED: Add custom documentation after this comment -->

## useAsyncReducer

The `useAsyncReducer` hook is a variation of React's core useReducer hook. Not a fork, but heavily inspired by [@bitovi/use-simple-reducer](https://github.com/bitovi/use-simple-reducer).

`useAsyncReducer` takes an initial state object and an object of actions that would modify the state, and returns an object containing the current state, the actions that may be performed on the state, a boolean `isLoading` indicating if an action is processing, and an error object for if one of the actions threw an error. All of this with full type-safety.

### Actions

Actions are sync or async functions that accept a state and additional parameters, and return the next state.

```tsx
import { useAsyncReducer } from '@saphe/react-use';
import { ReactElement } from 'react';

export default function IncrementButtons(): ReactElement {
  const { state, actions } = useAsyncReducer(
    { count: 0 },
    {
      increment: (state) => ({ count: state.count + 1 }),
      add: async (state, n: number) => ({ count: state.count + n }),
    },
  );

  return (
    <>
      <button onClick={actions.increment}>increment</button>
      <button onClick={() => actions.add(5)}>add 5</button>
    </>
  );
}
```

Even though `add` was defined as an async function, it is called as a sync function with the predefined parameters (all type-safe). You can add as many parameters as you'd like and they can be of any type.

### Queue

If async functions are called after each other, they are added to a queue and are executed one after another. During this execution, the `isLoading` boolean will be `true`.

### Error handling

Any errors thrown within actions are caught and returned using the `error` object, which is `null` as long as there hasn't been an error.

```ts
const { error } = useAsyncReducer(
  { count: 0 },
  {
    increment: (state) => ({ count: state.count + 1 }),
    error: () => {
      throw Error('Something went horribly wrong');
    },
  },
);
```

If an error has occurred, the `error` object looks like this:

```ts
interface Error<State> {
  message: string;
  action: Action<State>;
  pendingActions: Action<State>[];
  runFailedAction: () => void;
  runPendingActions: () => void;
  runAllActions: () => void;
}
```

## useUrlParams

The `useUrlParams` hook provides a type-safe way to parse your URL parameters. It takes a query object and either a parameter name, a list of parameter names, or a list of parameter configurations, and returns a type-safe object containing parsed values from the supplied query object.

### Parameter config

There are three ways to configure a parameter.

1. Define a single parameter name, returning an object with that parameter of type `string | null`:

```ts
const params = useUrlParams('singleStringParam');
params; // { singleStringParam: string | null; }
```

2. Define a list of parameter names, returning an object with those parameters of type `string | null`:

```ts
const params = useUrlParams(['firstStringParam', 'secondStringParam']);
params; // { firstStringParam: string | null; secondStringParam: string | null; }
```

3. Define a list of parameter configurations, returning an object with those parameters with their related type.

```ts
interface ParamConfig {
  name: string;
  /** Default: 'string' */
  type?: 'string' | 'number' | 'boolean';
  /** Default: false */
  array?: boolean;
}
```

```ts
const params = useUrlParams([
  { name: 'numberParam', type: 'number' },
  { name: 'numberArr', type: 'number', array: true },
  { name: 'boolParam', type: 'boolean' },
  { name: 'boolArr', type: 'boolean', array: true },
  { name: 'stringParam', type: 'string' },
  { name: 'stringArr', type: 'string', array: true },
]);
params; // { numberParam: number | null; numberArr: number[]; boolParam: boolean | null; ...etc }
```

Options 2 and 3 may be combined in a mixed configuration:

```ts
const params = useUrlParams(['first', { name: 'second', type: 'number' }]);
params; // { first: string | null; second: number | null; }
```

### Next.JS integration

```ts
import { useUrlParams, UseUrlParamsTypes } from '@saphe/react-use';
import { useRouter } from 'next/router';

export default function useNextUrlParams<
  S extends string, 
  C extends UseUrlParamsTypes.Config<S>
>(
  config: S | C[],
  options?: UseUrlParamsTypes.Options,
): UseUrlParamsTypes.State<S, typeof config> {
  const router = useRouter();
  return useUrlParams(config, router.query, options);
}
```
