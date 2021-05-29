import { Props } from '@saphe/react-form';
import React, { ReactElement } from 'react';

export default function BSSubmitButton(
  props: Props.SubmitButtonProps,
): ReactElement {
  return (
    <button type="submit" disabled={props.isSubmitting} className="btn btn-primary">
      {props.isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  );
}
