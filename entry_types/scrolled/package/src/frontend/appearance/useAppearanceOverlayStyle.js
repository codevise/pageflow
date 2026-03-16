import {useMemo} from 'react';

import {isTranslucentColor} from '../utils/isTranslucentColor';

export function useAppearanceOverlayStyle(section) {
  const {appearance, cardSurfaceColor, splitOverlayColor, overlayBackdropBlur} = section;

  return useMemo(() => {
    if (appearance === 'cards') {
      return overlayStyle(cardSurfaceColor, overlayBackdropBlur);
    }
    else if (appearance === 'split') {
      return overlayStyle(splitOverlayColor, overlayBackdropBlur, true);
    }

    return {};
  }, [appearance, cardSurfaceColor, splitOverlayColor, overlayBackdropBlur]);
}

function overlayStyle(color, backdropBlur, blurByDefault) {
  const style = {};

  if (color) {
    style.backgroundColor = color;
  }

  const blur = resolvedBackdropBlur(color, backdropBlur, blurByDefault);

  if (blur > 0) {
    style.backdropFilter = `blur(${blur / 100 * 10}px)`;
  }

  return style;
}

function resolvedBackdropBlur(color, backdropBlur, blurByDefault) {
  if (blurByDefault) {
    if (color && !isTranslucentColor(color)) {
      return 0;
    }
  }
  else if (!isTranslucentColor(color)) {
    return 0;
  }

  return backdropBlur ?? 100;
}
