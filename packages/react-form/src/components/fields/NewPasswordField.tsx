import { ReactElement } from 'react';
import { getFieldStyle } from '../../lib/form';
import { PasswordProps } from '../../lib/props';
import { AddFieldPack } from '../../lib/util';
import FieldContainer from '../helpers/FieldContainer';
import FieldText from '../helpers/FieldText';

export default function NewPasswordField(props: AddFieldPack<PasswordProps>): ReactElement {
  return (
    <FieldContainer fieldPack={props.fieldPack}>
      {props.fieldPack?.NEW_PASSWORD ? (
        <props.fieldPack.NEW_PASSWORD {...props} />
      ) : (
        <>
          <label htmlFor={props.id}>{props.label}</label>
          <input
            type="password"
            autoComplete="new-password"
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
