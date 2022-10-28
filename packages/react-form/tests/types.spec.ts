import { textFieldPlugin } from '../src/lib/plugins';
import { renderHook } from '@testing-library/react';
import useForm from '../src';
import { expectTypeOf } from 'expect-type';

const plugins = {
  text: textFieldPlugin,
};

describe('Types', () => {
  it('provides type-safe input of form fields based on the provided plugins', () => {
    renderHook(() =>
      useForm(plugins, {
        fields: (t) => {
          // eslint-disable-next-line no-constant-condition
          if (false) {
            // @ts-expect-error Unknown plugin
            const _unknownPlugin = t.unknown({});
            // @ts-expect-error Unknown option
            const _unknownOption = t.text({ unknown: 'test' });
            // @ts-expect-error Incorrect initial value type
            const _incorrectType = t.text({ initialValue: 10 });
            // @ts-expect-error Many is undefined, it should not accept an array by default
            const _manyUndefined = t.text({ initialValue: ['Array of strings'] });
            // @ts-expect-error Many is false, it should not accept an array
            const _manyFalse = t.text({ many: false, initialValue: ['Array of strings'] });
            // @ts-expect-error Many is true, it should not accept a string
            const _manyTrue = t.text({ many: true, initialValue: 'String' });
            // @ts-expect-error Many is true, it should not accept null
            const _manyTrueNull = t.text({ many: true, initialValue: null });
          }

          return {
            exposeCustomOption: t.text({ placeholder: 'String' }),
            correctManyUndefined: t.text({ initialValue: 'String' }),
            correctManyFalse: t.text({ many: false, initialValue: 'String' }),
            correctManyTrue: t.text({ many: true, initialValue: ['Array of strings'] }),
            manyUndefinedNull: t.text({ initialValue: null }),
            manyFalseNull: t.text({ many: false, initialValue: null }),
            manyTrueNullArray: t.text({ many: true, initialValue: [null] }),

            validation: t.text({
              validation: {
                validate: (value) => {
                  expectTypeOf(value).toEqualTypeOf<string | null>();
                  return '';
                },
              },
            }),
            // TODO
            // exposeCustomValidation: t.field.text({ validation: {length} }),
            // exposeCustomState: t.field.text({ state: 'hidden' }), expect error
            // @todo-ts-expect-error only fields are allowed in the fields object
            // randomObject: { thisShould: 'notBeAllowed' },
          };
        },
      }),
    );
  });

  it('generates a type-safe submit action based on the specified form fields', () => {
    renderHook(() =>
      useForm(plugins, {
        fields: (t) => ({
          text: t.text({}),
          textNotMany: t.text({ many: false }),
          textMany: t.text({ many: true }),
          textReq: t.text({ validation: { required: 'req' } }),
          textReqNotMany: t.text({ many: false, validation: { required: 'req' } }),
          textReqMany: t.text({ many: true, validation: { required: 'req' } }),
        }),
        onSubmit(formState) {
          expectTypeOf(formState).not.toBeAny();
          expectTypeOf(formState).not.toHaveProperty('random');
          expectTypeOf(formState.text.value).toEqualTypeOf<string | null>();
          expectTypeOf(formState.textNotMany.value).toEqualTypeOf<string | null>();
          expectTypeOf(formState.textMany.value).toEqualTypeOf<(string | null)[]>();
          expectTypeOf(formState.textReq.value).toEqualTypeOf<string>();
          expectTypeOf(formState.textReqNotMany.value).toEqualTypeOf<string>();
          expectTypeOf(formState.textReqMany.value).toEqualTypeOf<string[]>();
        },
      }),
    );
  });
});
