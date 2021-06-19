import { Props } from '@saphe/react-form';
import React, { ReactElement } from 'react';
import BSFieldText from './BSFieldText';

export default function BSTextAreaField(
  props: Props.TextAreaFieldProps,
): ReactElement {
  return (
    <>
      <label htmlFor={props.id} className="form-label">
        {props.label}
      </label>
      <textarea
        rows={props.rows ?? 6}
        className={`form-control${props.error ? ' is-invalid' : ''}`}
        id={props.id}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onChange={props.onChange}
        onBlur={props.onBlur}
        aria-describedby={props.describedBy}
      />
      <BSFieldText {...props} />
    </>
  );
}
