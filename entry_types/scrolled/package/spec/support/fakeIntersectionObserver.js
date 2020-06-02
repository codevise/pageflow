const observedElements = new Set();

global.IntersectionObserver = function(callback) {
  return {
    observe(el) {
      observedElements.add(el);

      const previousInvokeIntersectionCallback =
        el.invokeIntersectionCallback;

      el.invokeIntersectionCallback = (isIntersecting) => {
        callback([{isIntersecting}]);

        if (previousInvokeIntersectionCallback) {
          previousInvokeIntersectionCallback(isIntersecting);
        }
      };
    },

    unobserve(el) {
      observedElements.delete(el);
    }
  };
};

export function simulateScrollingIntoView(visibleEl) {
  observedElements.forEach(el => {
    if (visibleEl.contains(el) || el.contains(visibleEl)) {
      el.invokeIntersectionCallback(true);
    }
  });
}

export function simulateScrollingOutOfView(hiddenEl) {
  observedElements.forEach(el => {
    if (hiddenEl.contains(el) || el.contains(hiddenEl)) {
      el.invokeIntersectionCallback(false);
    }
  });
}
