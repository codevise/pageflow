import React from "react";
import classNames from 'classnames';
import headerStyles from "./DefaultNavigation.module.css";
import styles from "./HamburgerIcon.module.css";
import hamburgerIconStyles from "./HamburgerIcons.module.css";
import {useI18n, useTheme, ThemeIcon} from 'pageflow-scrolled/frontend';

export function HamburgerIcon({menuOpen, onClick, visibleOnDesktop}) {
  const theme = useTheme();
  const {t} = useI18n();

  return (
    <div className={classNames(styles.burgerMenuIconContainer, {
      [styles.visibleOnDesktop]: visibleOnDesktop
    })}>
      <button className={headerStyles.menuIcon}
              title={menuOpen ?
                     t('pageflow_scrolled.public.navigation.close_mobile_menu') :
                     t('pageflow_scrolled.public.navigation.open_mobile_menu')}
              type="button"
              onClick={onClick}>
        <ThemeIcon name="menu"
                   renderFallback={() =>
                     <span className={classNames(hamburgerIconStyles.hamburger,
                                                 hamburgerIconStyles['hamburger--collapse'],
                                                 {[styles.small]:
                                                   theme.options.defaultNavigationMenuIconVariant === 'small'},
                                                 {[hamburgerIconStyles['is-active']]: menuOpen})}>
                       <span className={hamburgerIconStyles['hamburger-box']}>
                         <span className={hamburgerIconStyles['hamburger-inner']}></span>
                       </span>
                     </span>
                   } />
      </button>
    </div>
  )
}
