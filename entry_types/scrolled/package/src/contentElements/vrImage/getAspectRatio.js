import {contentElementWidths} from 'pageflow-scrolled/frontend';

const aspectRatios = {
  wide: 0.5625,
  narrow: 0.75,
  square: 1,
  portrait: 1.7777
};

export function getAspectRatio({configuration, contentElementWidth, portraitOrientation}) {
  const effectiveAspectRatio = portraitOrientation && configuration.portraitAspectRatio
    ? configuration.portraitAspectRatio
    : configuration.aspectRatio;

  if (!effectiveAspectRatio) {
    return getAutoAspectRatio(contentElementWidth);
  }

  return aspectRatios[effectiveAspectRatio] || 0.75;
}

function getAutoAspectRatio(contentElementWidth) {
  return contentElementWidth === contentElementWidths.full ? 0.5 : 0.75;
}