import React, { ReactElement } from 'react';
import { AddFieldPack } from '../../utils/helperTypes';
import { CheckBoxFieldProps } from '../../utils/propTypes';
import FieldText from '../helpers/FieldText';
import FormFieldContainer from '../helpers/FormFieldContainer';

export default function CheckBoxField(
  props: AddFieldPack<CheckBoxFieldProps>,
): ReactElement {
  return (
    <FormFieldContainer fieldPack={props.fieldPack}>
      {props.fieldPack?.CHECKBOX ? (
        <props.fieldPack.CHECKBOX {...props} />
      ) : (
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
            value={props.value}
            disabled={props.disabled}
            onChange={props.onChange}
            onBlur={props.onBlur}
            aria-describedby={props.describedBy}
            style={{ marginRight: '10px' }}
          />
          <label htmlFor={props.id}>{props.label}</label>
          <FieldText {...props} />
        </div>
      )}
    </FormFieldContainer>
  );
}
