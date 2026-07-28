import {FilesView, editor} from 'pageflow/editor';

import * as support from '$support';
import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render} from 'pageflow/testHelpers';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

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
    'pageflow.editor.views.files_view.tabs.files': 'Files',
    'pageflow.editor.files.singular.image_files': 'an image',
    'pageflow.editor.views.filtered_files_view.any_file_type': 'a file',
    'pageflow.editor.views.filtered_files_view.select': 'Select %{name}',
    'pageflow.editor.views.folder_breadcrumb_view.label': 'Folder path',
    'pageflow.editor.views.folder_breadcrumb_view.reset': 'Leave folder',
    'pageflow.editor.views.filtered_files_view.cancel_selection': 'Cancel selection',
    'pageflow.editor.templates.files.back': 'Back',
    'pageflow.editor.views.folder_item_view.file_count': {
      one: '1 file',
      other: '%{count} files'
    },
    'pageflow.editor.views.files_blank_slate_view.empty_folder': 'This folder is empty',
    'pageflow.editor.views.files_blank_slate_view.no_matches': 'Nothing matches',
    'pageflow.editor.templates.files_blank_slate.no_files': 'No files',
    'pageflow.editor.templates.list_search_field.placeholder': 'Filter files'
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

  function banner(view) {
    return view.el.querySelector('.filtered_files-banner');
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

  describe('with folders', () => {
    function entryWithFolders() {
      editor.fileTypes = f.fileTypes(function() {
        this.withImageFileType();
        this.withVideoFileType();
        this.withTextTrackFileType();
      });

      return f.entry({}, {
        fileTypes: editor.fileTypes,
        fileFoldersAttributes: [
          {id: 10, perma_id: 1, name: 'Interviews'},
          {id: 11, perma_id: 2, name: 'Raw', parent_folder_perma_id: 1},
          {id: 12, perma_id: 3, name: 'Landscapes'}
        ],
        filesAttributes: {
          image_files: [
            {id: 1, display_name: 'unfiled.png'},
            {id: 2, display_name: 'interview.png', folder_perma_id: 1},
            {id: 3, display_name: 'raw.png', folder_perma_id: 2}
          ],
          video_files: [
            {id: 1, display_name: 'interview.mp4', folder_perma_id: 1}
          ]
        }
      });
    }

    function folderNames(queries) {
      return queries.queryAllByRole('button')
                    .map(el => el.querySelector('.file_folders-name'))
                    .filter(Boolean)
                    .map(el => el.textContent);
    }

    function listedNames(view) {
      return Array.from(view.el.querySelectorAll('#filtered_files > li'))
                  .map(el => el.querySelector('.file_folders-name, .file_name').textContent);
    }

    it('renders folders without parent in root list', () => {
      const view = new FilesView({model: entryWithFolders()});

      const queries = render(view);

      expect(folderNames(queries)).toEqual(['Interviews', 'Landscapes']);
    });

    // A file which has just been uploaded has no folder perma id until
    // the server responds.
    it('lists a file which is not in any folder yet in the root list', () => {
      const entry = entryWithFolders();
      const view = new FilesView({model: entry});

      const queries = render(view);
      entry.getFileCollection('image_files').add(
        {id: 4, display_name: 'fresh.png'},
        {fileType: editor.fileTypes.findByCollectionName('image_files')}
      );

      expect(fileNames(queries)).toContain('fresh.png');
    });

    it('renders only files which are not in any folder in root list', () => {
      const view = new FilesView({model: entryWithFolders()});

      const queries = render(view);

      expect(fileNames(queries)).toEqual(['unfiled.png']);
    });

    it('renders folders above files in one list', () => {
      const view = new FilesView({model: entryWithFolders()});

      render(view);

      expect(listedNames(view)).toEqual(['Interviews', 'Landscapes', 'unfiled.png']);
    });

    it('renders number of files in folder and its subfolders', () => {
      const view = new FilesView({model: entryWithFolders()});

      const {getByText} = render(view);

      expect(getByText('3 files')).not.toBeNull();
      expect(getByText('0 files')).not.toBeNull();
    });

    it('updates number of files when file is moved into folder', () => {
      const entry = entryWithFolders();
      const view = new FilesView({model: entry});

      const {getByText} = render(view);
      entry.getFileCollection('image_files').get(1).set('folder_perma_id', 3);

      expect(getByText('1 file')).not.toBeNull();
    });

    it('renders files of requested folder', () => {
      const view = new FilesView({model: entryWithFolders(), folderPermaId: '1'});

      const queries = render(view);

      expect(fileNames(queries)).toEqual(['interview.mp4', 'interview.png']);
    });

    it('renders folders nested in requested folder', () => {
      const view = new FilesView({model: entryWithFolders(), folderPermaId: '1'});

      const queries = render(view);

      expect(folderNames(queries)).toEqual(['Raw']);
    });

    it('falls back to root list for unknown folder', () => {
      const view = new FilesView({model: entryWithFolders(), folderPermaId: '99'});

      const queries = render(view);

      expect(folderNames(queries)).toEqual(['Interviews', 'Landscapes']);
      expect(fileNames(queries)).toEqual(['unfiled.png']);
    });

    it('navigates to folder when folder is clicked', async () => {
      const view = new FilesView({model: entryWithFolders(), pathParams: {}});
      const user = userEvent.setup();

      const {getByRole} = render(view);
      await user.click(getByRole('button', {name: /^Interviews/}));

      expect(editor.router.navigate).toHaveBeenCalledWith(
        '/files/folders/1', {trigger: true}
      );
    });

    it('keeps selection request when navigating into folder', async () => {
      const selectionHandler = {call: jest.fn(), getReferer: () => '/'};
      const view = new FilesView({
        model: entryWithFolders(),
        fileTypeName: 'image_files',
        allowSelectingAny: true,
        selectionHandler,
        pathParams: {
          collectionName: 'image_files:default',
          handler: 'some_handler',
          payload: '{}'
        }
      });
      const user = userEvent.setup();

      const {getByRole} = render(view);
      await user.click(getByRole('button', {name: /^Interviews/}));

      expect(editor.router.navigate).toHaveBeenCalledWith(
        '/files/image_files:default/folders/1?handler=some_handler&payload=%7B%7D',
        {trigger: true}
      );
    });

    it('marks folder rows as selectable only in selection mode', () => {
      const selectionHandler = {call: jest.fn(), getReferer: () => '/'};

      const browsing = new FilesView({model: entryWithFolders()});
      const selecting = new FilesView({
        model: entryWithFolders(),
        allowSelectingAny: true,
        selectionHandler
      });

      render(browsing);
      render(selecting);

      expect(browsing.el.querySelector('.file_folders-item'))
        .not.toHaveClass('selectable');
      expect(selecting.el.querySelector('.file_folders-item'))
        .toHaveClass('selectable');
    });

    it('highlights folder when navigating with arrow keys', async () => {
      const selectionHandler = {call: jest.fn(), getReferer: () => '/'};
      const view = new FilesView({
        model: entryWithFolders(),
        allowSelectingAny: true,
        selectionHandler
      });
      const user = userEvent.setup();

      const {getByLabelText} = render(view);
      getByLabelText('Filter files').focus();
      await user.keyboard('{ArrowDown}');

      expect(view.el.querySelector('.keyboard_highlight'))
        .toHaveTextContent('Interviews');
    });

    it('navigates into highlighted folder when pressing enter', async () => {
      const selectionHandler = {call: jest.fn(), getReferer: () => '/'};
      const view = new FilesView({
        model: entryWithFolders(),
        allowSelectingAny: true,
        selectionHandler,
        pathParams: {}
      });
      const user = userEvent.setup();

      const {getByLabelText} = render(view);
      getByLabelText('Filter files').focus();
      await user.keyboard('{ArrowDown}{Enter}');

      expect(editor.router.navigate).toHaveBeenCalledWith('/files/folders/1',
                                                          {trigger: true});
    });

    it('navigates to parent folder when back button is clicked', async () => {
      const view = new FilesView({
        model: entryWithFolders(),
        folderPermaId: '2',
        pathParams: {}
      });
      const user = userEvent.setup();

      const {getByText} = render(view);
      await user.click(getByText('Back'));

      expect(editor.router.navigate).toHaveBeenCalledWith('/files/folders/1',
                                                          {trigger: true});
    });

    it('navigates to root list from top level folder when back button is clicked',
       async () => {
      const view = new FilesView({
        model: entryWithFolders(),
        folderPermaId: '1',
        pathParams: {}
      });
      const user = userEvent.setup();

      const {getByText} = render(view);
      await user.click(getByText('Back'));

      expect(editor.router.navigate).toHaveBeenCalledWith('/files', {trigger: true});
    });

    it('returns to selection origin when back button is clicked in root list', async () => {
      const selectionHandler = {call: jest.fn(), getReferer: () => '/some/referer'};
      const view = new FilesView({
        model: entryWithFolders(),
        allowSelectingAny: true,
        selectionHandler,
        pathParams: {}
      });
      const user = userEvent.setup();

      const {getByText} = render(view);
      await user.click(getByText('Back'));

      expect(editor.router.navigate).toHaveBeenCalledWith('/some/referer',
                                                          {trigger: true});
    });

    it('stays in current folder when leaving selection mode via pills', async () => {
      const selectionHandler = {call: jest.fn(), getReferer: () => '/some/referer'};
      const view = new FilesView({
        model: entryWithFolders(),
        folderPermaId: '1',
        fileTypeName: 'image_files',
        selectionHandler,
        pathParams: {handler: 'some_handler', payload: '{}'}
      });
      const user = userEvent.setup();

      const {getByRole} = render(view);
      await user.click(getByRole('button', {name: 'Videos'}));

      expect(editor.router.navigate).toHaveBeenCalledWith('/files/folders/1',
                                                          {trigger: true});
    });

    it('stays in current folder when leaving selection mode', async () => {
      const selectionHandler = {call: jest.fn(), getReferer: () => '/some/referer'};
      const view = new FilesView({
        model: entryWithFolders(),
        folderPermaId: '1',
        allowSelectingAny: true,
        selectionHandler,
        pathParams: {handler: 'some_handler', payload: '{}'}
      });
      const user = userEvent.setup();

      const {getByRole} = render(view);
      await user.click(getByRole('button', {name: 'Cancel selection'}));

      expect(editor.router.navigate).toHaveBeenCalledWith('/files/folders/1',
                                                          {trigger: true});
    });

    it('adds newly created folder to list', () => {
      const entry = entryWithFolders();
      const view = new FilesView({model: entry});

      const queries = render(view);
      entry.fileFolders.add({perma_id: 4, name: 'Aerials'});

      expect(folderNames(queries)).toEqual(['Aerials', 'Interviews', 'Landscapes']);
    });

    describe('blank slate', () => {
      function entryWithEmptyFolder() {
        editor.fileTypes = f.fileTypes(function() {
          this.withImageFileType();
          this.withVideoFileType();
          this.withTextTrackFileType();
        });

        return f.entry({}, {
          fileTypes: editor.fileTypes,
          fileFoldersAttributes: [
            {id: 10, perma_id: 1, name: 'Interviews'},
            {id: 11, perma_id: 2, name: 'Empty'}
          ],
          filesAttributes: {
            image_files: [{id: 1, display_name: 'interview.png', folder_perma_id: 1}],
            video_files: [{id: 1, display_name: 'unfiled.mp4'}]
          }
        });
      }

      function entryWithoutFilesOrFolders() {
        editor.fileTypes = f.fileTypes(function() {
          this.withImageFileType();
        });

        return f.entry({}, {
          fileTypes: editor.fileTypes,
          filesAttributes: {image_files: []}
        });
      }

      it('states that the folder is empty', () => {
        const view = new FilesView({model: entryWithEmptyFolder(), folderPermaId: '2'});

        const {getByText} = render(view);

        expect(getByText('This folder is empty')).not.toBeNull();
      });

      it('states that nothing matches while files are hidden by the file type filter',
         async () => {
        const view = new FilesView({model: entryWithEmptyFolder(), folderPermaId: '1'});
        const user = userEvent.setup();

        const queries = render(view);
        await user.click(queries.getByRole('button', {name: 'Videos'}));

        expect(queries.getByText('Nothing matches')).not.toBeNull();
      });

      it('states that nothing matches while files are hidden by the search term',
         async () => {
        const view = new FilesView({model: entryWithEmptyFolder(), folderPermaId: '1'});
        const user = userEvent.setup();

        const queries = render(view);
        await user.type(queries.getByLabelText('Filter files'), 'nope');

        expect(queries.getByText('Nothing matches')).not.toBeNull();
      });

      it('keeps the given text when neither files nor folders are listed', () => {
        const view = new FilesView({model: entryWithoutFilesOrFolders()});

        const {getByText} = render(view);

        expect(getByText('No files')).not.toBeNull();
      });

      it('is not rendered while folders are listed', () => {
        const entry = entryWithEmptyFolder();
        const files = entry.getFileCollection('video_files');
        files.remove(files.first());
        const view = new FilesView({model: entry});

        const queries = render(view);

        expect(queries.queryByText('No files')).toBeNull();
      });

      it('updates once the last file has been removed from the folder', () => {
        const entry = entryWithEmptyFolder();
        const view = new FilesView({model: entry, folderPermaId: '1'});

        const queries = render(view);
        const files = entry.getFileCollection('image_files');
        files.remove(files.first());

        expect(queries.getByText('This folder is empty')).not.toBeNull();
      });
    });

    it('does not render breadcrumb in root list', () => {
      const view = new FilesView({model: entryWithFolders()});

      const {queryByRole} = render(view);

      expect(queryByRole('navigation', {name: 'Folder path'})).toBeNull();
    });

    it('renders name of current folder in breadcrumb', () => {
      const view = new FilesView({model: entryWithFolders(), folderPermaId: '1'});

      const {getByRole} = render(view);

      expect(getByRole('navigation', {name: 'Folder path'})).toHaveTextContent('Interviews');
    });

    it('renders breadcrumb above the list', () => {
      const view = new FilesView({model: entryWithFolders(), folderPermaId: '1'});

      const {getByRole} = render(view);
      const breadcrumb = getByRole('navigation', {name: 'Folder path'});
      const list = view.el.querySelector('.filtered_files-list');

      expect(breadcrumb.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING)
        .toBeTruthy();
    });

    it('renders parent folders in breadcrumb', () => {
      const view = new FilesView({model: entryWithFolders(), folderPermaId: '2'});

      const {getByRole} = render(view);

      expect(getByRole('navigation', {name: 'Folder path'}))
        .toHaveTextContent('InterviewsRaw');
    });

    it('navigates to parent folder when breadcrumb segment is clicked', async () => {
      const view = new FilesView({
        model: entryWithFolders(),
        folderPermaId: '2',
        pathParams: {}
      });
      const user = userEvent.setup();

      const {getByRole} = render(view);
      const breadcrumb = within(getByRole('navigation', {name: 'Folder path'}));
      await user.click(breadcrumb.getByRole('button', {name: 'Interviews'}));

      expect(editor.router.navigate).toHaveBeenCalledWith('/files/folders/1', {trigger: true});
    });

    it('separates every folder name from what precedes it', () => {
      const view = new FilesView({model: entryWithFolders(), folderPermaId: '2'});

      const {getByRole} = render(view);
      const breadcrumb = getByRole('navigation', {name: 'Folder path'});

      expect(Array.from(breadcrumb.children).map(child => child.className)).toEqual([
        'folder_breadcrumb-root',
        'folder_breadcrumb-separator',
        'folder_breadcrumb-parent',
        'folder_breadcrumb-separator',
        'folder_breadcrumb-current'
      ]);
    });

    it('navigates to root list when leaving folder', async () => {
      const view = new FilesView({
        model: entryWithFolders(),
        folderPermaId: '2',
        pathParams: {}
      });
      const user = userEvent.setup();

      const {getByRole} = render(view);
      await user.click(getByRole('button', {name: 'Leave folder'}));

      expect(editor.router.navigate).toHaveBeenCalledWith('/files', {trigger: true});
    });

    it('removes file from list when it is moved into folder', () => {
      const entry = entryWithFolders();
      const view = new FilesView({model: entry});

      const queries = render(view);

      expect(fileNames(queries)).toEqual(['unfiled.png']);

      entry.getFileCollection('image_files').get(1).set('folder_perma_id', 1);

      expect(fileNames(queries)).toEqual([]);
    });
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

    it('names the requested file type in the banner', () => {
      const view = new FilesView({
        model: entryWithFiles(),
        fileTypeName: 'image_files',
        selectionHandler
      });

      render(view);

      expect(banner(view)).toHaveTextContent('Select an image');
    });

    it('states that any file type may be selected in the banner', () => {
      const view = new FilesView({
        model: entryWithFiles(),
        allowSelectingAny: true,
        selectionHandler
      });

      render(view);

      expect(banner(view)).toHaveTextContent('Select a file');
    });

    it('states that any file type may be selected even if one is preselected', () => {
      const view = new FilesView({
        model: entryWithFiles(),
        fileTypeName: 'image_files',
        allowSelectingAny: true,
        selectionHandler
      });

      render(view);

      expect(banner(view)).toHaveTextContent('Select a file');
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
