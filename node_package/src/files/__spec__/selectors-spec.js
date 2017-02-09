import {file, nestedFiles, fileExists} from '../selectors';
import filesModule from 'files';

import createStore from 'createStore';

import {expect} from 'support/chai';

describe('file', () => {
  it('selects file id and variants', () => {
    const files = {'video_files': [{id: 5, variants: ['high']}]};
    const state = sample({files});

    const result = file('videoFiles', {id: 5})(state);

    expect(result).to.have.property('id', 5);
    expect(result).to.have.deep.property('variants[0]', 'high');
  });

  it('selects null if id is unknown', () => {
    const files = {'video_files': []};
    const state = sample({files});

    const result = file('videoFiles', {id: 5})(state);

    expect(result).to.eql(null);
  });

  it('includes parent file info', () => {
    const files = {'text_track_files': [
      {id: 5, variants: [], parent_file_id: 6, parent_file_model_type: 'Pageflow::VideoFile'}
    ]};
    const modelTypes = {
      'text_track_files': 'Pageflow::TextTrackFile'
    };
    const state = sample({files, modelTypes});

    const result = file('textTrackFiles', {id: 5})(state);

    expect(result).to.have.property('parentFileId', 6);
    expect(result).to.have.deep.property('parentFileModelType', 'Pageflow::VideoFile');
  });

  it('sets modelType from mapping', () => {
    const files = {'video_files': [{id: 5, variants: ['high']}]};
    const modelTypes = {'video_files': 'Pageflow::VideoFile'};
    const state = sample({files, modelTypes});

    const result = file('videoFiles', {id: 5})(state);

    expect(result).to.have.property('modelType', 'Pageflow::VideoFile');
  });

  it('sets collectionName', () => {
    const files = {'video_files': [{id: 5, variants: ['high']}]};
    const modelTypes = {'video_files': 'Pageflow::VideoFile'};
    const state = sample({files, modelTypes});

    const result = file('videoFiles', {id: 5})(state);

    expect(result).to.have.property('collectionName', 'videoFiles');
  });

  it('interpolates id partition into file url template', () => {
    const files = {'video_files': [{id: 2004, variants: ['high']}]};
    const fileUrlTemplates = {'video_files': {'high': 'http://example.com/:id_partition/high.mp4'}};
    const state = sample({files, fileUrlTemplates});

    const result = file('videoFiles', {id: 2004})(state);

    expect(result).to.have.deep.property('urls.high', 'http://example.com/000/002/004/high.mp4');
  });

  it('interpolates basename into file url template', () => {
    const files = {'video_files': [{id: 2004, variants: ['high'], basename: 'my-video'}]};
    const fileUrlTemplates = {'video_files': {'high': 'http://example.com/:basename.mp4'}};
    const state = sample({files, fileUrlTemplates});

    const result = file('videoFiles', {id: 2004})(state);

    expect(result).to.have.deep.property('urls.high', 'http://example.com/my-video.mp4');
  });

  it('skips url with missing template', () => {
    const files = {'video_files': [{id: 2004, variants: ['unknown']}]};
    const fileUrlTemplates = {'video_files': {}};
    const state = sample({files, fileUrlTemplates});

    const result = file('videoFiles', {id: 2004})(state);

    expect(result).not.to.have.deep.property('urls.unknown');
  });

  it('includes urls for all templates if variants is undefined', () => {
    const files = {'video_files': [{id: 2004, variants: undefined}]};
    const fileUrlTemplates = {'video_files': {'high': 'http://example.com/:id_partition/high.mp4'}};
    const state = sample({files, fileUrlTemplates});

    const result = file('videoFiles', {id: 2004})(state);

    expect(result).to.have.deep.property('urls.high');
  });
});

describe('nestedFiles', () => {
  it('selects nested files of given parent', () => {
    const files = {
      'video_files': [{id: 2004, variants: ['unknown']}],
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
      parent: file('videoFiles', {id: 2004})
    })(state);

    expect(result).to.have.deep.property('[0].id', 3001);
  });

  it('filters out unsaved files', () => {
    const files = {
      'video_files': [{id: 2004, variants: ['unknown']}],
      'text_track_files': [
        {
          parent_file_id: 2004,
          parent_file_model_type: 'Pageflow::VideoFile'
        }
      ]
    };
    const state = sample({files});

    const result = nestedFiles('textTrackFiles', {
      parent: file('videoFiles', {id: 2004})
    })(state);

    expect(result).to.eql([]);
  });

  it('selects empty array if parent is undefined', () => {
    const files = {
      'video_files': [{id: 2004, variants: ['unknown']}],
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

    expect(result).to.eql([]);
  });

  it('expands urls in files', () => {
    const files = {
      'video_files': [{id: 2004, variants: ['unknown']}],
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
      parent: file('videoFiles', {id: 2004})
    })(state);

    expect(result).to.have.deep.property('[0].urls.original');
  });
});

describe('fileExists', () => {
  it('returns function to check if given file exists', () => {
    const files = {
      'image_files': [{id: 1}, {id: 5}],
      'video_files': []
    };
    const state = sample({files});

    const fn = fileExists()(state);

    expect(fn('imageFiles', 5)).to.eq(true);
    expect(fn('imageFiles', 6)).to.eq(false);
    expect(fn('videoFiles', 5)).to.eq(false);
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
