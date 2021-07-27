import React, {createContext, useContext, useState, useCallback} from 'react';
import {useIsomorphicLayoutEffect} from '../useIsomorphicLayoutEffect';
import {useIsStaticPreview} from '../useScrollPositionLifecycle';
import {useContentElementEditorState} from '../useContentElementEditorState';

const ConsentContext = createContext();

export function ConsentProvider({consent, children}) {
  return (
    <ConsentContext.Provider value={consent}>
      {children}
    </ConsentContext.Provider>
  );
};

export function useConsentRequested() {
  const consent = useContext(ConsentContext);
  const [request, setRequest] = useState({});

  useIsomorphicLayoutEffect(() => {
    let unmounted = false;

    (async () => {
      const {vendors, acceptAll, denyAll, save} = await consent.requested();

      if (!unmounted) {
        setRequest({
          vendors,

          acceptAll() {
            acceptAll();
            setRequest({});
          },

          denyAll() {
            denyAll();
            setRequest({});
          },

          save(decisions) {
            save(decisions);
            setRequest({});
          }
        });
      }
    })();

    return () => unmounted = true;
  }, [consent]);

  return request;
}

export function useConsentGiven(vendorName) {
  const consent = useContext(ConsentContext);
  const {isEditable} = useContentElementEditorState();
  const isStaticPreview = useIsStaticPreview();
  const [consentGiven, setConsentGiven] = useState(isEditable ||
                                                   isStaticPreview);

  useIsomorphicLayoutEffect(() => {
    let unmounted = false;

    (async () => {
      if (!vendorName || isEditable || isStaticPreview) {
        return;
      }

      const result = await consent.requireAccepted(vendorName);

      if (!unmounted && result === 'fulfilled') {
        setConsentGiven(true);
      }
    })();

    return () => unmounted = true;
  }, [consent, vendorName]);

  const giveConsent = useCallback(() => consent.accept(vendorName),
                                  [consent, vendorName]);

  return [consentGiven, giveConsent];
}
