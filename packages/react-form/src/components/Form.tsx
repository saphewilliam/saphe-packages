import { ReactElement, FormEvent, ReactNode } from 'react';
import { FieldType } from '../lib/field';
import { getDefaultFieldValue } from '../lib/form';
import { AddFieldPack, Fields, FieldValue, FormErrors, FormTouched, FormValues } from '../lib/util';
import FieldSwitch from './FieldSwitch';

type Props<T extends Fields> = AddFieldPack<{
  name: string;
  fields: T;
  touched: FormTouched<T>;
  errors: FormErrors<T>;
  values: FormValues<T>;
  children: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: (fieldName: string, targetValue: FieldValue<FieldType>) => void;
  onFieldBlur: (fieldName: string) => void;
}>;

export default function Form<T extends Fields>(props: Props<T>): ReactElement {
  return (
    <form onSubmit={props.onSubmit} onReset={props.onReset}>
      {Object.entries(props.fields).map(([fieldName, field], idx) => {
        return (
          <FieldSwitch
            key={idx}
            formName={props.name}
            name={fieldName}
            field={field}
            fieldPack={props.fieldPack}
            error={props.errors[fieldName] ?? ''}
            value={
              props.values[fieldName as keyof typeof props.values] ?? getDefaultFieldValue(field)
            }
            onChange={(targetValue) => props.onFieldChange(fieldName, targetValue)}
            onBlur={() => props.onFieldBlur(fieldName)}
          />
        );
      })}
      {props.children}
    </form>
  );
}
