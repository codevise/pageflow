import React, {useContext} from 'react';
import classNames from 'classnames';

import {ThirdPartyConsentContext} from './ThirdPartyConsentProvider';
import {useTheme} from '../../entryState';
import {useI18n} from '../i18n';
import {useContentElementEditorState} from 'pageflow-scrolled/frontend';

import styles from './OptOutInfo.module.css';
import InfoIcon from '../icons/information.svg'

export function OptOutInfo({
  children,
  providerName,
  hide,
  contentElementPosition
}) {
  const {t} = useI18n();
  const {isEditable} = useContentElementEditorState();
  const {consents} = useContext(ThirdPartyConsentContext);
  const theme = useTheme();
  const optOutLink = theme.options.thirdPartyConsent?.optOutLink;

  if (!consents ||
      !consents[providerName] ||
      !optOutLink ||
      isEditable) {
    return children;
  }

  const linkText = t('pageflow_scrolled.public.third_party_consent.opt_out.prompt_link');
  const linkHtml = `<a href="${optOutLink}" target="_blank" rel="noopener">${linkText}</a>`;
  const html = t('pageflow_scrolled.public.third_party_consent.opt_out.prompt', {link: linkHtml});

  return (
    <>
      {children}
      <div className={classNames(styles.optOut, styles[contentElementPosition])}
           style={hide ? {opacity: 0, visibility: 'hidden'} : undefined}>
        <button className={styles.icon}>
          <InfoIcon/>
        </button>
        <div className={styles.tooltip}>
          <div dangerouslySetInnerHTML={{__html: html}} />
        </div>
      </div>
    </>
  );
};
