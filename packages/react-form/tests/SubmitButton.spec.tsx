import React from 'react';
import SubmitButton from '../src/components/helpers/SubmitButton';
import { matchSnapshot } from './testHelpers';

describe('Submit Button', () => {
  it('renders', () => {
    matchSnapshot(
      <SubmitButton
        isSubmitting={false}
        disabled={false}
        label="Submit"
        submittingLabel="Submitting..."
      />,
    );
    matchSnapshot(
      <SubmitButton
        isSubmitting={true}
        disabled={false}
        label="Submit"
        submittingLabel="Submitting..."
      />,
    );
  });
});
