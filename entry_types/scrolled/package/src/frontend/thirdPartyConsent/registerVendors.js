import I18n from 'i18n-js';

export function registerVendors({contentElementTypes, seed, consent, cookieName}) {
  const options = seed.config.theme.options.thirdPartyConsent;
  const locale = seed.collections.entries[0].locale;

  cookieName = cookieName || options?.cookieName;

  [
    ...seed.config.consentVendors,
    ...contentElementTypes.consentVendors({
      contentElements: seed.collections.contentElements,
      t(key, options) { return I18n.t(key, {...options, locale}); }
    })
  ].forEach(vendor => {
    consent.registerVendor(vendor.name, {
      displayName: vendor.displayName,
      description: vendor.description,
      paradigm: cookieName ? (vendor.paradigm || 'opt-in') : 'skip',
      cookieName: cookieName,
      cookieKey: options?.cookieProviderNameMapping?.[vendor.name],
      cookieDomain: options?.cookieDomain
    });
  });

  consent.closeVendorRegistration();
}
