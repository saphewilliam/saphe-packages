import React, { ReactElement } from 'react';
import { AddFieldPack } from '../../utils/helperTypes';
import { CheckBoxFieldProps } from '../../utils/propTypes';
import FormFieldContainer from '../FormFieldContainer';

export default function CheckBoxField(
  props: AddFieldPack<CheckBoxFieldProps>,
): ReactElement {
  return (
    <FormFieldContainer fieldPack={props.fieldPack}>
      {props.fieldPack?.CHECKBOX ? (
        <props.fieldPack.CHECKBOX {...props} />
      ) : (
        <>
          <input
            type="checkbox"
            id={props.id}
            name={props.name}
            value={props.value}
            disabled={props.disabled}
            onChange={props.onChange}
            onBlur={props.onBlur}
            aria-describedby={props.describedBy}
          />
          <label htmlFor={props.id}>{props.label}</label>
          {props.description && (
            <div id={props.describedBy}>{props.description}</div>
          )}
          {props.error && <div>{props.error}</div>}
        </>
      )}
    </FormFieldContainer>
  );
}
