import { Field, Fields, FieldSet, FieldsOrFieldSets } from '../lib/field';
import { FieldsBuilder, Plugins } from '../lib/plugin';
import { MaybePromise, OutputValue } from '../lib/util';

// TODO
type FieldValues<F extends Fields> = never;
// {
// [K in keyof F]: F[K] extends Field<infer Value, infer Many, infer Validation, infer State>
//   ? OutputValue<Value, Many, Validation>
//   : never;
// };

// TODO
// @ts-expect-error fix error in fieldsorfieldsets
interface Config<P extends Plugins, F extends FieldsOrFieldSets> {
  /** Optional, declares the fields and fieldsets of the form */
  fields?: (t: FieldsBuilder<P>) => F;
  /** Optional, defines what should happen on a submit event */
  onSubmit?: (formState: {
    formValues: {
      [I in keyof F]: F[I] extends Field<infer Value, infer Many, infer Validation>
        ? OutputValue<Value, Many, Validation>
        : F[I] extends FieldSet<infer FieldSetFields, any, any>
        ? {
            [J in keyof FieldSetFields]: FieldSetFields[J] extends Field<
              infer Value,
              infer Many,
              infer Validation
            >
              ? OutputValue<Value, Many, Validation>
              : never;
          }
        : never;
    };
  }) => MaybePromise<void>; // TODO return form state or void
}

interface HookResult {
  hello: string;
}

// TODO
// @ts-expect-error fix error in fieldsorfieldsets
export default function useForm<P extends Plugins, F extends FieldsOrFieldSets>(
  plugins: P,
  config: Config<P, F>,
): HookResult {
  return { hello: 'world' };
}
