import {rangeOverlapsSelection} from 'frontend/inlineEditing/EditableText/rangeOverlapsSelection';

describe('rangeOverlapsSelection', () => {
  const range = {
    anchor: {path: [1, 0], offset: 5},
    focus: {path: [1, 0], offset: 9}
  };

  it('returns false when selection is null', () => {
    expect(rangeOverlapsSelection(range, null)).toBe(false);
  });

  it('returns false without a range', () => {
    const selection = {
      anchor: {path: [1, 0], offset: 0},
      focus: {path: [1, 0], offset: 0}
    };

    expect(rangeOverlapsSelection(null, selection)).toBe(false);
  });

  it('returns true when selection is in the same top-level block', () => {
    const selection = {
      anchor: {path: [1, 0], offset: 0},
      focus: {path: [1, 0], offset: 0}
    };

    expect(rangeOverlapsSelection(range, selection)).toBe(true);
  });

  it('returns false when selection is in a different top-level block', () => {
    const selection = {
      anchor: {path: [0, 0], offset: 0},
      focus: {path: [0, 0], offset: 0}
    };

    expect(rangeOverlapsSelection(range, selection)).toBe(false);
  });

  it('returns false when selection is in a middle block of a multi-block range', () => {
    const multiBlockRange = {
      anchor: {path: [1, 0], offset: 0},
      focus: {path: [3, 0], offset: 5}
    };
    const selection = {
      anchor: {path: [2, 0], offset: 0},
      focus: {path: [2, 0], offset: 0}
    };

    expect(rangeOverlapsSelection(multiBlockRange, selection)).toBe(false);
  });

  it('returns true when selection is in the same block as a multi-block range start', () => {
    const multiBlockRange = {
      anchor: {path: [1, 0], offset: 0},
      focus: {path: [3, 0], offset: 5}
    };
    const selection = {
      anchor: {path: [1, 0], offset: 2},
      focus: {path: [1, 0], offset: 2}
    };

    expect(rangeOverlapsSelection(multiBlockRange, selection)).toBe(true);
  });

  it('returns true for a range in a block within multi-block selection span', () => {
    const selection = {
      anchor: {path: [0, 0], offset: 2},
      focus: {path: [2, 0], offset: 3}
    };

    expect(rangeOverlapsSelection(range, selection)).toBe(true);
  });

  it('works when selection anchor/focus are in reverse order', () => {
    const selection = {
      anchor: {path: [2, 0], offset: 3},
      focus: {path: [0, 0], offset: 2}
    };

    expect(rangeOverlapsSelection(range, selection)).toBe(true);
  });

  it('excludes the trailing block when selection ends at its start offset', () => {
    const selection = {
      anchor: {path: [0, 0], offset: 0},
      focus: {path: [1, 0], offset: 0}
    };

    expect(rangeOverlapsSelection(range, selection)).toBe(false);
  });
});
