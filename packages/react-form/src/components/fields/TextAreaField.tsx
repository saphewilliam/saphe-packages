import React, { ReactElement } from 'react';
import { getFieldStyle } from '../../utils/formHelpers';
import { AddFieldPack } from '../../utils/helperTypes';
import { TextAreaFieldProps } from '../../utils/propTypes';
import FieldText from '../helpers/FieldText';
import FormFieldContainer from '../helpers/FormFieldContainer';

export default function TextAreaField(
  props: AddFieldPack<TextAreaFieldProps>,
): ReactElement {
  return (
    <FormFieldContainer fieldPack={props.fieldPack}>
      {props.fieldPack?.TEXTAREA ? (
        <props.fieldPack.TEXTAREA {...props} />
      ) : (
        <>
          <label htmlFor={props.id}>{props.label}</label>
          <textarea
            rows={props.rows ?? 6}
            id={props.id}
            name={props.name}
            value={props.value}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onChange={props.onChange}
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
