/** @jsx jsx */
import {
  getUniformSelectedNode
} from 'frontend/inlineEditing/EditableText/getUniformSelectedNode';

import {createHyperscript} from 'slate-hyperscript';

export const jsx = createHyperscript({
  elements: {
    textBlock: {type: 'textBlock'},
    inlineImage: {type: 'inlineImage'},
  },
});

describe('getUniformSelectedNode', () => {
  it('returs first node if all selected nodes have same property value', () => {
    const editor = (
      <editor>
        <textBlock>
          <anchor />
          Line 1
        </textBlock>
        <textBlock>
          Line 2
          <focus />
        </textBlock>
      </editor>
    );

    const result = getUniformSelectedNode(editor, 'type');

    expect(result).toMatchObject({
      type: 'textBlock',
      children: [{text: 'Line 1'}]
    });
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

    const result = getUniformSelectedNode(editor, 'type');

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

    const result = getUniformSelectedNode(editor, 'type');

    expect(result).toBeNull();
  });
});
