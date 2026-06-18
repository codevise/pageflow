import {createEditor} from 'slate';

import {decorateCommentHighlights} from 'pageflow-scrolled/review';

describe('decorateCommentHighlights', () => {
  it('flags both ends of a highlight within a single text node', () => {
    const editor = createEditor();
    editor.children = [
      {type: 'paragraph', children: [{text: 'Some text to comment on'}]}
    ];

    const decorate = decorateCommentHighlights(editor, [{
      key: '1',
      range: {
        anchor: {path: [0, 0], offset: 5},
        focus: {path: [0, 0], offset: 9}
      }
    }]);

    const [decoration] = decorate([editor.children[0].children[0], [0, 0]]);

    expect(decoration.firstInRange).toBe(true);
    expect(decoration.lastInRange).toBe(true);
  });

  it('flags first and last node separately for a multi node highlight', () => {
    const editor = createEditor();
    editor.children = [
      {type: 'paragraph', children: [{text: 'First paragraph'}]},
      {type: 'paragraph', children: [{text: 'Second paragraph'}]}
    ];

    const decorate = decorateCommentHighlights(editor, [{
      key: '1',
      range: {
        anchor: {path: [0, 0], offset: 2},
        focus: {path: [1, 0], offset: 3}
      }
    }]);

    const [firstDecoration] = decorate([editor.children[0].children[0], [0, 0]]);
    const [lastDecoration] = decorate([editor.children[1].children[0], [1, 0]]);

    expect(firstDecoration.firstInRange).toBe(true);
    expect(firstDecoration.lastInRange).toBeUndefined();

    expect(lastDecoration.firstInRange).toBeUndefined();
    expect(lastDecoration.lastInRange).toBe(true);
  });
});
