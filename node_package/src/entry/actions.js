export const INIT = 'ENTRY_INIT';
export const READY = 'ENTRY_READY';

export function init({slug}) {
  return {
    type: INIT,
    payload: {
      slug
    }
  };
}

export function ready() {
  return {
    type: READY
  };
}
