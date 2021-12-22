import React, { ReactElement } from 'react';
import { getFieldStyle } from '../../lib/form';
import { TextAreaProps } from '../../lib/props';
import { AddFieldPack } from '../../lib/util';
import FieldContainer from '../helpers/FieldContainer';
import FieldText from '../helpers/FieldText';

export default function TextAreaField(props: AddFieldPack<TextAreaProps>): ReactElement {
  return (
    <FieldContainer fieldPack={props.fieldPack}>
      {props.fieldPack?.TEXT_AREA ? (
        <props.fieldPack.TEXT_AREA {...props} />
      ) : (
        <>
          <label htmlFor={props.id}>{props.label}</label>
          <textarea
            rows={props.rows ?? 6}
            id={props.id}
            name={props.name}
            value={props.value ?? ''}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onChange={(e) => {
              const value = e.target.value;
              props.onChange(value !== '' ? value : null);
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
