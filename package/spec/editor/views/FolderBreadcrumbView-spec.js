import {FileFoldersCollection, FolderBreadcrumbView} from 'pageflow/editor';

import * as support from '$support';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('FolderBreadcrumbView', () => {
  support.useFakeTranslations({
    'pageflow.editor.views.folder_breadcrumb_view.label': 'Folder path',
    'pageflow.editor.views.folder_breadcrumb_view.reset': 'Leave folder'
  });

  function setup(options = {}) {
    const fileFolders = new FileFoldersCollection([
      {id: 1, perma_id: 10, name: 'Photos'},
      {id: 2, perma_id: 11, name: 'Holidays', parent_folder_perma_id: 10}
    ]);
    const onSelect = jest.fn();

    const view = new FolderBreadcrumbView({
      model: fileFolders.byPermaId(11),
      fileFolders,
      onSelect,
      ...options
    });

    return {onSelect, ...render(view)};
  }

  it('displays path of folder', () => {
    const {getByRole} = setup();

    expect(getByRole('navigation', {name: 'Folder path'})).toHaveTextContent('PhotosHolidays');
  });

  it('leaves folder via root button', async () => {
    const user = userEvent.setup();
    const {getByRole, onSelect} = setup();

    await user.click(getByRole('button', {name: 'Leave folder'}));

    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it('supports displaying label for root', async () => {
    const user = userEvent.setup();
    const {getByRole, onSelect} = setup({rootLabel: 'My Story'});

    await user.click(getByRole('button', {name: 'My Story'}));

    expect(getByRole('navigation', {name: 'Folder path'}))
      .toHaveTextContent('My Story PhotosHolidays');
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
