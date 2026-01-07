expect.extend({
  toBeVisibleViaBinding(element) {
    const pass = !element.closest('.hidden_via_binding');

    return {
      pass,
      message: () => pass
        ? `expected element to have 'hidden_via_binding' class on itself or ancestors`
        : `expected element not to have 'hidden_via_binding' class on itself or ancestors`
    };
  }
});
