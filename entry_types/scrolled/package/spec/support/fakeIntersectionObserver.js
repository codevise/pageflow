const observedElements = new Set();

global.IntersectionObserver = function(callback) {
  return {
    observe(el) {
      observedElements.add(el);

      const previousInvokeIntersectionCallback =
        el.invokeIntersectionCallback;
      
      el.invokeIntersectionCallback = () => {
        callback([{isIntersecting: true}]);

        if (previousInvokeIntersectionCallback) {
          previousInvokeIntersectionCallback();
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
      el.invokeIntersectionCallback();
    }
  });
}
