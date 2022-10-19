import SubmitButton from '../src/components/helpers/SubmitButton';
import { matchSnapshot } from './testHelpers';

describe('Submit Button', () => {
  it('renders', () => {
    matchSnapshot(<SubmitButton type="button" isLoading={false} disabled={false} label="Submit" />);
    matchSnapshot(
      <SubmitButton type="submit" isLoading={true} disabled={false} label="Processing..." />,
    );
  });
});
