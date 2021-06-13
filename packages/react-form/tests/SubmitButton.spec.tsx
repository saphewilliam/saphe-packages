import React from 'react';
import SubmitButton from '../src/components/helpers/SubmitButton';
import { matchSnapshot } from './testHelpers';

describe('Submit Button', () => {
  it('renders', () => {
    matchSnapshot(<SubmitButton isSubmitting={false} />);
    matchSnapshot(<SubmitButton isSubmitting={true} />);
  });
});
