import {FilesExplorerView, editor} from 'pageflow/editor';

import * as support from '$support';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render} from 'pageflow/testHelpers';

import {state} from '$state';

describe('FilesExplorerView', () => {
  const f = support.factories;

  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  support.useFakeXhr(() => testContext);

  support.useFakeTranslations({
    'pageflow.editor.files.tabs.image_files': 'Images',
    'pageflow.editor.files.tabs.video_files': 'Videos',
    'pageflow.editor.templates.files_explorer.ok': 'OK',
    'pageflow.editor.templates.files_explorer_blank_slate.choose_hint': 'Please choose a story.',
    'pageflow.editor.views.explorer_files_view.no_files': 'This story does not contain any files.',
    'pageflow.editor.views.explorer_files_view.no_matches': 'No file matches the search term.',
    'pageflow.editor.views.explorer_files_view.search': 'Filter files and folders',
    'pageflow.editor.views.explorer_files_view.search_hint': 'Search files',
    'pageflow.editor.views.folder_breadcrumb_view.label': 'Folder path',
    'pageflow.editor.views.folder_breadcrumb_view.reset': 'Leave folder'
  });

  beforeEach(() => {
    editor.fileTypes = f.fileTypes(function() {
      this.withImageFileType();
      this.withVideoFileType();
      this.withTextTrackFileType();
    });
  });

  afterEach(() => {
    state.entry = null;
  });

  function currentEntry(filesAttributes = {}) {
    state.entry = f.entry({id: 1}, {
      fileTypes: editor.fileTypes,
      filesAttributes
    });
  }

  function respondWithOtherEntryFiles(files, fileFolders = []) {
    respondWithJson('/editor/entries', [{id: 2, title: 'Other'}]);
    respondWithJson('/editor/entries/2/files', files);
    respondWithJson('/editor/entries/2/file_folders', fileFolders);
  }

  function respondWithJson(url, body) {
    testContext.server.respondWith('GET', url,
                                   [200, {'Content-Type': 'application/json'},
                                    JSON.stringify(body)]);
  }

  function renderWithOtherEntry(view) {
    const result = render(view);

    testContext.server.respond();
    testContext.server.respond();

    return result;
  }

  it('asks to choose story while no entry is selected', () => {
    currentEntry();

    const {getByText} = render(new FilesExplorerView({}));

    expect(getByText('Please choose a story.').closest('ul').children.length).toBe(1);
  });

  it('displays loading indicator while files are loading', () => {
    currentEntry();
    respondWithOtherEntryFiles({});

    const view = new FilesExplorerView({});
    render(view);
    testContext.server.respond();

    expect(view.$el.find('.files_panel .loading').length).toBe(1);
  });

  it('removes loading indicator once files have been loaded', () => {
    currentEntry();
    respondWithOtherEntryFiles({
      image_files: [{id: 5, file_name: 'other.png', state: 'processed'}]
    });

    const view = new FilesExplorerView({});
    renderWithOtherEntry(view);

    expect(view.$el.find('.files_panel .loading').length).toBe(0);
  });

  it('displays blank slate if other entry does not contain files', () => {
    currentEntry();
    respondWithOtherEntryFiles({});

    const {getByText} = renderWithOtherEntry(new FilesExplorerView({}));

    expect(getByText('This story does not contain any files.').closest('ul').children.length)
      .toBe(1);
  });

  it('lists files of all types of other entry', () => {
    currentEntry();
    respondWithOtherEntryFiles({
      image_files: [{id: 5, file_name: 'other.png', state: 'processed'}],
      video_files: [{id: 6, file_name: 'other.mp4', state: 'encoded'}]
    });

    const {queryByText} = renderWithOtherEntry(new FilesExplorerView({}));

    expect(queryByText('other.png')).not.toBeNull();
    expect(queryByText('other.mp4')).not.toBeNull();
  });

  it('does not list nested files', () => {
    currentEntry();
    respondWithOtherEntryFiles({
      video_files: [{id: 6, file_name: 'other.mp4', state: 'encoded'}],
      text_track_files: [{
        id: 7,
        file_name: 'subtitles.vtt',
        parent_file_id: 6,
        parent_file_model_type: 'Pageflow::VideoFile'
      }]
    });

    const {queryByText} = renderWithOtherEntry(new FilesExplorerView({}));

    expect(queryByText('subtitles.vtt')).toBeNull();
  });

  it('supports filtering files by type', async () => {
    currentEntry();
    respondWithOtherEntryFiles({
      image_files: [{id: 5, file_name: 'other.png', state: 'processed'}],
      video_files: [{id: 6, file_name: 'other.mp4', state: 'encoded'}]
    });
    const user = userEvent.setup();

    const {getByRole, queryByText} = renderWithOtherEntry(new FilesExplorerView({}));
    await user.click(getByRole('button', {name: 'Videos'}));

    expect(queryByText('other.png')).toBeNull();
    expect(queryByText('other.mp4')).not.toBeNull();
  });

  it('displays details of selected file', async () => {
    currentEntry();
    respondWithOtherEntryFiles({
      image_files: [{id: 5, file_name: 'other.png', state: 'processed'}]
    });
    const user = userEvent.setup();

    const {getByText, getByRole} = renderWithOtherEntry(new FilesExplorerView({}));
    await user.click(getByText('other.png'));

    expect(getByRole('heading', {name: 'other.png'})).not.toBeNull();
  });

  it('passes other entry and selected file to callback', async () => {
    currentEntry();
    respondWithOtherEntryFiles({
      image_files: [{id: 5, file_name: 'other.png', state: 'processed'}]
    });
    const user = userEvent.setup();
    const callback = jest.fn();

    const {getByText, getByRole} =
      renderWithOtherEntry(new FilesExplorerView({callback}));
    await user.click(getByText('other.png'));
    await user.click(getByRole('button', {name: 'OK'}));

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({id: 2}),
      expect.objectContaining({id: 5})
    );
  });

  it('does not allow selecting files already used in current entry', async () => {
    currentEntry({image_files: [{id: 5}]});
    respondWithOtherEntryFiles({
      image_files: [{id: 5, file_name: 'used.png', state: 'processed'}]
    });
    const user = userEvent.setup();

    const {getByText, getByRole} = renderWithOtherEntry(new FilesExplorerView({}));
    await user.click(getByText('used.png'));

    expect(getByRole('button', {name: 'OK'})).toBeDisabled();
  });

  it('allows selecting files whose id is only used by file of other type', async () => {
    currentEntry({image_files: [{id: 5}]});
    respondWithOtherEntryFiles({
      video_files: [{id: 5, file_name: 'other.mp4', state: 'encoded'}]
    });
    const user = userEvent.setup();

    const {getByText, getByRole} = renderWithOtherEntry(new FilesExplorerView({}));
    await user.click(getByText('other.mp4'));

    expect(getByRole('button', {name: 'OK'})).not.toBeDisabled();
  });

  describe('when changing selected entry', () => {
    function respondWithEntries(filesOfThirdEntry) {
      respondWithJson('/editor/entries', [{id: 2, title: 'Other'}, {id: 3, title: 'Third'}]);
      respondWithJson('/editor/entries/2/files', {
        image_files: [{id: 5, file_name: 'other.png', state: 'processed'}],
        video_files: [{id: 6, file_name: 'other.mp4', state: 'encoded'}]
      });
      respondWithJson('/editor/entries/2/file_folders', []);
      respondWithJson('/editor/entries/3/files', filesOfThirdEntry);
      respondWithJson('/editor/entries/3/file_folders', []);
    }

    it('preserves file type filter', async () => {
      currentEntry();
      respondWithEntries({
        image_files: [{id: 7, file_name: 'third.png', state: 'processed'}],
        video_files: [{id: 8, file_name: 'third.mp4', state: 'encoded'}]
      });
      const user = userEvent.setup();

      const {getByText, getByRole, queryByText} = render(new FilesExplorerView({}));
      testContext.server.respond();
      await user.click(getByText('Other'));
      testContext.server.respond();
      await user.click(getByRole('button', {name: 'Videos'}));
      await user.click(getByText('Third'));
      testContext.server.respond();

      expect(queryByText('third.png')).toBeNull();
      expect(queryByText('third.mp4')).not.toBeNull();
      expect(getByRole('button', {name: 'Videos'})).toHaveAttribute('aria-pressed', 'true');
    });

    it('lists all files if entry does not contain files of selected type', async () => {
      currentEntry();
      respondWithEntries({
        image_files: [{id: 7, file_name: 'third.png', state: 'processed'}]
      });
      const user = userEvent.setup();

      const {getByText, getByRole, queryByText} = render(new FilesExplorerView({}));
      testContext.server.respond();
      await user.click(getByText('Other'));
      testContext.server.respond();
      await user.click(getByRole('button', {name: 'Videos'}));
      await user.click(getByText('Third'));
      testContext.server.respond();

      expect(queryByText('third.png')).not.toBeNull();
    });
  });

  describe('folders', () => {
    function respondWithFilesInFolders() {
      respondWithOtherEntryFiles({
        image_files: [
          {id: 5, file_name: 'top.png', state: 'processed'},
          {id: 6, file_name: 'nested.png', state: 'processed', folder_perma_id: 10},
          {id: 7, file_name: 'deeper.png', state: 'processed', folder_perma_id: 11}
        ],
        video_files: [
          {id: 8, file_name: 'clip.mp4', state: 'encoded', folder_perma_id: 12}
        ]
      }, [
        {id: 1, perma_id: 10, name: 'Photos'},
        {id: 2, perma_id: 11, name: 'Holidays', parent_folder_perma_id: 10},
        {id: 3, perma_id: 12, name: 'Clips'},
        {id: 4, perma_id: 13, name: 'Empty'}
      ]);
    }

    it('lists top level folders and files outside of folders', () => {
      currentEntry();
      respondWithFilesInFolders();

      const {queryByText} = renderWithOtherEntry(new FilesExplorerView({}));

      expect(queryByText('Photos')).not.toBeNull();
      expect(queryByText('Clips')).not.toBeNull();
      expect(queryByText('top.png')).not.toBeNull();
      expect(queryByText('Holidays')).toBeNull();
      expect(queryByText('nested.png')).toBeNull();
    });

    it('lists folders before files', () => {
      currentEntry();
      respondWithFilesInFolders();

      const {getByText} = renderWithOtherEntry(new FilesExplorerView({}));

      expect(getByText('Photos').compareDocumentPosition(getByText('top.png')))
        .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('hides folders without files', () => {
      currentEntry();
      respondWithFilesInFolders();

      const {queryByText} = renderWithOtherEntry(new FilesExplorerView({}));

      expect(queryByText('Empty')).toBeNull();
    });

    it('hides folders without files of selected type', async () => {
      currentEntry();
      respondWithFilesInFolders();
      const user = userEvent.setup();

      const {getByRole, queryByText} = renderWithOtherEntry(new FilesExplorerView({}));
      await user.click(getByRole('button', {name: 'Videos'}));

      expect(queryByText('Photos')).toBeNull();
      expect(queryByText('Clips')).not.toBeNull();
    });

    it('lists subfolders and files of folder once entered', async () => {
      currentEntry();
      respondWithFilesInFolders();
      const user = userEvent.setup();

      const {getByText, queryByText} = renderWithOtherEntry(new FilesExplorerView({}));
      await user.click(getByText('Photos'));

      expect(queryByText('Holidays')).not.toBeNull();
      expect(queryByText('nested.png')).not.toBeNull();
      expect(queryByText('top.png')).toBeNull();
      expect(queryByText('Clips')).toBeNull();
    });

    it('displays breadcrumb of entered folder', async () => {
      currentEntry();
      respondWithFilesInFolders();
      const user = userEvent.setup();

      const {getByText, getByRole} = renderWithOtherEntry(new FilesExplorerView({}));
      await user.click(getByText('Photos'));
      await user.click(getByText('Holidays'));

      expect(getByRole('navigation', {name: 'Folder path'}))
        .toHaveTextContent('Other PhotosHolidays');
    });

    it('supports leaving folder via breadcrumb', async () => {
      currentEntry();
      respondWithFilesInFolders();
      const user = userEvent.setup();

      const {getByText, getByRole, queryByText, queryByRole} =
        renderWithOtherEntry(new FilesExplorerView({}));
      await user.click(getByText('Photos'));
      await user.click(getByRole('button', {name: 'Other'}));

      expect(queryByText('top.png')).not.toBeNull();
      expect(queryByRole('navigation', {name: 'Folder path'})).toBeNull();
    });

    it('does not select folders', async () => {
      currentEntry();
      respondWithFilesInFolders();
      const user = userEvent.setup();

      const {getByText, getByRole} = renderWithOtherEntry(new FilesExplorerView({}));
      await user.click(getByText('top.png'));
      await user.click(getByText('Photos'));

      expect(getByRole('button', {name: 'OK'})).toBeDisabled();
    });

    it('starts at top level when other entry is selected', async () => {
      currentEntry();
      respondWithJson('/editor/entries', [{id: 2, title: 'Other'}, {id: 3, title: 'Third'}]);
      respondWithJson('/editor/entries/2/files', {
        image_files: [{id: 6, file_name: 'nested.png', state: 'processed', folder_perma_id: 10}]
      });
      respondWithJson('/editor/entries/2/file_folders', [{id: 1, perma_id: 10, name: 'Photos'}]);
      respondWithJson('/editor/entries/3/files', {
        image_files: [{id: 9, file_name: 'third.png', state: 'processed'}]
      });
      respondWithJson('/editor/entries/3/file_folders', []);
      const user = userEvent.setup();

      const {getByText, queryByText} = render(new FilesExplorerView({}));
      testContext.server.respond();
      await user.click(getByText('Other'));
      testContext.server.respond();
      await user.click(getByText('Photos'));
      await user.click(getByText('Third'));
      testContext.server.respond();

      expect(queryByText('third.png')).not.toBeNull();
    });
  });

  describe('search', () => {
    function respondWithSearchableFiles() {
      respondWithOtherEntryFiles({
        image_files: [
          {id: 5, display_name: 'tree.png', state: 'processed'},
          {id: 6, display_name: 'house.png', state: 'processed'},
          {id: 7, display_name: 'nested tree.png', state: 'processed', folder_perma_id: 10}
        ]
      }, [
        {id: 1, perma_id: 10, name: 'Photos'},
        {id: 2, perma_id: 11, name: 'Trees'}
      ]);
    }

    it('filters files of all folders by search term', async () => {
      currentEntry();
      respondWithSearchableFiles();
      const user = userEvent.setup();

      const {getByLabelText, queryByText} = renderWithOtherEntry(new FilesExplorerView({}));
      await user.type(getByLabelText('Filter files and folders'), 'tree');

      expect(queryByText('tree.png')).not.toBeNull();
      expect(queryByText('nested tree.png')).not.toBeNull();
      expect(queryByText('house.png')).toBeNull();
      expect(queryByText('Photos')).toBeNull();
    });

    it('displays search hint', async () => {
      currentEntry();
      respondWithSearchableFiles();

      const {queryByText} = renderWithOtherEntry(new FilesExplorerView({}));

      expect(queryByText('Search files')).not.toBeNull();
    });

    it('displays blank slate if no file matches search term', async () => {
      currentEntry();
      respondWithSearchableFiles();
      const user = userEvent.setup();

      const {getByLabelText, queryByText} = renderWithOtherEntry(new FilesExplorerView({}));
      await user.type(getByLabelText('Filter files and folders'), 'nothing');

      expect(queryByText('No file matches the search term.')).not.toBeNull();
    });

    it('displays no files blank slate again once search term is cleared', async () => {
      currentEntry();
      respondWithOtherEntryFiles({});
      const user = userEvent.setup();

      const {getByLabelText, queryByText} = renderWithOtherEntry(new FilesExplorerView({}));
      await user.type(getByLabelText('Filter files and folders'), 'x');
      await user.clear(getByLabelText('Filter files and folders'));

      expect(queryByText('This story does not contain any files.')).not.toBeNull();
    });
  });
});
