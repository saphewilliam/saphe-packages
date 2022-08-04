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

export type Config<S extends string> = S | Param<S>;
export type State<S extends string, C> = {
  [P in Extract<ArrayElement<C>, string>]: string | null;
} & {
  [P in Extract<ArrayElement<C>, Param<S>> as P['name']]: ReturnType<S, P>;
};

export function useUrlParams<S extends string, C extends Config<S>>(
  config: S | C[],
): State<S, typeof config> {
  // TODO
  return '' as unknown as State<S, typeof config>;
}
