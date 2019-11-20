import {PageBackgroundAsset} from '../PageBackgroundAsset';
import PageBackgroundVideo from '../PageBackgroundVideo';
import {PageBackgroundImage} from 'components';

import {shallow} from 'enzyme';

describe('PageBackgroundAsset', () => {
  describe('when backgroundType is image', () => {
    it('renders PageBackgroundImage', () => {
      const page = {
        backgroundType: 'image'
      };

      const wrapper = shallow(<PageBackgroundAsset page={page} />);

      expect(wrapper).to.have.descendants(PageBackgroundImage);
    });

    it('passes propertyNamePrefix', () => {
      const page = {
        fallbackBackgroundType: 'image'
      };

      const image = shallow(
        <PageBackgroundAsset page={page} propertyNamePrefix="fallback"/>
      ).find(PageBackgroundImage);

      expect(image).to.have.prop('propertyNamePrefix', 'fallback');
    });
  });

  describe('when backgroundType is video', () => {
    it('renders PageBackgroundVideo', () => {
      const page = {
        backgroundType: 'video'
      };

      const wrapper = shallow(<PageBackgroundAsset page={page} />);

      expect(wrapper).to.have.descendants(PageBackgroundVideo);
    });

    it('passes propertyNamePrefix', () => {
      const page = {
        fallbackBackgroundType: 'video'
      };

      const video = shallow(
        <PageBackgroundAsset page={page} propertyNamePrefix="fallback"/>
      ).find(PageBackgroundVideo);

      expect(video).to.have.prop('propertyNamePrefix', 'fallback');
    });
  });

  it('supports propertyNamePrefix', () => {
    const page = {
      fallbackBackgroundType: 'video'
    };

    const wrapper = shallow(<PageBackgroundAsset page={page} propertyNamePrefix="fallback" />);

    expect(wrapper).to.have.descendants(PageBackgroundVideo);
  });
});
