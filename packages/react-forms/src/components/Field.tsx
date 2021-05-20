import React, { ChangeEvent, FocusEvent } from 'react';
import {
  IField,
  FieldTypes,
  FieldValue,
  ISelectField,
  ITextAreaField,
  ITextField,
  HTMLField,
  FormStyles,
} from '../utils/fieldTypes';
import SelectField from './fields/SelectField';
import TextAreaField from './fields/TextAreaField';
import TextField from './fields/TextField';

interface Props<T extends IField> {
  formStyle: FormStyles;
  field: T;
  name: string;
  error: string;
  value: FieldValue<T>;
  onChange: (e: ChangeEvent<HTMLField>) => void;
  onBlur: (e: FocusEvent<HTMLField>) => void;
}

function Field<T extends IField>(props: Props<T>): JSX.Element {
  switch (props.field.type) {
    case FieldTypes.TEXT:
      return <TextField {...props} {...(props.field as ITextField)} />;
    case FieldTypes.TEXTAREA:
      return <TextAreaField {...props} {...(props.field as ITextAreaField)} />;
    case FieldTypes.SELECT:
      return <SelectField {...props} {...(props.field as ISelectField)} />;
  }
}

export default Field;
