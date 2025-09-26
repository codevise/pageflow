import {within} from '@testing-library/dom';

let container;

afterEach(() => {
  if (container) {
    container.remove();
    container = null;
  }
});

function ensureContainer() {
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }
}

export function renderBackboneView(view) {
  ensureContainer();
  view.render();
  container.appendChild(view.el);

  return within(view.el);
}
