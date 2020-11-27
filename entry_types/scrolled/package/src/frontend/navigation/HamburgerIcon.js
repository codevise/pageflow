import React from "react";
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./HamburgerIcon.module.css";
import hamburgerIconStyles from "./HamburgerIcons.module.css";
import {useI18n} from '../i18n';

export function HamburgerIcon(props) {
  const {t} = useI18n();

  return (
    <div className={styles.burgerMenuIconContainer}>
      <button className={classNames(headerStyles.menuIcon,
                                    styles.burgerMenuIcon,
                                    hamburgerIconStyles.hamburger,
                                    hamburgerIconStyles['hamburger--collapse'],
                                    {[hamburgerIconStyles['is-active']]: !props.mobileNavHidden})}
              title={props.mobileNavHidden ?
                     t('pageflow_scrolled.public.navigation.open_mobile_menu') :
                     t('pageflow_scrolled.public.navigation.close_mobile_menu')}
              type="button"
              onClick={props.onClick}>
          <span className={hamburgerIconStyles['hamburger-box']}>
            <span className={hamburgerIconStyles['hamburger-inner']}></span>
          </span>
      </button>
    </div>
  )
}
