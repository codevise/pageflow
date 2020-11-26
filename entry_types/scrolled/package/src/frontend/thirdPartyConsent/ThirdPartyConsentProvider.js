import React, {createContext, useCallback, useEffect, useMemo, useState} from 'react';
import {cookies} from 'pageflow/frontend';
import {useTheme} from '../../entryState';

export const ThirdPartyConsentContext = createContext();

export function ThirdPartyConsentProvider({children}) {
  const theme = useTheme();

  const cookieName = theme.options.thirdPartyConsent?.cookieName;
  const cookieDomain = theme.options.thirdPartyConsent?.cookieDomain;
  const providerNameMapping = useMemo(() => {
    return theme.options.thirdPartyConsent?.cookieProviderNameMapping || {}
  }, [theme])

  const [consents, setConsents] = useState(null);

  useEffect(() => {
    if (cookieName) {
      setConsents(getConsentsFromCookie(cookieName, providerNameMapping));
    }
  }, [cookieName, providerNameMapping]);

  const giveConsent = useCallback(provider => {
    enableProviderInCookie(provider, cookieName, cookieDomain, providerNameMapping);
    setConsents(consents => ({...consents, [provider]: true}));
  }, [cookieName, cookieDomain, providerNameMapping]);

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

function enableProviderInCookie(provider, cookieName, cookieDomain, providerNameMapping) {
  if (!cookieDomain || window.location.hostname.match(new RegExp(`${cookieDomain}$`))) {
    const newCookieContent = getCookieContent(cookieName);
    newCookieContent[providerNameMapping[provider] || provider] = true;
    cookies.setItem(cookieName, JSON.stringify(newCookieContent), null, cookieDomain);
  }
}
