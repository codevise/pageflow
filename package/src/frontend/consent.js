import {consentTrigger} from './consentTrigger';

export const consent = consent || {requested: false};

const trackConsentRequested = () => {
  consent.requested = true;
};

const setCallbacks = (resolve, reject) => {
  consent.resolve = resolve;
  consent.reject = reject;
};

const consentRequest = consentRequest || new Promise((resolve, reject) => {
  setCallbacks(resolve, reject);
});

consent.request = () => {
  trackConsentRequested();
  consent.promise = consentRequest;
  consentTrigger.request(consent);
  return consent;
};
