import {Configuration, FileInputView, BackgroundPositioningView, editor} from 'pageflow/editor';
import Backbone from 'backbone';

import * as support from '$support';
import {DropDownButton} from '$support/dominos/editor';
import {within} from '@testing-library/dom';

describe('FileInputView', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  it('displays file title', () => {
    const fixture = support.factories.imageFilesFixture({
      imageFileAttributes: {perma_id: 5, file_name: 'image.png'}
    });
    const model = new Configuration({file_id: 5});

    const view = new FileInputView({
      collection: fixture.imageFiles,
      model: model,
      propertyName: 'file_id'
    });

    view.render();
    const {getByText} = within(view.el);

    expect(getByText('image.png')).not.toBeNull();
  });

  it('can render button to edit background position', () => {
    var fixture = support.factories.videoFileWithTextTrackFiles({
      videoFileAttributes: {perma_id: 5, file_name: 'video.mp4', state: 'encoded'}
    });
    var model = new Configuration({
      file_id: 5,
    });

    var fileInputView = new FileInputView({
      collection: fixture.videoFiles,
      model: model,
      propertyName: 'file_id',
      positioning: true
    });

    fileInputView.render();
    var dropDownButton = DropDownButton.find(fileInputView);

    expect(dropDownButton.menuItemNames()).toEqual(expect.arrayContaining(['edit_background_positioning']));
  });

  it('can hide button to edit crop position', () => {
    var fixture = support.factories.videoFileWithTextTrackFiles({
      videoFileAttributes: {perma_id: 5, file_name: 'video.mp4', state: 'encoded'}
    });
    var model = new Configuration({
      file_id: 5,
    });

    var fileInputView = new FileInputView({
      collection: fixture.videoFiles,
      model: model,
      propertyName: 'file_id',
      positioning: false
    });

    fileInputView.render();
    var dropDownButton = DropDownButton.find(fileInputView);

    expect(dropDownButton.menuItemNames()).not.toContain('edit_background_positioning');
  });

  it('can show button to edit crop position dynamically', () => {
    var fixture = support.factories.videoFileWithTextTrackFiles({
      videoFileAttributes: {perma_id: 5, file_name: 'video.mp4', state: 'encoded'}
    });
    var model = new Configuration({
      file_id: 5,
    });

    var fileInputView = new FileInputView({
      collection: fixture.videoFiles,
      model: model,
      propertyName: 'file_id',
      positioning: crop => crop,
      positioningBinding: 'crop'
    });

    fileInputView.render();
    var dropDownButton = DropDownButton.find(fileInputView);

    expect(dropDownButton.menuItemNames()).not.toContain('edit_background_positioning');

    model.set('crop', true);

    expect(dropDownButton.menuItemNames()).toContain('edit_background_positioning');
  });

  it('can pass additional options to positioning dialog', () => {
    var fixture = support.factories.videoFileWithTextTrackFiles({
      videoFileAttributes: {perma_id: 5, file_name: 'video.mp4', state: 'encoded'}
    });
    var model = new Configuration({
      file_id: 5,
    });
    jest.spyOn(BackgroundPositioningView, 'open');

    var fileInputView = new FileInputView({
      collection: fixture.videoFiles,
      model: model,
      propertyName: 'file_id',
      positioning: true,
      positioningOptions: {
        previewAspectRatio: 0.5625
      }
    });

    fileInputView.render();
    var dropDownButton = DropDownButton.find(fileInputView);
    dropDownButton.selectMenuItemByName('edit_background_positioning');

    expect(BackgroundPositioningView.open).toHaveBeenCalledWith(
      expect.objectContaining({
        propertyName: 'file_id',
        previewAspectRatio: 0.5625
      })
    );
  });

  it('can pass additional options to positioning dialog via callback', () => {
    var fixture = support.factories.videoFileWithTextTrackFiles({
      videoFileAttributes: {perma_id: 5, file_name: 'video.mp4', state: 'encoded'}
    });
    var model = new Configuration({
      file_id: 5,
    });
    jest.spyOn(BackgroundPositioningView, 'open');

    var previewAspectRatio = 1;
    var fileInputView = new FileInputView({
      collection: fixture.videoFiles,
      model: model,
      propertyName: 'file_id',
      positioning: true,
      positioningOptions: () => ({
        previewAspectRatio
      })
    });

    fileInputView.render();
    var dropDownButton = DropDownButton.find(fileInputView);
    previewAspectRatio = 0.5;
    dropDownButton.selectMenuItemByName('edit_background_positioning');

    expect(BackgroundPositioningView.open).toHaveBeenCalledWith(
      expect.objectContaining({
        propertyName: 'file_id',
        previewAspectRatio: 0.5
      })
    );
  });

  it('can render additional drop down menu item', () => {
    const fixture = support.factories.imageFilesFixture({
      imageFileAttributes: {perma_id: 5}
    });
    const model = new Configuration({
      file_id: 5,
    });
    const handler = jest.fn();

    var fileInputView = new FileInputView({
      collection: fixture.imageFiles,
      model: model,
      propertyName: 'file_id',
      dropDownMenuItems: [
        {
          name: 'custom',
          label: 'Custom Item',
          selected: handler
        }
      ]
    });

    fileInputView.render();
    var dropDownButton = DropDownButton.find(fileInputView);
    dropDownButton.selectMenuItemByLabel('Custom Item');

    expect(handler).toHaveBeenCalledWith({
      inputModel: model,
      propertyName: 'file_id',
      file: fixture.imageFile
    });
  });

  it('can render additional drop down menu item registered via editor API', () => {
    const fixture = support.factories.imageFilesFixture({
      imageFileAttributes: {perma_id: 5}
    });
    const model = new Configuration({
      file_id: 5,
    });
    const handler = jest.fn();

    editor.dropDownMenuItems.register({
        name: 'api_custom',
        label: 'Custom Item added via editor API',
        selected: handler
      }, {
        menuName: 'backdropImageFileInput',
      }
    )

    var fileInputView = new FileInputView({
      collection: fixture.imageFiles,
      model: model,
      propertyName: 'file_id',
      dropDownMenuName: 'backdropImageFileInput'
    });

    fileInputView.render();
    var dropDownButton = DropDownButton.find(fileInputView);
    dropDownButton.selectMenuItemByLabel('Custom Item added via editor API');

    expect(handler).toHaveBeenCalledWith({
      inputModel: model,
      propertyName: 'file_id',
      file: fixture.imageFile
    });
  });

  it('supports nested items in additional drop down menu items', () => {
    const fixture = support.factories.imageFilesFixture({
      imageFileAttributes: {perma_id: 5}
    });
    const model = new Configuration({
      file_id: 5,
    });
    const handler = jest.fn();

    var fileInputView = new FileInputView({
      collection: fixture.imageFiles,
      model: model,
      propertyName: 'file_id',
      dropDownMenuItems: [
        {
          label: 'Group',
          items: [
            {
              name: 'custom',
              label: 'Custom Nested Item',
              selected: handler
            }
          ]
        }
      ]
    });

    fileInputView.render();
    var dropDownButton = DropDownButton.find(fileInputView);
    dropDownButton.selectMenuItemByLabel('Custom Nested Item');

    expect(handler).toHaveBeenCalledWith({
      inputModel: model,
      propertyName: 'file_id',
      file: fixture.imageFile
    });
  });

  it('supports Backbone model constructor as additional drop down menu items', () => {
    const fixture = support.factories.imageFilesFixture({
      imageFileAttributes: {perma_id: 5}
    });
    const model = new Configuration({
      file_id: 5,
    });
    const handler = jest.fn();
    const Item = Backbone.Model.extend({
      defaults: {
        name: 'custom',
        label: 'Custom Item'
      },

      initialize: function(attributes, options) {
        this.options = options;
      },

      selected() {
        handler({
          inputModel: this.options.inputModel,
          propertyName: this.options.propertyName,
          file: this.options.file
        });
      }
    });

    var fileInputView = new FileInputView({
      collection: fixture.imageFiles,
      model: model,
      propertyName: 'file_id',
      dropDownMenuItems: [Item]
    });

    fileInputView.render();
    var dropDownButton = DropDownButton.find(fileInputView);
    dropDownButton.selectMenuItemByLabel('Custom Item');

    expect(handler).toHaveBeenCalledWith({
      inputModel: model,
      propertyName: 'file_id',
      file: fixture.imageFile
    });
  });

  describe('for selecting a default text track file', () => {
    beforeEach(() => {
      testContext.fixture = support.factories.videoFileWithTextTrackFiles({
        videoFileAttributes: {perma_id: 5, file_name: 'video.mp4', state: 'encoded'},
        textTrackFilesAttributes: [
          {
            id: 1,
            perma_id: 10,
            configuration: {
              label: 'English'
            }
          },
          {
            id: 2,
            perma_id: 11,
            configuration: {
              label: 'German'
            }
          }
        ]
      });
    });

    it('displays text track files', () => {
      var model = new Configuration({
        file_id: 5,
      });

      var fileInputView = new FileInputView({
        collection: testContext.fixture.videoFiles,
        model: model,
        propertyName: 'file_id',
        textTrackFiles: testContext.fixture.textTrackFiles,
        defaultTextTrackFilePropertyName: 'default_text_track_file_id'
      });

      fileInputView.render();
      var dropDownButton = DropDownButton.find(fileInputView);

      expect(dropDownButton.menuItemLabels()).toEqual(expect.arrayContaining(['English']));
      expect(dropDownButton.menuItemLabels()).toEqual(expect.arrayContaining(['German']));
    });

    it('allows selecting default text track file', () => {
      var model = new Configuration({
        file_id: 5,
      });

      var fileInputView = new FileInputView({
        collection: testContext.fixture.videoFiles,
        model: model,
        propertyName: 'file_id',
        textTrackFiles: testContext.fixture.textTrackFiles,
        defaultTextTrackFilePropertyName: 'default_text_track_file_id'
      });

      fileInputView.render();
      var dropDownButton = DropDownButton.find(fileInputView);
      dropDownButton.selectMenuItemByLabel('English');

      expect(model.get('default_text_track_file_id')).toBe(10);
    });

    it('allows unsetting default text track file', () => {
      var model = new Configuration({
        file_id: 5,
        default_text_track_file_id: 10
      });

      var fileInputView = new FileInputView({
        collection: testContext.fixture.videoFiles,
        model: model,
        propertyName: 'file_id',
        textTrackFiles: testContext.fixture.textTrackFiles,
        defaultTextTrackFilePropertyName: 'default_text_track_file_id'
      });

      fileInputView.render();
      var dropDownButton = DropDownButton.find(fileInputView);
      dropDownButton.selectMenuItemByName('no_default_text_track');

      expect(model.get('default_text_track_file_id')).toBeNull();
    });
  });
});
