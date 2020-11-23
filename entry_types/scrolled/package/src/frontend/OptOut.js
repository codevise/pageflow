import React from 'react';
import {useI18n} from './i18n';
import styles from './OptOut.module.css';
import cx from 'classnames';
import InfoIcon from './icons/information.svg'

export const OptOut = ({optOutLink, hideTooltip, optOutPlacement}) => {
  const containerStyle = hideTooltip ? {display: 'none'} : {};
  const {t} = useI18n();

  const linkText = t('pageflow_scrolled.public.third_party_consent.opt_out.prompt_link');
  const linkHtml = `<a href="${optOutLink}" target="_blank" rel="noopener">${linkText}</a>`;
  const html = t('pageflow_scrolled.public.third_party_consent.opt_out.prompt', {link: linkHtml});

  return (
    <div style={containerStyle}>
      <div className={cx(styles.optOut, styles[optOutPlacement])}>
        <span className={styles.tooltip}>
          <div dangerouslySetInnerHTML={{__html: html}} />
        </span>
        <button className={styles.icon}>
          <InfoIcon/>
        </button>
      </div>
    </div>
  );
};
