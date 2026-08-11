import {FilesView, app, editor} from 'pageflow/editor';

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
    'pageflow.editor.views.filtered_files_view.search': 'Filter files and folders',
    'pageflow.editor.views.filtered_files_view.search_in_folder': 'Filter files in %{folder}',
    'pageflow.editor.templates.list_search_field.hint': 'Type %{hotkey} to search',
    'pageflow.editor.templates.list_search_field.hint_in_all_folders':
      'Type %{hotkey} to search all folders',
    'pageflow.editor.templates.list_search_field.hint_in_folder':
      'Type %{hotkey} to search this folder',
    'pageflow.editor.templates.list_search_field.reset': 'Clear name filter',
    'pageflow.editor.views.files_view.folder': 'New folder',
    'pageflow.editor.views.files_view.upload': 'Upload file...',
    'pageflow.editor.views.files_view.reuse': 'Reuse file...',
    'pageflow.editor.views.folder_item_view.name': 'Name of new folder',
    'pageflow.editor.views.folder_item_view.new_name': 'New name of folder',
    'pageflow.editor.views.folder_item_view.rename': 'Rename',
    'pageflow.editor.views.folder_item_view.destroy': 'Delete',
    'pageflow.editor.views.files_blank_slate_view.empty_folder': 'This folder is empty',
    'pageflow.editor.views.files_blank_slate_view.no_matches': 'Nothing matches',
    'pageflow.editor.templates.files_blank_slate.no_files': 'No files',
    'pageflow.editor.templates.file_item.actions': 'File actions',
    'pageflow.editor.templates.file_item.move': 'Move...',
    'pageflow.editor.views.move_to_folder_dialog_view.header': {
      one: 'Move file',
      other: 'Move files'
    },
    'pageflow.editor.views.move_to_folder_dialog_view.hint': {
      one: 'Select the folder to move %{file} to.',
      other: 'Select the folder to move %{count} files to.'
    },
    'pageflow.editor.views.filtered_files_view.move_selection': 'Move...',
    'pageflow.editor.views.filtered_files_view.actions': 'File list actions',
    'pageflow.editor.views.filtered_files_view.select_files': 'Select files',
    'pageflow.editor.views.filtered_files_view.end_selection': 'End selection',
    'pageflow.editor.views.filtered_files_view.selected_files': {
      zero: 'No files selected',
      one: '1 file selected',
      other: '%{count} files selected'
    },
    'pageflow.editor.views.move_to_folder_dialog_view.root': 'No folder',
    'pageflow.editor.views.move_to_folder_dialog_view.current': 'Current folder',
    'pageflow.editor.views.move_to_folder_dialog_view.cancel': 'Cancel'
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

    function searchHint(view) {
      return view.el.querySelector('.list_search_field-placeholder').textContent.trim();
    }

    it('hints that searching the root list looks into all folders', () => {
      const view = new FilesView({model: entryWithFolders()});

      render(view);

      expect(searchHint(view)).toEqual('Type / to search all folders');
    });

    it('hints that searching inside a folder stays in it', () => {
      const view = new FilesView({model: entryWithFolders(), folderPermaId: '1'});

      render(view);

      expect(searchHint(view)).toEqual('Type / to search this folder');
    });

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
      getByLabelText('Filter files and folders').focus();
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
      getByLabelText('Filter files and folders').focus();
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
      entry.fileFolders.add({id: 20, perma_id: 4, name: 'Aerials'});

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
        await user.type(queries.getByLabelText('Filter files in Interviews'), 'nope');

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

      it('states that nothing matches in the root list while files and folders are hidden',
         async () => {
        const view = new FilesView({model: entryWithEmptyFolder()});
        const user = userEvent.setup();

        const queries = render(view);
        await user.type(queries.getByLabelText('Filter files and folders'), 'nope');

        expect(queries.getByText('Nothing matches')).not.toBeNull();
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

    it('uploads into current folder', () => {
      const view = new FilesView({model: entryWithFolders(), folderPermaId: '1'});

      render(view);

      expect(editor.nextUploadFolder.get('name')).toEqual('Interviews');
    });

    it('uploads into no folder in root list', () => {
      const view = new FilesView({model: entryWithFolders()});

      render(view);

      expect(editor.nextUploadFolder).toBeUndefined();
    });

    it('stops uploading into folder once files view is closed', () => {
      const view = new FilesView({model: entryWithFolders(), folderPermaId: '1'});

      render(view);
      view.close();

      expect(editor.nextUploadFolder).toBeUndefined();
    });

    describe('adding a folder', () => {
      let testContext;

      beforeEach(() => {
        testContext = {};
      });

      support.useFakeXhr(() => testContext);

      async function addFolder(user, queries) {
        await user.click(queries.getByRole('button', {name: 'Add file'}));
        await user.click(queries.getByRole('link', {name: 'New folder'}));

        return queries.getByLabelText('Name of new folder');
      }

      it('renders row with input for name', async () => {
        const view = new FilesView({model: entryWithFolders()});
        const user = userEvent.setup();

        const queries = render(view);
        const input = await addFolder(user, queries);

        expect(input).not.toBeNull();
      });

      it('is offered below a separator in the add menu', () => {
        const view = new FilesView({model: entryWithFolders()});

        render(view);

        const addMenu = within(view.el.querySelector('.manage_files-add')
                                   .closest('.drop_down_button'));

        expect(addMenu.getAllByRole('link').map(link => link.textContent))
          .toEqual(['Upload file...', 'Reuse file...', 'New folder']);
        expect(addMenu.getByRole('link', {name: 'New folder'}).closest('li'))
          .toHaveClass('separated');
      });

      it('creates folder when name is confirmed', async () => {
        const entry = entryWithFolders();
        const view = new FilesView({model: entry});
        const user = userEvent.setup();

        const queries = render(view);
        const input = await addFolder(user, queries);
        await user.type(input, 'Aerials{Enter}');

        expect(testContext.requests[0].method).toEqual('POST');
        expect(JSON.parse(testContext.requests[0].requestBody))
          .toMatchObject({file_folder: {name: 'Aerials', parent_folder_perma_id: null}});
      });

      it('creates folder inside current folder', async () => {
        const entry = entryWithFolders();
        const view = new FilesView({model: entry, folderPermaId: '1'});
        const user = userEvent.setup();

        const queries = render(view);
        const input = await addFolder(user, queries);
        await user.type(input, 'Aerials{Enter}');

        expect(JSON.parse(testContext.requests[0].requestBody))
          .toMatchObject({file_folder: {name: 'Aerials', parent_folder_perma_id: 1}});
      });

      it('creates folder when input loses focus', async () => {
        const entry = entryWithFolders();
        const view = new FilesView({model: entry});
        const user = userEvent.setup();

        const queries = render(view);
        const input = await addFolder(user, queries);
        await user.type(input, 'Aerials');
        input.blur();

        expect(testContext.requests[0].method).toEqual('POST');
      });

      it('discards folder when input loses focus while empty', async () => {
        const entry = entryWithFolders();
        const view = new FilesView({model: entry});
        const user = userEvent.setup();

        const queries = render(view);
        const input = await addFolder(user, queries);
        input.blur();

        expect(testContext.requests).toEqual([]);
        expect(queries.queryByLabelText('Name of new folder')).toBeNull();
        expect(entry.fileFolders.length).toEqual(3);
      });

      it('discards folder on escape', async () => {
        const entry = entryWithFolders();
        const view = new FilesView({model: entry});
        const user = userEvent.setup();

        const queries = render(view);
        const input = await addFolder(user, queries);
        await user.type(input, 'Aerials{Escape}');

        expect(testContext.requests).toEqual([]);
        expect(entry.fileFolders.length).toEqual(3);
      });

      it('renders folder as row once it has been created', async () => {
        const entry = entryWithFolders();
        const view = new FilesView({model: entry});
        const user = userEvent.setup();

        const queries = render(view);
        const input = await addFolder(user, queries);
        await user.type(input, 'Aerials{Enter}');
        testContext.requests[0].respond(
          200,
          {'Content-Type': 'application/json'},
          JSON.stringify({id: 20, perma_id: 4, name: 'Aerials'})
        );

        expect(queries.queryByLabelText('Name of new folder')).toBeNull();
        expect(queries.getByRole('button', {name: /^Aerials/})).not.toBeNull();
      });
    });

    describe('deleting a folder from the list', () => {
      let testContext;

      beforeEach(() => {
        testContext = {};
      });

      support.useFakeXhr(() => testContext);

      function deleteLink(queries, name) {
        const row = queries.getByRole('button', {name}).closest('li');

        return within(row).getByRole('link', {name: 'Delete'});
      }

      // The item stays in the menu and is only hidden, so that it can
      // appear once the folder has been emptied.
      function isOffered(queries, name) {
        return !deleteLink(queries, name).closest('li').classList.contains('is_hidden');
      }

      it('is offered for folder without files and subfolders', () => {
        const view = new FilesView({model: entryWithFolders()});

        const queries = render(view);

        expect(isOffered(queries, /^Landscapes/)).toBe(true);
      });

      it('is not offered for folder holding files', () => {
        const view = new FilesView({model: entryWithFolders(), folderPermaId: '1'});

        const queries = render(view);

        expect(isOffered(queries, /^Raw/)).toBe(false);
      });

      it('is not offered for folder holding subfolders', () => {
        const view = new FilesView({model: entryWithFolders()});

        const queries = render(view);

        expect(isOffered(queries, /^Interviews/)).toBe(false);
      });

      it('is offered once the last file has left the folder', () => {
        const entry = entryWithFolders();
        const view = new FilesView({model: entry, folderPermaId: '1'});

        const queries = render(view);

        expect(isOffered(queries, /^Raw/)).toBe(false);

        entry.getFileCollection('image_files').get(3).set('folder_perma_id', null);

        expect(isOffered(queries, /^Raw/)).toBe(true);
      });

      it('destroys folder when selected', async () => {
        const entry = entryWithFolders();
        const view = new FilesView({model: entry});
        const user = userEvent.setup();

        const queries = render(view);
        await user.click(deleteLink(queries, /^Landscapes/));

        expect(testContext.requests[0].method).toEqual('DELETE');
        expect(testContext.requests[0].url).toEqual('/editor/entries/1/file_folders/12');
      });
    });

    describe('renaming a folder from the list', () => {
      let testContext;

      beforeEach(() => {
        testContext = {};
      });

      support.useFakeXhr(() => testContext);

      async function startRenaming(user, queries) {
        const row = queries.getByRole('button', {name: /^Interviews/}).closest('li');

        await user.click(within(row).getByRole('link', {name: 'Rename'}));

        return within(row).getByLabelText('New name of folder');
      }

      it('turns folder name into input holding current name', async () => {
        const view = new FilesView({model: entryWithFolders()});
        const user = userEvent.setup();

        const queries = render(view);
        const input = await startRenaming(user, queries);

        expect(input).toHaveValue('Interviews');
      });

      it('saves new name when it is confirmed', async () => {
        const view = new FilesView({model: entryWithFolders()});
        const user = userEvent.setup();

        const queries = render(view);
        const input = await startRenaming(user, queries);
        await user.clear(input);
        await user.type(input, 'Portraits{Enter}');

        expect(testContext.requests[0].method).toEqual('PUT');
        expect(testContext.requests[0].url).toEqual('/editor/entries/1/file_folders/10');
        expect(JSON.parse(testContext.requests[0].requestBody))
          .toMatchObject({file_folder: {name: 'Portraits'}});
        expect(folderNames(queries)).toContain('Portraits');
      });

      it('keeps current name on escape', async () => {
        const view = new FilesView({model: entryWithFolders()});
        const user = userEvent.setup();

        const queries = render(view);
        const input = await startRenaming(user, queries);
        await user.clear(input);
        await user.type(input, 'Portraits{Escape}');

        expect(testContext.requests).toEqual([]);
        expect(folderNames(queries)).toEqual(['Interviews', 'Landscapes']);
      });

      it('keeps current name when input is emptied', async () => {
        const view = new FilesView({model: entryWithFolders()});
        const user = userEvent.setup();

        const queries = render(view);
        const input = await startRenaming(user, queries);
        await user.clear(input);
        input.blur();

        expect(testContext.requests).toEqual([]);
        expect(folderNames(queries)).toEqual(['Interviews', 'Landscapes']);
      });

      it('is not offered in selection mode', () => {
        const view = new FilesView({
          model: entryWithFolders(),
          fileTypeName: 'image_files',
          allowSelectingAny: true,
          selectionHandler: {call: jest.fn(), getReferer: () => '/'},
          pathParams: {}
        });

        const {queryByRole} = render(view);

        expect(queryByRole('link', {name: 'Rename'})).toBeNull();
      });
    });

    describe('moving a file from the list', () => {
      let testContext;

      beforeEach(() => {
        testContext = {};
      });

      support.useFakeXhr(() => testContext);

      afterEach(() => app.dialogRegion.reset());

      async function openMoveDialog(user, queries, fileName) {
        const row = queries.getByText(fileName).closest('li');

        await user.click(within(row).getByRole('link', {name: 'Move...'}));

        return within(app.dialogRegion.currentView.el);
      }

      it('moves file into the chosen folder', async () => {
        const entry = entryWithFolders();
        const view = new FilesView({model: entry});
        const user = userEvent.setup();

        const queries = render(view);
        const dialog = await openMoveDialog(user, queries, 'unfiled.png');
        await user.click(dialog.getByRole('button', {name: /^Landscapes/}));

        expect(entry.getFileCollection('image_files').get(1).get('folder_perma_id')).toEqual(3);
        expect(testContext.requests[0].url).toEqual('/editor/entries/1/files/image_files/1');
      });

      it('removes file from the list it has been moved out of', async () => {
        const view = new FilesView({model: entryWithFolders()});
        const user = userEvent.setup();

        const queries = render(view);
        const dialog = await openMoveDialog(user, queries, 'unfiled.png');
        await user.click(dialog.getByRole('button', {name: /^Landscapes/}));

        expect(fileNames(queries)).toEqual([]);
      });

      it('moves file out of its folder when no folder is chosen', async () => {
        const entry = entryWithFolders();
        const view = new FilesView({model: entry, folderPermaId: '1'});
        const user = userEvent.setup();

        const queries = render(view);
        const dialog = await openMoveDialog(user, queries, 'interview.png');
        await user.click(dialog.getByRole('button', {name: /^No folder/}));

        expect(entry.getFileCollection('image_files').get(2).get('folder_perma_id')).toBeNull();
        expect(fileNames(queries)).toEqual(['interview.mp4']);
      });

      it('updates the number of files in the folders involved', async () => {
        const view = new FilesView({model: entryWithFolders()});
        const user = userEvent.setup();

        const queries = render(view);
        const dialog = await openMoveDialog(user, queries, 'unfiled.png');
        await user.click(dialog.getByRole('button', {name: /^Landscapes/}));

        expect(queries.getByRole('button', {name: /^Landscapes/}).textContent)
          .toContain('1 file');
      });

      it('is not offered in selection mode', () => {
        const view = new FilesView({
          model: entryWithFolders(),
          fileTypeName: 'image_files',
          allowSelectingAny: true,
          selectionHandler: {call: jest.fn(), getReferer: () => '/'},
          pathParams: {}
        });

        const {queryByRole} = render(view);

        expect(queryByRole('link', {name: 'Move...'})).toBeNull();
      });
    });


    describe('moving several files from the list', () => {
      let testContext;

      beforeEach(() => {
        testContext = {};
      });

      support.useFakeXhr(() => testContext);

      afterEach(() => app.dialogRegion.reset());

      async function startSelecting(user, queries) {
        await user.click(queries.getByRole('link', {name: 'Select files'}));
      }

      async function check(user, queries, fileName) {
        await user.click(queries.getByRole('checkbox', {name: fileName}));
      }

      async function moveSelection(user, view) {
        await user.click(view.el.querySelector('.filtered_files-selection_bar_action'));

        return within(app.dialogRegion.currentView.el);
      }

      it('moves all checked files into the chosen folder', async () => {
        const entry = entryWithFolders();
        const view = new FilesView({model: entry, folderPermaId: '1'});
        const user = userEvent.setup();

        const queries = render(view);
        await startSelecting(user, queries);
        await check(user, queries, 'interview.png');
        await check(user, queries, 'interview.mp4');
        const dialog = await moveSelection(user, view);
        await user.click(dialog.getByRole('button', {name: /^Landscapes/}));

        expect(entry.getFileCollection('image_files').get(2).get('folder_perma_id')).toEqual(3);
        expect(entry.getFileCollection('video_files').get(1).get('folder_perma_id')).toEqual(3);
        expect(fileNames(queries)).toEqual([]);
      });

      // Moving is all a selection is good for so far, so keeping the
      // check boxes around would only ask for another click to get rid
      // of them.
      it('stops checking files once they have been moved', async () => {
        const view = new FilesView({model: entryWithFolders()});
        const user = userEvent.setup();

        const queries = render(view);
        await startSelecting(user, queries);
        await check(user, queries, 'unfiled.png');
        const dialog = await moveSelection(user, view);
        await user.click(dialog.getByRole('button', {name: /^Landscapes/}));

        expect(view.el.querySelector('ul.files')).not.toHaveClass('is_selecting');
        expect(view.el.querySelector('.filtered_files-selection_bar'))
          .toHaveTextContent('No files selected');
        expect(fileNames(queries)).toEqual([]);
      });

      it('keeps checking files when the dialog is dismissed', async () => {
        const view = new FilesView({model: entryWithFolders()});
        const user = userEvent.setup();

        const queries = render(view);
        await startSelecting(user, queries);
        await check(user, queries, 'unfiled.png');
        const dialog = await moveSelection(user, view);
        await user.click(dialog.getByRole('button', {name: 'Cancel'}));

        expect(view.el.querySelector('ul.files')).toHaveClass('is_selecting');
        expect(view.el.querySelector('.filtered_files-selection_bar'))
          .toHaveTextContent('1 file selected');
      });

      it('states how many files are moved', async () => {
        const view = new FilesView({model: entryWithFolders(), folderPermaId: '1'});
        const user = userEvent.setup();

        const queries = render(view);
        await startSelecting(user, queries);
        await check(user, queries, 'interview.png');
        await check(user, queries, 'interview.mp4');
        const dialog = await moveSelection(user, view);

        expect(dialog.getByText('Select the folder to move 2 files to.')).not.toBeNull();
      });

      it('does not offer to move while nothing is checked', async () => {
        const view = new FilesView({model: entryWithFolders()});
        const user = userEvent.setup();

        const queries = render(view);
        await startSelecting(user, queries);

        expect(view.el.querySelector('.filtered_files-selection_bar_action')).toBeDisabled();

        await check(user, queries, 'unfiled.png');

        expect(view.el.querySelector('.filtered_files-selection_bar_action')).toBeEnabled();
      });
    });

    describe('filtering by file type', () => {
      function entryWithFolderTree() {
        editor.fileTypes = f.fileTypes(function() {
          this.withImageFileType();
          this.withVideoFileType();
          this.withTextTrackFileType();
        });

        return f.entry({}, {
          fileTypes: editor.fileTypes,
          fileFoldersAttributes: [
            {id: 10, perma_id: 1, name: 'Images only'},
            {id: 11, perma_id: 2, name: 'Videos only'},
            {id: 12, perma_id: 3, name: 'Nothing'},
            {id: 13, perma_id: 4, name: 'Nested images'},
            {id: 14, perma_id: 5, name: 'Inner', parent_folder_perma_id: 4}
          ],
          filesAttributes: {
            image_files: [
              {id: 1, display_name: 'direct.png', folder_perma_id: 1},
              {id: 2, display_name: 'nested.png', folder_perma_id: 5}
            ],
            video_files: [
              {id: 1, display_name: 'clip.mp4', folder_perma_id: 2}
            ]
          }
        });
      }

      it('lists all folders without file type filter', () => {
        const view = new FilesView({model: entryWithFolderTree()});

        const queries = render(view);

        expect(folderNames(queries))
          .toEqual(['Images only', 'Nested images', 'Nothing', 'Videos only']);
      });

      it('hides folders without files of selected file type', async () => {
        const view = new FilesView({model: entryWithFolderTree()});
        const user = userEvent.setup();

        const queries = render(view);
        await user.click(queries.getByRole('button', {name: 'Images'}));

        expect(folderNames(queries)).toEqual(['Images only', 'Nested images']);
      });

      it('keeps folders whose subfolders hold files of selected file type', async () => {
        const view = new FilesView({model: entryWithFolderTree()});
        const user = userEvent.setup();

        const queries = render(view);
        await user.click(queries.getByRole('button', {name: 'Videos'}));

        expect(folderNames(queries)).toEqual(['Videos only']);
      });

      it('lists all folders again when file type filter is reset', async () => {
        const view = new FilesView({model: entryWithFolderTree()});
        const user = userEvent.setup();

        const queries = render(view);
        await user.click(queries.getByRole('button', {name: 'Images'}));
        await user.click(queries.getByRole('button', {name: 'Images'}));

        expect(folderNames(queries))
          .toEqual(['Images only', 'Nested images', 'Nothing', 'Videos only']);
      });

      it('hides folder once its last file of selected file type is moved out', async () => {
        const entry = entryWithFolderTree();
        const view = new FilesView({model: entry});
        const user = userEvent.setup();

        const queries = render(view);
        await user.click(queries.getByRole('button', {name: 'Images'}));

        expect(folderNames(queries)).toEqual(['Images only', 'Nested images']);

        entry.getFileCollection('image_files').get(1).set('folder_perma_id', null);

        expect(folderNames(queries)).toEqual(['Nested images']);
      });

      it('keeps folder which has not been created yet visible', async () => {
        const view = new FilesView({model: entryWithFolderTree()});
        const user = userEvent.setup();

        const queries = render(view);
        await user.click(queries.getByRole('button', {name: 'Videos'}));
        await user.click(queries.getByRole('button', {name: 'Add file'}));
        await user.click(queries.getByRole('link', {name: 'New folder'}));

        expect(queries.getByLabelText('Name of new folder')).not.toBeNull();
      });
    });

    describe('searching', () => {
      it('finds files in all folders from root list', async () => {
        const view = new FilesView({model: entryWithFolders()});
        const user = userEvent.setup();

        const queries = render(view);
        await user.type(queries.getByLabelText('Filter files and folders'), 'raw');

        expect(fileNames(queries)).toEqual(['raw.png']);
      });

      it('finds folders by name from root list', async () => {
        const view = new FilesView({model: entryWithFolders()});
        const user = userEvent.setup();

        const queries = render(view);
        await user.type(queries.getByLabelText('Filter files and folders'), 'raw');

        expect(folderNames(queries)).toEqual(['Raw']);
      });

      it('restores folders of root list when search is cleared', async () => {
        const view = new FilesView({model: entryWithFolders()});
        const user = userEvent.setup();

        const queries = render(view);
        await user.type(queries.getByLabelText('Filter files and folders'), 'raw');
        await user.clear(queries.getByLabelText('Filter files and folders'));

        expect(folderNames(queries)).toEqual(['Interviews', 'Landscapes']);
        expect(fileNames(queries)).toEqual(['unfiled.png']);
      });

      it('stays inside current folder', async () => {
        const view = new FilesView({model: entryWithFolders(), folderPermaId: '1'});
        const user = userEvent.setup();

        const queries = render(view);
        await user.type(queries.getByLabelText('Filter files in Interviews'), 'png');

        expect(fileNames(queries)).toEqual(['interview.png']);
      });

      it('does not render folders while searching inside folder', async () => {
        const view = new FilesView({model: entryWithFolders(), folderPermaId: '1'});
        const user = userEvent.setup();

        const queries = render(view);
        await user.type(queries.getByLabelText('Filter files in Interviews'), 'raw');

        expect(folderNames(queries)).toEqual([]);
      });
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
