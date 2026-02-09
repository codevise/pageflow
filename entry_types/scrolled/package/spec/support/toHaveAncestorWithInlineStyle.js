expect.extend({
  toHaveAncestorWithInlineStyle(element, styleSubstring) {
    const ancestor = element.closest(`[style*="${styleSubstring}"]`);
    const pass = !!ancestor;

    return {
      pass,
      message: () => pass
        ? `expected element not to have ancestor with inline style '${styleSubstring}'`
        : `expected element to have ancestor with inline style '${styleSubstring}'`
    };
  }
});
