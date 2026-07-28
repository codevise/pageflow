import {MoveFileDialogView} from 'pageflow/editor';

import * as support from '$support';
import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('MoveFileDialogView', () => {
  const f = support.factories;

  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  support.useFakeXhr(() => testContext);

  support.useFakeTranslations({
    'pageflow.editor.views.move_file_dialog_view.header': 'Move file',
    'pageflow.editor.views.move_file_dialog_view.hint': 'Select the folder to move %{file} to.',
    'pageflow.editor.views.move_file_dialog_view.root': 'No folder',
    'pageflow.editor.views.move_file_dialog_view.current': 'Current folder',
    'pageflow.editor.views.move_file_dialog_view.cancel': 'Cancel'
  });

  function entryWithFolders(fileAttributes) {
    return f.entry({}, {
      fileTypes: f.fileTypesWithImageFileType(),
      fileFoldersAttributes: [
        {id: 10, perma_id: 1, name: 'Interviews'},
        {id: 11, perma_id: 2, name: 'Raw', parent_folder_perma_id: 1},
        {id: 12, perma_id: 3, name: 'Landscapes'}
      ],
      filesAttributes: {
        image_files: [{id: 5, display_name: 'image.png', ...fileAttributes}]
      }
    });
  }

  function dialog(entry) {
    const file = entry.getFileCollection('image_files').first();

    return {
      file,
      view: new MoveFileDialogView({model: file, fileFolders: entry.fileFolders})
    };
  }

  function targetNames(view) {
    return Array.from(view.el.querySelectorAll('.move_file_dialog-name'))
                .map(element => element.textContent);
  }

  function itemOf(queries, name) {
    return queries.getByRole('button', {name}).closest('li');
  }

  it('names the file in the hint', () => {
    const {view} = dialog(entryWithFolders());

    const {getByText} = render(view);

    expect(getByText('Select the folder to move image.png to.')).not.toBeNull();
  });

  it('offers folders of the entry and the root as targets', () => {
    const {view} = dialog(entryWithFolders());

    render(view);

    expect(targetNames(view)).toEqual(['No folder', 'Interviews', 'Raw', 'Landscapes']);
  });

  it('nests top level folders inside the root target', () => {
    const {view} = dialog(entryWithFolders());

    const queries = render(view);

    expect(within(itemOf(queries, /^No folder/)).getByRole('button', {name: /^Interviews/}))
      .not.toBeNull();
  });

  it('nests folders inside the folder they belong to', () => {
    const {view} = dialog(entryWithFolders());

    const queries = render(view);

    expect(within(itemOf(queries, /^Interviews/)).getByRole('button', {name: /^Raw/}))
      .not.toBeNull();
  });

  it('skips folders which have not been created yet', () => {
    const entry = entryWithFolders();
    entry.fileFolders.add({name: ''});
    const {view} = dialog(entry);

    render(view);

    expect(targetNames(view)).toEqual(['No folder', 'Interviews', 'Raw', 'Landscapes']);
  });

  it('marks and disables the folder the file is in', () => {
    const {view} = dialog(entryWithFolders({folder_perma_id: 2}));

    const queries = render(view);

    expect(queries.getByRole('button', {name: 'Raw Current folder'}))
      .toHaveAttribute('aria-current', 'true');
    expect(queries.getByRole('button', {name: 'Raw Current folder'})).toBeDisabled();
  });

  it('marks and disables the root for a file which is not in any folder', () => {
    const {view} = dialog(entryWithFolders());

    const queries = render(view);

    expect(queries.getByRole('button', {name: 'No folder Current folder'}))
      .toHaveAttribute('aria-current', 'true');
    expect(queries.getByRole('button', {name: 'No folder Current folder'})).toBeDisabled();
  });

  it('keeps offering folders nested inside the folder the file is in', () => {
    const {view} = dialog(entryWithFolders({folder_perma_id: 1}));

    const queries = render(view);

    expect(queries.getByRole('button', {name: /^Raw/})).toBeEnabled();
  });

  it('moves the file when a folder is clicked', async () => {
    const {view, file} = dialog(entryWithFolders());
    const user = userEvent.setup();

    const queries = render(view);
    await user.click(queries.getByRole('button', {name: /^Landscapes/}));

    expect(file.get('folder_perma_id')).toEqual(3);
    expect(testContext.requests[0].url).toEqual('/editor/entries/1/files/image_files/5');
  });

  it('moves the file out of its folder when the root is clicked', async () => {
    const {view, file} = dialog(entryWithFolders({folder_perma_id: 2}));
    const user = userEvent.setup();

    const queries = render(view);
    await user.click(queries.getByRole('button', {name: /^No folder/}));

    expect(file.get('folder_perma_id')).toBeNull();
  });

  it('closes once a target has been clicked', async () => {
    const {view} = dialog(entryWithFolders());
    const user = userEvent.setup();

    const queries = render(view);
    await user.click(queries.getByRole('button', {name: /^Landscapes/}));

    expect(view.isClosed).toBe(true);
  });

  it('does not save the file when the folder it is in is clicked', async () => {
    const {view} = dialog(entryWithFolders({folder_perma_id: 2}));
    const user = userEvent.setup();

    const queries = render(view);
    await user.click(queries.getByRole('button', {name: /^Raw/}));

    expect(testContext.requests).toEqual([]);
  });
});
