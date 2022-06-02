import { ReactElement } from 'react';
import { getFieldStyle } from '../../lib/form';
import { ColorProps } from '../../lib/props';
import { AddFieldPack } from '../../lib/util';
import FieldContainer from '../helpers/FieldContainer';
import FieldText from '../helpers/FieldText';

export default function ColorField(props: AddFieldPack<ColorProps>): ReactElement {
  return (
    <FieldContainer fieldPack={props.fieldPack}>
      {props.fieldPack?.COLOR ? (
        <props.fieldPack.COLOR {...props} />
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              type="color"
              id={props.id}
              name={props.name}
              value={props.value ?? ''}
              disabled={props.disabled}
              onChange={(e) => {
                const value = e.target.value;
                props.onChange(value !== '' ? value : null);
              }}
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
