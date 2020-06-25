import {sources} from 'frontend/VideoPlayer/sources';

describe('VideoPlayer sources', () => {
  it('includes hls variant by default', () => {
    const videoFile = {urls: {}};

    const result = sources(videoFile);

    expect(result.map(s => s.type)).toContain('application/x-mpegURL');
  });

  it('includes high mp4 variant by default', () => {
    const videoFile = {urls: {'high': 'http://example.com/4/high.mp4'}};

    const result = sources(videoFile);

    expect(result.map(s => s.type)).toContain('video/mp4');
    expect(result.filter(s => (s.type === 'video/mp4'))[0].src).toContain('high.mp4');
  });

  it('does not include dash variant by default', () => {
    const videoFile = {urls: {}};

    const result = sources(videoFile);

    expect(result.map(s => s.type)).not.toContain('application/dash+xml');
  });

  it('includes dash variant if file has dash playlist url', () => {
    const videoFile = {urls: {'dash-playlist': 'http://example.com/4/manifest.mpd'}};

    const result = sources(videoFile);

    expect(result.map(s => s.type)).toContain('application/dash+xml');
  });

  it('uses medium quality if requested', () => {
    const videoFile = {urls: {'medium': 'http://example.com/4/medium.mp4'}};

    const result = sources(videoFile, 'medium');

    expect(result.length).toBe(1);
    expect(result[0].src).toContain('medium.mp4');
  });

  it('uses fullhd quality if requested and available', () => {
    const videoFile = {urls: {
      'high': 'http://example.com/4/high.mp4',
      'fullhd': 'http://example.com/4/fullhd.mp4'
    }};

    const result = sources(videoFile, 'fullhd');

    expect(result.length).toBe(1);
    expect(result[0].src).toContain('fullhd.mp4');
  });

  it(
    'falls back to high quality if fullhd is requested but not available',
    () => {
      const videoFile = {urls: {
        'high': 'http://example.com/4/high.mp4'
      }};

      const result = sources(videoFile, 'fullhd');

      expect(result.length).toBe(1);
      expect(result[0].src).toContain('high.mp4');
    }
  );

  it('uses 4k quality if requested and available', () => {
    const videoFile = {urls: {
      'high': 'http://example.com/4/high.mp4',
      '4k': 'http://example.com/4/4k.mp4'
    }};

    const result = sources(videoFile, '4k');

    expect(result.length).toBe(1);
    expect(result[0].src).toContain('4k.mp4');
  });

  it('falls back to high quality if 4k is requested but not available', () => {
    const videoFile = {urls: {
      'high': 'http://example.com/4/high.mp4'
    }};

    const result = sources(videoFile, '4k');

    expect(result.length).toBe(1);
    expect(result[0].src).toContain('high.mp4');
  });
});
