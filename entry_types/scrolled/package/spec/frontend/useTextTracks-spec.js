import {useTextTracks} from 'frontend/useTextTracks';
import {useFile} from 'entryState';
import {settings} from 'pageflow/frontend';

import {renderHookInEntry} from 'support';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {act} from '@testing-library/react-hooks';

describe('useTextTracks', () => {
  const videoFile1Id = 2004;
  const videoFile1PermaId = 2400;
  const videoFile1SubtitlesEnId = 3001;
  const videoFile1SubtitlesEnPermaId = 3100;
  const videoFile1CaptionsDeId = 3002;
  const videoFile1CaptionsDePermaId = 3200;

  const videoFile2Id = 2005;
  const videoFile2PermaId = 2500;
  const videoFile2CaptionsDeId = 4001;
  const videoFile2CaptionsDePermaId = 4100;

  const seed = {
    videoFiles: [
      {id: videoFile1Id, permaId: videoFile1PermaId},
      {id: videoFile2Id, permaId: videoFile2PermaId}
    ],
    textTrackFiles: [
      {
        id: videoFile1SubtitlesEnId,
        permaId: videoFile1SubtitlesEnPermaId,
        parentFileId: videoFile1Id,
        parentFileModelType: 'Pageflow::VideoFile',
        configuration: {
          kind: 'subtitles',
          srclang: 'en'
        }
      },
      {
        id: videoFile1CaptionsDeId,
        permaId: videoFile1CaptionsDePermaId,
        parentFileId: videoFile1Id,
        parentFileModelType: 'Pageflow::VideoFile',
        configuration: {
          kind: 'captions',
          srclang: 'de'
        }
      },
      {
        id: videoFile2CaptionsDeId,
        permaId: videoFile2CaptionsDePermaId,
        parentFileId: videoFile2Id,
        parentFileModelType: 'Pageflow::VideoFile',
        configuration: {
          kind: 'captions',
          srclang: 'de',
          label: 'German'
        }
      }
    ]
  };

  useFakeTranslations({
    'pageflow_scrolled.public.languages.en': 'English',
    'pageflow_scrolled.public.languages.unknown': 'Unknown',
    'pageflow_scrolled.public.text_track_modes.auto': 'Auto (%{label})',
    'pageflow_scrolled.public.text_track_modes.auto_off': 'Auto (Off)'
  });

  beforeEach(() => settings.set('textTrack', null));

  it('returns text tracks of given file', () => {
    const {result} = renderHookInEntry(() => useTextTracks({
      file: useFile({collectionName: 'videoFiles', permaId: videoFile1PermaId})
    }), {seed});

    expect(result.current.files).toMatchObject([
      {
        id: videoFile1SubtitlesEnId,
        displayLabel: 'English'
      },
      {
        id: videoFile1CaptionsDeId,
        displayLabel: 'Unknown'
      }
    ]);
  });

  it('uses custom display label', () => {
    const {result} = renderHookInEntry(() => useTextTracks({
      file: useFile({collectionName: 'videoFiles', permaId: videoFile2PermaId})
    }), {seed});

    expect(result.current.files).toMatchObject([
      {
        id: videoFile2CaptionsDeId,
        displayLabel: 'German'
      }
    ]);
  });

  it('sets activeFileId to id of text track matching current settings', () => {
    settings.set('textTrack', {kind: 'captions', srclang: 'de'});

    const {result} = renderHookInEntry(() => useTextTracks({
      file: useFile({collectionName: 'videoFiles', permaId: videoFile1PermaId})
    }), {seed});

    expect(result.current).toMatchObject({
      activeFileId: videoFile1CaptionsDeId,
      mode: 'user',
      autoDisplayLabel: 'Auto (Off)'
    });
  });

  it('sets activeFileId to null if kind in settings is "off"', () => {
    settings.set('textTrack', {kind: 'off'});

    const {result} = renderHookInEntry(() => useTextTracks({
      file: useFile({collectionName: 'videoFiles', permaId: videoFile1PermaId})
    }), {seed});

    expect(result.current).toMatchObject({
      activeFileId: null,
      mode: 'off',
      autoDisplayLabel: 'Auto (Off)'
    });
  });

  it('sets activeFileId to null if non matches setting', () => {
    settings.set('textTrack', {kind: 'subtitle', srclang: 'en'});

    const {result} = renderHookInEntry(() => useTextTracks({
      file: useFile({collectionName: 'videoFiles', permaId: videoFile2PermaId})
    }), {seed});

    expect(result.current.activeFileId).toBeNull();
  });

  it('sets activeFileId to given default if non matches setting', () => {
    settings.set('textTrack', {kind: 'subtitle', srclang: 'en'});

    const {result} = renderHookInEntry(() => useTextTracks({
      file: useFile({collectionName: 'videoFiles', permaId: videoFile2PermaId}),
      defaultTextTrackFilePermaId: videoFile2CaptionsDePermaId
    }), {seed});

    expect(result.current).toMatchObject({
      activeFileId: videoFile2CaptionsDeId,
      mode: 'user',
      autoDisplayLabel: 'Auto (German)'
    });
  });

  it('sets activeFileId to first captions if captions enabled by default', () => {
    const {result} = renderHookInEntry(() => useTextTracks({
      file: useFile({collectionName: 'videoFiles', permaId: videoFile1PermaId}),
      captionsByDefault: true
    }), {seed});

    expect(result.current).toMatchObject({
      activeFileId: videoFile1CaptionsDeId,
      mode: 'auto',
      autoDisplayLabel: 'Auto (Unknown)'
    });
  });

  it('sets activeFileId to subtitles matching entry locale by default', () => {
    const {result} = renderHookInEntry(() => useTextTracks({
      file: useFile({collectionName: 'videoFiles', permaId: videoFile1PermaId}),
      captionsByDefault: true
    }), {
      seed: {
        entry: {locale: 'en'},
        ...seed
      }
    });

    expect(result.current).toMatchObject({
      activeFileId: videoFile1SubtitlesEnId,
      mode: 'auto',
      autoDisplayLabel: 'Auto (English)'
    });
  });

  it('provides select function which update settings', () => {
    const {result} = renderHookInEntry(() => useTextTracks({
      file: useFile({collectionName: 'videoFiles', permaId: videoFile1PermaId})
    }), {seed});

    const {select} = result.current;
    act(() => select(videoFile1CaptionsDeId));

    expect(settings.get('textTrack')).toMatchObject({
      kind: 'captions',
      srclang: 'de'
    });
  });

  it('provides select function which allows turning text tracks off', () => {
    const {result} = renderHookInEntry(() => useTextTracks({
      file: useFile({collectionName: 'videoFiles', permaId: videoFile1PermaId})
    }), {seed});

    const {select} = result.current;
    act(() => select('off'));

    expect(settings.get('textTrack')).toMatchObject({
      kind: 'off'
    });
  });

  it('provides select function which allows returning to auto mode', () => {
    const {result} = renderHookInEntry(() => useTextTracks({
      file: useFile({collectionName: 'videoFiles', permaId: videoFile1PermaId})
    }), {seed});

    const {select} = result.current;
    act(() => select('auto'));

    expect(settings.get('textTrack')).toMatchObject({});
  });
});
