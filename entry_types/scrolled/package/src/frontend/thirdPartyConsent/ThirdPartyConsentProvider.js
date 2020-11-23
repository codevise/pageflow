import React, {createContext, useState} from 'react';
import {cookies} from 'pageflow/frontend';
import {useTheme} from '../../entryState';

export const ThirdPartyConsentContext = createContext();

export function ThirdPartyConsentProvider({children}) {
  const theme = useTheme();

  const cookieName = theme.options.privacyCookieName || 'privacyOptIn';
  const providerNameMapping = theme.options.privacyCookieProviderNameMapping || {};

  const getCookieContent = () => {
    // Server-side rendering
    if (typeof window === 'undefined') {
      return {};
    }

    return JSON.parse(cookies.getItem(cookieName)) || {};
  }

  function getConsentsFromCookie() {
    const result = getCookieContent();

    Object.keys(providerNameMapping).forEach(key => {
      result[key] = result[providerNameMapping[key]];
    });

    return result;
  };

  const setConsentCookie = (provider) => {
    const newCookieContent = getCookieContent();
    newCookieContent[providerNameMapping[provider] || provider] = true;
    cookies.setItem(cookieName, JSON.stringify(newCookieContent));
  };

  const giveConsent = (provider) => {
    setConsentCookie(provider);
    setContext({consents: getCookieContent(), giveConsent});
  };

  const [context, setContext] = useState({
    consents: getConsentsFromCookie(),
    giveConsent
  });

  return (
    <ThirdPartyConsentContext.Provider value={context}>
      {children}
    </ThirdPartyConsentContext.Provider>
  );
};
