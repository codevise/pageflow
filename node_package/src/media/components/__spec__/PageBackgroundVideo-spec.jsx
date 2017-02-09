import {PageBackgroundVideo} from '../PageBackgroundVideo';
import MobilePageVideoPoster from '../MobilePageVideoPoster';
import PageVideoPlayer from '../PageVideoPlayer';

import {expect} from 'support/chai';
import fileExistsFn from 'support/fileExistsFn';
import {shallow} from 'enzyme';

describe('PageBackgroundVideo', () => {
  describe('on mobile platform', () => {
    it('renders mobile poster if present', () => {
      const props = {
        page: {
          mobilePosterImageId: 5
        },
        hasMobilePlatform: true,
        hasMuteVideoAutoplaySupport: true,
        fileExists: fileExistsFn({
          imageFiles: [5]
        })
      };

      const wrapper = shallow(<PageBackgroundVideo {...props} />);

      expect(wrapper).to.have.descendants(MobilePageVideoPoster);
    });

    it('renders mobile poster if mute autoplay is not supported', () => {
      const props = {
        page: {},

        hasMobilePlatform: true,
        hasMuteVideoAutoplaySupport: false,

        fileExists: fileExistsFn({
          imageFiles: []
        })
      };

      const wrapper = shallow(<PageBackgroundVideo {...props} />);

      expect(wrapper).to.have.descendants(MobilePageVideoPoster);
    });

    it('renders muted video player if mute autoplay is supported and no mobile poster is present', () => {
      const props = {
        page: {},

        hasMobilePlatform: true,
        hasMuteVideoAutoplaySupport: true,

        fileExists: fileExistsFn({
          imageFiles: []
        })
      };

      const wrapper = shallow(<PageBackgroundVideo {...props} />);

      expect(wrapper).to.have.descendants(PageVideoPlayer);
      expect(wrapper.find(PageVideoPlayer)).to.have.prop('muted', true);
    });
  });

  describe('on desktop platform', () => {
    it('renders non muted video player even if mobile poster is present', () => {
      const props = {
        page: {
          mobilePosterImageId: 5
        },
        hasMobilePlatform: false,
        hasMuteVideoAutoplaySupport: true,
        fileExists: fileExistsFn({
          imageFiles: [5]
        })
      };

      const wrapper = shallow(<PageBackgroundVideo {...props} />);

      expect(wrapper).to.have.descendants(PageVideoPlayer);
      expect(wrapper.find(PageVideoPlayer)).to.have.prop('muted', false);
    });
  });
});
