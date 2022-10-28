import { textFieldPlugin } from '../src/lib/plugins';
import { renderHook } from '@testing-library/react';
import useForm from '../src';
import { expectTypeOf } from 'expect-type';

const plugins = {
  fields: {
    text: textFieldPlugin,
  },
};

describe('Types', () => {
  it('provides type-safe input of form fields based on the provided plugins', () => {
    renderHook(() =>
      useForm(plugins, {
        fields: (t) => {
          // eslint-disable-next-line no-constant-condition
          if (false) {
            // @ts-expect-error Unknown plugin
            const _unknownPlugin = t.field.unknown({});
            // @ts-expect-error Unknown option
            const _unknownOption = t.field.text({ unknown: 'test' });
            // @ts-expect-error Incorrect initial value type
            const _incorrectType = t.field.text({ initialValue: 10 });
            // @ts-expect-error Many is undefined, it should not accept an array by default
            const _manyUndefined = t.field.text({ initialValue: ['Array of strings'] });
            // @ts-expect-error Many is false, it should not accept an array
            const _manyFalse = t.field.text({ many: false, initialValue: ['Array of strings'] });
            // @ts-expect-error Many is true, it should not accept a string
            const _manyTrue = t.field.text({ many: true, initialValue: 'String' });
            // @ts-expect-error Many is true, it should not accept null
            const _manyTrueNull = t.field.text({ many: true, initialValue: null });
          }

          return {
            exposeCustomOption: t.field.text({ placeholder: 'String' }),
            correctManyUndefined: t.field.text({ initialValue: 'String' }),
            correctManyFalse: t.field.text({ many: false, initialValue: 'String' }),
            correctManyTrue: t.field.text({ many: true, initialValue: ['Array of strings'] }),
            manyUndefinedNull: t.field.text({ initialValue: null }),
            manyFalseNull: t.field.text({ many: false, initialValue: null }),
            manyTrueNullArray: t.field.text({ many: true, initialValue: [null] }),

            validation: t.field.text({
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
          text: t.field.text({}),
          textNotMany: t.field.text({ many: false }),
          textMany: t.field.text({ many: true }),
          textReq: t.field.text({ validation: { required: 'req' } }),
          textReqNotMany: t.field.text({ many: false, validation: { required: 'req' } }),
          textReqMany: t.field.text({ many: true, validation: { required: 'req' } }),
        }),
        onSubmit(formState) {
          expectTypeOf(formState).not.toBeAny();
          expectTypeOf(formState).not.toHaveProperty('random');
          expectTypeOf(formState).toHaveProperty('values');

          const v = formState.values;
          expectTypeOf(v).not.toBeAny();
          expectTypeOf(v).not.toHaveProperty('random');

          expectTypeOf(v).toHaveProperty('text').toEqualTypeOf<string | null>();
          expectTypeOf(v).toHaveProperty('textNotMany').toEqualTypeOf<string | null>();
          expectTypeOf(v).toHaveProperty('textMany').toEqualTypeOf<(string | null)[]>();
          expectTypeOf(v).toHaveProperty('textReq').toEqualTypeOf<string>();
          expectTypeOf(v).toHaveProperty('textReqNotMany').toEqualTypeOf<string>();
          expectTypeOf(v).toHaveProperty('textReqMany').toEqualTypeOf<string[]>();
        },
      }),
    );
  });
});
