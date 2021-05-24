import { Props } from '@saphe/react-form';
import React, { ReactElement } from 'react';

export default function BSSelectField(
  props: Props.SelectFieldProps,
): ReactElement {
  return (
    <div className="mb-3">
      {props.label && (
        <label htmlFor={props.id} className="form-label">
          {props.label}
        </label>
      )}

      <select
        className={`form-select${props.error ? ' is-invalid' : ''}`}
        id={props.id}
        name={props.name}
        value={props.value}
        disabled={props.disabled}
        onChange={props.onChange}
        onBlur={props.onBlur}
        aria-describedby={`${props.id}Description`}
      >
        <option value="-1">{props.placeholder ?? ''}</option>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {props.description && (
        <div id={`${props.id}Description`} className="form-text">
          {props.description}
        </div>
      )}
      {props.error && <div className="invalid-feedback">{props.error}</div>}
    </div>
  );
}
