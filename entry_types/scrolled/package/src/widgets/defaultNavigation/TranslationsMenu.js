import React from 'react';
import classNames from 'classnames';
import headerStyles from "./DefaultNavigation.module.css";
import styles from "./TranslationsMenu.module.css";

import {
  ThemeIcon,
  Tooltip,
  useI18n,
  useEntryMetadata,
  useEntryTranslations
} from 'pageflow-scrolled/frontend';

export function TranslationsMenu({tooltipOffset = 0}) {
  const {t} = useI18n();
  const entry = useEntryMetadata();
  const translations = useEntryTranslations();

  if (translations.length < 2) {
    return null;
  }

  const content = (
    <div className={styles.tooltip}>
      <ul className={styles.list}>
        {translations.map(({id, url, displayLocale}) => {
          if (entry.id === id) {
            return (
              <li key={id} aria-current="page">
                <strong>{displayLocale}</strong>
              </li>
            );
          }
          else {
            return (
              <li key={id}>
                <a target="_top" href={url}>{displayLocale}</a>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );

  return (
    <Tooltip name="translations"
             horizontalOffset={tooltipOffset - 30}
             arrowPos={120 - tooltipOffset}
             content={content}>
      {(buttonProps) => (
        <button {...buttonProps}
                className={classNames(headerStyles.contextIcon)}
                title={t('pageflow_scrolled.public.navigation.language')}>
          <ThemeIcon name="world" />
          <div className={styles.tag}>
            <span>{entry.locale.substring(0, 2).toUpperCase()}</span>
          </div>
        </button>
      )}
    </Tooltip>
  )
}
