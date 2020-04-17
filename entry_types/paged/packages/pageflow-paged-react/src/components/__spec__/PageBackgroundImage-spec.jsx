import PageBackgroundImage from '../PageBackgroundImage';
import LazyBackgroundImage from '../LazyBackgroundImage';

import {shallow, mount} from 'enzyme';

describe('PageBackgroundImage', () => {
  it('uses backgroudImageId by default', () => {
    const page = {
      backgroundImageId: 5
    };

    const wrapper = shallow(<PageBackgroundImage page={page} />);

    expect(wrapper.find(LazyBackgroundImage)).toHaveProp('fileId', 5);
  });

  it('passes position', () => {
    const page = {
      backgroundImageId: 5,
      backgroundImageX: 70,
      backgroundImageY: 20
    };

    const wrapper = shallow(<PageBackgroundImage page={page} />);

    expect(wrapper.find(LazyBackgroundImage)).toHaveProp('position', [70, 20]);
  });

  describe('with propertyBaseName', () => {
    it('uses custom id property', () => {
      const page = {
        imageId: 5
      };

      const wrapper = shallow(<PageBackgroundImage page={page} propertyBaseName="image" />);

      expect(wrapper.find(LazyBackgroundImage)).toHaveProp('fileId', 5);
    });

    it('uses custom position properties', () => {
      const page = {
        imageId: 5,
        imageX: 70,
        imageY: 20
      };

      const wrapper = shallow(<PageBackgroundImage page={page} propertyBaseName="image" />);

      expect(wrapper.find(LazyBackgroundImage)).toHaveProp('position', [70, 20]);
    });
  });

  describe('with propertyNamePrefix', () => {
    it('uses custom id property', () => {
      const page = {
        fallbackBackgroundImageId: 5
      };

      const wrapper = shallow(<PageBackgroundImage page={page} propertyNamePrefix="fallback" />);

      expect(wrapper.find(LazyBackgroundImage)).toHaveProp('fileId', 5);
    });

    it('uses custom position properties', () => {
      const page = {
        fallbackBackgroundImageId: 5,
        fallbackBackgroundImageX: 70,
        fallbackBackgroundImageY: 20
      };

      const wrapper = shallow(<PageBackgroundImage page={page} propertyNamePrefix="fallback" />);

      expect(wrapper.find(LazyBackgroundImage)).toHaveProp('position', [70, 20]);
    });
  });
});
