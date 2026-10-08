import {FragmentPreviewView} from 'editor/views/FragmentPreviewView';
import styles from 'editor/views/FragmentPreviewView.module.css';

import {renderBackboneView} from 'pageflow/testHelpers';
import {fakeResizeObserver} from 'support/fakeResizeObserver';

describe('FragmentPreviewView', () => {
  let view, frames;

  beforeEach(() => {
    frames = [];
    jest.spyOn(window, 'requestAnimationFrame')
        .mockImplementation(callback => frames.push(callback));
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  beforeEach(() => {
    document.body.innerHTML = `
      <script type="text/html" data-template="fragment_preview_seed">
        <!DOCTYPE html>
        <html>
          <head><title>Preview<\\/title><\\/head>
          <body><div class="preview"><\\/div><\\/body>
        <\\/html>
      </script>
    `;
  });

  afterEach(() => view.close());

  function showView({width = 640, height = 400, ...options} = {}) {
    view = new FragmentPreviewView(options);
    resize({width, height});
    renderBackboneView(view);
    jest.spyOn(iframeWindow(), 'scrollTo').mockImplementation(() => {});

    return view;
  }

  function resize({width, height}) {
    Object.defineProperty(view.el, 'clientWidth', {value: width, configurable: true});
    Object.defineProperty(view.el, 'clientHeight', {value: height, configurable: true});
  }

  function iframeSize() {
    const {width, height} = view.ui.iframe[0].style;
    return {width, height};
  }

  function deviceStyle() {
    const {width, height, left, top} = view.ui.device[0].style;
    return {width, height, left, top};
  }

  function scale() {
    return view.el.style.getPropertyValue('--fragment-preview-scale');
  }

  function frameScale() {
    return view.el.style.getPropertyValue('--fragment-preview-frame-scale');
  }

  function setBezel(value) {
    view.ui.device[0].style.setProperty('--bezel-x', value);
    view.ui.device[0].style.setProperty('--bezel-y', value);
  }

  function iframeWindow() {
    return view.ui.iframe[0].contentWindow;
  }

  function receiveReady({source = iframeWindow()} = {}) {
    window.dispatchEvent(new MessageEvent('message', {data: {type: 'READY'}, source}));
  }

  function recordMessages() {
    const messages = [];
    jest.spyOn(iframeWindow(), 'postMessage').mockImplementation(data => messages.push(data));
    return messages;
  }

  it('renders seed template in iframe', () => {
    showView();

    expect(view.ui.iframe[0].contentDocument.querySelector('div.preview')).toBeTruthy();
  });

  it('renders desktop viewport scaled to fit width of area', () => {
    showView({width: 640, height: 600});

    expect(scale()).toEqual('0.5');
    expect(iframeSize()).toEqual({width: '1280px', height: '800px'});
    expect(deviceStyle()).toEqual({width: '640px', height: '400px', left: '0px', top: '100px'});
  });

  it('renders desktop viewport scaled to fit height of area', () => {
    showView({width: 1000, height: 400});

    expect(scale()).toEqual('0.5');
    expect(deviceStyle()).toEqual({width: '640px', height: '400px', left: '180px', top: '0px'});
  });

  it('rescales when its element is resized', () => {
    showView({width: 640, height: 600});

    resize({width: 320, height: 600});
    fakeResizeObserver.observe.mock.instances[0].callback([]);

    expect(scale()).toEqual('0.25');
  });

  it('leaves room for device frame', () => {
    showView({width: 660, height: 600});
    setBezel('10px');

    view.updateScale();

    expect(scale()).toEqual('0.5');
    expect(frameScale()).toEqual('1');
    expect(deviceStyle()).toEqual({width: '660px', height: '420px', left: '0px', top: '90px'});
  });

  it('shrinks device frame for small devices', () => {
    showView({width: 200, height: 400});
    setBezel('10px');

    view.updateScale();

    expect(parseFloat(frameScale())).toBeCloseTo(0.427);
    expect(parseFloat(view.ui.device[0].style.width)).toBeCloseTo(200);
  });

  it('renders phone viewport for phone device', () => {
    showView({width: 375, height: 800, device: 'phone'});

    expect(scale()).toEqual('1');
    expect(iframeSize()).toEqual({width: '375px', height: '667px'});
    expect(deviceStyle()).toEqual({width: '375px', height: '667px', left: '0px', top: '66.5px'});
  });

  it('uses phone frame for phone device', () => {
    showView({device: 'phone'});

    expect(view.el.classList).toContain(styles.phone);
  });

  describe('scrolling', () => {
    beforeEach(() => {
      jest.spyOn(performance, 'now').mockReturnValue(0);
    });

    function fakeDocumentScroll({scrollHeight, innerHeight}) {
      const win = iframeWindow();

      Object.defineProperty(win, 'innerHeight', {value: innerHeight, configurable: true});
      Object.defineProperty(win.document.documentElement, 'scrollHeight',
                            {value: scrollHeight, configurable: true});

      return jest.spyOn(win, 'scrollTo').mockImplementation(() => {});
    }

    function runFrame(time) {
      frames.shift()(time);
    }

    function lastScrollTop(scrollTo) {
      return scrollTo.mock.calls[scrollTo.mock.calls.length - 1][1];
    }

    function showScrollingPreview() {
      showView();
      const scrollTo = fakeDocumentScroll({scrollHeight: 1800, innerHeight: 800});
      receiveReady();
      view.showCollections({sections: []});

      return scrollTo;
    }

    it('waits at top before scrolling', () => {
      const scrollTo = showScrollingPreview();

      runFrame(500);

      expect(scrollTo).toHaveBeenLastCalledWith(0, 0);
    });

    it('eases towards end of document', () => {
      const scrollTo = showScrollingPreview();

      runFrame(1000 + 2500);

      expect(lastScrollTop(scrollTo)).toBeCloseTo(500);
    });

    it('waits at end of document', () => {
      const scrollTo = showScrollingPreview();

      runFrame(6500);

      expect(scrollTo).toHaveBeenLastCalledWith(0, 1000);
    });

    it('eases back up and starts over', () => {
      const scrollTo = showScrollingPreview();

      runFrame(7000 + 2500);
      expect(lastScrollTop(scrollTo)).toBeCloseTo(500);

      runFrame(12000 + 500);
      expect(scrollTo).toHaveBeenLastCalledWith(0, 0);
    });

    it('keeps document that fits viewport at top', () => {
      showView();
      const scrollTo = fakeDocumentScroll({scrollHeight: 800, innerHeight: 800});
      receiveReady();
      view.showCollections({sections: []});

      runFrame(3500);

      expect(scrollTo).toHaveBeenLastCalledWith(0, 0);
    });

    it('does not scroll before document is ready', () => {
      showView();
      view.showCollections({sections: []});

      expect(frames).toEqual([]);
    });

    it('starts over from top when collections change', () => {
      const scrollTo = showScrollingPreview();
      runFrame(6500);

      performance.now.mockReturnValue(6500);
      view.showCollections({sections: []});
      runFrame(7000);

      expect(scrollTo).toHaveBeenLastCalledWith(0, 0);
    });

    it('stops scrolling when closed', () => {
      showScrollingPreview();

      view.close();

      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });
  });

  it('posts collections once document is ready', () => {
    showView();
    const posted = recordMessages();

    view.showCollections({sections: [{permaId: 5}]});
    receiveReady();

    expect(posted).toEqual([
      {type: 'RESET_COLLECTIONS', payload: {collections: {sections: [{permaId: 5}]}}}
    ]);
  });

  it('posts collections selected after document is ready', () => {
    showView();
    const posted = recordMessages();

    receiveReady();
    view.showCollections({sections: [{permaId: 5}]});

    expect(posted).toEqual([
      {type: 'RESET_COLLECTIONS', payload: {collections: {sections: [{permaId: 5}]}}}
    ]);
  });

  it('does not post before document is ready', () => {
    showView();
    const posted = recordMessages();

    view.showCollections({sections: [{permaId: 5}]});

    expect(posted).toEqual([]);
  });

  it('ignores ready message of other window', () => {
    showView();
    const posted = recordMessages();

    view.showCollections({sections: [{permaId: 5}]});
    receiveReady({source: window});

    expect(posted).toEqual([]);
  });
});
