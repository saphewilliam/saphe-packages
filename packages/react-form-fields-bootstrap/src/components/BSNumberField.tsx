import { Props } from '@saphe/react-form';
import React, { ReactElement } from 'react';
import BSFieldText from './BSFieldText';

export default function BSNumberField(props: Props.NumberProps): ReactElement {
  return (
    <>
      <label htmlFor={props.id} className="form-label">
        {props.label}
      </label>
      <input
        type="number"
        className={`form-control${props.error ? ' is-invalid' : ''}`}
        id={props.id}
        name={props.name}
        value={props.value ?? ''}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          props.onChange(!isNaN(value) ? value : null);
        }}
        onBlur={props.onBlur}
        aria-describedby={props.describedBy}
      />
      <BSFieldText {...props} />
    </>
  );
}
