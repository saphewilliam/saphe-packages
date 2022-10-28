import { useMemo } from 'react';
import { Fields } from '../lib/field';
import { FieldsBuilder, Plugins } from '../lib/plugin';
import { FormConfig, FormState } from '../lib/types';

export const useInitialFormState = <P extends Plugins, F extends Fields>(
  plugins: P,
  config: FormConfig<P, F>,
): FormState<F> =>
  useMemo(() => {
    if (!config.fields) return {} as FormState<F>;

    // Build fields
    const fieldsBuilder: FieldsBuilder<P> = Object.entries(plugins).reduce(
      (prev, [pluginName, plugin]) => ({
        ...prev,
        [pluginName]: (opts: any) => ({ ...opts, plugin }),
      }),
      {} as FieldsBuilder<P>,
    );
    const fields = config.fields(fieldsBuilder);

    // Build initial state
    return Object.entries(fields).reduce((prev, [fieldName, field]) => {
      return {
        ...prev,
        [fieldName]: {
          field,
          value:
            field.initialValue ??
            (field.many ? [field.plugin.initialValue] : field.plugin.initialValue),
          touched: field.many ? Array((field.initialValue as any)?.length ?? 1).fill(false) : false,
          error: field.many ? Array((field.initialValue as any)?.length ?? 1).fill('') : '',
        },
      };
    }, {} as FormState<F>);
  }, [plugins, config.fields]);
