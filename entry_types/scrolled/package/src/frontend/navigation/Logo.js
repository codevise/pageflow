import React from 'react';
import classNames from 'classnames';

import {useTheme} from '../../entryState';

import styles from './AppHeader.module.css';

export function Logo() {
  const theme = useTheme();
  return (
    <a target="_blank"
       rel="noopener noreferrer"
       href={theme.options.logoUrl}
       className={classNames(styles.menuIcon, styles.logo)}>
      <picture>
        <source media="(max-width: 780px)" srcSet={theme.assets.logoMobile} />
        <source media="(min-width: 781px)" srcSet={theme.assets.logoDesktop} />
        <img src={theme.assets.logoDesktop}
             alt={theme.options.logoAltText} />
      </picture>
    </a>
  );
}
