import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { matchSnapshot } from '../utils/testHelpers';
import useRecaptcha from './useRecaptcha';

describe('useRecaptcha', () => {
  it('renders', async () => {
    const {
      result: {
        current: { Recaptcha, recaptchaToken },
      },
    } = renderHook(() =>
      useRecaptcha({
        errorMessage: 'Recaptcha error message',
        locale: 'en',
        siteKey: 'siteKey',
      }),
    );

    matchSnapshot(<Recaptcha />);
    expect(recaptchaToken).toBeUndefined();
  });

  it("doesn't render without config", () => {
    const {
      result: {
        current: { Recaptcha, recaptchaToken },
      },
    } = renderHook(() => useRecaptcha(undefined));
    matchSnapshot(<Recaptcha />);
    expect(recaptchaToken).toBeUndefined();
  });
});
