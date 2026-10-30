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

  describe('#isActive', () => {
    it('is false by default', () => {
      const selection = new ListSelection();

      expect(selection.isActive()).toBe(false);
    });

    it('is true while items are selected', () => {
      const selection = new ListSelection([f.file({id: 1})]);

      expect(selection.isActive()).toBe(true);
    });

    it('is true after start while no items are selected', () => {
      const selection = new ListSelection();

      selection.start();

      expect(selection.isActive()).toBe(true);
    });

    it('is false after stop', () => {
      const selection = new ListSelection([f.file({id: 1})]);

      selection.start();
      selection.stop();

      expect(selection.isActive()).toBe(false);
    });
  });

  describe('#start', () => {
    it('does not trigger event when already started', () => {
      const selection = new ListSelection();
      const listener = jest.fn();
      selection.start();
      selection.on('change:selecting', listener);

      selection.start();

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('#stop', () => {
    it('does not trigger events when not active', () => {
      const selection = new ListSelection();
      const listener = jest.fn();
      selection.on('all', listener);

      selection.stop();

      expect(listener).not.toHaveBeenCalled();
    });
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
