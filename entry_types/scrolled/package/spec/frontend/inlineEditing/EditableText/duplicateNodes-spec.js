/** @jsx jsx */
import {duplicateNodes} from 'frontend/inlineEditing/EditableText/duplicateNodes';

import {createHyperscript} from 'slate-hyperscript';

const h = createHyperscript({
  elements: {
    paragraph: {type: 'paragraph'},
    heading: {type: 'heading'},
    blockQuote: {type: 'block-quote'},
    bulletedList: {type: 'bulleted-list'},
    listItem: {type: 'list-item'}
  },
});

// Strip meta tags to make deep equality checks work
const jsx = (tagName, attributes, ...children) => {
  delete attributes.__self;
  delete attributes.__source;
  return h(tagName, attributes, ...children);
}

describe('duplicateNodes', () => {
  it('duplicates single selected paragraph', () => {
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

    duplicateNodes(editor);

    const output = (
      <editor>
        <paragraph>
          Line 1
        </paragraph>
        <paragraph>
          Line 1
        </paragraph>
        <paragraph>
          Line 2
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('duplicates multiple selected paragraphs', () => {
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

    duplicateNodes(editor);

    const output = (
      <editor>
        <paragraph>
          Line 1
        </paragraph>
        <paragraph>
          Line 2
        </paragraph>
        <paragraph>
          Line 1
        </paragraph>
        <paragraph>
          Line 2
        </paragraph>
        <paragraph>
          Line 3
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('preserves node properties when duplicating', () => {
    const editor = (
      <editor>
        <paragraph variant="highlight" color="#444">
          Line 1
          <cursor />
        </paragraph>
      </editor>
    );

    duplicateNodes(editor);

    const output = (
      <editor>
        <paragraph variant="highlight" color="#444">
          Line 1
        </paragraph>
        <paragraph variant="highlight" color="#444">
          Line 1
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('duplicates heading', () => {
    const editor = (
      <editor>
        <heading>
          Title
          <cursor />
        </heading>
        <paragraph>
          Text
        </paragraph>
      </editor>
    );

    duplicateNodes(editor);

    const output = (
      <editor>
        <heading>
          Title
        </heading>
        <heading>
          Title
        </heading>
        <paragraph>
          Text
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('duplicates list as a whole', () => {
    const editor = (
      <editor>
        <bulletedList>
          <listItem>
            Item 1
            <cursor />
          </listItem>
          <listItem>
            Item 2
          </listItem>
        </bulletedList>
      </editor>
    );

    duplicateNodes(editor);

    const output = (
      <editor>
        <bulletedList>
          <listItem>
            Item 1
          </listItem>
          <listItem>
            Item 2
          </listItem>
        </bulletedList>
        <bulletedList>
          <listItem>
            Item 1
          </listItem>
          <listItem>
            Item 2
          </listItem>
        </bulletedList>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('does nothing when no selection', () => {
    const editor = (
      <editor>
        <paragraph>
          Line 1
        </paragraph>
      </editor>
    );
    editor.selection = null;

    duplicateNodes(editor);

    const output = (
      <editor>
        <paragraph>
          Line 1
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('selects duplicated nodes', () => {
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

    duplicateNodes(editor);

    const output = (
      <editor>
        <paragraph>
          Line 1
        </paragraph>
        <paragraph>
          <anchor />Line 1<focus />
        </paragraph>
        <paragraph>
          Line 2
        </paragraph>
      </editor>
    );
    expect(editor.selection).toEqual(output.selection);
  });

  it('selects all duplicated nodes when multiple were selected', () => {
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

    duplicateNodes(editor);

    const output = (
      <editor>
        <paragraph>
          Line 1
        </paragraph>
        <paragraph>
          Line 2
        </paragraph>
        <paragraph>
          <anchor />Line 1
        </paragraph>
        <paragraph>
          Line 2<focus />
        </paragraph>
        <paragraph>
          Line 3
        </paragraph>
      </editor>
    );
    expect(editor.selection).toEqual(output.selection);
  });
});
