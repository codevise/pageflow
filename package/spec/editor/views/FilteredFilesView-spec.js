import {FilteredFilesView, editor} from 'pageflow/editor';
import * as support from '$support';
import {within, waitFor} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('FilteredFilesView', () => {
  const f = support.factories;

  support.useFakeTranslations({
    'pageflow.entry_types.strange.editor.files.filters.image_files.with_projection.name': 'Entry Type Filter',
    'pageflow.entry_types.strange.editor.files.filters.image_files.with_projection.blank_slate': 'Entry Type Blank',
    'pageflow.editor.files.filters.image_files.with_projection.name': 'Fallback Filter',
    'pageflow.editor.files.filters.image_files.with_projection.blank_slate': 'Fallback Blank',
    'pageflow.editor.templates.list_search_field.placeholder': 'Filter files',
    'pageflow.editor.templates.list_search_field.hint': 'Type / to search',
    'pageflow.editor.templates.list_search_field.reset': 'Clear name filter',
    'pageflow.editor.views.filtered_files_view.sort_button_label': 'Sort',
    'pageflow.editor.views.filtered_files_view.sort.alphabetical': 'Alphabetical',
    'pageflow.editor.views.filtered_files_view.sort.most_recent': 'Most recent'
  });

  it('uses entry type-specific translations if provided', () => {
    editor.registerEntryType('strange');

    const fileTypes = f.fileTypes(function() { this.withImageFileType({filters: [{name: 'with_projection', matches: () => true}]}); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {fileTypes, filesAttributes: {}});
    const view = new FilteredFilesView({
      entry: entry,
      fileType: fileType,
      filterName: 'with_projection'
    });

    view.render();
    const {getByText} = within(view.el);

    expect(getByText('Entry Type Filter')).not.toBeNull();
    expect(getByText('Entry Type Blank')).not.toBeNull();
  });

  it('falls back to generic translations', () => {
    editor.registerEntryType('other');

    const fileTypes = f.fileTypes(function() { this.withImageFileType({filters: [{name: 'with_projection', matches: () => true}]}); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {fileTypes, filesAttributes: {}});
    const view = new FilteredFilesView({
      entry: entry,
      fileType: fileType,
      filterName: 'with_projection'
    });

    view.render();
    const {getByText} = within(view.el);

    expect(getByText('Fallback Filter')).not.toBeNull();
    expect(getByText('Fallback Blank')).not.toBeNull();
  });

  let testContext;

  beforeEach(() => {
    testContext = {};
    editor.router = {navigate: jest.fn()};
  });

  const {render} = support.useHtmlSandbox(() => testContext);

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
      fileType: fileType
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
      fileType: fileType,
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
      fileType: fileType
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
      fileType: fileType
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
      fileType: fileType
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
      fileType: fileType
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
      fileType: fileType
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
      fileType: fileType,
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
      fileType: fileType
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
      fileType: fileType
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
      fileType: fileType,
      filterName: 'with_custom_field'
    });

    const user = userEvent.setup();

    const {getAllByText, getByLabelText} = render(view);
    const input = getByLabelText('Filter files');
    await user.type(input, 'some');

    const names = getAllByText(/\.png$/).map(el => el.textContent);

    expect(names).toEqual(['some-image.png']);
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
      fileType: fileType
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
      fileType: fileType
    });

    const {getAllByText} = render(view);

    const names = getAllByText(/\.png$/).map(el => el.textContent);

    expect(names).toEqual(['b.png', 'a.png']);
  });
});
