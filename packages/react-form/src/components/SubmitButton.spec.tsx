import React from 'react';
import { matchSnapshot } from '../utils/testHelpers';
import SubmitButton from './SubmitButton';

describe('Submit Button', () => {
  it('renders', () => {
    matchSnapshot(<SubmitButton isSubmitting={false} />);
    matchSnapshot(<SubmitButton isSubmitting={true} />);
  });
});
