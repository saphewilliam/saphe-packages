import React, { ReactElement } from 'react';
import { AddFieldPack } from '../../utils/helperTypes';
import { SubmitButtonProps } from '../../utils/propTypes';

export default function SubmitButton(
  props: AddFieldPack<SubmitButtonProps>,
): ReactElement {
  return props.fieldPack?.SubmitButton ? (
    <props.fieldPack.SubmitButton isSubmitting={props.isSubmitting} />
  ) : (
    <button type="submit" disabled={props.isSubmitting}>
      {props.isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  );
}
