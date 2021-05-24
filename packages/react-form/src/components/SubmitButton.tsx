import React, { ReactElement } from 'react';
import { FieldPack } from '../utils/helperTypes';
import { SubmitButtonProps } from '../utils/propTypes';

interface Props extends SubmitButtonProps {
  fieldPack?: FieldPack;
}

export default function SubmitButton(props: Props): ReactElement {
  return props.fieldPack?.SubmitButton ? (
    <props.fieldPack.SubmitButton isSubmitting={props.isSubmitting} />
  ) : (
    <button type="submit" disabled={props.isSubmitting}>
      {props.isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  );
}
