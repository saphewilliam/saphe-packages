import { Props } from '@saphe/react-form';
import React, { ReactElement } from 'react';
import BSFieldText from './BSFieldText';

export default function BSCheckBoxField(
  props: Props.CheckBoxFieldProps,
): ReactElement {
  return (
    <div className="form-check">
      <input
        type="checkbox"
        className={`form-check-input${props.error ? ' is-invalid' : ''}`}
        id={props.id}
        name={props.name}
        value={props.value}
        disabled={props.disabled}
        onChange={props.onChange}
        onBlur={props.onBlur}
        aria-describedby={props.describedBy}
      />
      <label className="form-check-label" htmlFor={props.id}>
        {props.label}
      </label>
      <BSFieldText {...props} />
    </div>
  );
}
