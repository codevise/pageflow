import {within} from '@testing-library/dom';

export function useReactBasedBackboneViews(context) {
  // Views that  use React internally, need to be attached to
  // the DOM in order to make event handling work.

  let currentElement;

  afterEach(() => {
    if (currentElement) {
      document.body.removeChild(currentElement);
      currentElement = null;
    }
  });

  return {
    render(view) {
      currentElement = view.el;
      document.body.appendChild(view.el);

      return within(view.render().el);
    }
  }
}
