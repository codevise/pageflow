import { JSDOM } from 'jsdom';

export function fakeParentWindow() {
  Object.defineProperty(window, 'parent', {value: new JSDOM('').window });
};

export function useFakeParentWindow() {
  beforeAll(() => {
    Object.defineProperty(window, 'parent', {
      value: new JSDOM('').window,
      configurable: true
    });
  });

  beforeEach(() => {
    window.parent.postMessage = jest.fn();
  });
}

export function createIframeWindow() {
  const dom = new JSDOM('');
  dom.reconfigure({windowTop: window, url: window.location.origin});
  return dom.window;
}
