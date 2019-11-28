import {PageFilePlayer} from '../PageFilePlayer';

import {shallow} from 'enzyme';

describe('PageFilePlayer', () => {
  it('renders player component if file is ready and page is is prepared', () => {
    const Player = function() {};
    const Preload = function() {};
    const file = {isReady: true};

    const wrapper = shallow(<PageFilePlayer file={file}
                                            pageIsPrepared={true}
                                            playerComponent={Player}
                                            preloadComponent={Preload} />);

    expect(wrapper).toContainMatchingElement(Player);
  });

  it('renders placeholder if page is is prepared but file not ready', () => {
    const Player = function() {};
    const Preload = function() {};
    const file = {isReady: false};

    const wrapper = shallow(<PageFilePlayer file={file}
                                            pageIsPrepared={true}
                                            playerComponent={Player}
                                            preloadComponent={Preload} />);

    expect(wrapper).toContainMatchingElement('noscript');
  });

  it('renders preload component if file is ready and page is preloaded', () => {
    const Player = function() {};
    const Preload = function() {};
    const file = {isReady: true};

    const wrapper = shallow(<PageFilePlayer file={file}
                                            pageIsPrepared={false}
                                            pageIsPreloaded={true}
                                            playerComponent={Player}
                                            preloadComponent={Preload} />);

    expect(wrapper).toContainMatchingElement(Preload);
  });

  it('renders placeholder if page is is preloaded but file not ready', () => {
    const Player = function() {};
    const Preload = function() {};
    const file = {isReady: false};

    const wrapper = shallow(<PageFilePlayer file={file}
                                            pageIsPrepared={false}
                                            pageIsPreloaded={true}
                                            playerComponent={Player}
                                            preloadComponent={Preload} />);

    expect(wrapper).toContainMatchingElement('noscript');
  });

  it('renders placeholder if page is is preloaded but preload component not present', () => {
    const Player = function() {};
    const file = {isReady: true};

    const wrapper = shallow(<PageFilePlayer file={file}
                                            pageIsPrepared={false}
                                            pageIsPreloaded={true}
                                            playerComponent={Player} />);

    expect(wrapper).toContainMatchingElement('noscript');
  });

  it('supports rendering structured data component', () => {
    const Player = function() {};
    const Preload = function() {};
    const StructuredData = function() {};
    const file = {isReady: true};

    const wrapper = shallow(<PageFilePlayer file={file}
                                            pageIsPrepared={false}
                                            playerComponent={Player}
                                            preloadComponent={Preload}
                                            structuredDataComponent={StructuredData} />);

    expect(wrapper).toContainMatchingElement(StructuredData);
    expect(wrapper.find(StructuredData)).toHaveProp('file', file);
  });
});
