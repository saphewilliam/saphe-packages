type FieldPropsBase<Value> = {
  id: string;
  name: string;
  value: Value;
  error: string;
  disabled: boolean;
  describedBy: string;
  onChange: (targetValue: Value) => void;
  onBlur: () => void;
};

type ComponentPropsBase = {
  label: string;
  description: string;
};

// TODO we might not need many: false and many: true
export type Props<Value> = ComponentPropsBase & { many: false } & FieldPropsBase<Value>;
export type ManyProps<Value> = ComponentPropsBase & { many: true } & {
  fields: FieldPropsBase<Value>[];
};
