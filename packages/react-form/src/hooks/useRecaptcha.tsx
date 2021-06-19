import React, { ReactElement, useCallback, useState } from 'react';
import RecaptchaComponent from 'react-google-recaptcha';

export interface Config {
  siteKey: string;
  locale: string;
  onError: () => void;
}

export interface State {
  Recaptcha: () => ReactElement;
  recaptchaToken: string | undefined;
}

export default function useRecaptcha(config?: Config): State {
  const [token, setToken] = useState<string | undefined>(undefined);

  const handleChange = (newToken: string | null) =>
    setToken(newToken ?? undefined);
  const handleExpired = () => setToken(undefined);
  const handleErrored = () =>
    console.error('Network Disconnected, cannot verify reCAPTCHA');

  const Recaptcha = useCallback(
    () =>
      config ? (
        <div>
          <RecaptchaComponent
            sitekey={config.siteKey}
            hl={config.locale}
            onChange={handleChange}
            onExpired={handleExpired}
            onErrored={handleErrored}
          />
        </div>
      ) : (
        <div />
      ),
    [config],
  );

  return { Recaptcha, recaptchaToken: token };
}
