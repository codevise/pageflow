import {processSources} from 'frontend/AudioPlayer';
import {browser} from 'pageflow/frontend';

describe('AudioPlayer processSources', () => {
  beforeEach(() => jest.restoreAllMocks());

  it('includes ogg, mp3 and m4a by default', () => {
    const audioFile = {urls: {
      'ogg': 'http://example.com/4/audio.ogg',
      'mp3': 'http://example.com/4/audio.mp3',
      'm4a': 'http://example.com/4/audio.m4a',
    }};

    const result = processSources(audioFile);

    expect(result.map(s => s.type)).toEqual(['audio/ogg', 'audio/mp3', 'audio/m4a']);
  });

  it('excludes ogg source if broken', () => {
    jest.spyOn(browser, 'has').mockImplementation(name => name === 'broken ogg support');

    const audioFile = {urls: {
      'ogg': 'http://example.com/4/audio.ogg',
      'mp3': 'http://example.com/4/audio.mp3',
      'm4a': 'http://example.com/4/audio.m4a',
    }};

    const result = processSources(audioFile);

    expect(result.map(s => s.type)).toEqual(['audio/mp3', 'audio/m4a']);
  });
});
