import React, { ReactElement } from 'react';
import {
  CheckType,
  ColorType,
  EmailType,
  Field,
  FieldType,
  FileType,
  NumberType,
  PasswordType,
  SelectType,
  TextAreaType,
  TextType,
} from '../lib/field';
import { PropsBase } from '../lib/props';
import { AddFieldPack, FieldValue } from '../lib/util';
import CheckField from './fields/CheckField';
import ColorField from './fields/ColorField';
import EmailField from './fields/EmailField';
import FileField from './fields/FileField';
import NumberField from './fields/NumberField';
import PasswordField from './fields/PasswordField';
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
      return <TextField {...(baseProps as PropsBase<TextType>)} {...props.field} />;
    case Field.TEXT_AREA:
      return <TextAreaField {...(baseProps as PropsBase<TextAreaType>)} {...props.field} />;
    case Field.SELECT:
      return <SelectField {...(baseProps as PropsBase<SelectType>)} {...props.field} />;
    case Field.CHECK:
      return <CheckField {...(baseProps as PropsBase<CheckType>)} {...props.field} />;
    case Field.NUMBER:
      return <NumberField {...(baseProps as PropsBase<NumberType>)} {...props.field} />;
    case Field.PASSWORD:
      return <PasswordField {...(baseProps as PropsBase<PasswordType>)} {...props.field} />;
    case Field.EMAIL:
      return <EmailField {...(baseProps as PropsBase<EmailType>)} {...props.field} />;
    case Field.FILE:
      return <FileField {...(baseProps as PropsBase<FileType>)} {...props.field} />;
    case Field.COLOR:
      return <ColorField {...(baseProps as PropsBase<ColorType>)} {...props.field} />;
  }
}
