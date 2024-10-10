import React from 'react';

import information from './icons/information.svg';
import muted from './icons/muted.svg';
import share from './icons/share.svg';
import unmuted from './icons/unmuted.svg';
import gear from './icons/gear.svg';
import textTracks from './icons/textTracks.svg';
import copyright from './icons/copyright.svg';
import world from './icons/world.svg';
import close from './icons/close.svg';
import checked from './icons/checked.svg';

import email from './icons/social/email.svg';
import facebook from './icons/social/facebook.svg';
import linkedIn from './icons/social/linkedIn.svg';
import telegram from './icons/social/telegram.svg';
import twitter from './icons/social/twitter.svg';
import whatsApp from './icons/social/whatsApp.svg';

import arrowLeft from './icons/arrowLeft.svg';
import arrowRight from './icons/arrowRight.svg';

import enterFullscreen from './icons/enterFullscreen.svg';
import exitFullscreen from './icons/exitFullscreen.svg';

import play from './icons/play.svg';
import pause from './icons/pause.svg';

import {useTheme} from '../entryState';

const icons = {
  expand: arrowRight,
  information,
  muted,
  share,
  unmuted,
  gear,
  textTracks,
  copyright,
  world,
  close,
  checked,

  email,
  facebook,
  linkedIn,
  telegram,
  twitter,
  whatsApp,

  arrowLeft,
  arrowRight,

  enterFullscreen,
  exitFullscreen,

  play,
  pause
};

/**
 * Render an SVG icon that can be customized in themes.
 *
 * @param {Object} props
 * @param {string} props.name -
 *   Either: arrowLeft, arrowRight, checked, copyright, close, email,
 *   enterFullscreen, exitFullscreen, expand, facebook, gear, information,
 *   linkedIn, menu, muted, pause, play, share, telegram,
 *   textTracks, twitter, unmuted, world, whatsApp,
 *   arrowLeft, arrowRight, world
 * @params {number} [props.width] - Image width.
 * @params {number} [props.height] - Image height.
 */
export function ThemeIcon({name, width, height, renderFallback}) {
  const theme = useTheme();
  const FallbackIcon = icons[name];
  const themeAsset = theme.assets.icons[name];

  if (!FallbackIcon && !renderFallback) {
    throw(new Error(
      `Unknown icon '${name}'. Available options: ${Object.keys(icons).join(', ')}.`
    ));
  }

  if (themeAsset) {
    return <svg width={width} height={height}>
      <use xlinkHref={`${themeAsset}#icon`} />
    </svg>
  }
  else if (renderFallback) {
    return renderFallback();
  }
  else {
    return <FallbackIcon width={width} height={height} />;
  }
}
