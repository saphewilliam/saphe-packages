import React, { ReactElement } from 'react';
import { SubmitButtonProps } from '../../lib/props';
import { AddFieldPack } from '../../lib/util';

export default function SubmitButton(props: AddFieldPack<SubmitButtonProps>): ReactElement {
  return props.fieldPack?.SubmitButton ? (
    <props.fieldPack.SubmitButton {...props} />
  ) : (
    <button type={props.type} disabled={props.isLoading || props.disabled} onClick={props.onClick}>
      {props.label}
    </button>
  );
}
