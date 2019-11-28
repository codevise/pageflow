import themeModule from 'theme';
import {mainColor} from 'theme/selectors';
import createStore from 'createStore';


describe('theme', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    testContext.container = document.createElement('div');
    document.body.appendChild(testContext.container);
  });

  afterEach(() => {
    document.body.removeChild(testContext.container);
  });

  it('provides selector to fetch mainColor', () => {
    insertThemeProbeElement(testContext.container, 'main_color', 'background-color: rgb(170, 170, 170)');
    const store = createStore([themeModule], {});

    const result = mainColor(store.getState());

    expect(result).toBe('rgb(170, 170, 170)');
  });

  function insertThemeProbeElement(container, name, style) {
    const element = document.createElement('span');
    element.id = `theme_probe-${name}`;
    element.setAttribute('style', style);
    container.appendChild(element);
  }
});
