/** @jsx jsx */
import {computeBounds} from 'frontend/inlineEditing/EditableText/computeBounds';

import {createHyperscript} from 'slate-hyperscript';

const h = createHyperscript({
  elements: {
    paragraph: {type: 'paragraph'},
    heading: {type: 'heading'}
  },
});

// Strip meta tags to make deep equality checks work
const jsx = (tagName, attributes, ...children) => {
  delete attributes.__self;
  delete attributes.__source;
  return h(tagName, attributes, ...children);
}

describe('computeBounds', () => {
  it('returns bounds of single selected paragraph', () => {
    const editor = (
      <editor>
        <paragraph>
          Line 1
          <cursor />
        </paragraph>
        <paragraph>
          Line 2
        </paragraph>
      </editor>
    );

    expect(computeBounds(editor)).toEqual([0, 0]);
  });

  it('returns bounds of multiple selected paragraphs', () => {
    const editor = (
      <editor>
        <paragraph>
          <anchor />
          Line 1
        </paragraph>
        <paragraph>
          Line 2
          <focus />
        </paragraph>
        <paragraph>
          Line 3
        </paragraph>
      </editor>
    );

    expect(computeBounds(editor)).toEqual([0, 1]);
  });

  it('returns bounds when selection starts in second paragraph', () => {
    const editor = (
      <editor>
        <paragraph>
          Line 1
        </paragraph>
        <paragraph>
          <anchor />
          Line 2
        </paragraph>
        <paragraph>
          Line 3
          <focus />
        </paragraph>
      </editor>
    );

    expect(computeBounds(editor)).toEqual([1, 2]);
  });

  it('excludes paragraph when focus is at start of next paragraph', () => {
    const editor = (
      <editor>
        <paragraph>
          <anchor />
          Line 1
        </paragraph>
        <paragraph>
          <focus />
          Line 2
        </paragraph>
        <paragraph>
          Line 3
        </paragraph>
      </editor>
    );

    expect(computeBounds(editor)).toEqual([0, 0]);
  });

  it('returns [0, 0] when no selection', () => {
    const editor = (
      <editor>
        <paragraph>
          Line 1
        </paragraph>
      </editor>
    );
    editor.selection = null;

    expect(computeBounds(editor)).toEqual([0, 0]);
  });
});
