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
import back from './icons/back.svg';

import bluesky from './icons/social/bluesky.svg';
import email from './icons/social/email.svg';
import facebook from './icons/social/facebook.svg';
import linkedIn from './icons/social/linkedIn.svg';
import telegram from './icons/social/telegram.svg';
import threads from './icons/social/threads.svg';
import twitter from './icons/social/twitter.svg';
import whatsApp from './icons/social/whatsApp.svg';

import arrowLeft from './icons/arrowLeft.svg';
import arrowRight from './icons/arrowRight.svg';
import scrollDown from './icons/scrollDown.svg';

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
  back,
  checked,

  bluesky,
  email,
  facebook,
  linkedIn,
  telegram,
  threads,
  twitter,
  whatsApp,

  arrowLeft,
  arrowRight,
  scrollDown,

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
 *   Either: arrowLeft, arrowRight, back, checked, copyright, close, email,
 *   enterFullscreen, exitFullscreen, expand, facebook, gear, information,
 *   linkedIn, menu, muted, pause, play, share, telegram,
 *   textTracks, twitter, unmuted, world, whatsApp,
 *   arrowLeft, arrowRight, scrollDown, world
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
