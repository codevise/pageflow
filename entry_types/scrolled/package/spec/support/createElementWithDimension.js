export function createElementWithDimension({
  offsetLeft = 0, offsetTop = 0,
  offsetParentHeight = 100,
  width = 100, height = 100,
  viewportLeft = 0, viewportTop = 0
}) {
  const el = document.createElement('div');

  el.getBoundingClientRect = function() {
    const left = typeof viewportLeft === 'function' ? viewportLeft() : viewportLeft;
    const top = typeof viewportTop === 'function' ? viewportTop() : viewportTop;

    return {
      left,
      top,
      right: left + width,
      bottom: top + height,
      width,
      height
    }
  };

  Object.defineProperties(el, {
    offsetLeft: {
      get() { return offsetLeft; }
    },
    offsetTop: {
      get() { return offsetTop; }
    },
    offsetWidth: {
      get() { return width; }
    },
    offsetHeight: {
      get() { return height; }
    },

    offsetParent: {
      get() {
        return {
          offsetHeight: offsetParentHeight
        };
      }
    }
  });

  return el;
}
