import React, {useState, useContext} from 'react';
import {ThirdPartyConsentContext} from './ThirdPartyConsentProvider';
import {useIsStaticPreview} from '../useScrollPositionLifecycle';
import {useTheme} from '../../entryState';
import {useI18n} from '../i18n';
import {useContentElementEditorState} from 'pageflow-scrolled/frontend';

import styles from './OptIn.module.css';
import OptInIcon from '../icons/media.svg';

export function OptIn({children, providerName}) {
  const {t} = useI18n();
  const cookieMessage =
    t(`pageflow_scrolled.public.third_party_consent.opt_in_prompt.${providerName}`);
  const theme = useTheme();
  const {isEditable} = useContentElementEditorState();
  const isStaticPreview = useIsStaticPreview();
  const [consentedHere, setConsentedHere] = useState(false);
  const {consents, giveConsent} = useContext(ThirdPartyConsentContext);

  if (!theme.options.privacyCookieName ||
      consents[providerName] ||
      isEditable ||
      isStaticPreview) {
    return typeof children === 'function' ? children(consentedHere) : children;
  }

  function consent() {
    giveConsent(providerName);
    setConsentedHere(true);
  }

  return (
    <div className={styles.optIn}>
      <div className={styles.optInIcon}>
        <OptInIcon/>
      </div>
      <div className={styles.optInMessage}>
        {cookieMessage}
      </div>
      <div>
        <button className={styles.optInButton} onClick={consent}>
          {t('pageflow_scrolled.public.third_party_consent.confirm')}
        </button>
      </div>
    </div>
  );
};
