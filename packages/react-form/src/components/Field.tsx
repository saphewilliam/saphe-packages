import React, { ChangeEvent, FocusEvent, ReactElement } from 'react';
import {
  FieldTypes,
  ICheckBoxField,
  IField,
  INumberField,
  ISelectField,
  ITextAreaField,
  ITextField,
} from '../utils/fieldTypes';
import { AddFieldPack, HTMLField } from '../utils/helperTypes';
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
  value: string;
  onChange: (e: ChangeEvent<HTMLField>) => void;
  onBlur: (e: FocusEvent<HTMLField>) => void;
}

export default function Field<T extends IField>(
  props: AddFieldPack<Props<T>>,
): ReactElement {
  switch (props.field.type) {
    case FieldTypes.TEXT:
      return <TextField {...props} {...(props.field as ITextField)} />;
    case FieldTypes.TEXTAREA:
      return <TextAreaField {...props} {...(props.field as ITextAreaField)} />;
    case FieldTypes.SELECT:
      return <SelectField {...props} {...(props.field as ISelectField)} />;
    case FieldTypes.CHECKBOX:
      return <CheckBoxField {...props} {...(props.field as ICheckBoxField)} />;
    case FieldTypes.NUMBER:
      return <NumberField {...props} {...(props.field as INumberField)} />;
  }
}
