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
        fileExists: fileExistsFn({
          imageFiles: [5]
        })
      };

      const wrapper = shallow(<PageBackgroundVideo {...props} />);

      expect(wrapper).to.have.descendants(MobilePageVideoPoster);
    });
  });

  describe('on platform with only mute autoplay support', () => {
    it('plays audio via context', () => {
      const props = {
        page: {},
        hasOnlyMutedAutoplaySupport: true,
        fileExists: fileExistsFn({
          imageFiles: []
        })
      };

      const wrapper = shallow(<PageBackgroundVideo {...props} />);

      expect(wrapper).to.have.descendants(PageVideoPlayer);
      expect(wrapper.find(PageVideoPlayer)).to.have.prop('playAudioViaContext', true);
    });
  });

  describe('on desktop platform', () => {
    it('renders non muted video player even if mobile poster is present', () => {
      const props = {
        page: {
          mobilePosterImageId: 5
        },
        hasMobilePlatform: false,
        hasOnlyMutedAutoplaySupport: false,
        fileExists: fileExistsFn({
          imageFiles: [5]
        })
      };

      const wrapper = shallow(<PageBackgroundVideo {...props} />);

      expect(wrapper).to.have.descendants(PageVideoPlayer);
      expect(wrapper.find(PageVideoPlayer)).to.have.prop('playAudioViaContext', false);
    });
  });
});
