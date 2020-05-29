const observedElements = new Set();

global.IntersectionObserver = function(callback) {
  return {
    observe(el) {
      observedElements.add(el);

      el.invokeIntersectionCallback = () => {
        callback([{isIntersecting: true}]);
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
