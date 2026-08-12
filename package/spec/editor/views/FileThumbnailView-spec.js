import Marionette from 'backbone.marionette';

import {FileThumbnailView} from 'pageflow/editor';

import * as support from '$support';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('FileThumbnailView', () => {
  const ThumbnailView = Marionette.ItemView.extend({
    template: () => '<span class="thumbnail_stand_in"></span>'
  });

  function fileWithThumbnailView(attributes) {
    return support.factories.file({id: 123, state: 'processed', ...attributes}, {
      fileType: support.factories.fileType({thumbnailView: ThumbnailView})
    });
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
});
