/** @jsx jsx */
import {
  decorateLineBreaks,
  withLineBreakNormalization
} from 'frontend/inlineEditing/EditableInlineText/lineBreaks';

import {createHyperscript} from 'slate-hyperscript';

const jsx = createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
  },
});

describe('decorateLineBreaks', () => {
  it('creates decoration for empty range after new line', () => {
    const path = [0];
    const nodeEntry = [{text: "Line 1\nLine 2"}, path];

    const decorations = decorateLineBreaks(nodeEntry);

    expect(decorations).toEqual([{
      anchor: {path, offset: 6},
      focus: {path, offset: 6},
      newLine: true
    }]);
  });

  it('creates decoration for shy characters range', () => {
    const path = [0];
    const nodeEntry = [{text: "Story\u00ADtelling soft\u00ADware"}, path];

    const decorations = decorateLineBreaks(nodeEntry);

    expect(decorations).toEqual([
      {
        anchor: {path, offset: 5},
        focus: {path, offset: 6},
        shy: true
      },
      {
        anchor: {path, offset: 18},
        focus: {path, offset: 19},
        shy: true
      }
    ]);
  });

  it('can handle string with both shy characters and new lines', () => {
    const path = [0];
    const nodeEntry = [{text: "Story\u00ADtelling\nwith Pageflow"}, path];

    const decorations = decorateLineBreaks(nodeEntry);

    expect(decorations).toEqual([
      {
        anchor: {path, offset: 5},
        focus: {path, offset: 6},
        shy: true
      },
      {
        anchor: {path, offset: 13},
        focus: {path, offset: 13},
        newLine: true
      }
    ]);
  });
});

describe('withLineBreakNormalization', () => {
  it('merges nodes on insert break', () => {
    const editor = withLineBreakNormalization(
      <editor>
        <block>
          Line 1
          <cursor />
        </block>
      </editor>
    );

    editor.insertBreak();
    editor.insertText('Line 2');

    expect(editor.children.length).toEqual(1);
    expect(editor.children[0].children[0].text).toEqual('Line 1Line 2');
  });

  it('allows inserting new lines as text', () => {
    const editor = withLineBreakNormalization(
      <editor>
        <block>
          Line 1
          <cursor />
        </block>
      </editor>
    );

    editor.insertText('\nLine 2');

    expect(editor.children[0].children[0].text).toEqual('Line 1\nLine 2');
  });

  it('prevents inserting new lines at the beginning', () => {
    const editor = withLineBreakNormalization(
      <editor>
        <block>
          <cursor />Line 1
        </block>
      </editor>
    );

    editor.insertText('\n');

    expect(editor.children[0].children[0].text).toEqual('Line 1');
  });

  it('prevents inserting multiple consecutive new lines', () => {
    const editor = withLineBreakNormalization(
      <editor>
        <block>
          Line 1
          <cursor />
        </block>
      </editor>
    );

    editor.insertText('\n\n\nLine 2');

    expect(editor.children[0].children[0].text).toEqual('Line 1\nLine 2');
  });

  it('allows inserting shy into word', () => {
    const editor = withLineBreakNormalization(
      <editor>
        <block>
          Story<cursor />telling
        </block>
      </editor>
    );

    editor.insertText('\u00AD');

    expect(editor.children[0].children[0].text).toEqual('Story\u00ADtelling');
  });

  it('prevents inserting multiple consecutibe shys', () => {
    const editor = withLineBreakNormalization(
      <editor>
        <block>
          Story<cursor />telling
        </block>
      </editor>
    );

    editor.insertText('\u00AD');
    editor.insertText('\u00AD');

    expect(editor.children[0].children[0].text).toEqual('Story\u00ADtelling');
  });

  it('prevents inserting shy at end of word', () => {
    const editor = withLineBreakNormalization(
      <editor>
        <block>
          Storytelling<cursor /> tool
        </block>
      </editor>
    );

    editor.insertText('\u00AD');

    expect(editor.children[0].children[0].text).toEqual('Storytelling tool');
  });

  it('prevents inserting shy at beginning of word', () => {
    const editor = withLineBreakNormalization(
      <editor>
        <block>
          Storytelling <cursor />tool
        </block>
      </editor>
    );

    editor.insertText('\u00AD');

    expect(editor.children[0].children[0].text).toEqual('Storytelling tool');
  });


  it('prevents inserting shy at beginning', () => {
    const editor = withLineBreakNormalization(
      <editor>
        <block>
          <cursor />Storytelling
        </block>
      </editor>
    );

    editor.insertText('\u00AD');

    expect(editor.children[0].children[0].text).toEqual('Storytelling');
  });
});
