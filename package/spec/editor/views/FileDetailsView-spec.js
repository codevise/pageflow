import Marionette from 'backbone.marionette';

import {FileDetailsView, FileMetaDataItemValueView} from 'pageflow/editor';

import * as support from '$support';
import {FileMetaDataTable, FileStageItem} from '$support/dominos/editor';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('FileDetailsView', () => {
  support.useFakeTranslations({
    'pageflow.editor.templates.file_item.source': 'Source',
    'pageflow.editor.templates.file_item.download': 'Download'
  });

  it('renders meta data items', () => {
    const file = support.factories.file({dimension: '200x100px'});

    const view = new FileDetailsView({model: file, metaDataAttributes: ['dimension']});

    render(view);

    expect(FileMetaDataTable.find(view).values())
      .toEqual(expect.arrayContaining(['200x100px']));
  });

  it('renders meta data items with custom view and options', () => {
    const file = support.factories.file({dimension: '200x100px'});

    const view = new FileDetailsView({
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

    render(view);

    expect(FileMetaDataTable.find(view).values())
      .toEqual(expect.arrayContaining(['200x100px!!']));
  });

  it('links to download_url', () => {
    const file = support.factories.file({
      original_url: '/path/file.png',
      display_name: 'My File',
      state: 'processed'
    });

    const view = new FileDetailsView({model: file});

    const {getByRole} = render(view);

    expect(getByRole('link', {name: 'Download'}).getAttribute('href'))
      .toBe('/path/file.png?download=My%20File');
  });

  it('shows only the stage the file is waiting on', () => {
    const file = support.factories.file({id: 123, state: 'uploading'});

    const view = new FileDetailsView({model: file});

    render(view);

    expect(FileStageItem.findAll(view).length).toBe(1);
  });

  it('hides stages once the file is ready', () => {
    const file = support.factories.file({id: 123, state: 'processed'});

    const view = new FileDetailsView({model: file});

    render(view);

    expect(FileStageItem.findAll(view).length).toBe(0);
    expect(view.$el.find('.file_stage_items')).not.toBeVisible();
  });

  describe('preview', () => {
    const PreviewView = Marionette.ItemView.extend({
      template: () => '<span class="preview_stand_in"></span>'
    });

    function fileWithPreview(attributes) {
      return support.factories.file({id: 123, state: 'processed', ...attributes}, {
        fileType: support.factories.fileType({previewView: PreviewView})
      });
    }

    it('is not rendered until shown', () => {
      const view = new FileDetailsView({model: fileWithPreview()});

      render(view);

      expect(view.$el.find('.preview_stand_in').length).toBe(0);
      expect(view.$el.find('.file_details-preview')).not.toBeVisible();
    });

    it('renders the preview view of the file type when shown', () => {
      const view = new FileDetailsView({model: fileWithPreview()});

      render(view);
      view.showPreview();

      expect(view.$el.find('.preview_stand_in').length).toBe(1);
    });

    it('drops the preview again when hidden', () => {
      const view = new FileDetailsView({model: fileWithPreview()});

      render(view);
      view.showPreview();
      view.hidePreview();

      expect(view.$el.find('.preview_stand_in').length).toBe(0);
    });

    it('is hidden for file types without preview view', () => {
      const view = new FileDetailsView({
        model: support.factories.file({id: 123, state: 'processed'})
      });

      render(view);
      view.showPreview();

      expect(view.$el.find('.file_details-preview')).not.toBeVisible();
    });

    it('is hidden while the file is still processing', () => {
      const view = new FileDetailsView({model: fileWithPreview({state: 'processing'})});

      render(view);
      view.showPreview();

      expect(view.$el.find('.preview_stand_in').length).toBe(0);
      expect(view.$el.find('.file_details-preview')).not.toBeVisible();
    });

    it('is rendered once the file has been processed', () => {
      const file = fileWithPreview({state: 'processing'});
      const view = new FileDetailsView({model: file});

      render(view);
      view.showPreview();
      file.set('state', 'processed');

      expect(view.$el.find('.preview_stand_in').length).toBe(1);
    });

    it('is not rendered on state change while not shown', () => {
      const file = fileWithPreview({state: 'processing'});
      const view = new FileDetailsView({model: file});

      render(view);
      file.set('state', 'processed');

      expect(view.$el.find('.preview_stand_in').length).toBe(0);
    });
  });
});
