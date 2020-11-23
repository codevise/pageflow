import React from 'react';
import styles from './OptIn.module.css';
import utilStyles from '../utils.module.css';
import OptInIcon from '../icons/media.svg';
import {useI18n} from '../i18n';
import cx from 'classnames';

export const OptIn = ({consent, cookieMessage, height}) => {
  const {t} = useI18n();

  return (
    <>
      <div style={{height: height}} className={styles.optIn}>
        <div className={styles.optInIcon}>
          <OptInIcon/>
        </div>
        <div className={styles.optInMessage}>
          {cookieMessage}
        </div>
        <div>
          <button
            className={cx(styles.optInButton, utilStyles.unstyledButton)}
            onClick={() => consent()}
          >
            {t('pageflow_scrolled.public.third_party_consent.confirm')}
          </button>
        </div>
      </div>
    </>
  );
};
