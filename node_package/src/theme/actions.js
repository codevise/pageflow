export const INIT = 'THEME_INIT';

export function init(payload) {
  return {
    type: INIT,
    payload
  };
}
