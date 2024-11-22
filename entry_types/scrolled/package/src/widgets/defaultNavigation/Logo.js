import React from 'react';
import classNames from 'classnames';

import {useTheme} from 'pageflow-scrolled/frontend';

import styles from './DefaultNavigation.module.css';

export function Logo({srcMobile, srcDesktop, url, altText}) {
  const theme = useTheme();
  return (
    <a target="_blank"
       rel="noopener noreferrer"
       href={url || theme.options.logoUrl}
       className={classNames(
         styles.logo,
         {[styles.centerMobileLogo]:
           theme.options.defaultNavigationMobileLogoPosition === 'center'}
       )}>
      <picture>
        <source media="(max-width: 780px)" srcSet={srcMobile || theme.assets.logoMobile} />
        <source media="(min-width: 781px)" srcSet={srcDesktop || theme.assets.logoDesktop} />
        <img src={srcDesktop || theme.assets.logoDesktop}
             alt={altText || theme.options.logoAltText} />
      </picture>
    </a>
  );
}
