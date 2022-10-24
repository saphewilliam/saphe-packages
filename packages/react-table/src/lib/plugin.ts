type Mutate<State> = {
  [K in keyof State as `set${Capitalize<K & string>}`]: (value: State[K]) => void;
};

export type Plugin<
  _Name extends string;
  GlobalConfig extends object,
  ColumnConfig extends object,
  Helpers extends object,
  State extends object,
> = {
  initialState: State;
  process: (opts: {
    globalConfig: GlobalConfig;
    columnConfig: ColumnConfig;
    data: any;
    state: State;
    mutate: Mutate<State>;
  }) => [any, Helpers];
};
