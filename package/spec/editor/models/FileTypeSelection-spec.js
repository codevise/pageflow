import {FileTypeSelection} from 'pageflow/editor';

import * as support from '$support';

describe('FileTypeSelection', () => {
  const f = support.factories;

  function file(collectionName) {
    const fileTypes = f.fileTypes(function(builder) {
      builder
        .withImageFileType()
        .withVideoFileType()
        .withTextTrackFileType();
    });
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {[collectionName]: [{id: 1, display_name: 'some file'}]}
    });

    return entry.getFileCollection(collectionName).first();
  }

  it('matches files of all types by default', () => {
    const selection = new FileTypeSelection();

    expect(selection.matches(file('image_files'))).toBe(true);
    expect(selection.matches(file('video_files'))).toBe(true);
  });

  it('matches only files of selected types', () => {
    const selection = new FileTypeSelection();

    selection.toggle('image_files');

    expect(selection.matches(file('image_files'))).toBe(true);
    expect(selection.matches(file('video_files'))).toBe(false);
  });

  it('replaces selection on select', () => {
    const selection = new FileTypeSelection();

    selection.toggle('image_files');
    selection.select(['video_files']);

    expect(selection.isSelected('image_files')).toBe(false);
    expect(selection.isSelected('video_files')).toBe(true);
  });

  it('selects single type on select only', () => {
    const selection = new FileTypeSelection();

    selection.toggle('image_files');
    selection.selectOnly('video_files');

    expect(selection.matches(file('image_files'))).toBe(false);
    expect(selection.matches(file('video_files'))).toBe(true);
  });

  it('matches all types when selecting only the single selected type', () => {
    const selection = new FileTypeSelection();

    selection.selectOnly('video_files');
    selection.selectOnly('video_files');

    expect(selection.get('collectionNames')).toEqual([]);
    expect(selection.matches(file('image_files'))).toBe(true);
  });

  it('keeps selecting single type if other types are selected as well', () => {
    const selection = new FileTypeSelection();

    selection.toggle('image_files');
    selection.toggle('video_files');
    selection.selectOnly('video_files');

    expect(selection.get('collectionNames')).toEqual(['video_files']);
  });

  it('knows whether a type is the only selected one', () => {
    const selection = new FileTypeSelection();

    selection.toggle('image_files');

    expect(selection.isOnlySelected('image_files')).toBe(true);

    selection.toggle('video_files');

    expect(selection.isOnlySelected('image_files')).toBe(false);
  });

  it('combines multiple selected types', () => {
    const selection = new FileTypeSelection();

    selection.toggle('image_files');
    selection.toggle('video_files');

    expect(selection.matches(file('image_files'))).toBe(true);
    expect(selection.matches(file('video_files'))).toBe(true);
  });

  it('deselects type on repeated toggle', () => {
    const selection = new FileTypeSelection();

    selection.toggle('image_files');
    selection.toggle('image_files');

    expect(selection.isSelected('image_files')).toBe(false);
    expect(selection.matches(file('video_files'))).toBe(true);
  });

  it('triggers change event when selection changes', () => {
    const selection = new FileTypeSelection();
    const listener = jest.fn();

    selection.on('change:collectionNames', listener);
    selection.toggle('image_files');

    expect(listener).toHaveBeenCalled();
  });

  describe('with storage key', () => {
    const storageKey = 'pageflow.files_view.file_types';

    afterEach(() => localStorage.removeItem(storageKey));

    it('persists selection', () => {
      const selection = new FileTypeSelection({}, {storageKey});

      selection.toggle('image_files');
      selection.toggle('video_files');

      expect(new FileTypeSelection({}, {storageKey}).get('collectionNames'))
        .toEqual(['image_files', 'video_files']);
    });

    it('restores selection', () => {
      localStorage.setItem(storageKey, 'video_files');

      const selection = new FileTypeSelection({}, {storageKey});

      expect(selection.isSelected('video_files')).toBe(true);
      expect(selection.matches(file('image_files'))).toBe(false);
    });

    it('restores empty selection', () => {
      localStorage.setItem(storageKey, '');

      const selection = new FileTypeSelection({}, {storageKey});

      expect(selection.get('collectionNames')).toEqual([]);
      expect(selection.matches(file('image_files'))).toBe(true);
    });
  });
});
