import { useMemo } from 'react';
import { Fields } from '../lib/field';
import { Plugins } from '../lib/plugin';
import { SingleComponentProps, FieldProps, ManyComponentProps } from '../lib/props';
import { FieldState, FormConfig, FormProps, FormState, FormStateField } from '../lib/types';
import { useFormState } from './useFormState';

export const useFormProps = <P extends Plugins, F extends Fields>(
  config: FormConfig<P, F>,
  state: FormState<F>,
  actions: ReturnType<typeof useFormState>['actions'],
  isLoading: boolean,
  id: string,
) =>
  useMemo<FormProps<F>>(
    () =>
      Object.entries(state).reduce(
        (prev, [fieldName, stateField]) => {
          const { field, error, value, state: fieldState } = stateField as FormStateField;

          const singleComponentProps: SingleComponentProps = {
            label:
              field.label ??
              fieldName
                .replace(/([A-Z])/g, (match) => ` ${match}`)
                .replace(/^./, (match) => match.toUpperCase())
                .trim(),
            description: field.description ?? '',
            describedBy: `${id}${fieldName}Description`,
            state: fieldState,
            isEnabled: fieldState === FieldState.ENABLED,
            isLoading: fieldState === FieldState.LOADING,
            isHidden: fieldState === FieldState.HIDDEN,
            isDisabled:
              fieldState === FieldState.DISABLED ||
              fieldState === FieldState.LOADING ||
              fieldState === FieldState.HIDDEN,
            isRequired: field.validation?.required !== undefined,
          };
          const manyComponentProps: ManyComponentProps<unknown> = {
            ...singleComponentProps,
            addField: (initialValue) =>
              actions.addField(fieldName, initialValue ?? field.plugin.initialValue),
            removeField: (fieldIndex) => actions.removeField(fieldName, fieldIndex),
          };
          const componentProps = field.many ? manyComponentProps : singleComponentProps;

          const fieldProps = field.many
            ? (() => ({
                fields: (value as unknown[]).map((value, index) => {
                  const props: FieldProps = {
                    id: `${id}${fieldName}${index}`,
                    name: `${id}${fieldName}${index}`,
                    error: error[index] ?? '',
                    describedBy: `${id}${fieldName}Description`,
                    value: field.plugin.serialize ? field.plugin.serialize(value) : value,
                    onChange: (targetValue) => actions.change(targetValue, fieldName, index),
                    onBlur: () => actions.blur(fieldName, index),
                  };
                  return props;
                }),
              }))()
            : (() => {
                const props: FieldProps = {
                  id: `${id}${fieldName}`,
                  name: `${id}${fieldName}`,
                  error,
                  describedBy: `${id}${fieldName}Description`,
                  value: field.plugin.serialize ? field.plugin.serialize(value) : value,
                  onChange: (targetValue) => actions.change(targetValue, fieldName),
                  onBlur: () => actions.blur(fieldName),
                };
                return props;
              })();
          return { ...prev, [fieldName]: { ...field, ...componentProps, ...fieldProps } };
        },
        {
          form: {
            onSubmit: (e) => {
              e?.preventDefault();
              actions.submit();
            },
            onReset: (e) => {
              e?.preventDefault();
              actions.reset();
            },
          },
          submitButton: {
            type: 'submit',
            label: !isLoading
              ? config.submitButton?.label ?? 'Submit'
              : config.submitButton?.isLoadingLabel ??
                config.submitButton?.label ??
                'Submitting...',
            isLoading,
            isDisabled: Object.values(state).some((stateField) => {
              const { error, field } = stateField as FormStateField;
              if (!field.many) return error !== '';
              for (const e of error) if (e !== '') return true;
              return false;
            }),
            onClick: (e) => {
              e?.preventDefault();
              actions.submit();
            },
          },
          resetButton: {
            type: 'reset',
            label: !isLoading
              ? config.resetButton?.label ?? 'Submit'
              : config.resetButton?.isLoadingLabel ?? config.resetButton?.label ?? 'Submitting...',
            isLoading,
            isDisabled: false,
            onClick: (e) => {
              e?.preventDefault();
              actions.reset();
            },
          },
        } as FormProps<F>,
      ),
    [config, state, actions, isLoading, id],
  );
