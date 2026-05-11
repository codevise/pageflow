// The i18n-js JS lib shipped by the i18n-js Ruby gem (Sprockets) is an
// old version whose fallback only tries defaultLocale; it never walks
// parent locales. Patch lookup so e.g. `de-CH` falls back via `de` to
// defaultLocale. The Webpack-bundled I18n (npm i18n-js) does this
// natively when I18n.fallbacks is true.
export function patchSprocketsI18nForParentLocaleFallback(I18n) {
  const originalLookup = I18n.lookup;

  I18n.lookup = function(scope, options) {
    options = options || {};

    if (!I18n.fallbacks || options.fallback) {
      return originalLookup.call(I18n, scope, options);
    }

    const candidates = parentLocaleChain(
      options.locale || I18n.currentLocale(), I18n.defaultLocale
    );

    for (const candidate of candidates) {
      const result = originalLookup.call(I18n, scope, I18n.prepareOptions(
        {locale: candidate, fallback: true}, options
      ));
      if (result !== undefined) return result;
    }

    return I18n.isValidNode(options, 'defaultValue') ? options.defaultValue : undefined;
  };
}

function parentLocaleChain(locale, defaultLocale) {
  const chain = [];
  const parts = String(locale).split('-');
  while (parts.length > 0) {
    chain.push(parts.join('-'));
    parts.pop();
  }
  if (!chain.includes(defaultLocale)) chain.push(defaultLocale);
  return chain;
}
