import React, {useState} from 'react';
import classNames from 'classnames';
import {
  useConsentRequested,
  useDarkWidgets,
  useI18n,
  useLegalInfo,
  ThemeIcon
} from 'pageflow-scrolled/frontend';
import {VendorsBox} from './VendorsBox';

import styles from './ConsentBar.module.css';

export function ConsentBar({configuration = {}}) {
  const {vendors, acceptAll, denyAll, save} = useConsentRequested();
  const [expanded, setExpanded] = useState(configuration.defaultExpanded);
  const {t} = useI18n();
  const privacyLinkUrl = useLegalInfo().privacy.url;
  const darkWidgets = useDarkWidgets();

  if (vendors) {
    return (

      <div className={classNames(styles.bar, {
        'scope-dark': darkWidgets,
      })}>
        {renderText({privacyLinkUrl, t, vendors})}

        {!expanded &&
         <button className={styles.configureButton} onClick={() => setExpanded(true)}>
           <ThemeIcon name="gear" width={15} height={15} />
           {t('pageflow_scrolled.public.consent_configure')}
         </button>}

        {expanded &&
         <VendorsBox vendors={vendors}
                     save={save}
                     t={t}
                     defaultExpanded={configuration.defaultExpanded} />}

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

function renderText({privacyLinkUrl, t, vendors}) {
  const text = t('pageflow_scrolled.public.consent_prompt_html', {
    privacyLinkUrl: appendVendorsParam(privacyLinkUrl, vendors)
  });

  return (
    <div className={styles.text} dangerouslySetInnerHTML={{
      __html: text
    }} />
  );
}

function appendVendorsParam(privacyLinkUrl, vendors) {
  try {
    const url = new URL(privacyLinkUrl, window.location.href);

    url.searchParams.set('vendors', vendors.map(vendor => vendor.name).join(','));
    url.hash = '#consent';

    return url.toString();
  }
  catch(e) {
    return privacyLinkUrl;
  }
}
