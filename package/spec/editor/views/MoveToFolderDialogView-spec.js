import {MoveToFolderDialogView} from 'pageflow/editor';

import * as support from '$support';
import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('MoveToFolderDialogView', () => {
  const f = support.factories;

  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  support.useFakeXhr(() => testContext);

  support.useFakeTranslations({
    'pageflow.editor.views.move_to_folder_dialog_view.header.files': {
      one: 'Move file',
      other: 'Move files'
    },
    'pageflow.editor.views.move_to_folder_dialog_view.header.folders': {
      one: 'Move folder',
      other: 'Move folders'
    },
    'pageflow.editor.views.move_to_folder_dialog_view.header.items': 'Move items',
    'pageflow.editor.views.move_to_folder_dialog_view.hint.files': {
      one: 'Select the folder to move %{name} to.',
      other: 'Select the folder to move %{count} files to.'
    },
    'pageflow.editor.views.move_to_folder_dialog_view.hint.folders': {
      one: 'Select the folder to move %{name} to.',
      other: 'Select the folder to move %{count} folders to.'
    },
    'pageflow.editor.views.move_to_folder_dialog_view.hint.items':
      'Select the folder to move %{count} items to.',
    'pageflow.editor.views.move_to_folder_dialog_view.root': 'No folder',
    'pageflow.editor.views.move_to_folder_dialog_view.current': 'Current folder',
    'pageflow.editor.views.move_to_folder_dialog_view.cancel': 'Cancel'
  });

  function entryWithFolders(...filesAttributes) {
    return f.entry({}, {
      fileTypes: f.fileTypesWithImageFileType(),
      fileFoldersAttributes: [
        {id: 10, perma_id: 1, name: 'Interviews'},
        {id: 11, perma_id: 2, name: 'Raw', parent_folder_perma_id: 1},
        {id: 12, perma_id: 3, name: 'Landscapes'}
      ],
      filesAttributes: {
        image_files: filesAttributes.length ?
                     filesAttributes.map((attributes, index) => ({
                       id: 5 + index,
                       display_name: `image${index}.png`,
                       ...attributes
                     })) :
                     [{id: 5, display_name: 'image.png'}]
      }
    });
  }

  function dialog(entry, options) {
    const files = entry.getFileCollection('image_files').models;

    return {
      files,
      file: files[0],
      view: new MoveToFolderDialogView({models: files,
                                        fileFolders: entry.fileFolders,
                                        ...options})
    };
  }

  function targetNames(view) {
    return Array.from(view.el.querySelectorAll('.move_to_folder_dialog-name'))
                .map(element => element.textContent);
  }

  function itemOf(queries, name) {
    return queries.getByRole('button', {name}).closest('li');
  }

  it('names the file in the header', () => {
    const {view} = dialog(entryWithFolders());

    const {getByRole} = render(view);

    expect(getByRole('heading')).toHaveTextContent('Move file');
  });

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

  describe('with several files', () => {
    it('states how many files are moved', () => {
      const {view} = dialog(entryWithFolders({}, {}, {}));

      const {getByRole, getByText} = render(view);

      expect(getByRole('heading')).toHaveTextContent('Move files');
      expect(getByText('Select the folder to move 3 files to.')).not.toBeNull();
    });

    it('marks the folder all files are in', () => {
      const {view} = dialog(entryWithFolders({folder_perma_id: 2}, {folder_perma_id: 2}));

      const {getByRole} = render(view);

      expect(getByRole('button', {name: 'Raw Current folder'}))
        .toHaveAttribute('aria-current', 'true');
    });

    it('marks no folder for files from different folders', () => {
      const {view} = dialog(entryWithFolders({folder_perma_id: 2}, {folder_perma_id: 3}));

      render(view);

      expect(view.el.querySelector('[aria-current]')).toBeNull();
    });

    it('moves all files when a folder is clicked', async () => {
      const {view, files} = dialog(entryWithFolders({}, {folder_perma_id: 2}));
      const user = userEvent.setup();

      const {getByRole} = render(view);
      await user.click(getByRole('button', {name: /^Landscapes/}));

      expect(files.map(file => file.get('folder_perma_id'))).toEqual([3, 3]);
      expect(testContext.requests.length).toEqual(2);
    });
  });

  describe('with folders', () => {
    function folderDialog(entry, ...names) {
      const folders = names.map(name => entry.fileFolders.findWhere({name}));

      return {
        folders,
        folder: folders[0],
        view: new MoveToFolderDialogView({models: folders, fileFolders: entry.fileFolders})
      };
    }

    it('names the folder in header and hint', () => {
      const {view} = folderDialog(entryWithFolders(), 'Landscapes');

      const {getByRole, getByText} = render(view);

      expect(getByRole('heading')).toHaveTextContent('Move folder');
      expect(getByText('Select the folder to move Landscapes to.')).not.toBeNull();
    });

    it('states how many folders are moved', () => {
      const {view} = folderDialog(entryWithFolders(), 'Landscapes', 'Raw');

      const {getByRole, getByText} = render(view);

      expect(getByRole('heading')).toHaveTextContent('Move folders');
      expect(getByText('Select the folder to move 2 folders to.')).not.toBeNull();
    });

    it('marks and disables the folder the folder is nested in', () => {
      const {view} = folderDialog(entryWithFolders(), 'Raw');

      const {getByRole} = render(view);

      expect(getByRole('button', {name: 'Interviews Current folder'}))
        .toHaveAttribute('aria-current', 'true');
      expect(getByRole('button', {name: 'Interviews Current folder'})).toBeDisabled();
    });

    it('marks and disables the root for a folder at the top level', () => {
      const {view} = folderDialog(entryWithFolders(), 'Landscapes');

      const {getByRole} = render(view);

      expect(getByRole('button', {name: 'No folder Current folder'})).toBeDisabled();
    });

    it('disables the folders which are moved', () => {
      const {view} = folderDialog(entryWithFolders(), 'Interviews');

      const {getByRole} = render(view);

      expect(getByRole('button', {name: /^Interviews/})).toBeDisabled();
    });

    it('disables subfolders of the folders which are moved', () => {
      const {view} = folderDialog(entryWithFolders(), 'Interviews');

      const {getByRole} = render(view);

      expect(getByRole('button', {name: /^Raw/})).toBeDisabled();
    });

    it('dims the folders which cannot be a target', () => {
      const {view} = folderDialog(entryWithFolders(), 'Interviews');

      const {getByRole} = render(view);

      expect(getByRole('button', {name: /^Interviews/})).toHaveClass('is_blocked');
      expect(getByRole('button', {name: /^Raw/})).toHaveClass('is_blocked');
      expect(getByRole('button', {name: 'No folder Current folder'}))
        .not.toHaveClass('is_blocked');
      expect(getByRole('button', {name: /^Landscapes/})).not.toHaveClass('is_blocked');
    });

    it('keeps offering folders outside of the folders which are moved', () => {
      const {view} = folderDialog(entryWithFolders(), 'Interviews');

      const {getByRole} = render(view);

      expect(getByRole('button', {name: /^Landscapes/})).toBeEnabled();
    });

    it('moves the folder when another folder is clicked', async () => {
      const {view, folder} = folderDialog(entryWithFolders(), 'Landscapes');
      const user = userEvent.setup();

      const {getByRole} = render(view);
      await user.click(getByRole('button', {name: /^Interviews/}));

      expect(folder.get('parent_folder_perma_id')).toEqual(1);
      expect(testContext.requests[0].url).toEqual('/editor/entries/1/file_folders/12');
    });

    it('moves the folder to the top level when the root is clicked', async () => {
      const {view, folder} = folderDialog(entryWithFolders(), 'Raw');
      const user = userEvent.setup();

      const {getByRole} = render(view);
      await user.click(getByRole('button', {name: /^No folder/}));

      expect(folder.get('parent_folder_perma_id')).toBeNull();
    });

    describe('together with files', () => {
      function mixedDialog(entry) {
        const file = entry.getFileCollection('image_files').first();
        const folder = entry.fileFolders.findWhere({name: 'Landscapes'});

        return {
          file,
          folder,
          view: new MoveToFolderDialogView({models: [file, folder],
                                            fileFolders: entry.fileFolders})
        };
      }

      it('names neither files nor folders in header and hint', () => {
        const {view} = mixedDialog(entryWithFolders());

        const {getByRole, getByText} = render(view);

        expect(getByRole('heading')).toHaveTextContent('Move items');
        expect(getByText('Select the folder to move 2 items to.')).not.toBeNull();
      });

      it('moves files and folders at once', async () => {
        const {view, file, folder} = mixedDialog(entryWithFolders());
        const user = userEvent.setup();

        const {getByRole} = render(view);
        await user.click(getByRole('button', {name: /^Interviews/}));

        expect(file.get('folder_perma_id')).toEqual(1);
        expect(folder.get('parent_folder_perma_id')).toEqual(1);
      });
    });
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

  it('invokes callback once the files have been moved', async () => {
    const onMove = jest.fn();
    const {view} = dialog(entryWithFolders(), {onMove});
    const user = userEvent.setup();

    const queries = render(view);

    expect(onMove).not.toHaveBeenCalled();

    await user.click(queries.getByRole('button', {name: /^Landscapes/}));

    expect(onMove).toHaveBeenCalled();
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
