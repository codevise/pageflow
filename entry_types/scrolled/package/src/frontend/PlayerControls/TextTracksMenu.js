import React from 'react';
import PropTypes from 'prop-types';

import {MenuBarButton} from './MenuBarButton';
import {useI18n} from '../i18n';

import TextTracksIcon from './images/textTracks.svg';

export function TextTracksMenu(props) {
  const {t} = useI18n();

  if (props.items.length < 2) {
    return null;
  }

  return (
    <MenuBarButton title={t('pageflow_scrolled.public.player_controls.text_tracks')}
                   icon={TextTracksIcon}
                   subMenuItems={props.items}
                   onSubMenuItemClick={props.onItemClick} />
  );
}

TextTracksMenu.propTypes = {
  items: MenuBarButton.propTypes.subMenuItems,
  onMenuItemClick: PropTypes.func
};

TextTracksMenu.defaultProps = {
  items: []
};
