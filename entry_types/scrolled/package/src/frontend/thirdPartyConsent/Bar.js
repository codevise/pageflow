import React, {useState} from 'react';

import {VendorsBox} from './VendorsBox';

import {useConsentRequested} from './hooks';
import {useI18n, useLocale} from '../i18n';
import {useLegalInfo} from '../../entryState';

import GearIcon from '../icons/gear.svg';

import styles from './Bar.module.css';

export function Bar() {
  const {vendors, acceptAll, denyAll, save} = useConsentRequested();
  const [expanded, setExpanded] = useState(false);
  const {t} = useI18n();
  const locale = useLocale();
  const privacyLinkUrl = useLegalInfo().privacy.url;

  if (vendors) {
    return (
      <div className={styles.bar}>
        {renderText({privacyLinkUrl, t, locale, vendors})}

        {!expanded &&
         <button className={styles.configureButton} onClick={() => setExpanded(true)}>
           <GearIcon width={15} height={15} />
           {t('pageflow_scrolled.public.consent_configure')}
         </button>}

        {expanded &&
         <VendorsBox vendors={vendors} save={save} t={t} />}

        <div className={styles.decisionButtons}>
          <button className={styles.button} onClick={denyAll}>
            {t('pageflow_scrolled.public.consent_deny_all')}
          </button>
          <button className={styles.acceptAllButton} onClick={acceptAll}>
            {t('pageflow_scrolled.public.consent_accept_all')}
          </button>

        </div>
      </div>
    );
  }

  return (
    null
  );
}

function renderText({privacyLinkUrl, t, locale, vendors}) {
  const vendorNames = vendors.map(vendor => vendor.name).join(',');
  const text = t('pageflow_scrolled.public.consent_prompt_html', {
    privacyLinkUrl: `${privacyLinkUrl}?lang=${locale}&vendors=${vendorNames}#consent`
  });

  return (
    <div className={styles.text} dangerouslySetInnerHTML={{
      __html: text
    }} />
  );
}
