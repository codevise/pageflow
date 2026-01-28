function toHaveColor(element, color) {
  const colorElement = element.closest('[style]');
  const actualColor = colorElement?.style.color;
  const pass = actualColor === color || actualColor === toRgb(color);

  return {
    pass,
    message: () => pass
      ? `expected element not to have color '${color}' on itself or ancestors`
      : `expected element to have color '${color}' on itself or ancestors, found '${actualColor}'`
  };
}

function toRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (result) {
      result = [null, result[1] + result[1], result[2] + result[2], result[3] + result[3]];
    }
  }

  if (!result) return hex;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgb(${r}, ${g}, ${b})`;
}

expect.extend({toHaveColor});
