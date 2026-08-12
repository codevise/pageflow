import $ from 'jquery';

import {FilePreviewProgressBarView} from 'pageflow/editor';

import * as support from '$support';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('FilePreviewProgressBarView', () => {
  support.useFakeTranslations({
    'pageflow.editor.views.file_preview_progress_bar_view.position': 'Playback position'
  });

  function media({duration, currentTime = 0} = {}) {
    // jsdom does not implement media playback.
    const element = document.createElement('audio');

    Object.defineProperty(element, 'duration', {
      get: () => duration === undefined ? NaN : duration,
      configurable: true
    });

    element.currentTime = currentTime;

    return element;
  }

  function progressBarView(element) {
    const view = new FilePreviewProgressBarView({media: element});

    render(view);

    return view;
  }

  it('renders a slider named after what it controls', () => {
    const {getByRole} = render(new FilePreviewProgressBarView({media: media()}));

    expect(getByRole('slider', {name: 'Playback position'})).not.toBeNull();
  });

  it('lets the slider span the duration of the file', () => {
    const view = progressBarView(media({duration: 120}));

    expect(view.$el.find('input').attr('max')).toBe('120');
  });

  it('waits for the duration to become known', () => {
    const element = media();
    const view = progressBarView(element);

    expect(view.$el.find('input').attr('max')).toBe('0');

    Object.defineProperty(element, 'duration', {get: () => 120, configurable: true});
    $(element).trigger('durationchange');

    expect(view.$el.find('input').attr('max')).toBe('120');
  });

  it('follows the current time of the file', () => {
    const element = media({duration: 120});
    const view = progressBarView(element);

    element.currentTime = 30;
    $(element).trigger('timeupdate');

    expect(view.$el.find('input').val()).toBe('30');
    expect(view.el.style.getPropertyValue('--progress')).toBe('25%');
  });

  it('does not fill the bar while the duration is unknown', () => {
    const view = progressBarView(media({currentTime: 5}));

    expect(view.el.style.getPropertyValue('--progress')).toBe('0%');
  });

  it('seeks to the position of the slider', () => {
    const element = media({duration: 120});
    const view = progressBarView(element);

    view.$el.find('input').val(60).trigger('input');

    expect(element.currentTime).toBe(60);
    expect(view.el.style.getPropertyValue('--progress')).toBe('50%');
  });

  it('stops following the file once closed', () => {
    const element = media({duration: 120});
    const view = progressBarView(element);

    view.close();
    element.currentTime = 30;

    expect(() => $(element).trigger('timeupdate')).not.toThrow();
  });
});
