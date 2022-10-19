import { ReactElement } from 'react';
import { getFieldStyle } from '../../lib/form';
import { CheckProps } from '../../lib/props';
import { AddFieldPack } from '../../lib/util';
import FieldContainer from '../helpers/FieldContainer';
import FieldText from '../helpers/FieldText';

export default function CheckField(props: AddFieldPack<CheckProps>): ReactElement {
  return (
    <FieldContainer fieldPack={props.fieldPack}>
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
              checked={props.value}
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
    </FieldContainer>
  );
}
