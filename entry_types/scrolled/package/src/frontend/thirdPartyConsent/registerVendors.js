import I18n from 'i18n-js';

export function registerVendors({contentElementTypes, seed, consent}) {
  const options = seed.config.theme.options.thirdPartyConsent;
  const locale = seed.collections.entries[0].locale;

  contentElementTypes
    .consentVendors({
      contentElements: seed.collections.contentElements,
      t(key, options) { return I18n.t(key, {...options, locale}); }
    })
    .forEach(vendor => {
      consent.registerVendor(vendor.name, {
        displayName: vendor.displayName,
        description: vendor.description,
        paradigm: options?.cookieName ? 'opt-in' : 'skip',
        cookieName: options?.cookieName,
        cookieKey: options?.cookieProviderNameMapping?.[vendor.name],
        cookieDomain: options?.cookieDomain
      });
    });

  consent.closeVendorRegistration();
}
