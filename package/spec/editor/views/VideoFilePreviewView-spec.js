import {VideoFilePreviewView} from 'pageflow/editor';

import * as support from '$support';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('VideoFilePreviewView', () => {
  support.useFakeTranslations({
    'pageflow.editor.views.file_preview_progress_bar_view.position': 'Playback position',
    'pageflow.editor.views.video_file_preview_view.mute': 'Mute',
    'pageflow.editor.views.video_file_preview_view.unmute': 'Unmute'
  });

  it('plays the preview encoding muted in a loop', () => {
    const view = new VideoFilePreviewView({
      model: support.factories.file({preview_url: '/video_low.mp4'})
    });

    render(view);
    const video = view.$el.find('video')[0];

    expect(video.getAttribute('src')).toBe('/video_low.mp4');
    expect(video.muted).toBe(true);
    expect(video.hasAttribute('loop')).toBe(true);
    expect(video.hasAttribute('autoplay')).toBe(true);
    expect(video.hasAttribute('playsinline')).toBe(true);
  });

  it('reserves space matching the dimensions of the file', () => {
    const view = new VideoFilePreviewView({
      model: support.factories.file({
        preview_url: '/video_low.mp4',
        width: 1920,
        height: 1080
      })
    });

    render(view);

    expect(view.$el.find('video').attr('width')).toBe('1920');
    expect(view.$el.find('video')[0].style.getPropertyValue('--preview-width'))
      .toBe('1920px');
    expect(view.$el.find('video').attr('height')).toBe('1080');
  });

  it('does not reserve space for files of unknown dimensions', () => {
    const view = new VideoFilePreviewView({
      model: support.factories.file({preview_url: '/video_low.mp4'})
    });

    render(view);

    expect(view.$el.find('video').attr('width')).toBeUndefined();
  });

  describe('progress bar', () => {
    function previewView() {
      return new VideoFilePreviewView({
        model: support.factories.file({preview_url: '/video_low.mp4'})
      });
    }

    it('seeks the video', () => {
      const view = previewView();

      render(view);
      const video = view.$el.find('video')[0];
      Object.defineProperty(video, 'duration', {get: () => 120, configurable: true});
      view.$el.find('video').trigger('durationchange');

      view.$el.find('.file_preview-progress input').val(30).trigger('input');

      expect(video.currentTime).toBe(30);
    });

    it('comes before the mute button', () => {
      const view = previewView();

      render(view);

      expect(view.$el.find('.file_preview-controls > *').map((index, element) => {
        return element.className;
      }).get()).toEqual(['file_preview-progress', 'file_preview-mute_toggle']);
    });
  });

  describe('sound', () => {
    function previewView() {
      return new VideoFilePreviewView({
        model: support.factories.file({preview_url: '/video_low.mp4'})
      });
    }

    it('is turned on by clicking the video', () => {
      const view = previewView();

      render(view);
      view.$el.find('video').trigger('click');

      expect(view.$el.find('video')[0].muted).toBe(false);
    });

    it('is turned off by clicking the video again', () => {
      const view = previewView();

      render(view);
      view.$el.find('video').trigger('click');
      view.$el.find('video').trigger('click');

      expect(view.$el.find('video')[0].muted).toBe(true);
    });

    it('is turned on by clicking the button', () => {
      const view = previewView();

      const {getByRole} = render(view);
      getByRole('button', {name: 'Unmute'}).click();

      expect(view.$el.find('video')[0].muted).toBe(false);
    });

    it('is turned off by clicking the button again', () => {
      const view = previewView();

      const {getByRole} = render(view);
      getByRole('button', {name: 'Unmute'}).click();
      getByRole('button', {name: 'Mute'}).click();

      expect(view.$el.find('video')[0].muted).toBe(true);
    });

    function shownIcons(view) {
      return ['muted', 'unmuted'].filter(function(name) {
        return !view.$el.find('.file_preview-' + name).hasClass('is_hidden');
      });
    }

    it('is indicated by the icon of the button', () => {
      const view = previewView();

      render(view);

      expect(shownIcons(view)).toEqual(['muted']);

      view.$el.find('video').trigger('click');

      expect(shownIcons(view)).toEqual(['unmuted']);
    });

    it('keeps the button reachable once unmuted', () => {
      const view = previewView();

      const {getByRole} = render(view);
      view.$el.find('video').trigger('click');

      expect(getByRole('button', {name: 'Mute'})).not.toBeNull();
    });
  });

  it('updates once the file has been encoded', () => {
    const file = support.factories.file({});
    const view = new VideoFilePreviewView({model: file});

    render(view);
    file.set('preview_url', '/video_low.mp4');

    expect(view.$el.find('video').attr('src')).toBe('/video_low.mp4');
  });
});
