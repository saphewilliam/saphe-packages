import React, { ReactElement } from 'react';
import { AddFieldPack } from '../../utils/helperTypes';
import { NumberFieldProps } from '../../utils/propTypes';
import FormFieldContainer from '../FormFieldContainer';

export default function TextField(
  props: AddFieldPack<NumberFieldProps>,
): ReactElement {
  return (
    <FormFieldContainer fieldPack={props.fieldPack}>
      {props.fieldPack?.NUMBER ? (
        <props.fieldPack.NUMBER {...props} />
      ) : (
        <>
          <label htmlFor={props.id}>{props.label}</label>
          <input
            type="number"
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
