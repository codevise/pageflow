import { JSDOM } from 'jsdom';

export function fakeParentWindow() {
  Object.defineProperty(window, 'parent', {value: new JSDOM('').window });
};
