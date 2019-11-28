expect.extend({
  toHaveDescendant(wrapper, selector) {
    if (wrapper.find(selector).length > 0) {
      return {
        message: () =>
          `expected ${wrapper.debug()} not have descendenant '${selector}'`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${wrapper.debug()} have descendenant '${selector}'`,
        pass: false,
      };
    }
  },

  toHaveExactlyOneDescendant(wrapper, selector) {
    var count = wrapper.find(selector).length;

    if (count == 1) {
      return {
        message: () =>
          `expected ${wrapper.debug()} not have exactly one descendenant '${selector}'`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${wrapper.debug()} have exactly one descendenant '${selector}', but has ${count}`,
        pass: false,
      };
    }
  },
});
