import React, {createContext, useState} from 'react';
import {cookies} from 'pageflow/frontend';
import {useTheme} from '../entryState';

export const ThirdPartyConsentContext = createContext();

export function ThirdPartyConsentProvider({children}) {
  const theme = useTheme();
  const cookieName = theme.options.privacyCookieName || 'privacyOptIn';

  const getProviderCookieKey = (provider) => {
    if (provider === 'video' && theme.options.privacyCookieVideoEmbedKey) {
      return theme.options.privacyCookieVideoEmbedKey;
    }

    return provider;
  };

  const getProviderPageflowKey = (provider) => {
    if (provider === theme.options.privacyCookieVideoEmbedKey) {
      return 'video';
    }

    return provider;
  };

  const getCookieContent = () => {
    // Server-side rendering
    if (typeof window === 'undefined') {
      return {};
    }

    const cookie = JSON.parse(cookies.getItem(cookieName)) || {};

    if (!theme.options.privacyCookieVideoEmbedKey) {
      return cookie;
    }

    const result = {};

    Object.keys(cookie).forEach(key => {
      result[getProviderPageflowKey(key)] = cookie[key];
    });

    return result;
  };

  const setConsentCookie = (provider) => {
    const newCookieContent = getCookieContent();
    const providerCookieKey = getProviderCookieKey(provider);
    newCookieContent[providerCookieKey] = true;
    cookies.setItem(cookieName, JSON.stringify(newCookieContent));
  };

  const giveConsent = (provider) => {
    setConsentCookie(provider);
    setContext({consents: getCookieContent(), giveConsent});
  };

  const [context, setContext] = useState({
    consents: getCookieContent(),
    giveConsent
  });

  return (
    <ThirdPartyConsentContext.Provider value={context}>
      {children}
    </ThirdPartyConsentContext.Provider>
  );
};
