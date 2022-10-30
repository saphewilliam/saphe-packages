import { useId } from 'react';
import { Fields } from '../lib/field';
import { Plugins } from '../lib/plugin';
import { FormConfig, FormState, Form } from '../lib/types';
import { useFormProps } from './useFormProps';
import { useFormState } from './useFormState';
import { useInitialFormState } from './useInitialFormState';

export function useForm<P extends Plugins, F extends Fields>(
  plugins: P,
  config: FormConfig<P, F>,
): Form<F> {
  const id = useId();
  const initialState: FormState<F> = useInitialFormState(plugins, config);
  // TODO isLoading, error
  const { state, actions, isLoading, error } = useFormState(config, initialState);

  // TODO?
  // useEffect(() => {
  //   if (stringify(config.fields) !== stringify(state.fields)) actions.reset();
  // }, [actions, config.fields, state.fields]);

  const props = useFormProps(state, actions, id);

  return { state: state, props: props, isLoading, error };
}
