import {PageScroller} from '../PageScroller';

import {mount} from 'enzyme';

describe('PageScroller', () => {
  it('sets className', () => {
    const wrapper = mount(<PageScroller className="some_class" />);

    expect(wrapper.find('.scroller')).to.have.className('some_class');
  });

  describe('with positive number for marginBottom prop', () => {
    it('sets clipped_bottom className', () => {
      const wrapper = mount(<PageScroller marginBottom={5} />);

      expect(wrapper.find('.scroller')).to.have.className('scroller-clipped_bottom');
    });

    it('sets bottom style', () => {
      const wrapper = mount(<PageScroller marginBottom={5} />);

      expect(wrapper.find('.scroller')).to.have.style('bottom', '5px');
    });
  });

  describe('with marginBottom prop set to false', () => {
    it('does not set clipped_bottom className', () => {
      const wrapper = mount(<PageScroller marginBottom={false} />);

      expect(wrapper.find('.scroller')).not.to.have.className('scroller-clipped_bottom');
    });

    it('does not set bottom style', () => {
      const wrapper = mount(<PageScroller marginBottom={false} />);

      expect(wrapper.find('.scroller')).not.to.have.style('bottom');
    });
  });
});
