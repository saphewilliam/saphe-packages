import { Props } from '@saphe/react-form';
import React, { ReactElement } from 'react';
import BSFieldText from './BSFieldText';

export default function BSTextField(props: Props.TextProps): ReactElement {
  return (
    <>
      <label htmlFor={props.id} className="form-label">
        {props.label}
      </label>
      <input
        type="text"
        className={`form-control${props.error ? ' is-invalid' : ''}`}
        id={props.id}
        name={props.name}
        value={props.value ?? ''}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.value)}
        onBlur={props.onBlur}
        aria-describedby={props.describedBy}
      />
      <BSFieldText {...props} />
    </>
  );
}
