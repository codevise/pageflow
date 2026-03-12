import {isTranslucentColor} from './utils/isTranslucentColor';

export function splitOverlayStyle({color, backdropBlur}) {
  const style = {};

  if (color) {
    style.backgroundColor = color;
  }

  const blur = resolvedBackdropBlur({color, backdropBlur});

  if (blur > 0) {
    style.backdropFilter = `blur(${blur / 100 * 10}px)`;
  }

  return style;
}

function resolvedBackdropBlur({color, backdropBlur}) {
  if (color && !isTranslucentColor(color)) {
    return 0;
  }

  return backdropBlur ?? 100;
}
