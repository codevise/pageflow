import {textTracks} from '../selectors';
import {updateTextTrackSettings} from '../actions';

import filesModule from 'files';
import {file} from 'files/selectors';

import settingsModule from 'settings';
import {update as updateSetting} from 'settings/actions';

import i18nModule from 'i18n';

import Backbone from 'backbone';
import createStore from 'createStore';


describe('textTracks selector', () => {
  beforeEach(() => {
    window.I18n = {
      t() {
        return '(translation)';
      }
    };
  });

  const videoFile1Id = 2004;
  const videoFile1PermaId = 2400;
  const videoFile1TextTrackEnId = 3001;
  const videoFile1TextTrackEnPermaId = 3100;
  const videoFile1TextTrackDeId = 3002;
  const videoFile1TextTrackDePermaId = 3200;

  const videoFile2Id = 2005;
  const videoFile2PermaId = 2500;
  const videoFile2TextTrackDeId = 4001;
  const videoFile2TextTrackDePermaId = 4100;

  const files = {
    'video_files': [
      {id: videoFile1Id, perma_id: videoFile1PermaId, variants: []},
      {id: videoFile2Id, perma_id: videoFile2PermaId, variants: []}
    ],
    'text_track_files': [
      {
        id: videoFile1TextTrackEnId,
        perma_id: videoFile1TextTrackEnPermaId,
        parent_file_id: videoFile1Id,
        parent_file_model_type: 'Pageflow::VideoFile',
        configuration: {
          kind: 'subtitles',
          srclang: 'en'
        }
      },
      {
        id: videoFile1TextTrackDeId,
        perma_id: videoFile1TextTrackDePermaId,
        parent_file_id: videoFile1Id,
        parent_file_model_type: 'Pageflow::VideoFile',
        configuration: {
          kind: 'captions',
          srclang: 'de',
          label: 'German'
        }
      },
      {
        id: videoFile2TextTrackDeId,
        perma_id: videoFile2TextTrackDePermaId,
        parent_file_id: videoFile2Id,
        parent_file_model_type: 'Pageflow::VideoFile',
        configuration: {
          kind: 'captions',
          srclang: 'de'
        }
      }
    ]
  };

  it('selects text tracks of given file', () => {
    const state = sample({files});

    const result = textTracks({
      file: file('videoFiles', {id: videoFile1PermaId})
    })(state);

    expect(result).toHaveProperty('files', 0, 'id', videoFile1TextTrackEnId);
    expect(result).toHaveProperty('files', 1, 'id', videoFile1TextTrackDeId);
  });

  it('sets activeFileId to id of selected text track', () => {
    const state = sample({
      files,
      selectedTextTrack: file('textTrackFiles', {id: videoFile1TextTrackDePermaId})
    });

    const result = textTracks({
      file: file('videoFiles', {id: videoFile1PermaId})
    })(state);

    expect(result).toHaveProperty('activeFileId', videoFile1TextTrackDeId);
  });

  it('sets activeFileId to id of text track with matching language', () => {
    const state = sample({
      files,
      selectedTextTrack: file('textTrackFiles', {id: videoFile1TextTrackDePermaId})
    });

    const result = textTracks({
      file: file('videoFiles', {id: videoFile2PermaId})
    })(state);

    expect(result).toHaveProperty('activeFileId', videoFile2TextTrackDeId);
  });

  it(
    'sets activeFileId to id of text track given by defaultTextTrackFileId selector if non matches setting',
    () => {
      const state = sample({
        files,
        selectedTextTrack: file('textTrackFiles', {id: videoFile1TextTrackEnPermaId}),
      });

      const result = textTracks({
        file: file('videoFiles', {id: videoFile2PermaId}),
        defaultTextTrackFileId: () => videoFile2TextTrackDePermaId
      })(state);

      expect(result).toHaveProperty('activeFileId', videoFile2TextTrackDeId);
    }
  );

  it(
    'sets activeFileId to falsy if defaultTextTrackFileId selector gives unknown id',
    () => {
      const state = sample({
        files,
        selectedTextTrack: file('textTrackFiles', {id: videoFile1TextTrackEnPermaId}),
      });

      const result = textTracks({
        file: file('videoFiles', {id: videoFile2PermaId}),
        defaultTextTrackFileId: () => 8000
      })(state);

      expect(result.activeFileId).toBeFalsy();
    }
  );

  it('sets activeFileId to null if kind is "off"', () => {
    const state = sample({
      files,
      selectedTextTrack: () => ({kind: 'off'}),
    });

    const result = textTracks({
      file: file('videoFiles', {id: videoFile2PermaId}),
      defaultTextTrackFileId: () => videoFile2TextTrackDePermaId
    })(state);

    expect(result.activeFileId).toBeFalsy();
  });

  it('sets activeFileId to id of of first captions if mute', () => {
    const state = sample({
      files,
      volume: 0,
      locale: 'de'
    });

    const result = textTracks({
      file: file('videoFiles', {id: videoFile1PermaId})
    })(state);

    expect(result).toHaveProperty('activeFileId', videoFile1TextTrackDeId);
  });

  it('sets activeFileId to id of of subtitles matching entry locale', () => {
    const state = sample({
      files,
      locale: 'en'
    });

    const result = textTracks({
      file: file('videoFiles', {id: videoFile1PermaId})
    })(state);

    expect(result).toHaveProperty('activeFileId', videoFile1TextTrackEnId);
  });

  it('adds displayLabel', () => {
    const state = sample({files});

    const result = textTracks({
      file: file('videoFiles', {id: videoFile1PermaId})
    })(state);

    expect(result).toHaveProperty(['files', 1, 'displayLabel'], 'German');
  });
});

function sample({
  files,
  fileUrlTemplates = {
    video_files: {},
    text_track_files: {},
  },
  modelTypes = {
    video_files: 'Pageflow::VideoFile',
    text_track_files: 'Pageflow::TextTrackFile'
  },
  selectedTextTrack,
  volume,
  locale = 'en'
}) {
  const store = createStore([
    i18nModule,
    filesModule,
    settingsModule
  ], {
    locale,
    files,
    fileUrlTemplates,
    modelTypes,
    settings: new Backbone.Model()
  });

  if (selectedTextTrack) {
    store.dispatch(updateTextTrackSettings(selectedTextTrack(store.getState())));
  }

  if (volume !== undefined) {
    store.dispatch(updateSetting({
      property: 'volume',
      value: volume
    }));
  }

  return store.getState();
}
