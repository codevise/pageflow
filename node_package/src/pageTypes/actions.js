export const INIT = 'PAGE_TYPES_INIT';

export function init({pageTypes}) {
  return {
    type: INIT,
    payload: {
      pageTypes
    }
  };
}
