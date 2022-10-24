import {
  Field,
  FieldMany,
  Fields,
  FieldSet,
  FieldsOrFieldSets,
  FieldState,
  FieldValidation,
} from '../lib/field';
import { FieldsBuilder, Plugins } from '../lib/plugin';
import { MaybePromise, OutputValue } from '../lib/util';

// TODO
type FieldValues<F extends Fields> = never;
// {
// [K in keyof F]: F[K] extends Field<infer Value, infer Many, infer Validation, infer State>
//   ? OutputValue<Value, Many, Validation>
//   : never;
// };

interface Config<P extends Plugins, F extends FieldsOrFieldSets> {
  /** Optional, a unique name to identify the form. If omitted, a random name is generated */
  name?: string;
  /** Optional, declares the fields and fieldsets of the form */
  fields?: (t: FieldsBuilder<P>) => F;

  /** Optional, defines what should happen on a submit event */
  onSubmit?: (formState: {
    formValues: never;
    // formValues: {
    //   [K in keyof F]: F[K] extends Field<infer Value, infer Many, any, infer _State>
    //     ? OutputValue<Value, Many, {}>
    //     : never;
    // };
    // formValues: {
    //   [K in keyof F]: F[K] extends Field<Value, Many, Validation, State>
    //     ? OutputValue<Value, Many, Validation>
    //     : F[K] extends FieldSet<infer NestedF, Value, Many, Validation, State>
    //     ? FieldValues<NestedF, Value, Many, Validation, State>
    //     : never;
    // };
  }) => MaybePromise<void>; // TODO return form state or void
}

interface HookResult {
  hello: string;
}

export default function useForm<P extends Plugins, F extends FieldsOrFieldSets>(
  plugins: P,
  config: Config<P, F>,
): HookResult {
  return { hello: 'world' };
}
