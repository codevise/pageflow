import {act} from '@testing-library/react';

export const fakeIntersectionObserver = {
  byRoot(root) {
    return this.instances.find(intersectionObserver =>
      intersectionObserver.root === root
    );
  }
};

beforeEach(() => {
  fakeIntersectionObserver.instances = new Set();
  fakeIntersectionObserver.observedElements = new Set();
});

global.IntersectionObserver = function(callback, {threshold = 0, root, rootMargin} = {}) {
  if (root && fakeIntersectionObserver.byRoot(root)) {
    throw new Error('Did not except more than one intersection observer per root');
  }

  fakeIntersectionObserver.instances.add(this);
  this.root = root;
  this.rootMargin = rootMargin;

  this.observe = function(target) {
    fakeIntersectionObserver.observedElements.add(target);

    const previousInvokeIntersectionCallback =
      target.invokeIntersectionCallback;

    target.invokeIntersectionCallback = (isIntersecting, filterRootMargin) => {
      if (!filterRootMargin || rootMargin === filterRootMargin) {
        callback([{target, isIntersecting, intersectionRatio: threshold}]);
      }

      if (previousInvokeIntersectionCallback) {
        previousInvokeIntersectionCallback(isIntersecting, filterRootMargin);
      }
    };
  };

  this.unobserve = function(el) {
    fakeIntersectionObserver.observedElements.delete(el);
  };

  this.disconnect = function() {
    fakeIntersectionObserver.instances.delete(this);
  };
};

export function simulateIntersecting(target, {rootMargin} = {}) {
  if (!target.invokeIntersectionCallback) {
    throw new Error(`Intersection observer does not currently observe ${target}.`);
  }

  act(() => target.invokeIntersectionCallback(true, rootMargin));
}

export function simulateNotIntersecting(target, {rootMargin} = {}) {
  if (!target.invokeIntersectionCallback) {
    throw new Error(`Intersection observer does not currently observe ${target}.`);
  }

  act(() => target.invokeIntersectionCallback(false, rootMargin));
}

export function simulateScrollingIntoView(visibleEl) {
  fakeIntersectionObserver.observedElements.forEach(el => {
    if (visibleEl.contains(el) || el.contains(visibleEl)) {
      el.invokeIntersectionCallback(true);
    }
  });
}

export function simulateScrollingOutOfView(hiddenEl) {
  fakeIntersectionObserver.observedElements.forEach(el => {
    if (hiddenEl.contains(el) || el.contains(hiddenEl)) {
      el.invokeIntersectionCallback(false);
    }
  });
}
