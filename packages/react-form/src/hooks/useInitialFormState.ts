import { useMemo } from 'react';
import { Fields } from '../lib/field';
import { Plugins } from '../lib/plugin';
import { FieldsBuilder, FieldState, FormConfig, FormState } from '../lib/types';

export const useInitialFormState = <P extends Plugins, F extends Fields>(
  plugins: P,
  config: FormConfig<P, F>,
): FormState<F> =>
  useMemo(() => {
    let initialState = {} as FormState<F>;
    if (config.fields) {
      // Build fields
      const fieldsBuilder: FieldsBuilder<P> = Object.entries(plugins).reduce(
        (prev, [pluginName, plugin]) => ({
          ...prev,
          [pluginName]: (opts: any) => ({ ...opts, plugin }),
        }),
        {} as FieldsBuilder<P>,
      );
      const fields = config.fields(fieldsBuilder);

      // Build initial state based on fields
      initialState = Object.entries(fields).reduce((prev, [fieldName, field]) => {
        return {
          ...prev,
          [fieldName]: {
            field,
            value:
              field.initialValue ??
              (field.many ? [field.plugin.initialValue] : field.plugin.initialValue),
            touched: field.many
              ? Array((field.initialValue as any)?.length ?? 1).fill(false)
              : false,
            error: field.many ? Array((field.initialValue as any)?.length ?? 1).fill('') : '',
            state: field.initialState ?? FieldState.ENABLED,
          },
        };
      }, {} as FormState<F>);
    }

    // Fire custom onInit function if present
    if (config.onInit) {
      const onInitResult = config.onInit(initialState);
      if (typeof onInitResult !== 'undefined') initialState = onInitResult;
    }

    return initialState;
  }, [plugins, config.fields]);
