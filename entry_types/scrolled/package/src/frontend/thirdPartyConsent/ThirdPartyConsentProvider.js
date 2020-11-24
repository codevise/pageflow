import React, {createContext, useCallback, useEffect, useMemo, useState} from 'react';
import {cookies} from 'pageflow/frontend';
import {useTheme} from '../../entryState';

export const ThirdPartyConsentContext = createContext();

export function ThirdPartyConsentProvider({children}) {
  const theme = useTheme();

  const cookieName = theme.options.privacyCookieName || 'privacyOptIn';
  const providerNameMapping = useMemo(() => theme.options.privacyCookieProviderNameMapping || {},
                                      [theme]);

  const [consents, setConsents] = useState(null);

  useEffect(() => {
    setConsents(getConsentsFromCookie(cookieName, providerNameMapping));
  }, [cookieName, providerNameMapping]);

  const giveConsent = useCallback(provider => {
    enableProviderInCookie(provider, cookieName, providerNameMapping);
    setConsents(getConsentsFromCookie(cookieName, providerNameMapping));
  }, [cookieName, providerNameMapping]);

  const context = useMemo(() => ({
    consents,
    giveConsent
  }), [consents, giveConsent]);

  return (
    <ThirdPartyConsentContext.Provider value={context}>
      {children}
    </ThirdPartyConsentContext.Provider>
  );
};

function getCookieContent(cookieName) {
  return JSON.parse(cookies.getItem(cookieName)) || {};
}

function getConsentsFromCookie(cookieName, providerNameMapping) {
  const result = getCookieContent(cookieName);

  Object.keys(providerNameMapping).forEach(key => {
    result[key] = result[providerNameMapping[key]];
  });

  return result;
}

function enableProviderInCookie(provider, cookieName, providerNameMapping) {
  const newCookieContent = getCookieContent(cookieName);
  newCookieContent[providerNameMapping[provider] || provider] = true;
  cookies.setItem(cookieName, JSON.stringify(newCookieContent));
}
