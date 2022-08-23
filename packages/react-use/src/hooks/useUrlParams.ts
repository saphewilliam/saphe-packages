import { useMemo } from 'react';

export type Param<S extends string> = {
  name: S;
  type?: 'string' | 'number' | 'boolean';
  array?: boolean;
};

type ArrayElement<C> = C extends (infer E)[] ? E : never;
type ReturnArrayType<S extends string, P extends Param<S>, T> = P extends { array: true }
  ? T[]
  : T | null;
type ReturnType<S extends string, P extends Param<S>> = ReturnArrayType<
  S,
  P,
  P extends { type: 'number' } ? number : P extends { type: 'boolean' } ? boolean : string
>;

export type Query = Record<string, string | string[] | undefined>;
export type Config<S extends string> = S | Param<S>;
export type State<S extends string, C> = {
  [P in Extract<ArrayElement<C>, string>]: string | null;
} & {
  [P in Extract<ArrayElement<C>, Param<S>> as P['name']]: ReturnType<S, P>;
};
export type Options = {
  /** Strings that represent a value of `true`, default = `['true']` */
  truthyStrings?: string[];
  /** Strings that represent a value of `false`, default = `['false']` */
  falsyStrings?: string[];
};

function getParam(name: string, query: Query): string | null {
  const raw = query[name];
  if (raw === undefined) return null;
  if (Array.isArray(raw)) return raw[raw.length - 1] ?? null;
  return raw;
}

function getParamArray(name: string, query: Query): string[] {
  const raw = query[name];
  if (raw === undefined) return [];
  if (!Array.isArray(raw)) return [raw];
  return raw;
}

function parseParam(
  name: string,
  value: string | null,
  type?: 'string' | 'number' | 'boolean',
  options?: Options,
): string | number | boolean | null {
  if (value === null) return null;
  switch (type) {
    case undefined:
    case 'string':
      return value;
    case 'boolean': {
      if ((options?.truthyStrings ?? ['true']).includes(value)) return true;
      if ((options?.falsyStrings ?? ['false']).includes(value)) return false;
      console.warn(`Parameter ${name}: ${value} cannot be parsed to boolean`);
      return null;
    }
    case 'number': {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) {
        console.warn(`Parameter ${name}: ${value} cannot be parsed to number`);
        return null;
      }
      return parsed;
    }
  }
}

export function useUrlParams<S extends string, C extends Config<S>>(
  config: S | C[],
  query?: Query,
  options?: Options,
): State<S, typeof config> {
  type T = State<S, typeof config>;
  const params = useMemo<T>(() => {
    if (!query) return {} as T;

    if (typeof config === 'string') return { [config]: getParam(config, query) } as T;

    return config.reduce(
      (prev, curr) => ({
        ...prev,
        ...(typeof curr === 'string'
          ? { [curr]: getParam(curr, query) }
          : {
              [curr.name]: curr.array
                ? getParamArray(curr.name, query)
                    .map((p) => parseParam(curr.name, p, curr.type, options))
                    .filter((p) => p !== null)
                : parseParam(curr.name, getParam(curr.name, query), curr.type, options),
            }),
      }),
      {},
    ) as T;
  }, [config, query]);

  return params;
}
