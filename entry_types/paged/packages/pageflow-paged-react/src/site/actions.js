export const INIT = 'SITE_INIT';

export function init(site) {
  return {
    type: INIT,
    payload: {
      site
    }
  };
}
