import { ReactElement } from 'react';
import { getFieldStyle } from '../../lib/form';
import { MonthProps } from '../../lib/props';
import { AddFieldPack } from '../../lib/util';
import FieldContainer from '../helpers/FieldContainer';
import FieldText from '../helpers/FieldText';

function toMonth(date: Date | null): string {
  if (date === null) return '';
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().padStart(4, '0');
  return `${year}-${month}`;
}

export default function MonthField(props: AddFieldPack<MonthProps>): ReactElement {
  return (
    <FieldContainer fieldPack={props.fieldPack}>
      {props.fieldPack?.MONTH ? (
        <props.fieldPack.MONTH {...props} />
      ) : (
        <>
          <label htmlFor={props.id}>{props.label}</label>
          <input
            type="month"
            autoComplete="off"
            id={props.id}
            name={props.name}
            value={toMonth(props.value)}
            disabled={props.disabled}
            onChange={(e) => {
              const value = e.target.value;
              props.onChange(value !== '' ? new Date(value) : null);
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
