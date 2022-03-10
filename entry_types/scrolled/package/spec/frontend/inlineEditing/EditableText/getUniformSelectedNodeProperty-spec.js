/** @jsx jsx */
import {
  getUniformSelectedNodeProperty
} from 'frontend/inlineEditing/EditableText/getUniformSelectedNodeProperty';

import {createHyperscript} from 'slate-hyperscript';

export const jsx = createHyperscript({
  elements: {
    textBlock: {type: 'textBlock'},
    inlineImage: {type: 'inlineImage'},
  },
});

describe('getUniformSelectedNodeProperty', () => {
  it('returs node property value if all selected nodes have same value', () => {
    const editor = (
      <editor>
        <textBlock>
          Line 1
          <cursor />
        </textBlock>
      </editor>
    );

    const result = getUniformSelectedNodeProperty(editor, 'type');

    expect(result).toEqual('textBlock');
  });

  it('returs null if nodes with different property values are selected', () => {
    const editor = (
      <editor>
        <textBlock>
          Line 1
          <anchor />
        </textBlock>
        <inlineImage />
        <textBlock>
          Line 2
          <focus />
        </textBlock>
      </editor>
    );

    const result = getUniformSelectedNodeProperty(editor, 'type');

    expect(result).toBeNull();
  });

  it('returs null if nothing is selected', () => {
    const editor = (
      <editor>
        <textBlock>
          Line 1
        </textBlock>
        <inlineImage />
        <textBlock>
          Line 2
        </textBlock>
      </editor>
    );

    const result = getUniformSelectedNodeProperty(editor, 'type');

    expect(result).toBeNull();
  });
});
