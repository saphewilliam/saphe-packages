import { FieldState } from './types';

export interface SingleComponentProps {
  label: string;
  description: string;
  describedBy: string;
  state: FieldState;
  isEnabled: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  isHidden: boolean;
  isRequired: boolean;
}

export interface ManyComponentProps<RawValue> extends SingleComponentProps {
  /** Add a field to the fields array. It takes the new field's initial value as a parameter (if left empty, the plugin's default initial value is set) */
  addField: (initialValue?: RawValue) => void;
  /** Remove the field with a given index */
  removeField: (index: number) => void;
}

export interface FieldProps<RawValue = unknown> {
  id: string;
  name: string;
  value: RawValue;
  error: string;
  describedBy: string;
  onChange: (targetValue: RawValue) => void;
  onBlur: () => void;
}

export interface FieldsProps<RawValue> {
  fields: FieldProps<RawValue>[];
}

export type SingleProps<RawValue> = SingleComponentProps & { many: false } & FieldProps<RawValue>;
export type ManyProps<RawValue> = ManyComponentProps<RawValue> & {
  many: true;
} & FieldsProps<RawValue>;
