import PageVideoPlayer, {VideoPlayer} from '../PageVideoPlayer';

import {shallow} from 'enzyme';

describe('PageVideoPlayer', () => {
  it('uses videoFileId by default', () => {
    const page = {
      videoFileId: 5
    };

    const wrapper = shallow(<PageVideoPlayer page={page} />);

    expect(wrapper.find(VideoPlayer)).toHaveProp('videoFileId', 5);
  });

  it('uses posterImageId by default', () => {
    const page = {
      posterImageId: 6
    };

    const wrapper = shallow(<PageVideoPlayer page={page} />);

    expect(wrapper.find(VideoPlayer)).toHaveProp('posterImageFileId', 6);
  });

  it('passes position', () => {
    const page = {
      videoFileId: 5,
      videoFileX: 70,
      videoFileY: 20
    };

    const wrapper = shallow(<PageVideoPlayer page={page} />);

    expect(wrapper.find(VideoPlayer)).toHaveProp('position', [70, 20]);
  });

  describe('with videoPropertyBaseName', () => {
    it('uses custom id property', () => {
      const page = {
        videoId: 5
      };

      const wrapper = shallow(<PageVideoPlayer page={page} videoPropertyBaseName="video" />);

      expect(wrapper.find(VideoPlayer)).toHaveProp('videoFileId', 5);
    });

    it('uses custom position properties', () => {
      const page = {
        videoId: 5,
        videoX: 70,
        videoY: 20
      };

      const wrapper = shallow(<PageVideoPlayer page={page} videoPropertyBaseName="video" />);

      expect(wrapper.find(VideoPlayer)).toHaveProp('position', [70, 20]);
    });
  });

  describe('with posterImagePropertyBaseName', () => {
    it('uses custom id property', () => {
      const page = {
        customPosterId: 5
      };

      const wrapper = shallow(<PageVideoPlayer page={page} posterImagePropertyBaseName="customPoster" />);

      expect(wrapper.find(VideoPlayer)).toHaveProp('posterImageFileId', 5);
    });
  });

  describe('with propertyNamePrefix', () => {
    it('uses custom id property', () => {
      const page = {
        fallbackVideoFileId: 5
      };

      const wrapper = shallow(<PageVideoPlayer page={page} propertyNamePrefix="fallback" />);

      expect(wrapper.find(VideoPlayer)).toHaveProp('videoFileId', 5);
    });

    it('uses custom posterImageId by default', () => {
      const page = {
        fallbackPosterImageId: 6
      };

      const wrapper = shallow(<PageVideoPlayer page={page} propertyNamePrefix="fallback" />);

      expect(wrapper.find(VideoPlayer)).toHaveProp('posterImageFileId', 6);
    });

    it('uses custom position properties', () => {
      const page = {
        fallbackVideoFileId: 5,
        fallbackVideoFileX: 70,
        fallbackVideoFileY: 20
      };

      const wrapper = shallow(<PageVideoPlayer page={page} propertyNamePrefix="fallback" />);

      expect(wrapper.find(VideoPlayer)).toHaveProp('position', [70, 20]);
    });
  });
});
