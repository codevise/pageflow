export const REQUEST = 'CONSENT_REQUEST';
export const DENY_ALL = 'CONSENT_DENY_ALL';
export const ACCEPT_ALL = 'CONSENT_ACCEPT_ALL';

export function request() {
 return {
   type: REQUEST
 };
}

export function denyAll() {
  return {
    type: DENY_ALL
  };
}

export function acceptAll() {
  return {
    type: ACCEPT_ALL
  };
}
