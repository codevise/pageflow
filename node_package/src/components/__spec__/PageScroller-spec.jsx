import {PageScroller} from '../PageScroller';

import {expect} from 'support';
import {shallow} from 'enzyme';

describe('PageScroller', () => {
  it('sets className', () => {
    const wrapper = shallow(<PageScroller className="some_class" />);

    expect(wrapper).to.have.className('some_class');
  });

  describe('with positive number for marginBottom prop', () => {
    it('sets clipped_bottom className', () => {
      const wrapper = shallow(<PageScroller marginBottom={5} />);

      expect(wrapper).to.have.className('scroller-clipped_bottom');
    });

    it('sets bottom style', () => {
      const wrapper = shallow(<PageScroller marginBottom={5} />);

      expect(wrapper).to.have.style('bottom', '5px');
    });
  });

  describe('with marginBottom prop set to false', () => {
    it('does not set clipped_bottom className', () => {
      const wrapper = shallow(<PageScroller marginBottom={false} />);

      expect(wrapper).not.to.have.className('scroller-clipped_bottom');
    });

    it('does not set bottom style', () => {
      const wrapper = shallow(<PageScroller marginBottom={false} />);

      expect(wrapper).not.to.have.style('bottom');
    });
  });
});
