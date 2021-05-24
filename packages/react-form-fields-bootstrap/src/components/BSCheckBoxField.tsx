import { FieldProps } from '@saphe/react-form';
import React, { ReactElement } from 'react';

export default function BSCheckBoxField(
  props: FieldProps.CheckBoxFieldProps,
): ReactElement {
  return (
    <div className="form-check">
      <input
        type="checkbox"
        className="form-check-input"
        id={props.id}
        name={props.name}
        value={props.value}
        disabled={props.disabled}
        onChange={props.onChange}
        onBlur={props.onBlur}
        aria-describedby={`${props.id}Description`}
      />
      <label className="form-check-label" htmlFor={props.id}>
        {props.label}
      </label>
      {props.description && (
        <div id={`${props.id}Description`} className="form-text">
          {props.description}
        </div>
      )}
      {props.error && <div className="invalid-feedback">{props.error}</div>}
    </div>
  );
}
