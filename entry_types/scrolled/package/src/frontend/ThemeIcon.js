import React from 'react';

import information from './icons/information.svg';
import muted from './icons/muted.svg';
import share from './icons/share.svg';
import unmuted from './icons/unmuted.svg';
import gear from './icons/gear.svg';
import copyright from './icons/copyright.svg';
import world from './icons/world.svg';

import email from './icons/social/email.svg';
import facebook from './icons/social/facebook.svg';
import linkedIn from './icons/social/linkedIn.svg';
import telegram from './icons/social/telegram.svg';
import twitter from './icons/social/twitter.svg';
import whatsApp from './icons/social/whatsApp.svg';

import arrowLeft from './icons/arrowLeft.svg';
import arrowRight from './icons/arrowRight.svg';

import {useTheme} from '../entryState';

const icons = {
  expand: arrowRight,
  information,
  muted,
  share,
  unmuted,
  gear,
  copyright,
  world,

  email,
  facebook,
  linkedIn,
  telegram,
  twitter,
  whatsApp,

  arrowLeft,
  arrowRight
};

/**
 * Render an SVG icon that can be customized in themes.
 *
 * @param {Object} props
 * @param {string} props.name -
 *   Either: copyright, expand, gear, information, muted, share, unmuted,
 *   email, facebook, linkedIn, telegram, twitter, whatsApp,
 *   arrowLeft, arrowRight, world
 * @params {number} [props.width] - Image width.
 * @params {number} [props.height] - Image height.
 */
export function ThemeIcon({name, width, height}) {
  const theme = useTheme();
  const FallbackIcon = icons[name];
  const themeAsset = theme.assets.icons[name];

  if (!FallbackIcon) {
    throw(new Error(
      `Unknown icon '${name}'. Available options: ${Object.keys(icons).join(', ')}.`
    ));
  }

  if (themeAsset) {
    return <svg width={width} height={height}>
      <use xlinkHref={`${themeAsset}#icon`} />
    </svg>
  }
  else {
    return <FallbackIcon width={width} height={height} />;
  }
}
