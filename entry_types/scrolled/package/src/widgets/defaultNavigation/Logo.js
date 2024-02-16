import React from 'react';
import classNames from 'classnames';

import {useTheme} from 'pageflow-scrolled/frontend';

import styles from './DefaultNavigation.module.css';

export function Logo() {
  const theme = useTheme();
  return (
    <a target="_blank"
       rel="noopener noreferrer"
       href={theme.options.logoUrl}
       className={classNames(
         styles.menuIcon,
         styles.logo,
         {[styles.centerMobileLogo]:
           theme.options.defaultNavigationMobileLogoPosition === 'center'}
       )}>
      <picture>
        <source media="(max-width: 780px)" srcSet={theme.assets.logoMobile} />
        <source media="(min-width: 781px)" srcSet={theme.assets.logoDesktop} />
        <img src={theme.assets.logoDesktop}
             alt={theme.options.logoAltText} />
      </picture>
    </a>
  );
}
