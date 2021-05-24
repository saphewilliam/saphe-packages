import { Props } from '@saphe/react-form';
import React, { ReactElement } from 'react';

export default function BSTextAreaField(
  props: Props.TextAreaFieldProps,
): ReactElement {
  return (
    <div className="mb-3">
      <label htmlFor={props.id} className="form-label">
        {props.label}
      </label>
      <textarea
        rows={props.rows}
        className={`form-control${props.error ? ' is-invalid' : ''}`}
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
        <div id={`${props.id}Description`} className="form-text">
          {props.description}
        </div>
      )}
      {props.error && <div className="invalid-feedback">{props.error}</div>}
    </div>
  );
}
