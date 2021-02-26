export const consent = consent || {requested: false};

const trackConsentRequested = () => {
  consent.requested = consent.requested || new Promise((resolve, reject) =>  {
    setCallbacks('request', resolve, reject);
  });
};

const setCallbacks = (name, resolve, reject) => {
  consent[name + 'Resolve'] = resolve;
  consent[name + 'Reject'] = reject;
};

const consentRequest = consentRequest || new Promise((resolve, reject) => {
  setCallbacks('consent', resolve, reject);
});

consent.request = () => {
  trackConsentRequested();
  consent.promise = consentRequest;
  return consent;
};
