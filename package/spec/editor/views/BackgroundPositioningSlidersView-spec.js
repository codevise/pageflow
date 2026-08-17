import Marionette from 'backbone.marionette';

import {BackgroundPositioningSlidersView, Configuration} from 'pageflow/editor';

import * as support from '$support';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('BackgroundPositioningSlidersView', () => {
  const PositioningView = Marionette.ItemView.extend({
    template: () => '<span class="file_stand_in"></span>'
  });

  function slidersView(fileTypeOptions) {
    const fixture = support.factories.imageFilesFixture({
      fileTypeOptions,
      imageFileAttributes: {perma_id: 5, url: '/image.jpg'}
    });

    return new BackgroundPositioningSlidersView({
      model: new Configuration({file_id: 5}),
      propertyName: 'file_id',
      filesCollection: fixture.imageFiles
    });
  }

  it('renders image of the file', () => {
    const view = slidersView();

    render(view);

    expect(view.el.querySelector('img').getAttribute('src')).toEqual('/image.jpg');
  });

  it('renders the positioning view of the file type instead', () => {
    const view = slidersView({positioningView: PositioningView});

    render(view);

    expect(view.el.querySelectorAll('.file_stand_in')).toHaveLength(1);
    expect(view.el.querySelector('img')).toBeNull();
  });

  it('lets the positioning view render the complete file', () => {
    const initialize = jest.fn();
    const view = slidersView({positioningView: PositioningView.extend({initialize})});

    render(view);

    expect(initialize).toHaveBeenCalledWith(expect.objectContaining({fit: 'contain'}));
  });

  it('closes positioning view of the file type when closed', () => {
    const onClose = jest.fn();
    const view = slidersView({positioningView: PositioningView.extend({onClose})});

    render(view);
    view.close();

    expect(onClose).toHaveBeenCalled();
  });
});
