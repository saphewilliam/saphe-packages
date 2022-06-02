import { Props } from '@saphe/react-form';
import { ReactElement } from 'react';
import BSFieldText from './BSFieldText';

export default function BSCheckField(props: Props.CheckProps): ReactElement {
  return (
    <div className="form-check">
      <input
        type="checkbox"
        className={`form-check-input${props.error ? ' is-invalid' : ''}`}
        id={props.id}
        name={props.name}
        value={String(props.value)}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.checked)}
        onBlur={props.onBlur}
        aria-describedby={props.describedBy}
      />
      <label className="form-check-label" htmlFor={props.id}>
        {props.label}
      </label>
      <BSFieldText {...props} />
    </div>
  );
}
