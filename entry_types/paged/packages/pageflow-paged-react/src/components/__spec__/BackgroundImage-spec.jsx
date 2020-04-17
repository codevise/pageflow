import BackgroundImage from '../BackgroundImage';

import {shallow, mount} from 'enzyme';

describe('BackgroundImage', () => {
  it('has image file css class', () => {
    const props = {fileId: 5};

    const result = shallow(<BackgroundImage {...props} />);

    expect(result).toHaveClassName('image_5');
  });

  it('has image_none css class if not fileId is given', () => {
    var result = shallow(<BackgroundImage />);

    expect(result).toHaveClassName('image_none');
  });

  it('has load_image css class if loaded prop is present', () => {
    const props = {fileId: 5, loaded: true};

    const result = shallow(<BackgroundImage {...props} />);

    expect(result).toHaveClassName('load_image');
  });

  it('has image file css class', () => {
    const props = {fileId: 5};

    const result = shallow(<BackgroundImage {...props} />);

    expect(result).toHaveClassName('image_5');
  });

  describe('with fileCollection prop set to videoFiles', () => {
    it('has video poster css class', () => {
      const props = {fileId: 5, fileCollection: 'videoFiles'};

      const result = shallow(<BackgroundImage {...props} />);

      expect(result.find('div')).toHaveClassName('video_poster_5');
    });
  });

  it('defaults background position to center', () => {
    const props = {fileId: 5};

    const result = mount(<BackgroundImage {...props} />);

    expect(result.find('div')).toHaveStyle('backgroundPosition', '50% 50%');
  });

  it('defaults background position to center', () => {
    const props = {fileId: 5, position: [undefined, undefined]};

    const result = mount(<BackgroundImage {...props} />);

    expect(result.find('div')).toHaveStyle('backgroundPosition', '50% 50%');
  });

  it('sets background position inline styles', () => {
    const props = {fileId: 5, position: [10, 20]};

    const result = mount(<BackgroundImage {...props} />);

    expect(result.find('div')).toHaveStyle('backgroundPosition', '10% 20%');
  });

  it('supports rendering structured data component', () => {
    const StructuredData = function() {};
    const props = {
      fileId: 5,
      fileCollection: 'videoFiles',
      structuredDataComponent: StructuredData
    };

    const result = shallow(<BackgroundImage {...props} />);

    expect(result).toContainMatchingElement(StructuredData);
    expect(result.find(StructuredData)).toHaveProp('fileCollection', 'videoFiles');
    expect(result.find(StructuredData)).toHaveProp('fileId', 5);
  });
});
