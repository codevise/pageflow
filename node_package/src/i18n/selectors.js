export function t(state) {
  return function(key, options) {
    return I18n.t(key, {locale: state.i18n.locale, ...options});
  };
}

export function locale(state) {
  return state.i18n.locale;
}
