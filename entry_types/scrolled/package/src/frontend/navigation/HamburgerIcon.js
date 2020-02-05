import React from "react";
import classNames from 'classnames';
import headerStyles from "./AppHeader.module.css";
import styles from "./HamburgerIcon.module.css";
import hamburgerIconStyles from "./HamburgerIcons.module.css";

export function HamburgerIcon(props) {
  return (
    <div className={styles.burgerMenuIconContainer}>
      <button className={classNames(headerStyles.menuIcon, styles.burgerMenuIcon,
        hamburgerIconStyles.hamburger, hamburgerIconStyles['hamburger--collapse'],
        {[hamburgerIconStyles['is-active']]: !props.mobileNavHidden})}
              type="button" onClick={props.onClick}>
          <span className={hamburgerIconStyles['hamburger-box']}>
            <span className={hamburgerIconStyles['hamburger-inner']}></span>
          </span>
      </button>
    </div>
  )
}
