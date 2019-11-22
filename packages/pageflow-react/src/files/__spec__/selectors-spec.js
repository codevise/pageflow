import {file, nestedFiles, fileExists} from '../selectors';
import filesModule from 'files';

import createStore from 'createStore';


describe('file', () => {
  it('selects file id and variants', () => {
    const files = {'video_files': [{id: 5, perma_id: 50, variants: ['high']}]};
    const state = sample({files});

    const result = file('videoFiles', {id: 50})(state);

    expect(result).toHaveProperty('id', 5);
    expect(result).toHaveProperty(['variants', 0], 'high');
  });

  it('selects null if id is unknown', () => {
    const files = {'video_files': []};
    const state = sample({files});

    const result = file('videoFiles', {id: 5})(state);

    expect(result).toBe(null);
  });

  it('includes parent file info', () => {
    const files = {'text_track_files': [
      {id: 5, perma_id: 50, variants: [], parent_file_id: 6, parent_file_model_type: 'Pageflow::VideoFile'}
    ]};
    const modelTypes = {
      'text_track_files': 'Pageflow::TextTrackFile'
    };
    const state = sample({files, modelTypes});

    const result = file('textTrackFiles', {id: 50})(state);

    expect(result).toHaveProperty('parentFileId', 6);
    expect(result).toHaveProperty('parentFileModelType', 'Pageflow::VideoFile');
  });

  it('sets modelType from mapping', () => {
    const files = {'video_files': [{id: 5, perma_id: 50, variants: ['high']}]};
    const modelTypes = {'video_files': 'Pageflow::VideoFile'};
    const state = sample({files, modelTypes});

    const result = file('videoFiles', {id: 50})(state);

    expect(result).toHaveProperty('modelType', 'Pageflow::VideoFile');
  });

  it('sets collectionName', () => {
    const files = {'video_files': [{id: 5, perma_id: 50, variants: ['high']}]};
    const modelTypes = {'video_files': 'Pageflow::VideoFile'};
    const state = sample({files, modelTypes});

    const result = file('videoFiles', {id: 50})(state);

    expect(result).toHaveProperty('collectionName', 'videoFiles');
  });

  it('interpolates id partition into file url template', () => {
    const files = {'video_files': [{id: 2004, perma_id: 31, variants: ['high']}]};
    const fileUrlTemplates = {'video_files': {'high': 'http://example.com/:id_partition/high.mp4'}};
    const state = sample({files, fileUrlTemplates});

    const result = file('videoFiles', {id: 31})(state);

    expect(result).toHaveProperty('urls.high', 'http://example.com/000/002/004/high.mp4');
  });

  it('interpolates basename into file url template', () => {
    const files = {'video_files': [{id: 2004, perma_id: 31, variants: ['high'], basename: 'my-video'}]};
    const fileUrlTemplates = {'video_files': {'high': 'http://example.com/:basename.mp4'}};
    const state = sample({files, fileUrlTemplates});

    const result = file('videoFiles', {id: 31})(state);

    expect(result).toHaveProperty('urls.high', 'http://example.com/my-video.mp4');
  });

  it('skips url with missing template', () => {
    const files = {'video_files': [{id: 2004, perma_id: 31, variants: ['unknown']}]};
    const fileUrlTemplates = {'video_files': {}};
    const state = sample({files, fileUrlTemplates});

    const result = file('videoFiles', {id: 31})(state);

    expect(result).not.toHaveProperty('urls.unknown');
  });

  it('includes urls for all templates if variants is undefined', () => {
    const files = {'video_files': [{id: 2004, perma_id: 31, variants: undefined}]};
    const fileUrlTemplates = {'video_files': {'high': 'http://example.com/:id_partition/high.mp4'}};
    const state = sample({files, fileUrlTemplates});

    const result = file('videoFiles', {id: 31})(state);

    expect(result).toHaveProperty('urls.high');
  });
});

describe('nestedFiles', () => {
  it('selects nested files of given parent', () => {
    const files = {
      'video_files': [{id: 2004, perma_id: 31, variants: ['unknown']}],
      'text_track_files': [
        {
          id: 3001,
          parent_file_id: 2004,
          parent_file_model_type: 'Pageflow::VideoFile'
        }
      ]
    };
    const modelTypes = {
      'video_files': 'Pageflow::VideoFile',
      'text_track_files': 'Pageflow::TextTrackFile'
    };
    const state = sample({files, modelTypes});

    const result = nestedFiles('textTrackFiles', {
      parent: file('videoFiles', {id: 31})
    })(state);

    expect(result).toHaveProperty([0, 'id'], 3001);
  });

  it('filters out unsaved files', () => {
    const files = {
      'video_files': [{id: 2004, perma_id: 31, variants: ['unknown']}],
      'text_track_files': [
        {
          parent_file_id: 2004,
          parent_file_model_type: 'Pageflow::VideoFile'
        }
      ]
    };
    const state = sample({files});

    const result = nestedFiles('textTrackFiles', {
      parent: file('videoFiles', {id: 31})
    })(state);

    expect(result).toEqual([]);
  });

  it('selects empty array if parent is undefined', () => {
    const files = {
      'video_files': [{id: 2004, perma_id: 31, variants: ['unknown']}],
      'text_track_files': [
        {
          id: 3001,
          parent_file_id: 2004,
          parent_file_model_type: 'Pageflow::VideoFile'
        }
      ]
    };
    const state = sample({files});

    const result = nestedFiles('textTrackFiles', {
      parent: file('videoFiles', {id: 'not_there'})
    })(state);

    expect(result).toEqual([]);
  });

  it('expands urls in files', () => {
    const files = {
      'video_files': [{id: 2004, perma_id: 31, variants: ['unknown']}],
      'text_track_files': [
        {
          id: 3001,
          parent_file_id: 2004,
          parent_file_model_type: 'Pageflow::VideoFile'
        }
      ]
    };
    const fileUrlTemplates = {
      'video_files': {},
      'text_track_files': {'original': 'http://example.com/:id_partition/file.vtt'}
    };
    const state = sample({files, fileUrlTemplates});

    const result = nestedFiles('textTrackFiles', {
      parent: file('videoFiles', {id: 31})
    })(state);

    expect(result).toHaveProperty([0, 'urls', 'original']);
  });
});

describe('fileExists', () => {
  it('returns function to check if given file exists', () => {
    const files = {
      'image_files': [{id: 1, perma_id: 201}, {id: 5, perma_id: 205}],
      'video_files': []
    };
    const state = sample({files});

    const fn = fileExists()(state);

    expect(fn('imageFiles', 205)).toBe(true);
    expect(fn('imageFiles', 206)).toBe(false);
    expect(fn('videoFiles', 205)).toBe(false);
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
  }
}) {
  const store = createStore([filesModule], {files, fileUrlTemplates, modelTypes});
  return store.getState();
}
