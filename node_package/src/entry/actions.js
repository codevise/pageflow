export const INIT = 'ENTRY_INIT';

export function init({slug}) {
  return {
    type: INIT,
    payload: {
      slug
    }
  };
}
