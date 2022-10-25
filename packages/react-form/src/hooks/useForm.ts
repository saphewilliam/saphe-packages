import { Field, Fields } from '../lib/field';
import { FieldsBuilder, Plugins } from '../lib/plugin';
import { MaybePromise, OutputValue } from '../lib/util';

interface Config<P extends Plugins, F extends Fields> {
  /** Optional, declares the fields and fieldsets of the form */
  fields?: (t: FieldsBuilder<P>) => F;
  /** Optional, defines what should happen on a submit event */
  onSubmit?: (formState: {
    formValues: {
      [I in keyof F]: F[I] extends Field<infer Value, infer Many, infer Validation>
        ? OutputValue<Value, Many, Validation>
        : never;
    };
  }) => MaybePromise<void>; // TODO return form state or void
}

interface HookResult {
  hello: string;
}

export default function useForm<P extends Plugins, F extends Fields>(
  plugins: P,
  config: Config<P, F>,
): HookResult {
  return { hello: 'world' };
}
