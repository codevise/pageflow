import {AudioFilePreviewView} from 'pageflow/editor';

import * as support from '$support';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('AudioFilePreviewView', () => {
  support.useFakeTranslations({
    'pageflow.editor.views.audio_file_preview_view.pause': 'Pause',
    'pageflow.editor.views.audio_file_preview_view.play': 'Play',
    'pageflow.editor.views.file_preview_progress_bar_view.position': 'Playback position'
  });

  function previewView(attributes) {
    const view = new AudioFilePreviewView({
      model: support.factories.file({
        sources: [{src: '/audio.ogg', type: 'audio/ogg'}],
        ...attributes
      })
    });

    render(view);

    // jsdom does not implement media playback.
    const audio = view.$el.find('audio')[0];
    let paused = true;

    Object.defineProperty(audio, 'paused', {get: () => paused, configurable: true});

    audio.play = () => { paused = false; view.$el.find('audio').trigger('play'); };
    audio.pause = () => { paused = true; view.$el.find('audio').trigger('pause'); };

    view.simulateEnded = () => { paused = true; view.$el.find('audio').trigger('ended'); };

    return view;
  }

  function shownControls(view) {
    return ['play', 'pause'].filter(function(name) {
      return !view.$el.find('.file_preview-' + name).hasClass('is_hidden');
    });
  }

  it('renders a source per encoding', () => {
    const view = previewView({
      sources: [
        {src: '/audio.ogg', type: 'audio/ogg'},
        {src: '/audio.m4a', type: 'audio/mp4'}
      ]
    });

    expect(view.$el.find('source').map((index, source) => [[
      source.getAttribute('src'),
      source.getAttribute('type')
    ]]).get()).toEqual([
      ['/audio.ogg', 'audio/ogg'],
      ['/audio.m4a', 'audio/mp4']
    ]);
  });

  it('does not loop', () => {
    const view = previewView();

    expect(view.$el.find('audio')[0].hasAttribute('loop')).toBe(false);
    expect(view.$el.find('audio')[0].hasAttribute('autoplay')).toBe(false);
  });

  it('offers to play while paused', () => {
    const view = previewView();

    expect(shownControls(view)).toEqual(['play']);
  });

  it('offers to pause while playing', () => {
    const view = previewView();

    view.$el.find('.file_preview-play_toggle').trigger('click');

    expect(shownControls(view)).toEqual(['pause']);
  });

  it('offers to play again once paused', () => {
    const view = previewView();

    view.$el.find('.file_preview-play_toggle').trigger('click');
    view.$el.find('.file_preview-play_toggle').trigger('click');

    expect(shownControls(view)).toEqual(['play']);
  });

  it('offers to play again once the file has ended', () => {
    const view = previewView();

    view.$el.find('.file_preview-play_toggle').trigger('click');
    view.simulateEnded();

    expect(shownControls(view)).toEqual(['play']);
  });

  it('seeks via the progress bar', () => {
    const view = previewView();
    const audio = view.$el.find('audio')[0];
    Object.defineProperty(audio, 'duration', {get: () => 120, configurable: true});
    view.$el.find('audio').trigger('durationchange');

    view.$el.find('.file_preview-progress input').val(30).trigger('input');

    expect(audio.currentTime).toBe(30);
  });

  it('names the play button after what it does', () => {
    const view = previewView();

    expect(view.$el.find('.file_preview-play_toggle').attr('aria-label')).toBe('Play');

    view.$el.find('.file_preview-play_toggle').trigger('click');

    expect(view.$el.find('.file_preview-play_toggle').attr('aria-label')).toBe('Pause');
  });

  it('updates once the file has been encoded', () => {
    const view = previewView({sources: undefined});

    view.model.set('sources', [{src: '/audio.ogg', type: 'audio/ogg'}]);

    expect(view.$el.find('source').attr('src')).toBe('/audio.ogg');
  });
});
