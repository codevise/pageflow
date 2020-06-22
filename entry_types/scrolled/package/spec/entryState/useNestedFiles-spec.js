import {useNestedFiles, useFile} from 'entryState';

import {renderHookInEntry} from 'support';

describe('useNestedFiles', () => {
  it('returns nested files of given parent', () => {
    const {result} = renderHookInEntry(() => useNestedFiles({
      collectionName: 'textTrackFiles',
      parent: useFile({collectionName: 'videoFiles', permaId: 10})
    }), {
      seed: {
        videoFiles: [{id: 100, permaId: 10}],
        textTrackFiles: [{id: 200, parentFileId: 100, parentFileModelType: 'Pageflow::VideoFile'}],
        fileUrlTemplates: {
          textTrackFiles: {
            vtt: '/text_track_files/:id_partition/file.vtt'
          }
        },
        fileModelTypes: {
          textTrackFiles: 'Pageflow::TextTrackFile',
          videoFiles: 'Pageflow::VideoFile'
        }
      }
    });

    expect(result.current).toMatchObject([{
      id: 200,
      urls: {
        vtt: '/text_track_files/000/000/200/file.vtt'
      }
    }]);
  });

  it('returns empty array if parent is null', () => {
    const {result} = renderHookInEntry(() => useNestedFiles({
      collectionName: 'textTrackFiles',
      parent: null
    }), {
      seed: {
        videoFiles: [{id: 100, permaId: 10}],
        textTrackFiles: [{id: 200, parentFileId: 100, parentFileModelType: 'Pageflow::VideoFile'}],
        fileUrlTemplates: {
          textTrackFiles: {
            vtt: '/text_track_files/:id_partition/file.vtt'
          }
        },
        fileModelTypes: {
          textTrackFiles: 'Pageflow::TextTrackFile',
          videoFiles: 'Pageflow::VideoFile'
        }
      }
    });

    expect(result.current).toEqual([]);
  });

  it('excludes nested files of other file of same type', () => {
    const {result} = renderHookInEntry(() => useNestedFiles({
      collectionName: 'textTrackFiles',
      parent: useFile({collectionName: 'videoFiles', permaId: 11})
    }), {
      seed: {
        videoFiles: [{id: 100, permaId: 10}, {id: 101, permaId: 11}],
        textTrackFiles: [{id: 200, parentFileId: 100, parentFileModelType: 'Pageflow::VideoFile'}],
        fileModelTypes: {
          textTrackFiles: 'Pageflow::TextTrackFile',
          videoFiles: 'Pageflow::VideoFile'
        }
      }
    });

    expect(result.current).toEqual([]);
  });

  it('excludes nested files of other file with same id of other type', () => {
    const {result} = renderHookInEntry(() => useNestedFiles({
      collectionName: 'textTrackFiles',
      parent: useFile({collectionName: 'videoFiles', permaId: 10})
    }), {
      seed: {
        audioFiles: [{id: 100, permaId: 11}],
        videoFiles: [{id: 100, permaId: 10}],
        textTrackFiles: [{id: 200, parentFileId: 100, parentFileModelType: 'Pageflow::AudioFile'}],
        fileModelTypes: {
          audioFiles: 'Pageflow::AudioFile',
          textTrackFiles: 'Pageflow::TextTrackFile',
          videoFiles: 'Pageflow::VideoFile'
        }
      }
    });

    expect(result.current).toEqual([]);
  });
});
