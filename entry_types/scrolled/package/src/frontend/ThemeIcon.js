import React from 'react';

import information from './icons/information.svg';
import muted from './icons/muted.svg';
import share from './icons/share.svg';
import unmuted from './icons/unmuted.svg';

import {useTheme} from '../entryState';

const icons = {
  information,
  muted,
  share,
  unmuted
};

/**
 * Render an SVG icon that can be customized in themes.
 *
 * @param {Object} props
 * @param {string} props.name - Either: information, muted, share or unmuted.
 */
export function ThemeIcon({name}) {
  const theme = useTheme();
  const FallbackIcon = icons[name];
  const themeAsset = theme.assets.icons[name];

  if (!FallbackIcon) {
    throw(new Error(
      `Unknown icon '${name}'. Available options: ${Object.keys(icons).join(', ')}.`
    ));
  }

  if (themeAsset) {
    return <svg>
      <use xlinkHref={`${themeAsset}#icon`} />
    </svg>
  }
  else {
    return <FallbackIcon />;
  }
}
