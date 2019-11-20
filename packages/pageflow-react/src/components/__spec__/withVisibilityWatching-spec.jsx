import withVisibilityWatching from '../withVisibilityWatching';

import {mount} from 'enzyme';
import sinon from 'sinon';
import lolex from 'lolex';

describe('withVisibilityWatching creates component that', () => {
  beforeEach(function() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
  });

  afterEach(function() {
    document.body.removeChild(this.container);
  });

  beforeEach(function() {
    this.clock = lolex.install();
  });

  afterEach(function() {
    this.clock.uninstall();
  });

  const Component = function(props) {
    return (
      <div style={props.style}>
        Some content
      </div>
    );
  };
  const ComponentWithVisibilityWatching = withVisibilityWatching(Component);

  it('calls onHidden handler when element becomes hidden', function() {
    const handler = sinon.spy();
    const wrapper = mount(<ComponentWithVisibilityWatching watchVisibility={true}
                                                           onHidden={handler} />,
                         {attachTo: this.container});

    wrapper.setProps({style: {visibility: 'hidden'}});
    this.clock.runToLast();

    expect(handler).toHaveBeenCalledOnce();
  });

  it('calls onVisible handler when element becomes visible', function() {
    const handler = sinon.spy();
    const wrapper = mount(<ComponentWithVisibilityWatching watchVisibility={true}
                                                           style={{visibility: 'hidden'}}
                                                           onVisible={handler} />,
                          {attachTo: this.container});

    wrapper.setProps({style: {visibility: 'visible'}});
    this.clock.runToLast();

    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not call handlers when element is display none', function() {
    const handler = sinon.spy();
    const wrapper = mount(<ComponentWithVisibilityWatching watchVisibility={true}
                                                           style={{
                                                             display: 'none',
                                                             visibility: 'hidden'
                                                           }}
                                                           onVisible={handler} />,
                          {attachTo: this.container});

    wrapper.setProps({style: {
      display: 'none',
      visibility: 'visible'
    }});
    this.clock.runToLast();

    expect(handler).not.toHaveBeenCalled();
  });

  it('does not call handlers watchVisibility is set to false', function() {
    const handler = sinon.spy();
    const wrapper = mount(<ComponentWithVisibilityWatching watchVisibility={false}
                                                           style={{visibility: 'hidden'}}
                                                           onVisible={handler} />,
                          {attachTo: this.container});

    wrapper.setProps({style: {visibility: 'visible'}});
    this.clock.runToLast();

    expect(handler).not.toHaveBeenCalled();
  });
});
