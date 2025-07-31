import {FilteredFilesView, editor} from 'pageflow/editor';
import * as support from '$support';
import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

describe('FilteredFilesView', () => {
  const f = support.factories;

  support.useFakeTranslations({
    'pageflow.entry_types.strange.editor.files.filters.image_files.with_projection.name': 'Entry Type Filter',
    'pageflow.entry_types.strange.editor.files.filters.image_files.with_projection.blank_slate': 'Entry Type Blank',
    'pageflow.editor.files.filters.image_files.with_projection.name': 'Fallback Filter',
    'pageflow.editor.files.filters.image_files.with_projection.blank_slate': 'Fallback Blank',
    'pageflow.editor.views.filtered_files_view.name_filter_placeholder': 'Filter files',
    'pageflow.editor.views.filtered_files_view.name_filter_reset': 'Clear name filter',
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
  });

  support.useHtmlSandbox(() => testContext);

  it('filters files by name as user types', async () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [
          {id: 1, file_name: 'some-image.png'},
          {id: 2, file_name: 'other.png'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileType: fileType
    });

    const user = userEvent.setup();

    view.render();
    testContext.htmlSandbox.append(view.el);

    const {getByPlaceholderText} = within(view.el);
    const input = getByPlaceholderText('Filter files');
    await user.type(input, 'other');

    const names = Array.from(view.el.querySelectorAll('.files .file_name')).map(el => el.textContent);

    expect(names).toEqual(['other.png']);
  });

  it('keeps focus on name filter while typing', async () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [
          {id: 1, file_name: 'some-image.png'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileType: fileType
    });

    const user = userEvent.setup();

    view.render();
    testContext.htmlSandbox.append(view.el);

    const {getByPlaceholderText} = within(view.el);
    const input = getByPlaceholderText('Filter files');
    input.focus();
    await user.type(input, 's');

    expect(input).toHaveFocus();
  });

  it('clears filter when clicking reset button', async () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [
          {id: 1, file_name: 'some-image.png'},
          {id: 2, file_name: 'other.png'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileType: fileType
    });

    const user = userEvent.setup();

    view.render();
    testContext.htmlSandbox.append(view.el);

    const {getByPlaceholderText, getByTitle} = within(view.el);
    const input = getByPlaceholderText('Filter files');
    const reset = getByTitle('Clear name filter');

    await user.type(input, 'other');
    await user.click(reset);

    const names = Array.from(view.el.querySelectorAll('.files .file_name')).map(el => el.textContent);

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
          {id: 1, file_name: 'some-image.png', configuration: {custom: 'yes'}},
          {id: 2, file_name: 'other.png', configuration: {custom: 'yes'}},
          {id: 3, file_name: 'some-other.png'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileType: fileType,
      filterName: 'with_custom_field'
    });

    const user = userEvent.setup();

    view.render();
    testContext.htmlSandbox.append(view.el);

    const {getByPlaceholderText} = within(view.el);
    const input = getByPlaceholderText('Filter files');
    await user.type(input, 'some');

    const names = Array.from(view.el.querySelectorAll('.files .file_name')).map(el => el.textContent);

    expect(names).toEqual(['some-image.png']);
  });

  it('changes sort order when selecting item from drop down', async () => {
    const fileTypes = f.fileTypes(function() { this.withImageFileType(); });
    const fileType = fileTypes.first();
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: {
        image_files: [
          {id: 1, file_name: 'a.png'},
          {id: 2, file_name: 'b.png'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileType: fileType
    });

    const user = userEvent.setup();

    view.render();
    testContext.htmlSandbox.append(view.el);

    let names = Array.from(view.el.querySelectorAll('.files .file_name')).map(el => el.textContent);
    expect(names).toEqual(['a.png', 'b.png']);

    const {getByTitle, getAllByText} = within(view.el);
    await user.click(getByTitle('Sort'));
    await user.click(getAllByText('Most recent')[1]);

    names = Array.from(view.el.querySelectorAll('.files .file_name')).map(el => el.textContent);
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
          {id: 1, file_name: 'a.png', updated_at: '2024-01-01'},
          {id: 2, file_name: 'b.png', updated_at: '2024-02-01'}
        ]
      }
    });

    const view = new FilteredFilesView({
      entry: entry,
      fileType: fileType
    });

    view.render();
    testContext.htmlSandbox.append(view.el);

    const names = Array.from(view.el.querySelectorAll('.files .file_name')).map(el => el.textContent);

    expect(names).toEqual(['b.png', 'a.png']);
  });
});
