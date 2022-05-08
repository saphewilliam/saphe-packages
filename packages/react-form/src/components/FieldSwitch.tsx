import React, { ReactElement } from 'react';
import * as F from '../lib/field';
import { Field } from '../lib/field';
import { PropsBase } from '../lib/props';
import { AddFieldPack, FieldValue } from '../lib/util';
import CheckField from './fields/CheckField';
import ColorField from './fields/ColorField';
import DateField from './fields/DateField';
import DateTimeField from './fields/DateTimeField';
import EmailField from './fields/EmailField';
import FileField from './fields/FileField';
import MonthField from './fields/MonthField';
import NumberField from './fields/NumberField';
import PasswordField from './fields/PasswordField';
import SelectField from './fields/SelectField';
import TextAreaField from './fields/TextAreaField';
import TextField from './fields/TextField';
import TimeField from './fields/TimeField';

export type Props<T extends F.FieldType> = AddFieldPack<{
  field: T;
  name: string;
  formName: string;
  error: string;
  value: FieldValue<T>;
  onChange: (targetValue: FieldValue<T>) => void;
  onBlur: () => void;
}>;

export default function FieldSwitch<T extends F.FieldType>(props: Props<T>): ReactElement {
  const id = `${props.formName}${props.name.charAt(0).toUpperCase()}${props.name.slice(1)}`;
  const label =
    props.field.label ??
    props.name
      .replace(/([A-Z])/g, (match) => ` ${match}`)
      .replace(/^./, (match) => match.toUpperCase())
      .trim();

  const baseProps: AddFieldPack<PropsBase<T>> = {
    id,
    label,
    description: props.field.description ?? '',
    describedBy: `${id}Description`,
    disabled: false, // TODO make this variable
    name: props.name,
    value: props.value,
    error: props.error,
    onChange: props.onChange,
    onBlur: props.onBlur,
    fieldPack: props.fieldPack,
  };

  switch (props.field.type) {
    case Field.TEXT:
      return <TextField {...(baseProps as PropsBase<F.TextType>)} {...props.field} />;
    case Field.TEXT_AREA:
      return <TextAreaField {...(baseProps as PropsBase<F.TextAreaType>)} {...props.field} />;
    case Field.SELECT:
      return <SelectField {...(baseProps as PropsBase<F.SelectType>)} {...props.field} />;
    case Field.CHECK:
      return <CheckField {...(baseProps as PropsBase<F.CheckType>)} {...props.field} />;
    case Field.NUMBER:
      return <NumberField {...(baseProps as PropsBase<F.NumberType>)} {...props.field} />;
    case Field.PASSWORD:
      return <PasswordField {...(baseProps as PropsBase<F.PasswordType>)} {...props.field} />;
    case Field.EMAIL:
      return <EmailField {...(baseProps as PropsBase<F.EmailType>)} {...props.field} />;
    case Field.FILE:
      return <FileField {...(baseProps as PropsBase<F.FileType>)} {...props.field} />;
    case Field.COLOR:
      return <ColorField {...(baseProps as PropsBase<F.ColorType>)} {...props.field} />;
    case Field.DATE:
      return <DateField {...(baseProps as PropsBase<F.DateType>)} {...props.field} />;
    case Field.TIME:
      return <TimeField {...(baseProps as PropsBase<F.TimeType>)} {...props.field} />;
    case Field.DATE_TIME:
      return <DateTimeField {...(baseProps as PropsBase<F.DateTimeType>)} {...props.field} />;
    case Field.MONTH:
      return <MonthField {...(baseProps as PropsBase<F.MonthType>)} {...props.field} />;
  }
}
