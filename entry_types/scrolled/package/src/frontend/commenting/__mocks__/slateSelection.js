let mockRange = null;

export const slateSelection = {
  inEditor() {
    return mockRange;
  },

  async simulateChange(user, el, range) {
    mockRange = range;
    document.dispatchEvent(new Event('selectionchange'));
    await user.pointer({target: el, keys: '[MouseLeft]'});
  }
};

beforeEach(() => {
  mockRange = null;
});
