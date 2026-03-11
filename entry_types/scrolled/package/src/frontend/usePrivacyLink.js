import {useLegalInfo} from '../entryState';

// eslint-disable-next-line no-script-url
const displayPrivacySettingsUrl = 'javascript:pageflowDisplayPrivacySettings()';

/**
 * Returns the privacy link URL, label and link props. When vendors
 * are passed, the vendors query parameter and consent hash are
 * appended to the URL. Handles absolute, protocol-relative and
 * relative URLs.
 *
 * @param {Object} [options]
 * @param {string} [options.vendors] - Comma-separated vendor names.
 *
 * @example
 *
 * const {url, label, props} = usePrivacyLink({vendors: 'youtube'});
 * // props => {href: '...', target: '_blank', rel: 'noreferrer noopener'}
 */
export function usePrivacyLink({vendors} = {}) {
  const {privacy} = useLegalInfo();

  const url = vendors && privacy.url && privacy.url !== displayPrivacySettingsUrl
    ? appendVendorsParam(privacy.url, vendors)
    : privacy.url;

  return {
    url,
    label: privacy.label,
    props: linkProps(url)
  };
}

function linkProps(url) {
  if (url === displayPrivacySettingsUrl) {
    return {
      href: '#privacySettings',
      onClick(event) {
        window.pageflowDisplayPrivacySettings();
        event.preventDefault();
      }
    };
  }

  return {
    href: url,
    target: '_blank',
    rel: 'noreferrer noopener'
  };
}

function appendVendorsParam(privacyLinkUrl, vendors) {
  const isProtocolRelative = privacyLinkUrl.startsWith('//');
  const urlString = isProtocolRelative ? 'https:' + privacyLinkUrl : privacyLinkUrl;
  const url = new URL(urlString, 'https://localhost');

  url.searchParams.set('vendors', vendors);
  url.hash = '#consent';

  if (isProtocolRelative) {
    return url.toString().replace('https:', '');
  }
  else if (!privacyLinkUrl.includes('://')) {
    return url.pathname + url.search + url.hash;
  }

  return url.toString();
}
