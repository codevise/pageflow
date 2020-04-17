import {PageThumbnail} from '../PageThumbnail';

import fileExistsFn from 'support/fileExistsFn';
import {shallow} from 'enzyme';

describe('PageThumbnail', () => {
  it('has class names for thumbnail candidate', () => {
    const props = {
      page: {
        thumbnailFileId: 10
      },
      pageType: {
        thumbnailCandidates: [
          {
            attribute: 'thumbnailFileId',
            collectionName: 'image_files',
            cssClassPrefix: 'pageflow_image_file'
          }
        ]
      },
      fileExists: fileExistsFn({
        'imageFiles': [10]
      }),
      imageStyle: 'thumbnail'
    };

    const result = shallow(<PageThumbnail {...props} />);

    expect(result).toHaveClassName('pageflow_image_file_thumbnail_10');
  });

  it('supports lazy thumbnail css class', () => {
    const props = {
      page: {
        thumbnailFileId: 10
      },
      pageType:{
        thumbnailCandidates: [
          {
            attribute: 'thumbnailFileId',
            collectionName: 'image_files',
            cssClassPrefix: 'pageflow_image_file'
          }
        ]
      },
      fileExists: fileExistsFn({
        'imageFiles': [10]
      }),
      imageStyle: 'thumbnail',
      lazy: true
    };

    const result = shallow(<PageThumbnail {...props} />);

    expect(result).toHaveClassName('lazy_pageflow_image_file_thumbnail_10');
  });

  it('adds load_image class if loaded prop is present', () => {
    const props = {
      page: {
        thumbnailFileId: 10
      },
      pageType: {
        thumbnailCandidates: [
          {
            attribute: 'thumbnailFileId',
            collectionName: 'image_files',
            cssClassPrefix: 'pageflow_image_file'
          }
        ]
      },
      fileExists: fileExistsFn({
        'imageFiles': [10]
      }),
      imageStyle: 'thumbnail',
      lazy: true,
      loaded: true
    };

    const result = shallow(<PageThumbnail {...props} />);

    expect(result).toHaveClassName('load_image');
  });

  it('skips candidates whose attributes point to non existing files', () => {
    const props = {
      page: {
        thumbnailFileId: 10,
        videoId: 5
      },
      pageType: {
        thumbnailCandidates: [
          {
            attribute: 'thumbnailFileId',
            collectionName: 'image_files',
            cssClassPrefix: 'pageflow_image_file'
          },
          {
            attribute: 'videoId',
            collectionName: 'video_files',
            cssClassPrefix: 'pageflow_video_file'
          }
        ]
      },
      fileExists: fileExistsFn({
        'imageFiles': [],
        'videoFiles': [5, 10],
      }),
      imageStyle: 'thumbnail'
    };

    const result = shallow(<PageThumbnail {...props} />);

    expect(result).toHaveClassName('pageflow_video_file_thumbnail_5');
  });

  it('skips candidates whose attributes are not defined', () => {
    const props = {
      page: {},
      pageType: {
        thumbnailCandidates: [
          {
            attribute: 'thumbnailFileId',
            collectionName: 'image_files',
            cssClassPrefix: 'pageflow_image_file'},
        ]
      },
      fileExists: fileExistsFn({})
    };

    const result = shallow(<PageThumbnail {...props} />);

    expect(result).not.toHaveClassName('pageflow_image_file');
  });

  it('skips candidates whose condition is not met', () => {
    const props = {
      page: {
        imageId: 5,
        backgroundType: 'video'
      },
      pageType: {
        thumbnailCandidates: [
          {
            attribute: 'imageId',
            collectionName: 'image_files',
            cssClassPrefix: 'pageflow_image_file',
            condition: {
              attribute: 'background_type',
              value: 'image'
            }
          },
        ]
      },
      fileExists: fileExistsFn({
        imageFiles: [5, 6]
      }),
      imageStyle: 'thumbnail'
    };

    const result = shallow(<PageThumbnail {...props} />);

    expect(result).not.toHaveClassName('pageflow_image_file_thumbnail_5');
  });

  it('uses candidate whose condition is met', () => {
    const props = {
      page: {
        imageId: 5,
        backgroundType: 'image'
      },
      pageType: {
        thumbnailCandidates: [
          {
            attribute: 'image_id',
            collectionName: 'image_files',
            cssClassPrefix: 'pageflow_image_file',
            condition: {
              attribute: 'background_type',
              value: 'image'
            }
          },
        ]
      },
      fileExists: fileExistsFn({
        imageFiles: [5, 6]
      }),
      imageStyle: 'thumbnail'
    };

    const result = shallow(<PageThumbnail {...props} />);

    expect(result).toHaveClassName('pageflow_image_file_thumbnail_5');
  });

  it('skips candidates with negated met condition', () => {
    const props = {
      page: {
        imageId: 5,
        backgroundType: 'image'
      },
      pageType: {
        thumbnailCandidates: [
          {
            attribute: 'imageId',
            collectionName: 'image_files',
            cssClassPrefix: 'pageflow_image_file',
            condition: {
              attribute: 'background_type',
              value: 'image',
              negated: true
            }
          },
        ]
      },
      fileExists: fileExistsFn({
        imageFiles: [5, 6]
      }),
      imageStyle: 'thumbnail'
    };

    const result = shallow(<PageThumbnail {...props} />);

    expect(result).not.toHaveClassName('pageflow_image_file_thumbnail_5');
  });

  it('uses candidate with negated unmet condition', () => {
    const props = {
      page: {
        imageId: 5,
        backgroundType: 'video'
      },
      pageType: {
        thumbnailCandidates: [
          {
            attribute: 'image_id',
            collectionName: 'image_files',
            cssClassPrefix: 'pageflow_image_file',
            condition: {
              attribute: 'background_type',
              value: 'image',
              negated: true
            }
          },
        ]
      },
      fileExists: fileExistsFn({
        imageFiles: [5, 6]
      }),
      imageStyle: 'thumbnail'
    };

    const result = shallow(<PageThumbnail {...props} />);

    expect(result).toHaveClassName('pageflow_image_file_thumbnail_5');
  });

  it('prefers custom thumbnail id', () => {
    const props = {
      page: {
        thumbnailFileId: 10
      },
      pageType: {
        thumbnailCandidates: [
          {
            attribute: 'thumbnailFileId',
            collectionName: 'imageFiles',
            cssClassPrefix: 'pageflow_image_file'
          }
        ]
      },

      fileExists: fileExistsFn({
        'imageFiles': [10, 11]
      }),
      customThumbnailId: 11,
      imageStyle: 'thumbnail'
    };

    const result = shallow(<PageThumbnail {...props} />);

    expect(result).toHaveClassName('pageflow_image_file_thumbnail_11');
  });

  it('skips custom thumbnail id pointing to non existent file', () => {
    const props = {
      page: {},
      pageType: {
        thumbnailCandidates: []
      },
      fileExists: fileExistsFn({
        'imageFiles': []
      }),
      customThumbnailId: 11,
      imageStyle: 'thumbnail'
    };

    const result = shallow(<PageThumbnail {...props} />);

    expect(result).not.toHaveClassName('pageflow_image_file_thumbnail_11');
  });

  it('takes className prop', () => {
    const props = {
      page: {},
      pageType: {
        thumbnailCandidates: []
      },
      fileExists: fileExistsFn({}),
      className: 'custom'
    };

    const result = shallow(<PageThumbnail {...props} />);

    expect(result).toHaveClassName('custom');
  });

  it('sets page type modifier class name', () => {
    const props = {
      page: {},
      pageType: {
        name: 'video',
        thumbnailCandidates: []
      },
      fileExists: fileExistsFn({})
    };

    const result = shallow(<PageThumbnail {...props} />);

    expect(result).toHaveClassName('is_video');
  });

  describe('when page is null', function() {
    it('sets is_dangling class name', () => {
      const props =  {
        page: null,
        pageType: null,
        fileExists: fileExistsFn({})
      };

      const result = shallow(<PageThumbnail {...props} />);

      expect(result).toHaveClassName('is_dangling');
    });
  });
});
