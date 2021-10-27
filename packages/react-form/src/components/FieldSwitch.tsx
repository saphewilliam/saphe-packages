import React, { ReactElement } from 'react';
import {
  Field,
  FieldType,
  CheckType,
  NumberType,
  SelectType,
  TextAreaType,
  TextType,
} from '../utils/fieldTypes';
import { AddFieldPack } from '../utils/helperTypes';
import { PropsBase } from '../utils/propTypes';
import CheckBoxField from './fields/CheckBoxField';
import NumberField from './fields/NumberField';
import SelectField from './fields/SelectField';
import TextAreaField from './fields/TextAreaField';
import TextField from './fields/TextField';

interface Props<T extends FieldType> extends PropsBase<T> {
  field: T;
}

export default function FieldSwitch<T extends FieldType>(
  props: AddFieldPack<Props<T>>,
): ReactElement {
  switch (props.field.type) {
    case Field.TEXT:
      return (
        <TextField
          // FIXME figure out how to do this without casting to unkown first
          {...(props as unknown as PropsBase<TextType>)}
          {...(props.field as TextType)}
        />
      );
    case Field.TEXT_AREA:
      return (
        <TextAreaField
          {...(props as unknown as PropsBase<TextAreaType>)}
          {...(props.field as TextAreaType)}
        />
      );
    case Field.SELECT:
      return (
        <SelectField
          {...(props as unknown as PropsBase<SelectType>)}
          {...(props.field as SelectType)}
        />
      );
    case Field.CHECK:
      return (
        <CheckBoxField
          {...(props as unknown as PropsBase<CheckType>)}
          {...(props.field as CheckType)}
        />
      );
    case Field.NUMBER:
      return (
        <NumberField
          {...(props as unknown as PropsBase<NumberType>)}
          {...(props.field as NumberType)}
        />
      );
  }
}
