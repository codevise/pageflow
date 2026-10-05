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
    'pageflow.editor.views.explorer_files_view.no_files': 'This story does not contain any files.'
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

  function respondWithOtherEntryFiles(files) {
    testContext.server.respondWith('GET', '/editor/entries',
                                   [200, {'Content-Type': 'application/json'},
                                    JSON.stringify([{id: 2, title: 'Other'}])]);
    testContext.server.respondWith('GET', '/editor/entries/2/files',
                                   [200, {'Content-Type': 'application/json'},
                                    JSON.stringify(files)]);
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
    function respondWith(url, body) {
      testContext.server.respondWith('GET', url,
                                     [200, {'Content-Type': 'application/json'},
                                      JSON.stringify(body)]);
    }

    function respondWithEntries(filesOfThirdEntry) {
      respondWith('/editor/entries', [{id: 2, title: 'Other'}, {id: 3, title: 'Third'}]);
      respondWith('/editor/entries/2/files', {
        image_files: [{id: 5, file_name: 'other.png', state: 'processed'}],
        video_files: [{id: 6, file_name: 'other.mp4', state: 'encoded'}]
      });
      respondWith('/editor/entries/3/files', filesOfThirdEntry);
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
});
