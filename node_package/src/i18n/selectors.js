import {memoizedSelector} from 'utils';

export const t = memoizedSelector(
  locale,
  locale =>
    function(key, options) {
      return I18n.t(key, {locale, ...options});
    }
);

export function locale(state) {
  return state.i18n.locale;
}
