import { Props } from '@saphe/react-form';
import React, { ReactElement } from 'react';

export default function BSSubmitButton(props: Props.SubmitButtonProps): ReactElement {
  return (
    <button
      type={props.type}
      disabled={props.isLoading || props.disabled}
      className="btn btn-primary"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}
