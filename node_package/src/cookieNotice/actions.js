export const REQUEST = 'COOKIE_NOTICE_REQUEST';
export const DISMISS = 'COOKIE_NOTICE_DISMISS';

export function request() {
  return {
    type: REQUEST
  };
}

export function dismiss() {
  return {
    type: DISMISS
  };
}
