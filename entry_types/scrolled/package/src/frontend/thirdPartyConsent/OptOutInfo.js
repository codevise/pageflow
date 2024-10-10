import React from 'react';
import classNames from 'classnames';

import {useConsentGiven} from './hooks';
import {useTheme, useContentElementConsentVendor} from '../../entryState';
import {useI18n} from '../i18n';
import {useContentElementAttributes} from '../useContentElementAttributes';
import {widths} from '../layouts';
import {ThemeIcon} from '../ThemeIcon';

import styles from './OptOutInfo.module.css';

/**
 * Display info tooltip with a link to opt out of third party
 * embeds. Opt out url needs to be configured in theme options.
 *
 * @param {Object} props
 * @param {string} props.providerName -
 *   Only display if user has given consent for this provider.
 * @param {boolean} [hide] -
 *   Temporarily hide the tooltip, e.g. while the embed is playing
 *
 * @name ThirdPartyOptOutInfo
 */
export function OptOutInfo({
  providerName,
  hide,
  inset
}) {
  const {t} = useI18n();
  const theme = useTheme();
  const optOutUrl = theme.options.thirdPartyConsent?.optOutUrl;

  const {width, contentElementId} = useContentElementAttributes();
  const contentElementConsentVendor = useContentElementConsentVendor({contentElementId});

  providerName = providerName || contentElementConsentVendor?.name;
  const [consentGiven] = useConsentGiven(providerName);

  if (!optOutUrl || !consentGiven) {
    return null;
  }

  const linkText = t('pageflow_scrolled.public.third_party_consent.opt_out.prompt_link');
  const linkHtml = `<a href="${optOutUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
  const html = t('pageflow_scrolled.public.third_party_consent.opt_out.prompt', {link: linkHtml});

  return (
    <div className={classNames(styles.optOut,
                               {[styles.full]: width === widths.full || inset})}
         style={hide ? {opacity: 0, visibility: 'hidden'} : undefined}>
      <button className={styles.icon}>
        <ThemeIcon name="information" />
      </button>
      <div className={styles.tooltip}>
        <div dangerouslySetInnerHTML={{__html: html}} />
      </div>
    </div>
  );
};
