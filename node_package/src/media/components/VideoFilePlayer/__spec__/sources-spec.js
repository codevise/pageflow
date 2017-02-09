import sources from '../sources';

import {expect} from 'support/chai';

describe('sources', () => {
  it('includes hls variant by default', () => {
    const videoFile = {urls: {}};

    const result = sources(videoFile);

    expect(result.map(s => s.type)).to.include('application/x-mpegURL');
  });

  it('includes mp4 variant by default', () => {
    const videoFile = {urls: {}};

    const result = sources(videoFile);

    expect(result.map(s => s.type)).to.include('video/mp4');
  });

  it('does not include dash variant by default', () => {
    const videoFile = {urls: {}};

    const result = sources(videoFile);

    expect(result.map(s => s.type)).not.to.include('application/dash+xml');
  });

  it('includes dash variant if file has dash playlist url', () => {
    const videoFile = {urls: {'dash-playlist': 'http://example.com/4/maifest.mpd'}};

    const result = sources(videoFile);

    expect(result.map(s => s.type)).to.include('application/dash+xml');
  });

  it('uses medium quality if requested', () => {
    const videoFile = {urls: {'medium': 'http://example.com/4/medium.mp4'}};

    const result = sources(videoFile, 'medium');

    expect(result.length).to.eq(1);
    expect(result[0].src).to.include('medium.mp4');
  });

  it('uses fullhd quality if requested and available', () => {
    const videoFile = {urls: {
      'high': 'http://example.com/4/high.mp4',
      'fullhd': 'http://example.com/4/fullhd.mp4'
    }};

    const result = sources(videoFile, 'fullhd');

    expect(result.length).to.eq(1);
    expect(result[0].src).to.include('fullhd.mp4');
  });

  it('falls back to medium quality if fullhd is requested and but not available', () => {
    const videoFile = {urls: {
      'high': 'http://example.com/4/high.mp4'
    }};

    const result = sources(videoFile, 'fullhd');

    expect(result.length).to.eq(1);
    expect(result[0].src).to.include('high.mp4');
  });

  it('uses 4k quality if requested and available', () => {
    const videoFile = {urls: {
      'high': 'http://example.com/4/high.mp4',
      '4k': 'http://example.com/4/4k.mp4'
    }};

    const result = sources(videoFile, '4k');

    expect(result.length).to.eq(1);
    expect(result[0].src).to.include('4k.mp4');
  });

  it('falls back to high quality if fullhd is requested and but not available', () => {
    const videoFile = {urls: {
      'high': 'http://example.com/4/high.mp4'
    }};

    const result = sources(videoFile, '4k');

    expect(result.length).to.eq(1);
    expect(result[0].src).to.include('high.mp4');
  });
});
