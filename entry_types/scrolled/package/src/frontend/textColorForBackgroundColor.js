import invert from 'invert-color';

export function textColorForBackgroundColor(hex) {
  return invert(hex, true);
}
