import {FilesView, editor} from 'pageflow/editor';

import * as support from '$support';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('FilesView', () => {
  const f = support.factories;

  beforeEach(() => {
    localStorage.clear();
    editor.router = {navigate: jest.fn()};
  });

  support.useFakeTranslations({
    'pageflow.editor.files.tabs.image_files': 'Images',
    'pageflow.editor.files.tabs.video_files': 'Videos',
    'pageflow.editor.views.file_type_pills_view.group_label': 'Filter by file type',
    'pageflow.editor.views.files_view.add': 'Add file',
    'pageflow.editor.views.files_view.tabs.files': 'Files'
  });

  function entryWithFiles({imageFileTypeOptions} = {}) {
    editor.fileTypes = f.fileTypes(function() {
      this.withImageFileType(imageFileTypeOptions);
      this.withVideoFileType();
      this.withAudioFileType();
      this.withTextTrackFileType();
    });

    return f.entry({}, {
      fileTypes: editor.fileTypes,
      filesAttributes: {
        image_files: [{id: 1, display_name: 'image.png'}],
        video_files: [{id: 1, display_name: 'video.mp4'}]
      }
    });
  }

  function fileNames(queries) {
    return queries.queryAllByText(/\.(png|mp4)$/).map(el => el.textContent);
  }

  it('renders files tab', () => {
    const view = new FilesView({model: entryWithFiles()});

    const {getByRole} = render(view);

    expect(getByRole('tab', {name: 'Files'})).not.toBeNull();
  });

  it('renders files of all top level file types', () => {
    const view = new FilesView({model: entryWithFiles()});

    const queries = render(view);

    expect(fileNames(queries)).toEqual(['image.png', 'video.mp4']);
  });

  it('renders pill per top level file type', () => {
    const view = new FilesView({model: entryWithFiles()});

    const {getByRole} = render(view);

    expect(getByRole('button', {name: 'Images'})).not.toBeNull();
    expect(getByRole('button', {name: 'Videos'})).not.toBeNull();
  });

  it('selects file type from route', () => {
    const view = new FilesView({model: entryWithFiles(), fileTypeName: 'video_files'});

    const queries = render(view);

    expect(fileNames(queries)).toEqual(['video.mp4']);
    expect(queries.getByRole('button', {name: 'Videos'}))
      .toHaveAttribute('aria-pressed', 'true');
  });

  it('ignores stored file types without files', () => {
    localStorage.setItem('pageflow.files_view.file_types', 'audio_files');

    const view = new FilesView({model: entryWithFiles()});

    const queries = render(view);

    expect(fileNames(queries)).toEqual(['image.png', 'video.mp4']);
  });

  it('deselects file type when its last file is removed', () => {
    const entry = entryWithFiles();
    const view = new FilesView({model: entry, fileTypeName: 'image_files'});

    const queries = render(view);

    expect(fileNames(queries)).toEqual(['image.png']);

    const imageFiles = entry.getFileCollection('image_files');
    imageFiles.remove(imageFiles.first());

    expect(fileNames(queries)).toEqual(['video.mp4']);
  });

  it('ignores stored file types which are not available', () => {
    localStorage.setItem('pageflow.files_view.file_types', 'gone_files');

    const view = new FilesView({model: entryWithFiles()});

    const queries = render(view);

    expect(fileNames(queries)).toEqual(['image.png', 'video.mp4']);
  });

  describe('in selection mode', () => {
    const selectionHandler = {
      call: jest.fn(),
      getReferer: () => '/'
    };

    it('only renders files of requested file type', () => {
      const view = new FilesView({
        model: entryWithFiles(),
        fileTypeName: 'image_files',
        selectionHandler
      });

      const queries = render(view);

      expect(fileNames(queries)).toEqual(['image.png']);
    });

    it('ignores stored file type selection', () => {
      localStorage.setItem('pageflow.files_view.file_types', 'video_files');

      const view = new FilesView({
        model: entryWithFiles(),
        fileTypeName: 'image_files',
        selectionHandler
      });

      const queries = render(view);

      expect(fileNames(queries)).toEqual(['image.png']);
    });

    it('renders pills', () => {
      const view = new FilesView({
        model: entryWithFiles(),
        fileTypeName: 'image_files',
        selectionHandler
      });

      const {getByRole} = render(view);

      expect(getByRole('button', {name: 'Videos'})).not.toBeNull();
    });

    it('leaves selection mode when another file type is selected', async () => {
      const view = new FilesView({
        model: entryWithFiles(),
        fileTypeName: 'image_files',
        selectionHandler
      });
      const user = userEvent.setup();

      const {getByRole} = render(view);
      await user.click(getByRole('button', {name: 'Videos'}));

      expect(editor.router.navigate).toHaveBeenCalledWith('/files', {trigger: true});
    });

    it('leaves selection mode when requested file type is combined with another', async () => {
      const view = new FilesView({
        model: entryWithFiles(),
        fileTypeName: 'image_files',
        selectionHandler
      });
      const user = userEvent.setup();

      const {getByRole} = render(view);
      await user.keyboard('{Control>}');
      await user.click(getByRole('button', {name: 'Videos'}));
      await user.keyboard('{/Control}');

      expect(editor.router.navigate).toHaveBeenCalledWith('/files', {trigger: true});
    });

    it('stays in selection mode when last file of requested type is removed', () => {
      const entry = entryWithFiles();
      const view = new FilesView({
        model: entry,
        fileTypeName: 'image_files',
        selectionHandler
      });

      const queries = render(view);
      const imageFiles = entry.getFileCollection('image_files');
      imageFiles.remove(imageFiles.first());

      expect(fileNames(queries)).toEqual([]);
      expect(editor.router.navigate).not.toHaveBeenCalled();
    });

    it('stays in selection mode if no file type was requested', async () => {
      const view = new FilesView({
        model: entryWithFiles(),
        allowSelectingAny: true,
        selectionHandler
      });
      const user = userEvent.setup();

      const queries = render(view);

      expect(fileNames(queries)).toEqual(['image.png', 'video.mp4']);

      await user.click(queries.getByRole('button', {name: 'Videos'}));

      expect(fileNames(queries)).toEqual(['video.mp4']);
      expect(editor.router.navigate).not.toHaveBeenCalled();
    });

    it('stays in selection mode if any file type may be selected', async () => {
      const view = new FilesView({
        model: entryWithFiles(),
        fileTypeName: 'image_files',
        allowSelectingAny: true,
        selectionHandler
      });
      const user = userEvent.setup();

      const {getByRole} = render(view);
      await user.click(getByRole('button', {name: 'Videos'}));

      expect(editor.router.navigate).not.toHaveBeenCalled();
    });

    it('restricts list to file type of named filter', () => {
      const entry = entryWithFiles({
        imageFileTypeOptions: {
          filters: [{name: 'with_projection', matches: () => true}]
        }
      });

      const view = new FilesView({
        model: entry,
        fileTypeName: 'image_files',
        filterName: 'with_projection',
        selectionHandler
      });

      const queries = render(view);

      expect(fileNames(queries)).toEqual(['image.png']);
    });

    it('renders files of all file types if any may be selected', async () => {
      const view = new FilesView({
        model: entryWithFiles(),
        fileTypeName: 'image_files',
        allowSelectingAny: true,
        selectionHandler
      });
      const user = userEvent.setup();

      const queries = render(view);

      expect(queries.getByRole('group', {name: 'Filter by file type'})).not.toBeNull();
      expect(fileNames(queries)).toEqual(['image.png']);

      await user.click(queries.getByRole('button', {name: 'Images'}));

      expect(fileNames(queries)).toEqual(['image.png', 'video.mp4']);
    });
  });
});
