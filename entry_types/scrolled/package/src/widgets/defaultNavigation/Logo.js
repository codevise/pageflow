import React from 'react';
import classNames from 'classnames';

import {useDarkWidgets, useTheme} from 'pageflow-scrolled/frontend';

import styles from './DefaultNavigation.module.css';

export function Logo({srcMobile, srcDesktop, url, altText}) {
  const theme = useTheme();
  const darkWidgets = useDarkWidgets();

  srcDesktop =
    srcDesktop ||
    (darkWidgets ? theme.assets.logoDarkVariantDesktop : theme.assets.logoDesktop);

  srcMobile =
    srcMobile ||
    (darkWidgets ? theme.assets.logoDarkVariantMobile : theme.assets.logoMobile);

  const inIframe = typeof window !== 'undefined' && window.parent !== window;

  return (
    <a target={inIframe || !theme.options.logoOpenInSameTab ? "_blank" : null}
       rel="noopener noreferrer"
       href={url || theme.options.logoUrl}
       className={classNames(
         styles.logo,
         {[styles.centerMobileLogo]:
           theme.options.defaultNavigationMobileLogoPosition === 'center'}
       )}>
      <picture>
        <source media="(max-width: 780px)" srcSet={srcMobile} />
        <source media="(min-width: 781px)" srcSet={srcDesktop} />
        <img src={srcDesktop}
             alt={altText || theme.options.logoAltText} />
      </picture>
    </a>
  );
}
