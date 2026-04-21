import {highlightOverlapsSelection} from 'frontend/inlineEditing/EditableText/highlightOverlapsSelection';

describe('highlightOverlapsSelection', () => {
  const highlight = {
    range: {
      anchor: {path: [1, 0], offset: 5},
      focus: {path: [1, 0], offset: 9}
    }
  };

  it('returns false when selection is null', () => {
    expect(highlightOverlapsSelection(highlight, null)).toBe(false);
  });

  it('returns false when highlight has no range', () => {
    const selection = {
      anchor: {path: [1, 0], offset: 0},
      focus: {path: [1, 0], offset: 0}
    };

    expect(highlightOverlapsSelection({}, selection)).toBe(false);
  });

  it('returns true when selection is in the same top-level block', () => {
    const selection = {
      anchor: {path: [1, 0], offset: 0},
      focus: {path: [1, 0], offset: 0}
    };

    expect(highlightOverlapsSelection(highlight, selection)).toBe(true);
  });

  it('returns false when selection is in a different top-level block', () => {
    const selection = {
      anchor: {path: [0, 0], offset: 0},
      focus: {path: [0, 0], offset: 0}
    };

    expect(highlightOverlapsSelection(highlight, selection)).toBe(false);
  });

  it('returns true when selection is in a block inside a multi-block highlight range', () => {
    const multiBlockHighlight = {
      range: {
        anchor: {path: [1, 0], offset: 0},
        focus: {path: [3, 0], offset: 5}
      }
    };
    const selection = {
      anchor: {path: [2, 0], offset: 0},
      focus: {path: [2, 0], offset: 0}
    };

    expect(highlightOverlapsSelection(multiBlockHighlight, selection)).toBe(true);
  });

  it('returns true for highlight in block within multi-block selection span', () => {
    const selection = {
      anchor: {path: [0, 0], offset: 2},
      focus: {path: [2, 0], offset: 3}
    };

    expect(highlightOverlapsSelection(highlight, selection)).toBe(true);
  });

  it('works when selection anchor/focus are in reverse order', () => {
    const selection = {
      anchor: {path: [2, 0], offset: 3},
      focus: {path: [0, 0], offset: 2}
    };

    expect(highlightOverlapsSelection(highlight, selection)).toBe(true);
  });

  it('excludes the trailing block when selection ends at its start offset', () => {
    const selection = {
      anchor: {path: [0, 0], offset: 0},
      focus: {path: [1, 0], offset: 0}
    };

    expect(highlightOverlapsSelection(highlight, selection)).toBe(false);
  });
});
