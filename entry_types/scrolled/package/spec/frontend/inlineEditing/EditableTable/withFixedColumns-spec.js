/** @jsx jsx */
import {
  handleTableNavigation,
  withFixedColumns
} from 'frontend/inlineEditing/EditableTable/withFixedColumns';

import {createHyperscript} from 'slate-hyperscript';

export const h = createHyperscript({
  elements: {
    row: {type: 'row'},
    label: {type: 'label'},
    value: {type: 'value'},
    inline: { inline: true }
  },
});

// Strip meta tags to make deep equality checks work
const jsx = (tagName, attributes, ...children) => {
  delete attributes.__self;
  delete attributes.__source;
  return h(tagName, attributes, ...children);
}

describe('withFixedColumns', () => {
  describe('insertBreak', () => {
    it('adds new row when inserting break', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              Name
            </label>
            <value>
              Jane Doe<cursor />
            </value>
          </row>
        </editor>
      );

      editor.insertBreak();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              Name
            </label>
            <value>
              Jane Doe
            </value>
          </row>
          <row>
            <label>
              <text />
            </label>
            <value>
              <text />
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [1, 0, 0], offset: 0},
        focus: {path: [1, 0, 0], offset: 0},
      });
    });

    it('splits content of first cell when inserting break inside cell text', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              Name<cursor />Author
            </label>
            <value>
              Jane Doe
            </value>
          </row>
        </editor>
      );

      editor.insertBreak();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              Name
            </label>
            <value>
              <text />
            </value>
          </row>
          <row>
            <label>
              Author
            </label>
            <value>
              Jane Doe
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [1, 0, 0], offset: 0},
        focus: {path: [1, 0, 0], offset: 0},
      });
    });

    it('splits content of second cell when inserting break inside cell text', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              Name
            </label>
            <value>
              Jane Doe<cursor />Joe Shmoe
            </value>
          </row>
        </editor>
      );

      editor.insertBreak();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              Name
            </label>
            <value>
              Jane Doe
            </value>
          </row>
          <row>
            <label>
              <text />
            </label>
            <value>
              Joe Shmoe
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [1, 1, 0], offset: 0},
        focus: {path: [1, 1, 0], offset: 0},
      });
    });
  });

  describe('deleteBackwards', () => {
    it('can delete backward in first column', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              Nam<cursor />e
            </label>
            <value>
              Jane Doe
            </value>
          </row>
        </editor>
      );

      editor.deleteBackward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              Nae
            </label>
            <value>
              Jane Doe
            </value>
          </row>
        </editor>).children
      );
    });

    it('can delete backward in second column', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              Name
            </label>
            <value>
              Jane<cursor /> Doe
            </value>
          </row>
        </editor>
      );

      editor.deleteBackward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              Name
            </label>
            <value>
              Jan Doe
            </value>
          </row>
        </editor>).children
      );
    });

    it('moves cursor to first column when deleting backward from beginning of second column', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              Name
            </label>
            <value>
              <cursor />Jane Doe
            </value>
          </row>
        </editor>
      );

      editor.deleteBackward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              Name
            </label>
            <value>
              Jane Doe
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [0, 0, 0], offset: 4},
        focus: {path: [0, 0, 0], offset: 4},
      });
    });

    it('moves cursor to end of previous row when deleting backwards from first cell', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              A
            </label>
            <value>
              B
            </value>
          </row>
          <row>
            <label>
              <cursor />C
            </label>
            <value>
              D
            </value>
          </row>
        </editor>
      );

      editor.deleteBackward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              A
            </label>
            <value>
              B
            </value>
          </row>
          <row>
            <label>
              C
            </label>
            <value>
              D
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [0, 1, 0], offset: 1},
        focus: {path: [0, 1, 0], offset: 1},
      });
    });

    it('removes empty previous row when deleting backwards from first cell', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              <text />
            </label>
            <value>
              <text />
            </value>
          </row>
          <row>
            <label>
              <cursor />A
            </label>
            <value>
              B
            </value>
          </row>
        </editor>
      );

      editor.deleteBackward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              A
            </label>
            <value>
              B
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [0, 0, 0], offset: 0},
        focus: {path: [0, 0, 0], offset: 0},
      });
    });

    it('removes empty row when deleting backward from first cell', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              a
            </label>
            <value>
              b
            </value>
          </row>
          <row>
            <label>
              <cursor />
            </label>
            <value>
              <text />
            </value>
          </row>
          <row>
            <label>
              A
            </label>
            <value>
              B
            </value>
          </row>
        </editor>
      );

      editor.deleteBackward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              a
            </label>
            <value>
              b
            </value>
          </row>
          <row>
            <label>
              A
            </label>
            <value>
              B
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [0, 1, 0], offset: 1},
        focus: {path: [0, 1, 0], offset: 1},
      });
    });

    it('makes deleting backward from first cell no-op', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              <cursor />A
            </label>
            <value>
              B
            </value>
          </row>
        </editor>
      );

      editor.deleteBackward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              A
            </label>
            <value>
              B
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [0, 0, 0], offset: 0},
        focus: {path: [0, 0, 0], offset: 0},
      });
    });
  });

  describe('deleteForward', () => {
    it('can delete forward in first column', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              Nam<cursor />e
            </label>
            <value>
              Jane Doe
            </value>
          </row>
        </editor>
      );

      editor.deleteForward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              Nam
            </label>
            <value>
              Jane Doe
            </value>
          </row>
        </editor>).children
      );
    });

    it('can delete forward in at start of first column', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              <cursor />Name
            </label>
            <value>
              Jane Doe
            </value>
          </row>
        </editor>
      );

      editor.deleteForward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              ame
            </label>
            <value>
              Jane Doe
            </value>
          </row>
        </editor>).children
      );
    });

    it('can delete forward in second column', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              Name
            </label>
            <value>
              Jane<cursor /> Doe
            </value>
          </row>
        </editor>
      );

      editor.deleteForward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              Name
            </label>
            <value>
              JaneDoe
            </value>
          </row>
        </editor>).children
      );
    });

    it('moves cursor to second column when deleting forward from end of first column', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              Name<cursor />
            </label>
            <value>
              Jane Doe
            </value>
          </row>
        </editor>
      );

      editor.deleteForward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              Name
            </label>
            <value>
              Jane Doe
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [0, 1, 0], offset: 0},
        focus: {path: [0, 1, 0], offset: 0},
      });
    });

    it('moves cursor to start of next row when deleting forward from second cell', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              A
            </label>
            <value>
              B<cursor />
            </value>
          </row>
          <row>
            <label>
              C
            </label>
            <value>
              D
            </value>
          </row>
        </editor>
      );

      editor.deleteForward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              A
            </label>
            <value>
              B
            </value>
          </row>
          <row>
            <label>
              C
            </label>
            <value>
              D
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [1, 0, 0], offset: 0},
        focus: {path: [1, 0, 0], offset: 0},
      });
    });

    it('removes empty next row when deleting forward from last cell', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              A
            </label>
            <value>
              B<cursor />
            </value>
          </row>
          <row>
            <label>
              <text />
            </label>
            <value>
              <text />
            </value>
          </row>
        </editor>
      );

      editor.deleteForward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              A
            </label>
            <value>
              B
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [0, 1, 0], offset: 1},
        focus: {path: [0, 1, 0], offset: 1},
      });
    });

    it('removes empty row when deleting forward from first cell', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              a
            </label>
            <value>
              b
            </value>
          </row>
          <row>
            <label>
              <cursor />
            </label>
            <value>
              <text />
            </value>
          </row>
          <row>
            <label>
              A
            </label>
            <value>
              B
            </value>
          </row>
        </editor>
      );

      editor.deleteForward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              a
            </label>
            <value>
              b
            </value>
          </row>
          <row>
            <label>
              A
            </label>
            <value>
              B
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [1, 0, 0], offset: 0},
        focus: {path: [1, 0, 0], offset: 0},
      });
    });

    it('removes empty row when deleting forward from first cell of last line', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              a
            </label>
            <value>
              b
            </value>
          </row>
          <row>
            <label>
              <cursor />
            </label>
            <value>
              <text />
            </value>
          </row>
        </editor>
      );

      editor.deleteForward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              a
            </label>
            <value>
              b
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [0, 0, 0], offset: 0},
        focus: {path: [0, 0, 0], offset: 0},
      });
    });

    it('makes deleting forward from first cell of last remaining line no-op', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              <cursor />
            </label>
            <value>
              <text />
            </value>
          </row>
        </editor>
      );

      editor.deleteForward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              <text/>
            </label>
            <value>
              <text/>
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [0, 0, 0], offset: 0},
        focus: {path: [0, 0, 0], offset: 0},
      });
    });

    it('makes deleting forward from last cell no-op', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              A
            </label>
            <value>
              B<cursor />
            </value>
          </row>
        </editor>
      );

      editor.deleteForward();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              A
            </label>
            <value>
              B
            </value>
          </row>
        </editor>).children
      );
      expect(editor.selection).toEqual({
        anchor: {path: [0, 1, 0], offset: 1},
        focus: {path: [0, 1, 0], offset: 1},
      });
    });
  });

  describe('deleteFragment', () => {
    it('does not remove cells when deleting selection across cells', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              Name<anchor />Some
            </label>
            <value>
              Jane <focus />Doe
            </value>
          </row>
        </editor>
      );

      editor.deleteFragment();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              Name
            </label>
            <value>
              Doe
            </value>
          </row>
        </editor>).children
      );
    });

    it('does not remove cells when deleting selection across rows', () => {
      const editor = withFixedColumns(
        <editor>
          <row>
            <label>
              Name<anchor />Some
            </label>
            <value>
              Jane Doe
            </value>
          </row>
          <row>
            <label>
              A
            </label>
            <value>
              B
            </value>
          </row>
          <row>
            <label>
              Other
            </label>
            <value>
              Foo <focus />Content
            </value>
          </row>
        </editor>
      );

      editor.deleteFragment();

      expect(editor.children).toEqual((
        <editor>
          <row>
            <label>
              Name
            </label>
            <value>
              Content
            </value>
          </row>
        </editor>).children
      );
    });
  });
});

  describe('handleTableNavigation', () => {
  it('moves the cursor to the cell above when pressing ArrowUp', () => {
    const editor = withFixedColumns(
      <editor>
        <row>
          <label>Row 1, Col 1</label>
          <value>Row 1, Col 2</value>
        </row>
        <row>
          <label>Row 2, Col 1</label>
          <value>
            Row 2, Col 2<cursor />
          </value>
        </row>
      </editor>
    );

    const event = new KeyboardEvent('keydown', {key: 'ArrowUp'});
    handleTableNavigation(editor, event);

    expect(editor.selection).toEqual({
      anchor: {path: [0, 1, 0], offset: 0},
      focus: {path: [0, 1, 0], offset: 0}
    });
  });

  it('moves the cursor to the cell below when pressing ArrowDown', () => {
    const editor = withFixedColumns(
      <editor>
        <row>
          <label>Row 1, Col 1</label>
          <value>
            Row 1, Col 2<cursor />
          </value>
        </row>
        <row>
          <label>Row 2, Col 1</label>
          <value>Row 2, Col 2</value>
        </row>
      </editor>
    );

    const event = new KeyboardEvent('keydown', {key: 'ArrowDown'});
    handleTableNavigation(editor, event);

    expect(editor.selection).toEqual({
      anchor: {path: [1, 1, 0], offset: 0},
      focus: {path: [1, 1, 0], offset: 0}
    });
  });
});
