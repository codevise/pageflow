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

export function simulateScrollingIntoView(parent) {
  observedElements.forEach(el => {
    if (parent.contains(el)) {
      el.invokeIntersectionCallback();
    }
  });
}
