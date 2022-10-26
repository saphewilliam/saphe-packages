import { FieldMany } from './field';

export type FieldPropsBase<Value> = {
  id: string;
  name: string;
  value: Value;
  error: string;
  isDisabled: boolean;
  isHidden: boolean;
  describedBy: string;
  onChange: (targetValue: Value) => void;
  onBlur: () => void;
};

export type ComponentPropsBase = {
  label: string;
  description: string;
};

// TODO we might not need many: false and many: true
export type Props<Value> = ComponentPropsBase & { many: false } & FieldPropsBase<Value>;
export type ManyProps<Value> = ComponentPropsBase & { many: true } & {
  fields: FieldPropsBase<Value>[];
};
export type PropsFromMany<Value, Many extends FieldMany> = boolean extends Many
  ? Props<Value>
  : Many extends true
  ? ManyProps<Value>
  : Props<Value>;
