import React, {useState} from 'react';
import {useConsentGiven} from './hooks';
import {useI18n} from '../i18n';

import styles from './OptIn.module.css';
import OptInIcon from '../icons/media.svg';

/**
 * Render opt in prompt instead of children if third party consent
 * cookie has been configured in theme options and user has not given
 * consent for passed provider.
 *
 * @param {Object} props
 * @param {string} props.providerName -
 *   Only render children if user has given consent for this provider.
 * @param {React.ReactElement} props.children -
 *   Children to conditionally render.
 * @param {function} [props.wrapper] -
 *   Function that receives children to allow wrapping opt-in prompt
 *   in custom elements.
 * @param {boolean} [props.icon=true] -
 *   Allow hiding the icon in the opt-in prompt.
 *
 * @name ThirdPartyOptIn
 */
export function OptIn({children, providerName, wrapper, icon}) {
  const {t} = useI18n();
  const cookieMessage =
    t(`pageflow_scrolled.public.third_party_consent.opt_in_prompt.${providerName}`);
  const [consentedHere, setConsentedHere] = useState(false);
  const [consentGiven, giveConsent] = useConsentGiven(providerName);

  if (consentGiven || !providerName) {
    return typeof children === 'function' ? children({consentedHere}) : children;
  }

  function accept() {
    giveConsent(providerName);
    setConsentedHere(true);
  }

  return wrapper(
    <div className={styles.optIn}>
      {icon && <div className={styles.optInIcon}>
        <OptInIcon/>
      </div>}
      <div className={styles.optInMessage}>
        {cookieMessage}
      </div>
      <div>
        <button className={styles.optInButton} onClick={accept}>
          {t('pageflow_scrolled.public.third_party_consent.confirm')}
        </button>
      </div>
    </div>
  );
};

OptIn.defaultProps = {
  icon: true,
  wrapper: children => children
}
