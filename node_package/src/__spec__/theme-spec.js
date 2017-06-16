import themeModule from 'theme';
import {mainColor} from 'theme/selectors';
import createStore from 'createStore';

import {expect} from 'support/chai';

describe('theme', () => {
  beforeEach(function() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
  });

  afterEach(function() {
    document.body.removeChild(this.container);
  });

  it('provides selector to fetch mainColor', function() {
    insertThemeProbeElement(this.container, 'main_color', 'background-color: rgb(170, 170, 170)');
    const store = createStore([themeModule], {});

    const result = mainColor(store.getState());

    expect(result).to.eq('rgb(170, 170, 170)');
  });

  function insertThemeProbeElement(container, name, style) {
    const element = document.createElement('span');
    element.id = `theme_probe-${name}`;
    element.setAttribute('style', style);
    container.appendChild(element);
  }
});
