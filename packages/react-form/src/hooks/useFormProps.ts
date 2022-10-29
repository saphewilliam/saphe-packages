import { useMemo } from 'react';
import { Fields } from '../lib/field';
import { ComponentProps, FieldProps } from '../lib/props';
import { FormProps, FormState } from '../lib/types';
import { useFormState } from './useFormState';

export const useFormProps = <F extends Fields>(
  state: FormState<F>,
  actions: ReturnType<typeof useFormState>['actions'],
  id: string,
) =>
  useMemo<FormProps<F>>(
    () =>
      Object.entries(state).reduce(
        (prev, [fieldName, stateField]) => {
          const { field, error, value } = stateField;
          const componentProps: ComponentProps = {
            label:
              field.label ??
              fieldName
                .replace(/([A-Z])/g, (match) => ` ${match}`)
                .replace(/^./, (match) => match.toUpperCase())
                .trim(),
            description: field.description ?? '',
          };

          const fieldProps = field.many
            ? (() => ({
                fields: value.map((value: any, index: number) => {
                  const props: FieldProps<any> = {
                    id: `${id}${fieldName}${index}`,
                    name: `${id}${fieldName}${index}`,
                    describedBy: `${id}${fieldName}Description`,
                    value: field.plugin.serialize(value),
                    error: error[index],
                    onChange: (targetValue: any) => actions.change(targetValue, fieldName, index),
                    onBlur: () => actions.blur(fieldName, index),

                    // TODO
                    isDisabled: false,
                    isHidden: false,
                  };
                  return props;
                }),
              }))()
            : (() => {
                const props: FieldProps<any> = {
                  id: `${id}${fieldName}`,
                  name: `${id}${fieldName}`,
                  describedBy: `${id}${fieldName}Description`,
                  value: field.plugin.serialize(value),
                  error: error,
                  onChange: (targetValue: any) => actions.change(targetValue, fieldName),
                  onBlur: () => actions.blur(fieldName),

                  // TODO
                  isDisabled: false,
                  isHidden: false,
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
            key: `${id}submitButton`,
            type: 'submit',
            // TODO
            label: '',
            isDisabled: false,
            isLoading: false,
            // label: !isLoading
            //   ? submitButton?.label ?? 'Submit'
            //   : submitButton?.submittingLabel ?? submitButton?.label ?? 'Processing...',
            // disabled: Object.values(state.errors).reduce<boolean>(
            //   (prev, curr) => prev || curr !== '',
            //   false,
            // ),
            // isLoading,
            onClick: (e) => {
              e?.preventDefault();
              actions.submit();
            },
          },
        } as FormProps<F>,
      ),
    [state, actions, id],
  );
