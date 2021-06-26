import React, { ReactElement } from 'react';
import { getFieldStyle } from '../../utils/formHelpers';
import { AddFieldPack } from '../../utils/helperTypes';
import { TextProps } from '../../utils/propTypes';
import FieldText from '../helpers/FieldText';
import FormFieldContainer from '../helpers/FormFieldContainer';

export default function TextField(
  props: AddFieldPack<TextProps>,
): ReactElement {
  return (
    <FormFieldContainer fieldPack={props.fieldPack}>
      {props.fieldPack?.TEXT ? (
        <props.fieldPack.TEXT {...props} />
      ) : (
        <>
          <label htmlFor={props.id}>{props.label}</label>
          <input
            type="text"
            id={props.id}
            name={props.name}
            value={props.value}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onChange={(e) => props.onChange(e.target.value)}
            onBlur={props.onBlur}
            aria-describedby={props.describedBy}
            style={getFieldStyle(props.error)}
          />
          <FieldText {...props} />
        </>
      )}
    </FormFieldContainer>
  );
}
