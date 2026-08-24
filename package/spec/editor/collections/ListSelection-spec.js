import {ListSelection} from 'pageflow/editor';

import * as support from '$support';

describe('ListSelection', () => {
  const f = support.factories;

  it('adds file which is not selected yet', () => {
    const file = f.file({id: 1});
    const selection = new ListSelection();

    selection.toggle(file);

    expect(selection.includes(file)).toBe(true);
  });

  it('removes file which is selected', () => {
    const file = f.file({id: 1});
    const selection = new ListSelection([file]);

    selection.toggle(file);

    expect(selection.includes(file)).toBe(false);
  });

  // Files of different types can share ids.
  it('tells files with the same id apart', () => {
    const file = f.file({id: 1});
    const otherFile = f.file({id: 1});
    const selection = new ListSelection();

    selection.toggle(file);
    selection.toggle(otherFile);

    expect(selection.length).toEqual(2);
    expect(selection.includes(file)).toBe(true);
    expect(selection.includes(otherFile)).toBe(true);
  });

  it('removes the file it is passed rather than one with the same id', () => {
    const file = f.file({id: 1});
    const otherFile = f.file({id: 1});
    const selection = new ListSelection([file, otherFile]);

    selection.toggle(otherFile);

    expect(selection.models).toEqual([file]);
  });

  describe('#destroyAll', () => {
    it('destroys every selected item', () => {
      const file = f.file({id: 1});
      const otherFile = f.file({id: 2});
      jest.spyOn(file, 'destroy').mockImplementation(() => {});
      jest.spyOn(otherFile, 'destroy').mockImplementation(() => {});
      const selection = new ListSelection([file, otherFile]);

      selection.destroyAll();

      expect(file.destroy).toHaveBeenCalled();
      expect(otherFile.destroy).toHaveBeenCalled();
    });

    it('destroys items which leave the selection along the way', () => {
      const file = f.file({id: 1});
      const otherFile = f.file({id: 2});
      const selection = new ListSelection([file, otherFile]);
      jest.spyOn(file, 'destroy').mockImplementation(() => selection.remove(file));
      jest.spyOn(otherFile, 'destroy').mockImplementation(() => selection.remove(otherFile));

      selection.destroyAll();

      expect(otherFile.destroy).toHaveBeenCalled();
    });
  });
});
