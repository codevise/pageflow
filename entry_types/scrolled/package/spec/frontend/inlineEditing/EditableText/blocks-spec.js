/** @jsx jsx */
import {
  applyTypographyVariant,
  applyTypographySize,
  applyColor,
  applyTextAlign,
  isBlockActive,
  toggleBlock,
  withBlockNormalization
} from 'frontend/inlineEditing/EditableText/blocks';

import {Transforms} from 'slate';
import {createHyperscript} from 'slate-hyperscript';

const h = createHyperscript({
  elements: {
    paragraph: {type: 'paragraph'},
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

describe('isBlockActive', () => {
  it('returns true if current node has type', () => {
    const editor = (
      <editor>
        <blockQuote>
          Line 1
          <cursor />
        </blockQuote>
      </editor>
    );

    expect(isBlockActive(editor, 'block-quote')).toEqual(true);
    expect(isBlockActive(editor, 'paragraph')).toEqual(false);
  });
});

describe('toggleBlock', () => {
  it('toggles type', () => {
    const editor = (
      <editor>
        <paragraph>
          Line 1
          <cursor />
        </paragraph>
      </editor>
    );

    toggleBlock(editor, 'block-quote');

    const output = (
      <editor>
        <blockQuote>
          Line 1
        </blockQuote>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('unwraps lists when toggled to paragraph', () => {
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

    toggleBlock(editor, 'paragraph');

    const output = (
      <editor>
        <paragraph>
          Item 1
        </paragraph>
        <bulletedList>
          <listItem>
            Item 2
          </listItem>
        </bulletedList>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('wraps lists', () => {
    const editor = (
      <editor>
        <paragraph>
          <anchor />
          Item 1
        </paragraph>
        <paragraph>
          Item 2
          <focus />
        </paragraph>
      </editor>
    );

    toggleBlock(editor, 'bulleted-list');

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
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('preserves typography variant when unwrapping list', () => {
    const editor = (
      <editor>
        <bulletedList>
          <listItem variant="sm">
            Item 1
            <cursor />
          </listItem>
        </bulletedList>
      </editor>
    );

    toggleBlock(editor, 'paragraph');

    const output = (
      <editor>
        <paragraph variant="sm">
          Item 1
          <cursor />
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('applies typography variant of first selected node when wrapping lists', () => {
    const editor = (
      <editor>
        <paragraph variant="sm">
          <anchor />
          Item 1
        </paragraph>
        <paragraph>
          Item 1
          <focus />
        </paragraph>
      </editor>
    );

    toggleBlock(editor, 'bulleted-list');

    const output = (
      <editor>
        <bulletedList variant="sm">
          <listItem variant="sm">
            Item 1
          </listItem>
          <listItem>
            Item 1
          </listItem>
        </bulletedList>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('preserves color property when unwrapping list', () => {
    const editor = (
      <editor>
        <bulletedList>
          <listItem color="#444">
            Item 1
            <cursor />
          </listItem>
        </bulletedList>
      </editor>
    );

    toggleBlock(editor, 'paragraph');

    const output = (
      <editor>
        <paragraph color="#444">
          Item 1
          <cursor />
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('applies color of first selected node when wrapping lists', () => {
    const editor = (
      <editor>
        <paragraph color="#444">
          <anchor />
          Item 1
        </paragraph>
        <paragraph>
          Item 1
          <focus />
        </paragraph>
      </editor>
    );

    toggleBlock(editor, 'bulleted-list');

    const output = (
      <editor>
        <bulletedList color="#444">
          <listItem color="#444">
            Item 1
          </listItem>
          <listItem>
            Item 1
          </listItem>
        </bulletedList>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });
});

describe('applyTypographyVariant', () => {
  it('sets variant property deeply in lists', () => {
    const editor = (
      <editor>
        <bulletedList>
          <listItem>
            Item 1
            <cursor />
          </listItem>
          <listItem>
            Item 1
          </listItem>
        </bulletedList>
      </editor>
    );

    applyTypographyVariant(editor, 'highlight');

    const output = (
      <editor>
        <bulletedList variant="highlight">
          <listItem variant="highlight">
            Item 1
          </listItem>
          <listItem variant="highlight">
            Item 1
          </listItem>
        </bulletedList>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('sets variant property of elements of same type', () => {
    const editor = (
      <editor>
        <paragraph>
          <anchor />
          Text
        </paragraph>
        <paragraph>
          More Text
          <focus />
        </paragraph>
        <paragraph>
          Other Text
        </paragraph>
      </editor>
    );

    applyTypographyVariant(editor, 'highlight');

    const output = (
      <editor>
        <paragraph variant="highlight">
          Text
        </paragraph>
        <paragraph variant="highlight">
          More Text
        </paragraph>
        <paragraph>
          Other Text
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('unsets variant property if blank', () => {
    const editor = (
      <editor>
        <paragraph variant="highlight">
          <cursor />
          Text
        </paragraph>
      </editor>
    );

    applyTypographyVariant(editor, undefined);

    const output = (
      <editor>
        <paragraph>
          Text
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });
});

describe('applyTypographySize', () => {
  it('sets size property of elements of same type', () => {
    const editor = (
      <editor>
        <paragraph>
          <anchor />
          Text
        </paragraph>
        <paragraph>
          More Text
          <focus />
        </paragraph>
        <paragraph>
          Other Text
        </paragraph>
      </editor>
    );

    applyTypographySize(editor, 'sm');

    const output = (
      <editor>
        <paragraph size="sm">
          Text
        </paragraph>
        <paragraph size="sm">
          More Text
        </paragraph>
        <paragraph>
          Other Text
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('unsets variant property if blank', () => {
    const editor = (
      <editor>
        <paragraph size="sm">
          <cursor />
          Text
        </paragraph>
      </editor>
    );

    applyTypographySize(editor, undefined);

    const output = (
      <editor>
        <paragraph>
          Text
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });
});

describe('applyColor', () => {
  it('sets color property deeply in lists', () => {
    const editor = (
      <editor>
        <bulletedList>
          <listItem>
            Item 1
            <cursor />
          </listItem>
          <listItem>
            Item 1
          </listItem>
        </bulletedList>
      </editor>
    );

    applyColor(editor, '#444');

    const output = (
      <editor>
        <bulletedList color="#444">
          <listItem color="#444">
            Item 1
          </listItem>
          <listItem color="#444">
            Item 1
          </listItem>
        </bulletedList>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('sets color property of elements of same type', () => {
    const editor = (
      <editor>
        <paragraph>
          <anchor />
          Text
        </paragraph>
        <paragraph>
          More Text
          <focus />
        </paragraph>
        <paragraph>
          Other Text
        </paragraph>
      </editor>
    );

    applyColor(editor, '#444');

    const output = (
      <editor>
        <paragraph color="#444">
          Text
        </paragraph>
        <paragraph color="#444">
          More Text
        </paragraph>
        <paragraph>
          Other Text
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('unsets color property if blank', () => {
    const editor = (
      <editor>
        <paragraph color="#444">
          <cursor />
          Text
        </paragraph>
      </editor>
    );

    applyColor(editor, undefined);

    const output = (
      <editor>
        <paragraph>
          Text
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });
});

describe('applyTextAlign', () => {
  it('sets color property deeply in lists', () => {
    const editor = (
      <editor>
        <bulletedList>
          <listItem>
            Item 1
            <cursor />
          </listItem>
          <listItem>
            Item 1
          </listItem>
        </bulletedList>
      </editor>
    );

    applyTextAlign(editor, 'justify');

    const output = (
      <editor>
        <bulletedList textAlign="justify">
          <listItem textAlign="justify">
            Item 1
          </listItem>
          <listItem textAlign="justify">
            Item 1
          </listItem>
        </bulletedList>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('sets textAlign property of multiple elements', () => {
    const editor = (
      <editor>
        <paragraph>
          <anchor />
          Text
        </paragraph>
        <paragraph>
          More Text
          <focus />
        </paragraph>
        <paragraph>
          Other Text
        </paragraph>
      </editor>
    );

    applyTextAlign(editor, 'justify');

    const output = (
      <editor>
        <paragraph textAlign="justify">
          Text
        </paragraph>
        <paragraph textAlign="justify">
          More Text
        </paragraph>
        <paragraph>
          Other Text
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('unsets textAlign property if set to ragged', () => {
    const editor = (
      <editor>
        <paragraph textAlign="justify">
          <cursor />
          Text
        </paragraph>
      </editor>
    );

    applyTextAlign(editor, 'ragged');

    const output = (
      <editor>
        <paragraph>
          Text
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });

  it('unsets textAlign property if blank', () => {
    const editor = (
      <editor>
        <paragraph textAlign="justify">
          <cursor />
          Text
        </paragraph>
      </editor>
    );

    applyTextAlign(editor, undefined);

    const output = (
      <editor>
        <paragraph>
          Text
        </paragraph>
      </editor>
    );
    expect(editor.children).toEqual(output.children);
  });
});

describe('withBlockNormalization', () => {
  describe('with onlyParagraphs false', () => {
    it('is no-op by default', () => {
      const editor = withBlockNormalization(
        {},
        <editor>
          <paragraph>
            Line 1
            <cursor />
          </paragraph>
        </editor>
      );

      Transforms.insertNodes(
        editor,
        <blockQuote>Some quote</blockQuote>
      );

      const output = (
        <editor>
          <paragraph>
            Line 1
          </paragraph>
          <blockQuote>
            Some quote
            <cursor />
          </blockQuote>
        </editor>
      );
      expect(editor.children).toEqual(output.children);
    });
  });

  describe('with onlyParagraphs true', () => {
    it('turns blocks over other types into paragraphs', () => {
      const editor = withBlockNormalization(
        {onlyParagraphs: true},
        <editor>
          <paragraph>
            Line 1
            <cursor />
          </paragraph>
        </editor>
      );

      Transforms.insertNodes(
        editor,
        <blockQuote>Some quote</blockQuote>
      );

      const output = (
        <editor>
          <paragraph>
            Line 1
          </paragraph>
          <paragraph>
            Some quote
            <cursor />
          </paragraph>
        </editor>
      );
      expect(editor.children).toEqual(output.children);
    });

    it('turns list into paragraphs', () => {
      const editor = withBlockNormalization(
        {onlyParagraphs: true},
        <editor>
          <paragraph>
            Line 1
            <cursor />
          </paragraph>
        </editor>
      );

      Transforms.insertNodes(
        editor,
        <bulletedList>
          <listItem>
            Item 1
            <cursor />
          </listItem>
          <listItem>
            Item 2
          </listItem>
        </bulletedList>
      );

      const output = (
        <editor>
          <paragraph>
            Line 1
          </paragraph>
          <paragraph>
            Item 1
          </paragraph>
          <paragraph>
            Item 2
            <cursor />
          </paragraph>
        </editor>
      );
      expect(editor.children).toEqual(output.children);
    });
  });
});
