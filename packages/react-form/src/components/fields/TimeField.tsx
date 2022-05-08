import React, { ReactElement } from 'react';
import { getFieldStyle } from '../../lib/form';
import { MonthProps } from '../../lib/props';
import { AddFieldPack } from '../../lib/util';
import FieldContainer from '../helpers/FieldContainer';
import FieldText from '../helpers/FieldText';

export default function MonthField(props: AddFieldPack<MonthProps>): ReactElement {
  return (
    <FieldContainer fieldPack={props.fieldPack}>
      {props.fieldPack?.TIME ? (
        <props.fieldPack.TIME {...props} />
      ) : (
        <>
          <label htmlFor={props.id}>{props.label}</label>
          <input
            type="time"
            autoComplete="off"
            id={props.id}
            name={props.name}
            value={props.value?.toLocaleTimeString() ?? ''}
            disabled={props.disabled}
            onChange={(e) => {
              const value = e.target.value;
              props.onChange(value !== '' ? new Date(`0000T${value}`) : null);
            }}
            onBlur={props.onBlur}
            aria-describedby={props.describedBy}
            style={getFieldStyle(props.error)}
          />
          <FieldText {...props} />
        </>
      )}
    </FieldContainer>
  );
}
