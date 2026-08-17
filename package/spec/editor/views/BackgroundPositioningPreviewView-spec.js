import Marionette from 'backbone.marionette';

import {BackgroundPositioningPreviewView, Configuration} from 'pageflow/editor';

import * as support from '$support';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('BackgroundPositioningPreviewView', () => {
  const PositioningView = Marionette.ItemView.extend({
    template: () => '<span class="file_stand_in"></span>',
    setPosition: function() {}
  });

  function previewView({positioningView, ...attributes} = {}) {
    const fixture = support.factories.imageFilesFixture({
      fileTypeOptions: {positioningView},
      imageFileAttributes: {perma_id: 5, url: '/image.jpg'}
    });

    return new BackgroundPositioningPreviewView({
      model: new Configuration({file_id: 5, ...attributes}),
      propertyName: 'file_id',
      filesCollection: fixture.imageFiles,
      ratio: 16 / 9,
      maxSize: 200,
      label: 'Preview'
    });
  }

  it('renders image of the file cropped to the given position', () => {
    const view = previewView({file_x: 20, file_y: 30});

    render(view);

    const image = view.el.querySelector('.image img');

    expect(image.getAttribute('src')).toEqual('/image.jpg');
    expect(image.style.objectPosition).toEqual('20% 30%');
  });

  it('renders the positioning view of the file type instead', () => {
    const view = previewView({positioningView: PositioningView});

    render(view);

    expect(view.el.querySelectorAll('.file_stand_in')).toHaveLength(1);
    expect(view.el.querySelector('img')).toBeNull();
  });

  it('lets the positioning view crop the file', () => {
    const initialize = jest.fn();
    const view = previewView({positioningView: PositioningView.extend({initialize})});

    render(view);

    expect(initialize).toHaveBeenCalledWith(expect.objectContaining({fit: 'cover'}));
  });

  it('passes position to the positioning view', () => {
    const setPosition = jest.fn();
    const view = previewView({
      positioningView: PositioningView.extend({setPosition}),
      file_x: 20,
      file_y: 30
    });

    render(view);

    expect(setPosition).toHaveBeenCalledWith(20, 30);
  });

  it('updates position of the positioning view when the model changes', () => {
    const setPosition = jest.fn();
    const view = previewView({positioningView: PositioningView.extend({setPosition})});

    render(view);
    view.model.setFilePosition('file_id', 'x', 80);

    expect(setPosition).toHaveBeenLastCalledWith(80, 50);
  });

  it('closes positioning view of the file type when closed', () => {
    const onClose = jest.fn();
    const view = previewView({positioningView: PositioningView.extend({onClose})});

    render(view);
    view.close();

    expect(onClose).toHaveBeenCalled();
  });
});
