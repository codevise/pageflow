import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {ExplorerFileDetailsView, FileMetaDataItemValueView} from 'pageflow/editor';

import * as support from '$support';
import {FileMetaDataTable} from '$support/dominos/editor';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('ExplorerFileDetailsView', () => {
  support.useFakeTranslations({
    'pageflow.editor.templates.file_meta_data_item_value_view.edit': 'Edit'
  });

  const PreviewView = Marionette.ItemView.extend({
    template: () => '<span class="preview_stand_in"></span>'
  });

  function file(attributes, fileTypeOptions) {
    return support.factories.file({id: 123, state: 'processed', ...attributes}, {
      fileType: support.factories.fileType(fileTypeOptions)
    });
  }

  it('is empty while no file is selected', () => {
    const view = new ExplorerFileDetailsView({selection: new Backbone.Model()});

    render(view);

    expect(view.el).toBeEmpty();
  });

  it('displays full name of selected file', () => {
    const selection = new Backbone.Model();
    const view = new ExplorerFileDetailsView({selection});

    const {getByRole} = render(view);
    selection.set('file', file({file_name: 'a-very-long-file-name-that-gets-truncated.mp4'}));

    expect(getByRole('heading', {name: 'a-very-long-file-name-that-gets-truncated.mp4'}))
      .not.toBeNull();
  });

  it('displays meta data of the file type', () => {
    const selection = new Backbone.Model();
    const view = new ExplorerFileDetailsView({selection});

    render(view);
    selection.set('file', file({dimension: '200x100px'}, {metaDataAttributes: ['dimension']}));

    expect(FileMetaDataTable.find(view).values())
      .toEqual(expect.arrayContaining(['200x100px']));
  });

  it('renders preview of selected file', () => {
    const selection = new Backbone.Model();
    const view = new ExplorerFileDetailsView({selection});

    render(view);
    selection.set('file', file({}, {previewView: PreviewView}));

    expect(view.$el.find('.preview_stand_in').length).toBe(1);
  });

  it('never displays edit links', () => {
    const selection = new Backbone.Model();
    const view = new ExplorerFileDetailsView({selection});

    const {queryByRole} = render(view);
    selection.set('file', file({}, {
      metaDataAttributes: [{
        name: 'rights',
        valueView: FileMetaDataItemValueView.extend({getText: () => 'value'}),
        valueViewOptions: {settingsDialogTabLink: 'general'}
      }]
    }));

    expect(queryByRole('button', {name: 'Edit'})).toBeNull();
  });

  it('replaces details when other file is selected', () => {
    const selection = new Backbone.Model();
    const view = new ExplorerFileDetailsView({selection});

    const {queryAllByRole} = render(view);
    selection.set('file', file({id: 1, file_name: 'one.png'}, {previewView: PreviewView}));
    selection.set('file', file({id: 2, file_name: 'two.png'}, {previewView: PreviewView}));

    expect(queryAllByRole('heading').map(heading => heading.textContent))
      .toEqual(['two.png']);
    expect(view.$el.find('.preview_stand_in').length).toBe(1);
  });

  it('closes preview when closed', () => {
    const onClose = jest.fn();
    const selection = new Backbone.Model();
    const view = new ExplorerFileDetailsView({selection});

    render(view);
    selection.set('file', file({}, {previewView: PreviewView.extend({onClose})}));
    view.close();

    expect(onClose).toHaveBeenCalled();
  });

  it('is empty again once selection is reset', () => {
    const selection = new Backbone.Model();
    const view = new ExplorerFileDetailsView({selection});

    render(view);
    selection.set('file', file({}, {previewView: PreviewView}));
    selection.set('file', null);

    expect(view.el).toBeEmpty();
  });
});
