import React, { ReactElement } from 'react';
import { AddFieldPack } from '../../utils/helperTypes';
import { TextFieldProps } from '../../utils/propTypes';
import FormFieldContainer from '../FormFieldContainer';

export default function TextField(
  props: AddFieldPack<TextFieldProps>,
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
            onChange={props.onChange}
            onBlur={props.onBlur}
            aria-describedby={props.describedBy}
          />
          {props.description && (
            <div id={props.describedBy}>{props.description}</div>
          )}
          {props.error && <div>{props.error}</div>}
        </>
      )}
    </FormFieldContainer>
  );
}
