import {PageBackgroundVideo} from '../PageBackgroundVideo';
import MobilePageVideoPoster from '../MobilePageVideoPoster';
import PageVideoPlayer from '../PageVideoPlayer';

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
        hasAutoplaySupport: false,
        fileExists: fileExistsFn({
          imageFiles: [5]
        })
      };

      const wrapper = shallow(<PageBackgroundVideo {...props} />);

      expect(wrapper).to.have.descendants(MobilePageVideoPoster);
    });

    it('renders muted video player on mobile if no mobile poster is present', () => {
      const props = {
        page: {},
        hasMobilePlatform: true,
        hasAutoplaySupport: false,
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
        hasAutoplaySupport: true,
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
