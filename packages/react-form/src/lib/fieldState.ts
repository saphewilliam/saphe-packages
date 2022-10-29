import { Fields } from './field';
import { FormState } from './types';

export enum State {
  ENABLED = 'ENABLED',
  LOADING = 'LOADING',
  DISABLED = 'DISABLED',
  HIDDEN = 'HIDDEN',
}

export type FieldState<F extends Fields> = State | ((formState: FormState<F>) => State);
