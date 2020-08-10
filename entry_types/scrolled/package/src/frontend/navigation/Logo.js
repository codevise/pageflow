import React from 'react';
import classNames from 'classnames';

import {useTheme} from '../../entryState';

import styles from './AppHeader.module.css';

export function Logo() {
  const theme = useTheme();

  return (
    <picture>
      <source media="(max-width: 780px)" srcSet={theme.assets.logoMobile} />
      <source media="(min-width: 781px)" srcSet={theme.assets.logoDesktop} />
      <img src={theme.assets.logoDesktop}
           alt={theme.options.logoAltText}
           className={classNames(styles.menuIcon, styles.logo)}/>
    </picture>
  );
}
