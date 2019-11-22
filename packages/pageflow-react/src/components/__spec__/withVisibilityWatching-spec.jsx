import withVisibilityWatching from '../withVisibilityWatching';

import {mount} from 'enzyme';
import sinon from 'sinon';
import lolex from 'lolex';

describe('withVisibilityWatching creates component that', () => {
  let testContext;

  beforeEach(function() {
    testContext = {};
    testContext.container = document.createElement('div');
    document.body.appendChild(testContext.container);
  });

  afterEach(function() {
    document.body.removeChild(testContext.container);
  });

  beforeEach(function() {
    testContext.clock = lolex.install();
  });

  afterEach(function() {
    testContext.clock.uninstall();
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
                         {attachTo: testContext.container});

    wrapper.setProps({style: {visibility: 'hidden'}});
    testContext.clock.runToLast();

    expect(handler).toHaveBeenCalledOnce();
  });

  it('calls onVisible handler when element becomes visible', function() {
    const handler = sinon.spy();
    const wrapper = mount(<ComponentWithVisibilityWatching watchVisibility={true}
                                                           style={{visibility: 'hidden'}}
                                                           onVisible={handler} />,
                          {attachTo: testContext.container});

    wrapper.setProps({style: {visibility: 'visible'}});
    testContext.clock.runToLast();

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
                          {attachTo: testContext.container});

    wrapper.setProps({style: {
      display: 'none',
      visibility: 'visible'
    }});
    testContext.clock.runToLast();

    expect(handler).not.toHaveBeenCalled();
  });

  it('does not call handlers watchVisibility is set to false', function() {
    const handler = sinon.spy();
    const wrapper = mount(<ComponentWithVisibilityWatching watchVisibility={false}
                                                           style={{visibility: 'hidden'}}
                                                           onVisible={handler} />,
                          {attachTo: testContext.container});

    wrapper.setProps({style: {visibility: 'visible'}});
    testContext.clock.runToLast();

    expect(handler).not.toHaveBeenCalled();
  });
});
