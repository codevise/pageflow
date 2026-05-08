/** @jsx jsx */
import {newCommentThreadSubjectRange}
  from 'frontend/inlineEditing/EditableText/newCommentThreadSubjectRange';

import {createHyperscript} from 'slate-hyperscript';

const h = createHyperscript({
  elements: {paragraph: {type: 'paragraph'}}
});

const jsx = (tagName, attributes, ...children) => {
  delete attributes.__self;
  delete attributes.__source;
  return h(tagName, attributes, ...children);
};

describe('newCommentThreadSubjectRange', () => {
  it('returns undefined when there is no selection', () => {
    const editor = (
      <editor>
        <paragraph>Some text</paragraph>
      </editor>
    );

    expect(newCommentThreadSubjectRange(editor)).toBeUndefined();
  });

  it("returns the surrounding block's range when selection is collapsed", () => {
    const editor = (
      <editor>
        <paragraph>First</paragraph>
        <paragraph>Second<cursor /></paragraph>
      </editor>
    );

    expect(newCommentThreadSubjectRange(editor)).toEqual({
      anchor: {path: [1, 0], offset: 0},
      focus: {path: [1, 0], offset: 6}
    });
  });

  it('returns the editor selection when expanded', () => {
    const editor = (
      <editor>
        <paragraph>
          <anchor />First<focus />
        </paragraph>
      </editor>
    );

    expect(newCommentThreadSubjectRange(editor)).toEqual({
      anchor: {path: [0, 0], offset: 0},
      focus: {path: [0, 0], offset: 5}
    });
  });
});
