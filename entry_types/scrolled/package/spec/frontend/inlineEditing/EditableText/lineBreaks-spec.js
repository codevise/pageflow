/** @jsx jsx */
import {
  decorateLineBreaks,
  withLineBreakNormalization
} from 'frontend/inlineEditing/EditableText/lineBreaks';

import {createHyperscript} from 'slate-hyperscript';

const jsx = createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
  },
});

describe('decorateLineBreaks', () => {
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
});

describe('withLineBreakNormalization', () => {
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
