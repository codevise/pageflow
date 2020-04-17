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

      expect(wrapper).toContainMatchingElement(PageBackgroundImage);
    });

    it('passes propertyNamePrefix', () => {
      const page = {
        fallbackBackgroundType: 'image'
      };

      const image = shallow(
        <PageBackgroundAsset page={page} propertyNamePrefix="fallback"/>
      ).find(PageBackgroundImage);

      expect(image).toHaveProp('propertyNamePrefix', 'fallback');
    });
  });

  describe('when backgroundType is video', () => {
    it('renders PageBackgroundVideo', () => {
      const page = {
        backgroundType: 'video'
      };

      const wrapper = shallow(<PageBackgroundAsset page={page} />);

      expect(wrapper).toContainMatchingElement(PageBackgroundVideo);
    });

    it('passes propertyNamePrefix', () => {
      const page = {
        fallbackBackgroundType: 'video'
      };

      const video = shallow(
        <PageBackgroundAsset page={page} propertyNamePrefix="fallback"/>
      ).find(PageBackgroundVideo);

      expect(video).toHaveProp('propertyNamePrefix', 'fallback');
    });
  });

  it('supports propertyNamePrefix', () => {
    const page = {
      fallbackBackgroundType: 'video'
    };

    const wrapper = shallow(<PageBackgroundAsset page={page} propertyNamePrefix="fallback" />);

    expect(wrapper).toContainMatchingElement(PageBackgroundVideo);
  });
});
