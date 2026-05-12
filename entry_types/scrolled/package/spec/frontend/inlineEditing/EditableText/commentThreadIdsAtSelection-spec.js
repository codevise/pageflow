import {commentThreadIdsAtSelection} from 'frontend/inlineEditing/EditableText/commentThreadIdsAtSelection';

describe('commentThreadIdsAtSelection', () => {
  const blockSelection = (block, offset = 0) => ({
    anchor: {path: [block, 0], offset},
    focus: {path: [block, 0], offset}
  });

  const highlight = (id, block) => ({
    thread: {id},
    range: {
      anchor: {path: [block, 0], offset: 0},
      focus: {path: [block, 0], offset: 4}
    }
  });

  it('returns empty array when selection is null', () => {
    expect(commentThreadIdsAtSelection([highlight(5, 0)], null)).toEqual([]);
  });

  it('returns ids of highlights overlapping the selection block', () => {
    const highlights = [
      highlight(5, 0),
      highlight(6, 0),
      highlight(7, 1)
    ];

    expect(commentThreadIdsAtSelection(highlights, blockSelection(0)))
      .toEqual([5, 6]);
  });

  it('preserves the order from the highlights list', () => {
    const highlights = [
      highlight(7, 1),
      highlight(5, 0),
      highlight(6, 0)
    ];

    expect(commentThreadIdsAtSelection(highlights, blockSelection(0)))
      .toEqual([5, 6]);
  });

  it('skips highlights without a thread (e.g. pending new-thread highlight)', () => {
    const pending = {
      key: 'selection',
      range: {
        anchor: {path: [0, 0], offset: 0},
        focus: {path: [0, 0], offset: 4}
      }
    };

    expect(commentThreadIdsAtSelection([pending, highlight(5, 0)], blockSelection(0)))
      .toEqual([5]);
  });

  it('returns empty array when no highlights overlap', () => {
    expect(commentThreadIdsAtSelection([highlight(5, 0)], blockSelection(2)))
      .toEqual([]);
  });
});
