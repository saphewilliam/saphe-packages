import React, { ReactElement } from 'react';
import { SubmitButtonProps } from '../utils/fieldPropTypes';
import { FieldPack } from '../utils/helperTypes';

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
