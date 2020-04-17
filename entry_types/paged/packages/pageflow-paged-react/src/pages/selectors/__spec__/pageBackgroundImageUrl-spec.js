import pageBackgroundImageUrl from '../pageBackgroundImageUrl';
import filesModule from 'files';
import pageTypesModule from 'pageTypes';

import createStore from 'createStore';


describe('pageBackgroundImageUrl', () => {
  it('returns url of image file thumbnail candidiate', () => {
    const page = {
      type: 'image',
      backgroundImageId: 100
    };
    const state = sample({
      pageTypes: {
        image: {
          thumbnailCandidates: [
            {
              attribute: 'backgroundImageId',
              collectionName: 'image_files'
            }
          ]
        }
      },
      files: {
        'image_files': [{id: 10, perma_id: 100, variants: ['medium']}]
      },
      fileUrlTemplates: {
        'image_files': {
          'medium': 'http://example.com/:id_partition/medium.jpg'
        }
      }
    });

    const result = pageBackgroundImageUrl({page: () => page, variant: 'medium'})(state);

    expect(result).toBe('http://example.com/000/000/010/medium.jpg');
  });

  it('returns poster url of video file thumbnail candidiate', () => {
    const page = {
      type: 'video',
      videoId: 100
    };
    const state = sample({
      pageTypes: {
        video: {
          thumbnailCandidates: [
            {
              attribute: 'videoId',
              collectionName: 'video_files'
            }
          ]
        }
      },
      files: {
        'video_files': [{id: 10, perma_id: 100, variants: ['poster_medium']}]
      },
      fileUrlTemplates: {
        'video_files': {
          'poster_medium': 'http://example.com/:id_partition/poster_medium.jpg'
        }
      }
    });

    const result = pageBackgroundImageUrl({page: () => page, variant: 'medium'})(state);

    expect(result).toBe('http://example.com/000/000/010/poster_medium.jpg');
  });

  it('returns undefined if thumbnail candidate is not present', () => {
    const page = {
      type: 'video',
      videoId: undefined
    };
    const state = sample({
      pageTypes: {
        video: {
          thumbnailCandidates: [
            {
              attribute: 'videoId',
              collectionName: 'video_files'
            }
          ]
        }
      },
      files: {
        'video_files': []
      },
      fileUrlTemplates: {
        'video_files': {
          'poster_medium': 'http://example.com/:id_partition/poster_medium.jpg'
        }
      }
    });

    const result = pageBackgroundImageUrl({page: () => page, variant: 'medium'})(state);

    expect(result).toBeUndefined();
  });

  it('returns undefined for unsupported thumbnail candidate', () => {
    const page = {
      type: 'panorama',
      packageId: 1
    };
    const state = sample({
      pageTypes: {
        panorama: {
          thumbnailCandidates: [
            {
              attribute: 'packageId',
              collectionName: 'packages'
            }
          ]
        }
      },
      files: {
        'packages': [
          {id: 1}
        ]
      }
    });

    const result = pageBackgroundImageUrl({page: () => page, variant: 'medium'})(state);

    expect(result).toBeUndefined();
  });

  it('returns undefined if page is undefined', () => {
    const state = sample({
      pageTypes: {
        image: {
          thumbnailCandidates: []
        }
      },
      files: {
        'image_files': []
      }
    });

    const result = pageBackgroundImageUrl({page: () => undefined, variant: 'medium'})(state);

    expect(result).toBeUndefined();
  });
});

function sample({
  pageTypes,
  files,
  fileUrlTemplates = {
    image_files: {},
    video_files: {}
  },
  modelTypes = {
    image_files: 'Pageflow::ImageFile',
    video_files: 'Pageflow::VideoFile'
  }
}) {
  const store = createStore([pageTypesModule, filesModule], {
    pageTypesSeed: pageTypes,
    files, fileUrlTemplates,
    modelTypes
  });
  return store.getState();
}
