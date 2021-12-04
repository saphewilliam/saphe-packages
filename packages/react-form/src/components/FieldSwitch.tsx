import React, { ReactElement } from 'react';
import {
  CheckType,
  Field,
  FieldType,
  NumberType,
  SelectType,
  TextAreaType,
  TextType,
} from '../lib/field';
import { PropsBase } from '../lib/props';
import { AddFieldPack, FieldValue } from '../lib/util';
import CheckField from './fields/CheckField';
import NumberField from './fields/NumberField';
import SelectField from './fields/SelectField';
import TextAreaField from './fields/TextAreaField';
import TextField from './fields/TextField';

export type Props<T extends FieldType> = AddFieldPack<{
  field: T;
  name: string;
  formName: string;
  error: string;
  value: FieldValue<T>;
  onChange: (targetValue: FieldValue<T>) => void;
  onBlur: () => void;
}>;

export default function FieldSwitch<T extends FieldType>(props: Props<T>): ReactElement {
  const id = `${props.formName}${props.name.charAt(0).toUpperCase()}${props.name.slice(1)}`;
  const label =
    props.field.label ??
    props.name
      .replace(/([A-Z])/g, (match) => ` ${match}`)
      .replace(/^./, (match) => match.toUpperCase())
      .trim();

  const baseProps: PropsBase<T> = {
    ...props,
    id,
    label,
    description: props.field.description ?? '',
    describedBy: `${id}Description`,
    disabled: false, // TODO make this variable
  };

  switch (props.field.type) {
    case Field.TEXT:
      return <TextField {...(baseProps as PropsBase<TextType>)} {...props.field} />;
    case Field.TEXT_AREA:
      return <TextAreaField {...(baseProps as PropsBase<TextAreaType>)} {...props.field} />;
    case Field.SELECT:
      return <SelectField {...(baseProps as PropsBase<SelectType>)} {...props.field} />;
    case Field.CHECK:
      return <CheckField {...(baseProps as PropsBase<CheckType>)} {...props.field} />;
    case Field.NUMBER:
      return <NumberField {...(baseProps as PropsBase<NumberType>)} {...props.field} />;
  }
}
