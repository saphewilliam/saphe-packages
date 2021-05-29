import React, { ReactElement } from 'react';
import { AddFieldPack } from '../../utils/helperTypes';
import { SelectFieldProps } from '../../utils/propTypes';
import FormFieldContainer from '../FormFieldContainer';

export default function SelectField(
  props: AddFieldPack<SelectFieldProps>,
): ReactElement {
  return (
    <FormFieldContainer fieldPack={props.fieldPack}>
      {props.fieldPack?.SELECT ? (
        <props.fieldPack.SELECT {...props} />
      ) : (
        <>
          <label htmlFor={props.id}>{props.label}</label>
          <select
            id={props.id}
            name={props.name}
            value={props.value}
            disabled={props.disabled}
            onChange={props.onChange}
            onBlur={props.onBlur}
            aria-describedby={`${props.id}Description`}
          >
            <option value="-placeholder-" disabled>
              {props.placeholder ?? ''}
            </option>
            {props.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {props.description && (
            <div id={`${props.id}Description`}>{props.description}</div>
          )}
          {props.error && <div>{props.error}</div>}
        </>
      )}
    </FormFieldContainer>
  );
}
