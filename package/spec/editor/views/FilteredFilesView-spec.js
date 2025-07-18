import {FilteredFilesView, editor} from 'pageflow/editor';
import * as support from '$support';
import {within} from '@testing-library/dom';

describe('FilteredFilesView', () => {
  const f = support.factories;

  support.useFakeTranslations({
    'pageflow.entry_types.strange.editor.files.filters.image_files.with_projection.name': 'Entry Type Filter',
    'pageflow.entry_types.strange.editor.files.filters.image_files.with_projection.blank_slate': 'Entry Type Blank',
    'pageflow.editor.files.filters.image_files.with_projection.name': 'Fallback Filter',
    'pageflow.editor.files.filters.image_files.with_projection.blank_slate': 'Fallback Blank'
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
});
