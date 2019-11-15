export const INIT = 'I18N_INIT';

export function init({locale}) {
  return {
    type: INIT,
    payload: {
      locale
    }
  };
}
