import React, { ReactElement } from 'react';
import { getFieldStyle } from '../../lib/form';
import { SelectProps } from '../../lib/props';
import { AddFieldPack } from '../../lib/util';
import FieldContainer from '../helpers/FieldContainer';
import FieldText from '../helpers/FieldText';

export default function SelectField(props: AddFieldPack<SelectProps>): ReactElement {
  return (
    <FieldContainer fieldPack={props.fieldPack}>
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
            onChange={(e) => props.onChange(e.target.value)}
            onBlur={props.onBlur}
            aria-describedby={props.describedBy}
            style={getFieldStyle(props.error)}
          >
            <option value="" disabled>
              {props.placeholder ?? ''}
            </option>
            {props.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label ?? option.value}
              </option>
            ))}
          </select>
          <FieldText {...props} />
        </>
      )}
    </FieldContainer>
  );
}
