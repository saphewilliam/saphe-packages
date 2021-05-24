import React, { ChangeEvent, FocusEvent, ReactElement } from 'react';
import { IField } from '../utils/fieldTypes';
import { AddFieldPack, FormValue, HTMLField } from '../utils/helperTypes';
import CheckBoxField from './fields/CheckBoxField';
import NumberField from './fields/NumberField';
import SelectField from './fields/SelectField';
import TextAreaField from './fields/TextAreaField';
import TextField from './fields/TextField';

interface Props<T extends IField> {
  id: string;
  field: T;
  name: string;
  error: string;
  value: FormValue;
  onChange: (e: ChangeEvent<HTMLField>) => void;
  onBlur: (e: FocusEvent<HTMLField>) => void;
}

export default function Field<T extends IField>(
  props: AddFieldPack<Props<T>>,
): ReactElement {
  return <div>Field</div>;
  // switch (props.field.type) {
  //   case FieldTypes.TEXT:
  //     return <TextField {...props} {...(props.field as ITextField)} />;
  //   case FieldTypes.TEXTAREA:
  //     return <TextAreaField {...props} {...(props.field as ITextAreaField)} />;
  //   case FieldTypes.SELECT:
  //     return <SelectField {...props} {...(props.field as ISelectField)} />;
  // }
}
