import { Props } from '@saphe/react-form';
import { ReactElement } from 'react';
import BSFieldText from './BSFieldText';

export default function BSTextAreaField(props: Props.TextAreaProps): ReactElement {
  return (
    <>
      <label htmlFor={props.id} className="form-label">
        {props.label}
      </label>
      <textarea
        rows={props.rows ?? 6}
        className={`form-control${props.error ? ' is-invalid' : ''}`}
        id={props.id}
        name={props.name}
        value={props.value ?? ''}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.value)}
        onBlur={props.onBlur}
        aria-describedby={props.describedBy}
      />
      <BSFieldText {...props} />
    </>
  );
}
