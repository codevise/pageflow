import React, {useState} from 'react';
import {createEditor, Transforms} from 'slate';
import {Slate, withReact} from 'slate-react';

import {SelectionAwareLinkTooltipProvider} from 'frontend/inlineEditing/EditableText/SelectionAwareLinkTooltipProvider';
import {LinkPreview} from 'frontend/inlineEditing/LinkTooltip';

import {act, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

describe('SelectionAwareLinkTooltipProvider', () => {
  beforeEach(() => {
    const rect = {width: 100, height: 20, top: 100, left: 100, bottom: 120, right: 200, x: 100, y: 100};
    Element.prototype.getClientRects = jest.fn(() => [rect]);
    Element.prototype.getBoundingClientRect = jest.fn(() => rect);
  });

  function renderWithEditor() {
    const editor = withReact(createEditor());

    function TestEditor() {
      const [value, setValue] = useState([
        {type: 'paragraph', children: [{text: 'Some text'}]}
      ]);

      return (
        <Slate editor={editor} value={value} onChange={setValue}>
          <SelectionAwareLinkTooltipProvider>
            <LinkPreview href="https://example.com">A link</LinkPreview>
          </SelectionAwareLinkTooltipProvider>
        </Slate>
      );
    }

    return {editor, ...render(<TestEditor />)};
  }

  async function select(editor, anchorOffset, focusOffset) {
    await act(async () => {
      Transforms.select(editor, {
        anchor: {path: [0, 0], offset: anchorOffset},
        focus: {path: [0, 0], offset: focusOffset}
      });
    });
  }

  it('does not display tooltip while text is selected', async () => {
    const {editor, getByText, queryByRole} = renderWithEditor();

    await select(editor, 0, 4);
    const user = userEvent.setup();
    await user.hover(getByText('A link'));

    expect(queryByRole('link')).toBeNull();
  });

  it('displays tooltip once selection is collapsed', async () => {
    const {editor, getByText, queryByRole} = renderWithEditor();

    await select(editor, 0, 4);
    await select(editor, 2, 2);
    const user = userEvent.setup();
    await user.hover(getByText('A link'));

    expect(queryByRole('link')).toHaveAttribute('href', 'https://example.com');
  });
});
