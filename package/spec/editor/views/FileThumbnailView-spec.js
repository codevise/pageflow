import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {AudioFile, FileThumbnailView, stageProvider} from 'pageflow/editor';

import * as support from '$support';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('FileThumbnailView', () => {
  support.setupGlobals({
    config: {confirmEncodingJobs: false}
  });

  const ThumbnailView = Marionette.ItemView.extend({
    template: () => '<span class="thumbnail_stand_in"></span>'
  });

  function fileWithThumbnailView(attributes) {
    return support.factories.file({id: 123, state: 'processed', ...attributes}, {
      fileType: support.factories.fileType({thumbnailView: ThumbnailView})
    });
  }

  function stageIcons(view) {
    return view.$el.find('.file_stage_icon');
  }

  it('renders background image from thumbnail url', () => {
    const view = new FileThumbnailView({
      model: support.factories.file({thumbnail_url: '/image_thumbnail.jpg'})
    });

    render(view);

    expect(view.$el.css('background-image')).toBe('url(/image_thumbnail.jpg)');
  });

  it('renders the thumbnail view of the file type', () => {
    const view = new FileThumbnailView({model: fileWithThumbnailView()});

    render(view);

    expect(view.$el.find('.thumbnail_stand_in').length).toBe(1);
  });

  it('does not render thumbnail view of file type while file is processing', () => {
    const view = new FileThumbnailView({
      model: fileWithThumbnailView({state: 'processing'})
    });

    render(view);

    expect(view.$el.find('.thumbnail_stand_in').length).toBe(0);
  });

  it('renders thumbnail view of file type once the file has been processed', () => {
    const file = fileWithThumbnailView({state: 'processing'});
    const view = new FileThumbnailView({model: file});

    render(view);
    file.set('state', 'processed');

    expect(view.$el.find('.thumbnail_stand_in').length).toBe(1);
  });

  it('does not render thumbnail view of file type twice', () => {
    const file = fileWithThumbnailView();
    const view = new FileThumbnailView({model: file});

    render(view);
    file.set('state', 'processing');
    file.set('state', 'processed');

    expect(view.$el.find('.thumbnail_stand_in').length).toBe(1);
  });

  it('does not render thumbnail view for file types without one', () => {
    const view = new FileThumbnailView({
      model: support.factories.file({id: 123, state: 'processed'})
    });

    render(view);

    expect(view.$el.find('.thumbnail_stand_in').length).toBe(0);
  });

  it('renders files that do not have a file type', () => {
    const view = new FileThumbnailView({model: new AudioFile({state: 'encoded'})});

    render(view);

    expect(view.$el.find('.pictogram').hasClass('audio')).toEqual(true);
  });

  it('renders models that do not support thumbnail views of file types', () => {
    const Thumbnail = Backbone.Model.extend({
      mixins: [stageProvider],
      thumbnailPictogram: 'mask',

      isReady: function() {
        return true;
      }
    });

    const view = new FileThumbnailView({model: new Thumbnail()});

    render(view);

    expect(view.$el.find('.pictogram').hasClass('mask')).toEqual(true);
  });

  it('closes thumbnail view of file type when closed', () => {
    const onClose = jest.fn();
    const file = support.factories.file({id: 123, state: 'processed'}, {
      fileType: support.factories.fileType({
        thumbnailView: ThumbnailView.extend({onClose})
      })
    });
    const view = new FileThumbnailView({model: file});

    render(view);
    view.close();

    expect(onClose).toHaveBeenCalled();
  });

  it('renders stage icon while file is not ready', () => {
    const view = new FileThumbnailView({
      model: support.factories.file({state: 'uploading'})
    });

    render(view);

    expect(stageIcons(view).length).toEqual(1);
  });

  it('renders icon of stage the file is waiting on', () => {
    const view = new FileThumbnailView({
      model: support.factories.file({state: 'processing_failed'})
    });

    render(view);

    expect(stageIcons(view).find('.file_stage_icon-alert')[0].style.display)
      .not.toEqual('none');
  });

  it('renders no stage icon once file is ready', () => {
    const view = new FileThumbnailView({
      model: support.factories.file({state: 'processed'})
    });

    render(view);

    expect(stageIcons(view).length).toEqual(0);
  });

  it('removes stage icon when file becomes ready', () => {
    const file = support.factories.file({state: 'processing'});
    const view = new FileThumbnailView({model: file});

    render(view);
    file.set('state', 'processed');

    expect(stageIcons(view).length).toEqual(0);
  });

  it('renders no stage icon when no file is set', () => {
    const view = new FileThumbnailView({});

    render(view);

    expect(stageIcons(view).length).toEqual(0);
  });

  it('renders pictogram of file types that define one', () => {
    const view = new FileThumbnailView({
      model: new AudioFile({state: 'encoded'}, {fileType: support.factories.fileType()})
    });

    render(view);

    expect(view.$el.find('.pictogram').hasClass('audio')).toEqual(true);
    expect(view.$el.hasClass('always_picogram')).toEqual(true);
  });
});
