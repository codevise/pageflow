export const INIT = 'THEMING_INIT';

export function init(theming) {
  return {
    type: INIT,
    payload: {
      theming
    }
  };
}
