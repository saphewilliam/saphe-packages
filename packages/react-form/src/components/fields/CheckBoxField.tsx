import React, { ReactElement } from 'react';
import { getFieldStyle } from '../../utils/formHelpers';
import { AddFieldPack } from '../../utils/helperTypes';
import { CheckProps } from '../../utils/propTypes';
import FieldText from '../helpers/FieldText';
import FormFieldContainer from '../helpers/FormFieldContainer';

export default function CheckBoxField(
  props: AddFieldPack<CheckProps>,
): ReactElement {
  return (
    <FormFieldContainer fieldPack={props.fieldPack}>
      {props.fieldPack?.CHECK ? (
        <props.fieldPack.CHECK {...props} />
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              type="checkbox"
              id={props.id}
              name={props.name}
              value={String(props.value)}
              disabled={props.disabled}
              onChange={(e) => props.onChange(e.target.checked)}
              onBlur={props.onBlur}
              aria-describedby={props.describedBy}
              style={{ marginRight: '10px', ...getFieldStyle(props.error) }}
            />
            <label htmlFor={props.id}>{props.label}</label>
          </div>
          <FieldText {...props} />
        </>
      )}
    </FormFieldContainer>
  );
}
