export interface ComponentProps {
  label: string;
  description: string;
}

export interface FieldProps<RawValue> {
  id: string;
  name: string;
  value: RawValue;
  error: string;
  isDisabled: boolean;
  isHidden: boolean;
  describedBy: string;
  onChange: (targetValue: RawValue) => void;
  onBlur: () => void;
}

export interface FieldsProps<RawValue> {
  fields: FieldProps<RawValue>[];
}

export type Props<RawValue> = ComponentProps & { many: false } & FieldProps<RawValue>;
export type ManyProps<RawValue> = ComponentProps & { many: true } & FieldsProps<RawValue>;
