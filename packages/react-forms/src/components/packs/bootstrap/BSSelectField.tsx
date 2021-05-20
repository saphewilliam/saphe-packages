import React from 'react';
import { SelectFieldProps } from '../../../utils/fieldTypes';

function BSSelectField(props: SelectFieldProps): JSX.Element {
  return (
    <div className="mb-3">
      {props.label && (
        <label htmlFor={props.name} className="form-label">
          {props.label}
        </label>
      )}

      <select
        className={`form-select${props.error ? ' is-invalid' : ''}`}
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        aria-describedby={`${props.name}Description`}
      >
        <option value="-1">{props.placeholder ?? ''}</option>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {props.description && (
        <div id={`${props.name}Description`} className="form-text">
          {props.description}
        </div>
      )}
      {props.error && <div className="invalid-feedback">{props.error}</div>}
    </div>
  );
}

export default BSSelectField;
