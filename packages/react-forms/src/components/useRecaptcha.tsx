import React, { ReactElement, useCallback, useState } from 'react';
import RecaptchaComponent from 'react-google-recaptcha';
import { RecaptchaConfig } from '../utils/fieldTypes';

interface State {
  Recaptcha: () => ReactElement;
  recaptchaToken: string | null;
}

function useRecaptcha(config?: RecaptchaConfig): State {
  const [token, setToken] = useState<string | null>(null);

  const handleChange = (newToken: string | null) => setToken(newToken);
  const handleExpired = () => setToken(null);
  const handleErrored = () =>
    console.error('Network Disconnected, cannot verify reCAPTCHA');

  const Recaptcha = useCallback(
    () => (
      <div className="mb-3">
        {!!config && (
          <RecaptchaComponent
            sitekey={config.key}
            hl={config.locale}
            onChange={handleChange}
            onExpired={handleExpired}
            onErrored={handleErrored}
          />
        )}
      </div>
    ),
    [config],
  );

  return { Recaptcha, recaptchaToken: token };
}

export default useRecaptcha;
