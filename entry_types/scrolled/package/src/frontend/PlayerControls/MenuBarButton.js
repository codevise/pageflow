import React, {useState, useCallback, useRef} from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import styles from './MenuBarButton.module.css';
import CheckIcon from './images/check.svg';

export function MenuBarButton(props) {
  const {subMenuItems, onClick} = props;

  const [subMenuExpanded, setSubMenuExpanded] = useState(props.subMenuExpanded);
  const closeMenuTimeout = useRef();

  const openMenu = useCallback(() => {
    if (subMenuItems.length > 0) {
      setSubMenuExpanded(true);
    }
  }, [subMenuItems.length]);

  const closeMenu = useCallback(() => {
    setSubMenuExpanded(false);
  }, []);

  const onButtonClick = useCallback(event => {
    openMenu();

    if (onClick) {
      onClick();
    }
  }, [onClick, openMenu]);

  const onFocus = useCallback(() => {
    clearTimeout(closeMenuTimeout.current);
  }, []);

  const onBlur = useCallback(() => {
    clearTimeout(closeMenuTimeout.current);

    closeMenuTimeout.current = setTimeout(() => {
      setSubMenuExpanded(false);
    }, 100);
  }, []);

  const onKeyDown = useCallback(event => {
    if (event.key === 'Escape') {
      setSubMenuExpanded(false);
    }
  }, []);

  return (
    <div className={classNames({[styles.subMenuExpanded]: subMenuExpanded}, styles.wrapper)}
         onMouseEnter={openMenu}
         onMouseLeave={closeMenu}
         onFocus={onFocus}
         onBlur={onBlur}
         onKeyDown={onKeyDown}>
      <button className={styles.button}
              title={props.title}
              onClick={onButtonClick}>
        {React.createElement(props.icon, {className: styles.icon})}
      </button>
      {renderSubMenu(props, closeMenu)}
    </div>
  );
}

MenuBarButton.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.elementType,
  subMenuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
      annotation: PropTypes.string,
      active: PropTypes.bool,
    })
  ),
  onClick: PropTypes.func,
  onSubMenuItemClick: PropTypes.func
};

MenuBarButton.defaultProps = {
  subMenuItems: []
};

function renderSubMenu(props, closeMenu) {
  if (props.subMenuItems.length > 0) {
    return (
      <ul className={styles.subMenu} role="menu">
        {renderSubMenuItems(props, closeMenu)}
      </ul>
    );
  }
}

function renderSubMenuItems(props, closeMenu) {
  return props.subMenuItems.map(item => {
    return (
      <li className={styles.subMenuItem} key={item.value}>
        <button className={styles.subMenuItemButton}
                role="menuitemradio"
                aria-checked={item.active}
                onClick={subMenuItemClickHandler(props, item.value, closeMenu)} >

          {renderSubMenuItemIcon(item)}
          {item.label}
          {renderSubMenuItemAnnotation(props, item)}
        </button>
      </li>
    );
  });
}

function renderSubMenuItemIcon(item) {
  if (item.active) {
    return (
      <CheckIcon className={styles.subMenuItemIcon} />
    );
  }
}

function renderSubMenuItemAnnotation(props, item) {
  if (item.annotation) {
    return (
      <span className={styles.subMenuItemAnnotation}>
        {item.annotation}
      </span>
    );
  }
}

function subMenuItemClickHandler(props, value, closeMenu) {
  return (event) => {
    event.preventDefault();
    closeMenu();

    if (props.onSubMenuItemClick) {
      props.onSubMenuItemClick(value);
    }
  };
}
