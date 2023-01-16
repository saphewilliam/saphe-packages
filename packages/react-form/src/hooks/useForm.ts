import { useId } from 'react';
import { Fields } from '../lib/field';
import { Plugins } from '../lib/plugin';
import { FormConfig } from '../lib/types';
import { useFormProps } from './useFormProps';
import { useFormState } from './useFormState';
import { useInitialFormState } from './useInitialFormState';

export function useForm<P extends Plugins, F extends Fields>(plugins: P, config: FormConfig<P, F>) {
  const initialState = useInitialFormState(plugins, config);
  const { state, actions, isLoading, error } = useFormState(config, initialState);

  const id = useId();
  const props = useFormProps(config, state, actions, isLoading, id);

  return { state, props, isLoading, error };
}
