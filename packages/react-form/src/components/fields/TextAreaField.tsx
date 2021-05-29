import React, { ReactElement } from 'react';
import { AddFieldPack } from '../../utils/helperTypes';
import { TextAreaFieldProps } from '../../utils/propTypes';
import FormFieldContainer from '../FormFieldContainer';

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
            aria-describedby={`${props.id}Description`}
          />
          {props.description && (
            <div id={`${props.id}Description`}>{props.description}</div>
          )}
          {props.error && <div>{props.error}</div>}
        </>
      )}
    </FormFieldContainer>
  );
}
