import {ImageFilePreviewView} from 'pageflow/editor';

import * as support from '$support';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('ImageFilePreviewView', () => {
  it('renders image with preview url', () => {
    const view = new ImageFilePreviewView({
      model: support.factories.file({preview_url: '/image_medium.jpg'})
    });

    render(view);

    expect(view.$el.find('img').attr('src')).toBe('/image_medium.jpg');
  });

  it('reserves space matching the dimensions of the file', () => {
    const view = new ImageFilePreviewView({
      model: support.factories.file({
        preview_url: '/image_medium.jpg',
        width: 800,
        height: 1200
      })
    });

    render(view);

    expect(view.$el.find('img').attr('width')).toBe('800');
    expect(view.$el.find('img')[0].style.getPropertyValue('--preview-width'))
      .toBe('800px');
    expect(view.$el.find('img').attr('height')).toBe('1200');
  });

  it('updates when preview url changes', () => {
    const file = support.factories.file({preview_url: '/image_medium.jpg'});
    const view = new ImageFilePreviewView({model: file});

    render(view);
    file.set('preview_url', '/other_image.jpg');

    expect(view.$el.find('img').attr('src')).toBe('/other_image.jpg');
  });
});
