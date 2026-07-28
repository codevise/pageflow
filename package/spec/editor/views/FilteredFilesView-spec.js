import {FileTypeSelection, FilteredFilesView, editor} from 'pageflow/editor';
import * as support from '$support';
import {waitFor} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render} from 'pageflow/testHelpers';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('FilteredFilesView', () => {
  const f = support.factories;

  support.useFakeTranslations({
    'pageflow.entry_types.strange.editor.files.filters.image_files.with_projection.name': 'Entry Type Filter',
    'pageflow.entry_types.strange.editor.files.filters.image_files.with_projection.blank_slate': 'Entry Type Blank',
    'pageflow.editor.files.filters.image_files.with_projection.name': 'Fallback Filter',
    'pageflow.editor.files.filters.image_files.with_projection.blank_slate': 'Fallback Blank',
    'pageflow.editor.templates.list_search_field.hint': 'Type / to search',
    'pageflow.editor.templates.list_search_field.reset': 'Clear name filter',
    'pageflow.editor.files.singular.image_files': 'an image',
    'pageflow.editor.views.filtered_files_view.any_file_type': 'a file',
    'pageflow.editor.views.filtered_files_view.cancel_selection': 'Cancel selection',
    'pageflow.editor.views.filtered_files_view.reset_filter': 'Reset filter',
    'pageflow.editor.views.filtered_files_view.select': 'Select %{name}',
    'pageflow.editor.views.filtered_files_view.search': 'Filter files',
    'pageflow.editor.views.filtered_files_view.search_in_folder': 'Filter files in %{folder}',
    'pageflow.editor.views.filtered_files_view.sort_button_label': 'Sort',
    'pageflow.editor.views.filtered_files_view.sort.alphabetical': 'Alphabetical',
    'pageflow.editor.views.filtered_files_view.sort.most_recent': 'Most recent',
    'pageflow.editor.files.tabs.image_files': 'Images',
    'pageflow.editor.files.tabs.video_files': 'Videos',
    'pageflow.editor.views.file_type_pills_view.group_label': 'Filter by file type'
  });

  it('uses entry type-specific translations if provided', () => {
    editor.registerEntryType('strange');

    const fileTypes = f.fileTypes(function() { this.withImageFileType({filters: [{name: 'with_projection', matches: () => true}]}); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {fileTypes, filesAttributes: {}});
    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType],
      filterName: 'with_projection'
    });

    const {getByText} = render(view);

    expect(view.el.querySelector('.filtered_files-banner'))
      .toHaveTextContent('Select Entry Type Filter');
    expect(getByText('Entry Type Blank')).not.toBeNull();
  });

  it('falls back to generic translations', () => {
    editor.registerEntryType('other');

    const fileTypes = f.fileTypes(function() { this.withImageFileType({filters: [{name: 'with_projection', matches: () => true}]}); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {fileTypes, filesAttributes: {}});
    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType],
      filterName: 'with_projection'
    });

    const {getByText} = render(view);

    expect(view.el.querySelector('.filtered_files-banner'))
      .toHaveTextContent('Select Fallback Filter');
    expect(getByText('Fallback Blank')).not.toBeNull();
  });

  beforeEach(() => {
    editor.router = {navigate: jest.fn()};
  });

  it('filters files by name as user types', async () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [
          {id: 1, display_name: 'some-image.png'},
          {id: 2, display_name: 'other.png'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType]
    });

    const user = userEvent.setup();

    const {getAllByText, getByLabelText} = render(view);
    const input = getByLabelText('Filter files');
    await user.type(input, 'other');

    const names = getAllByText(/\.png$/).map(el => el.textContent);

    expect(names).toEqual(['other.png']);
  });

  it('focuses name filter after rendering in selection mode', async () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {fileTypes, filesAttributes: {image_files: []}});
    const selectionHandler = jest.fn();
    selectionHandler.getReferer = () => '/';

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType],
      selectionHandler
    });

    const {getByLabelText} = render(view);
    const input = getByLabelText('Filter files');

    await waitFor(() => expect(input).toHaveFocus());
  });

  it('keeps focus on name filter while typing', async () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [
          {id: 1, display_name: 'some-image.png'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType]
    });

    const user = userEvent.setup();

    const {getByLabelText} = render(view);
    const input = getByLabelText('Filter files');
    input.focus();
    await user.type(input, 's');

    expect(input).toHaveFocus();
  });

  it('hides placeholder when typing', async () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [
          {id: 1, display_name: 'some-image.png'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType]
    });

    const user = userEvent.setup();

    const {getByLabelText} = render(view);
    const input = getByLabelText('Filter files');
    const wrapper = input.closest('.list_search_field');

    expect(wrapper).not.toHaveClass('has_value');

    await user.type(input, 's');

    expect(wrapper).toHaveClass('has_value');
  });

  it('focuses name filter via hotkey', async () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {fileTypes, filesAttributes: {image_files: []}});

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType]
    });

    const user = userEvent.setup();

    const {getByLabelText} = render(view);
    const input = getByLabelText('Filter files');
    await user.keyboard('/');

    expect(input).toHaveFocus();
  });

  it('resets filter on Escape', async () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [
          {id: 1, display_name: 'a.png'},
          {id: 2, display_name: 'b.png'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType]
    });

    const user = userEvent.setup();

    const {getAllByText, getByLabelText} = render(view);
    const input = getByLabelText('Filter files');
    await user.type(input, 'b');
    await user.keyboard('{Escape}');

    const names = getAllByText(/\.png$/).map(el => el.textContent);
    expect(names).toEqual(['a.png', 'b.png']);
    expect(input).toHaveValue('');
  });

  it('blurs filter on Escape if empty', async () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {fileTypes, filesAttributes: {image_files: []}});

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType]
    });

    const user = userEvent.setup();

    const {getByLabelText} = render(view);
    const input = getByLabelText('Filter files');

    await user.keyboard('{Escape}');

    expect(input).not.toHaveFocus();
  });

  it('supports keyboard selection', async () => {
    const selectionHandler = jest.fn();
    selectionHandler.getReferer = () => '/';

    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [
          {id: 1, display_name: 'a.png'},
          {id: 2, display_name: 'b.png'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType],
      selectionHandler
    });

    const user = userEvent.setup();

    const {getByLabelText} = render(view);
    const input = getByLabelText('Filter files');
    input.focus();

    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(selectionHandler).toHaveBeenCalled();
  });

  it('sets aria-controls on filter input', () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {fileTypes, filesAttributes: {image_files: []}});

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType]
    });

    const {getByLabelText} = render(view);
    const input = getByLabelText('Filter files');
    expect(input.getAttribute('aria-controls')).toEqual('filtered_files');
  });

  it('clears filter when clicking reset button', async () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [
          {id: 1, display_name: 'some-image.png'},
          {id: 2, display_name: 'other.png'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType]
    });

    const user = userEvent.setup();

    const {getByLabelText, getByTitle, getAllByText} = render(view);
    const input = getByLabelText('Filter files');
    const reset = getByTitle('Clear name filter');

    await user.type(input, 'other');
    await user.click(reset);

    const names = getAllByText(/\.png$/).map(el => el.textContent);

    expect(names).toEqual(['other.png', 'some-image.png']);
    expect(input).toHaveValue('');
  });

  it('combines named filter with name substring filtering', async () => {
    const fileTypes = f.fileTypes(function() {
      this.withImageFileType({
        filters: [{
          name: 'with_custom_field',
          matches: file => !!file.configuration.get('custom')
        }]
      });
    });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [
          {id: 1, display_name: 'some-image.png', configuration: {custom: 'yes'}},
          {id: 2, display_name: 'other.png', configuration: {custom: 'yes'}},
          {id: 3, display_name: 'some-other.png'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType],
      filterName: 'with_custom_field'
    });

    const user = userEvent.setup();

    const {getAllByText, getByLabelText} = render(view);
    const input = getByLabelText('Filter files');
    await user.type(input, 'some');

    const names = getAllByText(/\.png$/).map(el => el.textContent);

    expect(names).toEqual(['some-image.png']);
  });

  it('renders files of all given file types', () => {
    const fileTypes = f.fileTypes(function() {
      this.withImageFileType();
      this.withVideoFileType();
      this.withTextTrackFileType();
    });
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [{id: 1, display_name: 'image.png'}],
        video_files: [{id: 1, display_name: 'video.mp4'}]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [
        fileTypes.findByCollectionName('image_files'),
        fileTypes.findByCollectionName('video_files')
      ]
    });

    const {getAllByText} = render(view);

    const names = getAllByText(/\.(png|mp4)$/).map(el => el.textContent);

    expect(names).toEqual(['image.png', 'video.mp4']);
  });

  it('sorts files of different types together', () => {
    const fileTypes = f.fileTypes(function() {
      this.withImageFileType();
      this.withVideoFileType();
      this.withTextTrackFileType();
    });
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [{id: 1, display_name: 'b.png'}],
        video_files: [{id: 2, display_name: 'a.mp4'}]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [
        fileTypes.findByCollectionName('image_files'),
        fileTypes.findByCollectionName('video_files')
      ]
    });

    const {getAllByText} = render(view);

    const names = getAllByText(/\.(png|mp4)$/).map(el => el.textContent);

    expect(names).toEqual(['a.mp4', 'b.png']);
  });

  it('renders meta data attributes of the file type of each file', async () => {
    const fileTypes = f.fileTypes(function() {
      this.withImageFileType({metaDataAttributes: ['dimension']});
      this.withVideoFileType({metaDataAttributes: ['duration']});
      this.withTextTrackFileType();
    });
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [{id: 1, display_name: 'image.png', dimension: '200x100px'}],
        video_files: [{id: 1, display_name: 'video.mp4', duration: '2:30'}]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [
        fileTypes.findByCollectionName('image_files'),
        fileTypes.findByCollectionName('video_files')
      ]
    });

    jest.useFakeTimers();
    const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

    const {getByText} = render(view);

    // The overlay holding the meta data is only built on demand, after
    // the pointer has rested on the thumbnail for a moment.
    for (const thumbnail of view.$el.find('.file_thumbnail_button').toArray()) {
      await user.hover(thumbnail);
      jest.runOnlyPendingTimers();
    }

    jest.useRealTimers();

    expect(getByText('200x100px')).not.toBeNull();
    expect(getByText('2:30')).not.toBeNull();
  });

  it('renders only files of selected file types', () => {
    const fileTypes = f.fileTypes(function() {
      this.withImageFileType();
      this.withVideoFileType();
      this.withTextTrackFileType();
    });
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [{id: 1, display_name: 'image.png'}],
        video_files: [{id: 1, display_name: 'video.mp4'}]
      }
    });
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.toggle('video_files');

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [
        fileTypes.findByCollectionName('image_files'),
        fileTypes.findByCollectionName('video_files')
      ],
      fileTypeSelection: fileTypeSelection
    });

    const {getAllByText} = render(view);

    const names = getAllByText(/\.(png|mp4)$/).map(el => el.textContent);

    expect(names).toEqual(['video.mp4']);
  });

  it('updates list when file type selection changes', () => {
    const fileTypes = f.fileTypes(function() {
      this.withImageFileType();
      this.withVideoFileType();
      this.withTextTrackFileType();
    });
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [{id: 1, display_name: 'image.png'}],
        video_files: [{id: 1, display_name: 'video.mp4'}]
      }
    });
    const fileTypeSelection = new FileTypeSelection();

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [
        fileTypes.findByCollectionName('image_files'),
        fileTypes.findByCollectionName('video_files')
      ],
      fileTypeSelection: fileTypeSelection
    });

    const {getAllByText} = render(view);
    fileTypeSelection.toggle('image_files');

    const names = getAllByText(/\.(png|mp4)$/).map(el => el.textContent);

    expect(names).toEqual(['image.png']);
  });

  it('renders file type pills below search field', () => {
    const fileTypes = f.fileTypes(function() {
      this.withImageFileType();
      this.withVideoFileType();
      this.withTextTrackFileType();
    });
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [{id: 1, display_name: 'image.png'}],
        video_files: [{id: 1, display_name: 'video.mp4'}]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [
        fileTypes.findByCollectionName('image_files'),
        fileTypes.findByCollectionName('video_files')
      ],
      fileTypeSelection: new FileTypeSelection()
    });

    const {getByRole, getByLabelText} = render(view);
    const searchField = getByLabelText('Filter files');
    const pills = getByRole('group', {name: 'Filter by file type'});

    expect(searchField.compareDocumentPosition(pills) & Node.DOCUMENT_POSITION_FOLLOWING)
      .toBeTruthy();
  });

  describe('banner', () => {
    const selectionHandler = {
      call: jest.fn(),
      getReferer: () => '/'
    };

    function setup(options) {
      editor.registerEntryType('other');

      const fileTypes = f.fileTypes(function() {
        this.withImageFileType({filters: [{name: 'with_projection', matches: () => true}]});
      });
      const entry = f.entry({}, {fileTypes, filesAttributes: {}});

      const view = new FilteredFilesView({
        entry: entry,
        fileTypes: [fileTypes.first()],
        ...options
      });

      render(view);

      return view.el.querySelector('.filtered_files-banner');
    }

    function dismissButton(banner) {
      return banner.querySelector('.filtered_files-banner_dismiss');
    }

    it('is not rendered while just browsing files', () => {
      expect(setup()).toBeNull();
    });

    it('names the file type being selected', () => {
      const banner = setup({
        selectionHandler,
        selectionFileType: {collectionName: 'image_files'}
      });

      expect(banner).toHaveTextContent('Select an image');
    });

    it('prefers the label passed by the view requesting the selection', () => {
      const banner = setup({
        selectionHandler: {...selectionHandler, selectionLabel: 'a background image'},
        selectionFileType: {collectionName: 'image_files'}
      });

      expect(banner).toHaveTextContent('Select a background image');
    });

    it('falls back to naming no file type in particular', () => {
      const banner = setup({selectionHandler});

      expect(banner).toHaveTextContent('Select a file');
    });

    it('names the active filter', () => {
      const banner = setup({
        selectionHandler,
        selectionFileType: {collectionName: 'image_files'},
        filterName: 'with_projection'
      });

      expect(banner).toHaveTextContent('Select Fallback Filter');
    });

    it('emphasizes the name inside the sentence', () => {
      const banner = setup({
        selectionHandler,
        selectionFileType: {collectionName: 'image_files'}
      });

      expect(banner.querySelector('.filtered_files-banner_name')).toHaveTextContent('an image');
    });

    it('leaves selection mode when dismissed', () => {
      const onDismissSelection = jest.fn();
      const banner = setup({selectionHandler, onDismissSelection});

      dismissButton(banner).click();

      expect(onDismissSelection).toHaveBeenCalled();
      expect(dismissButton(banner)).toHaveAttribute('title', 'Cancel selection');
    });

    it('drops the filter when dismissed while not selecting', () => {
      const onDismissSelection = jest.fn();
      const banner = setup({filterName: 'with_projection', onDismissSelection});

      dismissButton(banner).click();

      expect(onDismissSelection).toHaveBeenCalled();
      expect(dismissButton(banner)).toHaveAttribute('title', 'Reset filter');
    });
  });

  it('keeps file type pills in the header which sticks while scrolling', () => {
    const fileTypes = f.fileTypes(function() {
      this.withImageFileType();
      this.withVideoFileType();
      this.withTextTrackFileType();
    });
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [{id: 1, display_name: 'image.png'}],
        video_files: [{id: 1, display_name: 'video.mp4'}]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [
        fileTypes.findByCollectionName('image_files'),
        fileTypes.findByCollectionName('video_files')
      ],
      fileTypeSelection: new FileTypeSelection()
    });

    const {getByRole, getByLabelText} = render(view);
    const header = view.el.querySelector('.filtered_files-header');

    expect(header).toContainElement(getByLabelText('Filter files'));
    expect(header).toContainElement(getByRole('group', {name: 'Filter by file type'}));
  });

  it('renders no file type pills without file type selection', () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const entry = f.entry({}, {fileTypes, filesAttributes: {}});

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileTypes.first()]
    });

    const {queryByRole} = render(view);

    expect(queryByRole('group', {name: 'Filter by file type'})).toBeNull();
  });

  it('changes sort order when selecting item from drop down', async () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [
          {id: 1, display_name: 'a.png'},
          {id: 2, display_name: 'b.png'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType]
    });

    const user = userEvent.setup();

    const {getByTitle, getAllByText} = render(view);

    let names = getAllByText(/\.png$/).map(el => el.textContent);
    expect(names).toEqual(['a.png', 'b.png']);

    await user.click(getByTitle('Sort'));
    await user.click(getAllByText('Most recent')[1]);

    names = getAllByText(/\.png$/).map(el => el.textContent);
    expect(names).toEqual(['b.png', 'a.png']);
  });

  it('restores sort order from local storage', () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const key = 'pageflow.filtered_files.sort_order';
    localStorage.setItem(key, 'most_recent');

    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [
          {id: 1, display_name: 'a.png', updated_at: '2024-01-01'},
          {id: 2, display_name: 'b.png', updated_at: '2024-02-01'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileTypes: [fileType]
    });

    const {getAllByText} = render(view);

    const names = getAllByText(/\.png$/).map(el => el.textContent);

    expect(names).toEqual(['b.png', 'a.png']);
  });
});
