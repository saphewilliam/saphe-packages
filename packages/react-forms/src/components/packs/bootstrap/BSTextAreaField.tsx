import React from 'react';
import { TextAreaFieldProps } from '../../../utils/fieldTypes';

function BSTextAreaField(props: TextAreaFieldProps): JSX.Element {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label">
        {props.label}
      </label>
      <textarea
        rows={props.rows}
        className={`form-control${props.error ? ' is-invalid' : ''}`}
        id={props.name}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onBlur={props.onBlur}
        aria-describedby={`${props.name}Description`}
      />
      {props.description && (
        <div id={`${props.name}Description`} className="form-text">
          {props.description}
        </div>
      )}
      {props.error && <div className="invalid-feedback">{props.error}</div>}
    </div>
  );
}

export default BSTextAreaField;
