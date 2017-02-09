import {textTracks} from '../selectors';
import {updateTextTrackSettings} from '../actions';

import filesModule from 'files';
import {file} from 'files/selectors';

import settingsModule from 'settings';
import {update as updateSetting} from 'settings/actions';

import i18nModule from 'i18n';

import Backbone from 'backbone';
import createStore from 'createStore';

import {expect} from 'support/chai';

describe('textTracks selector', () => {
  beforeEach(() => {
    window.I18n = {
      t() {
        return '(translation)';
      }
    };
  });

  const files = {
    'video_files': [
      {id: 2004, variants: []},
      {id: 2005, variants: []}
    ],
    'text_track_files': [
      {
        id: 3001,
        parent_file_id: 2004,
        parent_file_model_type: 'Pageflow::VideoFile',
        configuration: {
          kind: 'subtitles',
          srclang: 'en'
        }
      },
      {
        id: 3002,
        parent_file_id: 2004,
        parent_file_model_type: 'Pageflow::VideoFile',
        configuration: {
          kind: 'captions',
          srclang: 'de',
          label: 'German'
        }
      },
      {
        id: 4001,
        parent_file_id: 2005,
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
      file: file('videoFiles', {id: 2004})
    })(state);

    expect(result).to.have.deep.property('files[0].id', 3001);
  });

  it('sets activeFileId to id of text track matching settings', () => {
    const state = sample({
      files,
      textTrack: file('textTrackFiles', {id: 3002})
    });

    const result = textTracks({
      file: file('videoFiles', {id: 2004})
    })(state);

    expect(result).to.have.deep.property('activeFileId', 3002);
  });

  it('sets activeFileId to id of given by defaultTextTrackFileId selector if non matches setting', () => {
    const state = sample({
      files,
      textTrack: file('textTrackFiles', {id: 3001}),
    });

    const result = textTracks({
      file: file('videoFiles', {id: 2005}),
      defaultTextTrackFileId: () => 4001
    })(state);

    expect(result).to.have.deep.property('activeFileId', 4001);
  });

  it('sets activeFileId to falsy if defaultTextTrackFileId selector gives unknown id', () => {
    const state = sample({
      files,
      textTrack: file('textTrackFiles', {id: 3001}),
    });

    const result = textTracks({
      file: file('videoFiles', {id: 2005}),
      defaultTextTrackFileId: () => 8000
    })(state);

    expect(result.activeFileId).to.be.falsy;
  });

  it('sets activeFileId to null if kind is "off"', () => {
    const state = sample({
      files,
      textTrack: () => ({kind: 'off'}),
    });

    const result = textTracks({
      file: file('videoFiles', {id: 2005}),
      defaultTextTrackFileId: () => 4001
    })(state);

    expect(result.activeFileId).to.be.falsy;
  });

  it('sets activeFileId to id of of first captions if mute', () => {
    const state = sample({
      files,
      volume: 0,
      locale: 'de'
    });

    const result = textTracks({
      file: file('videoFiles', {id: 2004})
    })(state);

    expect(result).to.have.deep.property('activeFileId', 3002);
  });

  it('sets activeFileId to id of of subtitles matching entry locale', () => {
    const state = sample({
      files,
      locale: 'en'
    });

    const result = textTracks({
      file: file('videoFiles', {id: 2004})
    })(state);

    expect(result).to.have.deep.property('activeFileId', 3001);
  });

  it('adds displayLabel', () => {
    const state = sample({files});

    const result = textTracks({
      file: file('videoFiles', {id: 2004})
    })(state);

    expect(result).to.have.deep.property('files[1].displayLabel', 'German');
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
  textTrack,
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

  if (textTrack) {
    store.dispatch(updateTextTrackSettings(textTrack(store.getState())));
  }

  if (volume !== undefined) {
    store.dispatch(updateSetting({
      property: 'volume',
      value: volume
    }));
  }

  return store.getState();
}
