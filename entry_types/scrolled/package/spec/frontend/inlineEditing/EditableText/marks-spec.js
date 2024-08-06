/** @jsx jsx */
import {
  toggleMark,
  isMarkActive
} from 'frontend/inlineEditing/EditableText/marks';

import {createHyperscript} from 'slate-hyperscript';

const h = createHyperscript({
  elements: {
    paragraph: {type: 'paragraph'},
  },
});

// Strip meta tags to make deep equality checks work
const jsx = (tagName, attributes, ...children) => {
  delete attributes.__self;
  delete attributes.__source;
  return h(tagName, attributes, ...children);
}

describe('isMarkActive', () => {
  it('returns true if current node has mark', () => {
    const editor = (
      <editor>
        <paragraph>
          <text bold>Line 1<cursor /></text>
        </paragraph>
      </editor>
    );

    expect(isMarkActive(editor, 'bold')).toEqual(true);
    expect(isMarkActive(editor, 'italic')).toEqual(false);
  });
});

describe('toggleMark', () => {
  it('adds mark', () => {
    const editor = (
      <editor>
        <paragraph>
          Some <anchor />text<focus />
        </paragraph>
      </editor>
    );

    toggleMark(editor, 'bold');

    const output = (
      <editor>
        <paragraph>
          Some <text bold>text</text>
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('removes mark', () => {
    const editor = (
      <editor>
        <paragraph>
          Some <text bold><anchor />text<focus /></text>
        </paragraph>
      </editor>
    );

    toggleMark(editor, 'bold');

    const output = (
      <editor>
        <paragraph>
          Some text
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('treats sub and sup as mutually exclusive', () => {
    const editor = (
      <editor>
        <paragraph>
          Some <text sup><anchor />text<focus /></text>
        </paragraph>
      </editor>
    );

    toggleMark(editor, 'sub');

    const output = (
      <editor>
        <paragraph>
          Some <text sub>text</text>
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });
});
