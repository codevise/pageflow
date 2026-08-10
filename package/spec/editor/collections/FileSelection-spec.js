import {FileSelection} from 'pageflow/editor';

import * as support from '$support';

describe('FileSelection', () => {
  const f = support.factories;

  it('adds file which is not selected yet', () => {
    const file = f.file({id: 1});
    const selection = new FileSelection();

    selection.toggle(file);

    expect(selection.includes(file)).toBe(true);
  });

  it('removes file which is selected', () => {
    const file = f.file({id: 1});
    const selection = new FileSelection([file]);

    selection.toggle(file);

    expect(selection.includes(file)).toBe(false);
  });

  // Files of different types can share ids.
  it('tells files with the same id apart', () => {
    const file = f.file({id: 1});
    const otherFile = f.file({id: 1});
    const selection = new FileSelection();

    selection.toggle(file);
    selection.toggle(otherFile);

    expect(selection.length).toEqual(2);
    expect(selection.includes(file)).toBe(true);
    expect(selection.includes(otherFile)).toBe(true);
  });

  it('removes the file it is passed rather than one with the same id', () => {
    const file = f.file({id: 1});
    const otherFile = f.file({id: 1});
    const selection = new FileSelection([file, otherFile]);

    selection.toggle(otherFile);

    expect(selection.models).toEqual([file]);
  });
});
