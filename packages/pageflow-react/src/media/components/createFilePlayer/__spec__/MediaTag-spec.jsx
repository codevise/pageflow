import MediaTag from '../MediaTag';

import {mount, render} from 'enzyme';
import sinon from 'sinon';
import {findDOMNode} from 'react-dom';


describe('MediaTag', () => {
  it('renders tag with given name', () => {
    const wrapper = render(<MediaTag tagName="audio" />);

    expect(wrapper).toHaveDescendant('audio');
  });

  it('renders given sources', () => {
    const sources = [{type: 'video/mp4', src: 'some.mp4'}];
    const wrapper = render(<MediaTag sources={sources} />);

    expect(wrapper).toHaveExactlyOneDescendant('source');
    expect(wrapper).toHaveDescendant('source[type="video/mp4"][src="some.mp4"]');
  });

  it('renders given tracks', () => {
    const tracks = [{
      id: '1', kind: 'captions', label: 'Captions', src: 'some.vtt', srclang: 'en'
    }];
    const wrapper = render(<MediaTag tracks={tracks} />);

    expect(wrapper).toHaveExactlyOneDescendant('track');
    expect(wrapper).toHaveDescendant('track[id="1"]');
    expect(wrapper).toHaveDescendant('track[kind="captions"]');
    expect(wrapper).toHaveDescendant('track[label="Captions"]');
    expect(wrapper).toHaveDescendant('track[srclang="en"]');
    expect(wrapper).toHaveDescendant('track[src="some.vtt"]');
  });

  it('renders data-poster attribute for given poster', () => {
    const wrapper = render(<MediaTag poster="http://example.com/poster.png" />);

    expect(wrapper).toHaveDescendant('video[data-poster*="poster.png"]');
  });

  it('renders loop attribute', () => {
    const wrapper = render(<MediaTag loop={true} />);

    expect(wrapper).toHaveDescendant('video[loop]');
  });

  it('renders muted attribute', () => {
    const wrapper = render(<MediaTag muted={true} />);

    expect(wrapper).toHaveDescendant('video[muted]');
  });

  it('renders playsinline attribute', () => {
    const wrapper = render(<MediaTag playsInline={true} />);

    expect(wrapper).toHaveDescendant('video[playsinline]');
  });

  it('sets preload attribute to auto', () => {
    const wrapper = render(<MediaTag />);

    expect(wrapper).toHaveDescendant('video[preload="auto"]');
  });

  it('re-renders when source changes', () => {
    const sources = [{type: 'video/mp4', src: 'some.mp4'}];
    const changedSources = [{type: 'video/mp4', src: 'new.mp4'}];
    const wrapper = mount(<MediaTag sources={sources} />);

    wrapper.setProps({sources: changedSources});

    expect(wrapper.render()).toHaveDescendant('source[src="new.mp4"]');
  });

  it('re-renders when poster changes', () => {
    const wrapper = mount(<MediaTag />);

    wrapper.setProps({poster: 'http://example.com/poster.png'});
    wrapper.update();

    expect(wrapper.render()).toHaveDescendant('video[data-poster*="poster.png"]');
  });

  it('re-renders when track changes', () => {
    const tracks = [{
      id: '1', kind: 'captions', label: 'Captions', src: 'some.vtt', srclang: 'en'
    }];
    const changedTracks = [{
      id: '1', kind: 'captions', label: 'Captions', src: 'some.vtt', srclang: 'de'
    }];
    const wrapper = mount(<MediaTag tracks={tracks} />);

    wrapper.setProps({tracks: changedTracks});

    expect(wrapper.render()).toHaveDescendant('track[srclang="de"]');
  });

  it('triggers onSetup when component mounts', () => {
    const callback = sinon.spy();
    mount(<MediaTag onSetup={callback} />);

    expect(callback).toHaveBeenCalled();
  });

  it('triggers onDispose when component unmounts', () => {
    const callback = sinon.spy();
    const wrapper = mount(<MediaTag onDispose={callback} />);

    wrapper.unmount();

    expect(callback).toHaveBeenCalled();
  });

  it('triggers onDispose and onSetup when component re-renders', () => {
    const onDispose = sinon.spy();
    const onSetup= sinon.spy();
    const wrapper = mount(<MediaTag tagName="audio"
                                    onSetup={onSetup}
                                    onDispose={onDispose} />);

    onSetup.reset();
    wrapper.setProps({tagName: 'video'});

    expect(onDispose).toHaveBeenCalled();
    expect(onSetup.calledAfter(onDispose)).toBeTruthy();
  });

  it('discards dom changes on re-render', () => {
    const wrapper = mount(<MediaTag tagName="audio" />);

    appendElement(wrapper, 'p');
    wrapper.setProps({tagName: 'video'});

    expect(wrapper.render()).not.toHaveDescendant('p');
  });

  it('keeps dom changes when props did not change', () => {
    const wrapper = mount(<MediaTag />);

    appendElement(wrapper, 'p');
    wrapper.update();

    expect(wrapper.render()).toHaveDescendant('p');
  });

  function appendElement(wrapper, tagName) {
    // eslint-disable-next-line react/no-find-dom-node
    findDOMNode(wrapper.instance()).appendChild(document.createElement(tagName));
  }
});
