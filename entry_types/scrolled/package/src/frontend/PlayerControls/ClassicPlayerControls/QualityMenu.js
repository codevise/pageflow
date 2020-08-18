import React from 'react';
import PropTypes from 'prop-types';

import {MenuBarButton} from '../MenuBarButton';
import {useI18n} from '../../i18n';

import QualityIcon from '../images/quality.svg';

export function QualityMenu(props) {
  const {t} = useI18n();

  if (props.items.length < 2) {
    return null;
  }

  return (
    <MenuBarButton title={t('pageflow_scrolled.public.player_controls.quality')}
                   icon={QualityIcon}
                   subMenuItems={props.items}
                   subMenuExpanded={props.subMenuExpanded}
                   onSubMenuItemClick={props.onItemClick} x/>
  );
}

QualityMenu.propTypes = {
  items: MenuBarButton.propTypes.subMenuItems,
  onMenuItemClick: PropTypes.func
};

QualityMenu.defaultProps = {
  items: []
};
