import Backbone from 'backbone';

import {FileItemView, FileMetaDataItemValueView, ListHighlight} from 'pageflow/editor';

import * as support from '$support';
import {FileMetaDataTable} from '$support/dominos/editor';
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
    'pageflow.editor.templates.file_item.settings': 'Settings',
    'pageflow.editor.templates.file_item.select': 'Select'
  });

  it('displays file title', () => {
    const file = support.factories.file({file_name: 'original.png'});

    const view = new FileItemView({model: file});

    const {getByText} = render(view);

    expect(getByText('original.png')).not.toBeNull();
  });

  it('links to download_url', () => {
    const file = support.factories.file({
      original_url: '/path/file.png',
      display_name: 'My File',
      state: 'processed'
    });

    const view = new FileItemView({model: file});

    const {getByRole} = render(view);
    const link = getByRole('link', {name: 'Download'});

    expect(link.getAttribute('href'))
      .toBe('/path/file.png?download=My%20File');
  });

  it('renders meta data items given as string', () => {
    var file = support.factories.file(
      {dimension: '200x100px'}
    );
    var fileItemView = new FileItemView({
      model: file,
      metaDataAttributes: ['dimension']
    });

    fileItemView.render();
    var fileMetaDataTable = FileMetaDataTable.find(fileItemView);

    expect(fileMetaDataTable.values()).toEqual(expect.arrayContaining(['200x100px']));
  });

  it('renders meta data items with custom view and options', () => {
    var file = support.factories.file(
      {dimension: '200x100px'}
    );
    var fileItemView = new FileItemView({
      model: file,
      metaDataAttributes: [
        {
          name: 'dimension',
          valueView: FileMetaDataItemValueView.extend({
            getText: function() {
              return this.model.get(this.options.name) + this.options.suffix;
            }
          }),
          valueViewOptions: {
            suffix: '!!'
          }
        }
      ]
    });

    fileItemView.render();
    var fileMetaDataTable = FileMetaDataTable.find(fileItemView);

    expect(fileMetaDataTable.values()).toEqual(expect.arrayContaining(['200x100px!!']));
  });

  it('sets up proper ARIA attributes for expand/collapse', () => {
    var file = support.factories.file({id: 123});
    var fileItemView = new FileItemView({
      model: file,
      metaDataAttributes: []
    });

    const {getByRole} = render(fileItemView);

    var thumbnailButton = getByRole('button', {name: 'Show details'});
    var detailsDiv = getByRole('table', {hidden: true}).closest('.details');

    expect(thumbnailButton.getAttribute('aria-expanded')).toBe('false');
    expect(thumbnailButton.getAttribute('aria-controls')).toBe(`file-details-${file.cid}`);
    expect(detailsDiv.getAttribute('id')).toBe(`file-details-${file.cid}`);
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
        .toEqual(['Show details', 'Settings', 'Actions']);
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
        .toEqual(['Cancel upload', 'Delete']);
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
