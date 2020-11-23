import React from 'react';
import {useI18n} from './i18n';
import styles from './OptOut.module.css';
import cx from 'classnames';
import InfoIcon from './icons/information.svg'

export const OptOut = ({optOutLink, hideTooltip, optOutPlacement}) => {
  const containerStyle = hideTooltip ? {display: 'none'} : {};
  const {t} = useI18n();

  return (
    <div style={containerStyle}>
      <div className={cx(styles.optOut, styles[optOutPlacement])}>
        <span className={styles.tooltip}>
          <div>
            {t('pageflow_scrolled.public.embed_opt_in.opt_out.prompt')}
            <a href={optOutLink}>
              {t('pageflow_scrolled.public.embed_opt_in.opt_out.link_title')}
            </a>
            {t('pageflow_scrolled.public.embed_opt_in.opt_out.prompt_2')}
          </div>
        </span>
        <button className={styles.icon}>
          <InfoIcon/>
        </button>
      </div>
    </div>
  );
};
