import Backbone from 'backbone';

import {
  FileItemView, FileMetaDataOverlayView, ListSelection, ListHighlight, MoveToFolderDialogView, app
} from 'pageflow/editor';

import * as support from '$support';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render} from 'pageflow/testHelpers';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('FileItemView', () => {
  support.useFakeTranslations({
    'pageflow.editor.templates.file_item.expand_details': 'Show details',
    'pageflow.editor.templates.file_item.collapse_details': 'Hide details',
    'pageflow.editor.templates.file_item.download': 'Download',
    'pageflow.editor.templates.file_item.actions': 'Actions',
    'pageflow.editor.templates.file_item.cancel_upload': 'Cancel upload',
    'pageflow.editor.templates.file_item.destroy': 'Delete',
    'pageflow.editor.templates.file_item.move': 'Move...',
    'pageflow.editor.templates.file_item.settings': 'Settings',
    'pageflow.editor.templates.file_item.select': 'Select',
    'pageflow.editor.templates.files.in_folder': 'In folder:'
  });

  it('displays file title', () => {
    const file = support.factories.file({file_name: 'original.png'});

    const view = new FileItemView({model: file});

    const {getByText} = render(view);

    expect(getByText('original.png')).not.toBeNull();
  });

  describe('parent folder', () => {
    function fileFolders(attributes) {
      return support.factories.entry({}, {fileFoldersAttributes: attributes}).fileFolders;
    }

    function line(view) {
      return view.el.querySelector('.files-parent_folder');
    }

    it('is displayed for file from another folder', () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123, folder_perma_id: 1}),
        fileFolders: fileFolders([{id: 10, perma_id: 1, name: 'Interviews'}])
      });

      const {getByText} = render(view);

      expect(getByText('In folder:')).toBeVisible();
      expect(getByText('Interviews')).toBeVisible();
      expect(line(view)).not.toHaveClass('is_hidden');
    });

    it('is not displayed for file at the top level', () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123, folder_perma_id: null}),
        fileFolders: fileFolders([{id: 10, perma_id: 1, name: 'Interviews'}])
      });

      const {queryByText} = render(view);

      expect(queryByText('Interviews')).toBeNull();
      expect(line(view)).toHaveClass('is_hidden');
    });

    it('is not displayed while that folder is being displayed', () => {
      const folders = fileFolders([{id: 10, perma_id: 1, name: 'Interviews'}]);
      const view = new FileItemView({
        model: support.factories.file({id: 123, folder_perma_id: 1}),
        folder: folders.first(),
        fileFolders: folders
      });

      const {queryByText} = render(view);

      expect(queryByText('Interviews')).toBeNull();
    });

    it('does not display parent folders of the folder', () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123, folder_perma_id: 2}),
        fileFolders: fileFolders([
          {id: 10, perma_id: 1, name: 'Interviews'},
          {id: 11, perma_id: 2, parent_folder_perma_id: 1, name: 'Portraits'}
        ])
      });

      const {getByText, queryByText} = render(view);

      expect(getByText('Portraits')).toBeVisible();
      expect(queryByText('Interviews')).toBeNull();
    });

    // A persisted file would save itself on the way.
    it('follows the file being moved', () => {
      const file = support.factories.file({folder_perma_id: 1});
      const view = new FileItemView({
        model: file,
        fileFolders: fileFolders([
          {id: 10, perma_id: 1, name: 'Interviews'},
          {id: 11, perma_id: 2, name: 'Portraits'}
        ])
      });

      const {getByText, queryByText} = render(view);
      file.set('folder_perma_id', 2);

      expect(getByText('Portraits')).toBeVisible();
      expect(queryByText('Interviews')).toBeNull();
    });

    it('follows the folder being renamed', () => {
      const folders = fileFolders([{id: 10, perma_id: 1, name: 'Interviews'}]);
      const view = new FileItemView({
        model: support.factories.file({id: 123, folder_perma_id: 1}),
        fileFolders: folders
      });

      const {getByText} = render(view);
      folders.first().set('name', 'Portraits');

      expect(getByText('Portraits')).toBeVisible();
    });
  });

  describe('meta data overlay', () => {
    // Which overlay is open is tracked across instances, so a pinned
    // overlay would otherwise leak into the next example.
    beforeEach(() => {
      FileMetaDataOverlayView.currentlyOpen = null;
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    function thumbnailButton(queries) {
      return queries.getByRole('button', {name: /details$/});
    }

    // Hovering only opens the overlay after a delay.
    async function hoverThumbnail(queries) {
      const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

      await user.hover(thumbnailButton(queries));
      jest.runOnlyPendingTimers();

      return user;
    }

    it('is not built before the file is hovered', () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        metaDataAttributes: ['dimension']
      });

      const queries = render(view);

      expect(queries.queryByRole('table', {hidden: true})).toBeNull();
      expect(thumbnailButton(queries).getAttribute('aria-expanded')).toBe('false');
      expect(thumbnailButton(queries).getAttribute('aria-controls')).toBeNull();
    });

    it('describes the overlay once it has been built', async () => {
      const file = support.factories.file({id: 123});
      const view = new FileItemView({model: file, metaDataAttributes: []});

      const queries = render(view);
      await hoverThumbnail(queries);

      expect(thumbnailButton(queries).getAttribute('aria-controls'))
        .toBe(`file-details-${file.cid}`);
      expect(view.metaDataOverlay().el.id).toBe(`file-details-${file.cid}`);
    });

    it('renders overlay into the editor menu container', async () => {
      const container = document.createElement('div');
      container.id = 'editor_menu_container';
      document.body.appendChild(container);

      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        metaDataAttributes: []
      });

      const queries = render(view);
      await hoverThumbnail(queries);

      expect(container.contains(view.metaDataOverlay().el)).toBe(true);

      container.remove();
    });

    it('opens when thumbnail is hovered', async () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        metaDataAttributes: []
      });

      const queries = render(view);
      await hoverThumbnail(queries);

      expect(view.metaDataOverlay().isOpen()).toBe(true);
      expect(view.el).toHaveClass('expanded');
      expect(thumbnailButton(queries).getAttribute('aria-expanded')).toBe('true');
    });

    it('stays closed while the pointer only passes the thumbnail', async () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        metaDataAttributes: []
      });
      const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

      const queries = render(view);
      await user.hover(thumbnailButton(queries));
      await user.unhover(thumbnailButton(queries));
      jest.runAllTimers();

      expect(view.metaDataOverlayView).toBeUndefined();
      expect(view.el).not.toHaveClass('expanded');
    });

    it('opens without delay while an overlay is already open', async () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        metaDataAttributes: []
      });
      const otherView = new FileItemView({
        model: support.factories.file({id: 456}),
        metaDataAttributes: []
      });
      const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

      const queries = render(view);
      const otherQueries = render(otherView);
      await hoverThumbnail(queries);
      await user.hover(thumbnailButton(otherQueries));

      expect(otherView.metaDataOverlay().isOpen()).toBe(true);
    });

    it('dismisses when pointer leaves thumbnail', async () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        metaDataAttributes: []
      });
      const queries = render(view);
      const user = await hoverThumbnail(queries);
      await user.unhover(thumbnailButton(queries));
      jest.runAllTimers();

      expect(view.metaDataOverlay().isOpen()).toBe(false);
      expect(view.el).not.toHaveClass('expanded');
    });

    it('locks when thumbnail is clicked', () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        metaDataAttributes: []
      });

      const queries = render(view);
      thumbnailButton(queries).click();

      expect(view.metaDataOverlay().isOpen()).toBe(true);
      expect(view.metaDataOverlay().isLocked()).toBe(true);
    });

    it('unlocks when thumbnail is clicked again', () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        metaDataAttributes: []
      });

      const queries = render(view);
      thumbnailButton(queries).click();
      thumbnailButton(queries).click();

      expect(view.metaDataOverlay().isLocked()).toBe(false);
    });

    it('stays locked when other thumbnail is hovered', async () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        metaDataAttributes: []
      });
      const otherView = new FileItemView({
        model: support.factories.file({id: 456}),
        metaDataAttributes: []
      });
      const queries = render(view);
      const otherQueries = render(otherView);
      thumbnailButton(queries).click();
      await hoverThumbnail(otherQueries);

      expect(view.metaDataOverlay().isOpen()).toBe(true);
      expect(otherView.metaDataOverlay().isOpen()).toBe(false);
    });

    it('selects file when thumbnail is clicked in selection mode', async () => {
      const file = support.factories.file({id: 123});
      // Returning false keeps the view from navigating to the referer.
      const selectionHandler = {call: jest.fn().mockReturnValue(false), getReferer: jest.fn()};
      const view = new FileItemView({model: file, metaDataAttributes: [], selectionHandler});

      const queries = render(view);
      await hoverThumbnail(queries);
      thumbnailButton(queries).click();

      expect(selectionHandler.call).toHaveBeenCalledWith(file);
      expect(view.metaDataOverlay().isLocked()).toBe(false);
    });

    it('opens in selection mode', async () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        metaDataAttributes: [],
        selectionHandler: {call: jest.fn(), getReferer: jest.fn()}
      });

      const queries = render(view);
      await hoverThumbnail(queries);

      expect(view.metaDataOverlay().isOpen()).toBe(true);
    });

    it('closes when overlay of other file is opened', () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        metaDataAttributes: []
      });
      const otherView = new FileItemView({
        model: support.factories.file({id: 456}),
        metaDataAttributes: []
      });

      const queries = render(view);
      const otherQueries = render(otherView);
      thumbnailButton(queries).click();
      thumbnailButton(otherQueries).click();

      expect(view.metaDataOverlay().isOpen()).toBe(false);
      expect(view.el).not.toHaveClass('expanded');
      expect(otherView.metaDataOverlay().isOpen()).toBe(true);
    });
  });

  describe('actions', () => {
    it('renders settings button', () => {
      const file = support.factories.file({id: 123});

      const view = new FileItemView({model: file});

      const {getByRole} = render(view);

      expect(getByRole('button', {name: 'Settings'})).not.toBeNull();
    });

    it('renders settings button next to drop down', () => {
      const file = support.factories.file({id: 123});

      const view = new FileItemView({model: file});

      const {getAllByRole} = render(view);

      expect(getAllByRole('button').map(button => button.getAttribute('title')))
        .toEqual([null, 'Settings', 'Actions']);
    });

    it('hides settings button for file that has not been created yet', () => {
      const file = support.factories.file({});

      const view = new FileItemView({model: file});

      const {queryByRole} = render(view);

      expect(queryByRole('button', {name: 'Settings'})).toBeNull();
    });

    it('offers delete and cancel upload in drop down', () => {
      const file = support.factories.file({id: 123});

      const view = new FileItemView({model: file});

      const {getAllByRole} = render(view);

      expect(getAllByRole('link').map(link => link.textContent))
        .toEqual(['Move...', 'Cancel upload', 'Delete']);
    });

    it('destroys file when delete is selected', () => {
      window.confirm = jest.fn(() => true);
      const file = support.factories.file({id: 123});
      jest.spyOn(file, 'destroy').mockImplementation(() => {});

      const view = new FileItemView({model: file});

      const {getByRole} = render(view);
      getByRole('link', {name: 'Delete'}).click();

      expect(file.destroy).toHaveBeenCalled();
    });

    it('cancels upload when cancel upload is selected', () => {
      const file = support.factories.file({id: 123, state: 'uploading'});
      jest.spyOn(file, 'cancelUpload').mockImplementation(() => {});

      const view = new FileItemView({model: file});

      const {getByRole} = render(view);
      getByRole('link', {name: 'Cancel upload'}).click();

      expect(file.cancelUpload).toHaveBeenCalled();
    });

    it('hides cancel upload unless file is uploading', () => {
      const file = support.factories.file({id: 123});

      const view = new FileItemView({model: file});

      const {getByRole} = render(view);

      expect(getByRole('link', {name: 'Cancel upload'}).closest('li'))
        .toHaveClass('is_hidden');
      expect(getByRole('link', {name: 'Delete'}).closest('li'))
        .not.toHaveClass('is_hidden');
    });

    it('offers cancel upload instead of delete while file is uploading', () => {
      const file = support.factories.file({id: 123, state: 'uploading'});

      const view = new FileItemView({model: file});

      const {getByRole} = render(view);

      expect(getByRole('link', {name: 'Cancel upload'}).closest('li'))
        .not.toHaveClass('is_hidden');
      expect(getByRole('link', {name: 'Delete'}).closest('li'))
        .toHaveClass('is_hidden');
    });
  });

  describe('move', () => {
    afterEach(() => app.dialogRegion.reset());

    function fileFolders(attributes) {
      return support.factories.entry({}, {fileFoldersAttributes: attributes}).fileFolders;
    }

    // The item stays in the menu and is only hidden, so that it can
    // appear once the entry has folders.
    function isOffered(queries) {
      return !queries.getByRole('link', {name: 'Move...'}).closest('li')
                     .classList.contains('is_hidden');
    }

    it('is offered for file in entry with folders', () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        fileFolders: fileFolders([{id: 10, perma_id: 1, name: 'Interviews'}])
      });

      const queries = render(view);

      expect(isOffered(queries)).toBe(true);
    });

    it('is not offered without folders to move the file into', () => {
      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        fileFolders: fileFolders([])
      });

      const queries = render(view);

      expect(isOffered(queries)).toBe(false);
    });

    it('is not offered for folders which are still being named', () => {
      const folders = fileFolders([]);
      folders.add({name: ''});

      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        fileFolders: folders
      });

      const queries = render(view);

      expect(isOffered(queries)).toBe(false);
    });

    it('is offered once the first folder has been created', () => {
      const folders = fileFolders([]);
      const view = new FileItemView({
        model: support.factories.file({id: 123}),
        fileFolders: folders
      });

      const queries = render(view);
      folders.add({id: 10, perma_id: 1, name: 'Interviews'});

      expect(isOffered(queries)).toBe(true);
    });

    it('is not offered for file which has not been created yet', () => {
      const view = new FileItemView({
        model: support.factories.file({}),
        fileFolders: fileFolders([{id: 10, perma_id: 1, name: 'Interviews'}])
      });

      const queries = render(view);

      expect(isOffered(queries)).toBe(false);
    });

    it('opens dialog for file when selected', () => {
      const file = support.factories.file({id: 123});
      const folders = fileFolders([{id: 10, perma_id: 1, name: 'Interviews'}]);
      const view = new FileItemView({model: file, fileFolders: folders});

      const {getByRole} = render(view);
      getByRole('link', {name: 'Move...'}).click();

      expect(app.dialogRegion.currentView).toBeInstanceOf(MoveToFolderDialogView);
      expect(app.dialogRegion.currentView.options.models).toEqual([file]);
    });
  });

  describe('check box', () => {
    function view(attributes, listSelection) {
      return new FileItemView({
        model: support.factories.file({id: 123, file_name: 'original.png', ...attributes}),
        listSelection: listSelection || selecting()
      });
    }

    function selecting(files) {
      const listSelection = new ListSelection(files);
      listSelection.start();

      return listSelection;
    }

    it('is not rendered without file selection', () => {
      const {queryByRole} = render(new FileItemView({
        model: support.factories.file({id: 123})
      }));

      expect(queryByRole('checkbox')).toBeNull();
    });

    it('is labelled by the file name', () => {
      const {getByRole} = render(view());

      expect(getByRole('checkbox', {name: 'original.png'})).not.toBeNull();
    });

    it('follows the file name', () => {
      const file = support.factories.file({id: 123, file_name: 'original.png'});
      const itemView = new FileItemView({model: file, listSelection: selecting()});

      const {getByRole} = render(itemView);
      file.set('file_name', 'renamed.png');

      expect(getByRole('checkbox', {name: 'renamed.png'})).not.toBeNull();
    });

    it('checks the file when the file name is clicked', async () => {
      const listSelection = selecting();
      const itemView = view({}, listSelection);
      const user = userEvent.setup();

      const {getByText} = render(itemView);
      await user.click(getByText('original.png'));

      expect(listSelection.includes(itemView.model)).toBe(true);
    });

    it('is disabled while files are not being checked', () => {
      const itemView = view({}, new ListSelection());

      const {getByRole} = render(itemView);

      expect(getByRole('checkbox')).toBeDisabled();
    });

    it('is enabled once files are being checked', () => {
      const listSelection = new ListSelection();
      const itemView = view({}, listSelection);

      const {getByRole} = render(itemView);
      listSelection.start();

      expect(getByRole('checkbox')).toBeEnabled();
    });

    it('checks the file when clicked', async () => {
      const listSelection = selecting();
      const itemView = view({}, listSelection);
      const user = userEvent.setup();

      const {getByRole} = render(itemView);
      await user.click(getByRole('checkbox'));

      expect(listSelection.includes(itemView.model)).toBe(true);
      expect(itemView.el).toHaveClass('is_selected');
    });

    it('unchecks the file when clicked again', async () => {
      const listSelection = selecting();
      const itemView = view({}, listSelection);
      const user = userEvent.setup();

      const {getByRole} = render(itemView);
      await user.click(getByRole('checkbox'));
      await user.click(getByRole('checkbox'));

      expect(listSelection.includes(itemView.model)).toBe(false);
      expect(itemView.el).not.toHaveClass('is_selected');
    });

    it('is checked for file which is already selected', () => {
      const file = support.factories.file({id: 123});
      const itemView = new FileItemView({
        model: file,
        listSelection: selecting([file])
      });

      const {getByRole} = render(itemView);

      expect(getByRole('checkbox')).toBeChecked();
      expect(itemView.el).toHaveClass('is_selected');
    });

    // The selection is also cleared from the bar above the list.
    it('follows the selection', async () => {
      const listSelection = selecting();
      const itemView = view({}, listSelection);
      const user = userEvent.setup();

      const {getByRole} = render(itemView);
      await user.click(getByRole('checkbox'));
      listSelection.reset();

      expect(getByRole('checkbox')).not.toBeChecked();
      expect(itemView.el).not.toHaveClass('is_selected');
    });

    it('is not rendered in selection mode', () => {
      const {queryByRole} = render(new FileItemView({
        model: support.factories.file({id: 123}),
        listSelection: selecting(),
        selectionHandler: {call: jest.fn(), getReferer: jest.fn()}
      }));

      expect(queryByRole('checkbox')).toBeNull();
    });
  });

  describe('in selection mode', () => {
    const selectionHandler = () => ({
      call: jest.fn(),
      getReferer: jest.fn()
    });

    it('renders select button', () => {
      const file = support.factories.file({id: 123});

      const view = new FileItemView({model: file, selectionHandler: selectionHandler()});

      const {getByRole} = render(view);

      expect(getByRole('button', {name: 'Select'})).not.toBeNull();
    });

    it('names select button after file', () => {
      const file = support.factories.file({id: 123, file_name: 'original.png'});

      const view = new FileItemView({model: file, selectionHandler: selectionHandler()});

      const {getByRole} = render(view);

      expect(getByRole('button', {name: 'Select original.png'})).not.toBeNull();
    });

    it('marks item as selectable', () => {
      const file = support.factories.file({id: 123});

      const view = new FileItemView({model: file, selectionHandler: selectionHandler()});

      render(view);

      expect(view.el).toHaveClass('selectable');
    });

    it('does not offer actions', () => {
      const file = support.factories.file({id: 123});

      const view = new FileItemView({model: file, selectionHandler: selectionHandler()});

      const {queryByRole} = render(view);

      expect(queryByRole('link', {name: 'Delete'})).toBeNull();
      expect(queryByRole('button', {name: 'Settings'})).toBeNull();
    });

    it('does not offer actions of uploading file', () => {
      const file = support.factories.file({id: 123, state: 'uploading'});

      const view = new FileItemView({model: file, selectionHandler: selectionHandler()});

      const {queryByRole} = render(view);

      expect(queryByRole('link', {name: 'Cancel upload'})).toBeNull();
    });
  });

  it('does not render select button without selection handler', () => {
    const file = support.factories.file({id: 123});

    const view = new FileItemView({model: file});

    const {queryByRole} = render(view);

    expect(queryByRole('button', {name: 'Select'})).toBeNull();
  });

  describe('with list highlight', () => {
    it('marks item as selected while it is highlighted', () => {
      var file = support.factories.file({id: 123});
      var listHighlight = new ListHighlight({active: true}, {
        collection: new Backbone.Collection([file])
      });
      var fileItemView = new FileItemView({model: file, listHighlight});

      render(fileItemView);
      listHighlight.set('currentCid', file.cid);

      expect(fileItemView.el.getAttribute('aria-selected')).toBe('true');
    });

    it('does not mark item as selected while another file is highlighted', () => {
      var file = support.factories.file({id: 123});
      var otherFile = support.factories.file({id: 456});
      var listHighlight = new ListHighlight({active: true}, {
        collection: new Backbone.Collection([file, otherFile])
      });
      var fileItemView = new FileItemView({model: file, listHighlight});

      render(fileItemView);
      listHighlight.set('currentCid', otherFile.cid);

      expect(fileItemView.el.getAttribute('aria-selected')).toBeNull();
    });

    it('invokes selection handler when highlighted item is selected', () => {
      var file = support.factories.file({id: 123});
      var listHighlight = new ListHighlight({active: true}, {
        collection: new Backbone.Collection([file])
      });
      var selectionHandler = {
        call: jest.fn().mockReturnValue(false),
        getReferer: jest.fn()
      };
      var fileItemView = new FileItemView({model: file, listHighlight, selectionHandler});

      render(fileItemView);
      listHighlight.next();
      listHighlight.triggerSelect();

      expect(selectionHandler.call).toHaveBeenCalledWith(file);
    });
  });
});
