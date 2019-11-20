import {MobilePageVideoPoster} from '../MobilePageVideoPoster';
import {PageBackgroundImage} from 'components';

import fileExistsFn from 'support/fileExistsFn';
import {shallow} from 'enzyme';

describe('MobilePageVideoPoster', () => {
  it('prefers mobilePosterImageId over posterImageId', () => {
    const props = {
      page: {
        posterImageId: 5,
        mobilePosterImageId: 6,
        videoFileId: 10
      },
      fileExists: fileExistsFn({
        imageFiles: [5, 6],
        videoFiles: [10]
      })
    };

    const wrapper = shallow(<MobilePageVideoPoster {...props} />);

    expect(wrapper.find(PageBackgroundImage)).to.have.prop('propertyBaseName', 'mobilePosterImage');
    expect(wrapper.find(PageBackgroundImage)).to.have.prop('fileCollection', 'imageFiles');
  });

  it('prefers posterImageId over video file poster', () => {
    const props = {
      page: {
        posterImageId: 5,
        videoFileId: 10
      },
      fileExists: fileExistsFn({
        imageFiles: [5],
        videoFiles: [10]
      })
    };

    const wrapper = shallow(<MobilePageVideoPoster {...props} />);

    expect(wrapper.find(PageBackgroundImage)).to.have.prop('propertyBaseName', 'posterImage');
    expect(wrapper.find(PageBackgroundImage)).to.have.prop('fileCollection', 'imageFiles');
  });

  it('falls back to video file poster if poster does not exist', () => {
    const props = {
      page: {
        posterImageId: 5,
        videoFileId: 10
      },
      fileExists: fileExistsFn({
        imageFiles: [],
        videoFiles: [10]
      })
    };

    const wrapper = shallow(<MobilePageVideoPoster {...props} />);

    expect(wrapper.find(PageBackgroundImage)).to.have.prop('propertyBaseName', 'videoFile');
    expect(wrapper.find(PageBackgroundImage)).to.have.prop('fileCollection', 'videoFiles');
  });

  it('supports propertyNamePrefix', () => {
    const props = {
      page: {
        fallbackPosterImageId: 5,
        fallbackMobilePosterImageId: 6,
        fallbackVideoFileId: 10
      },
      fileExists: fileExistsFn({
        imageFiles: [5, 6],
        videoFiles: [10]
      }),
      propertyNamePrefix: 'fallback'
    };

    const wrapper = shallow(<MobilePageVideoPoster {...props} />);

    expect(wrapper.find(PageBackgroundImage)).to.have.prop('propertyBaseName', 'fallbackMobilePosterImage');
    expect(wrapper.find(PageBackgroundImage)).to.have.prop('fileCollection', 'imageFiles');
  });
});
