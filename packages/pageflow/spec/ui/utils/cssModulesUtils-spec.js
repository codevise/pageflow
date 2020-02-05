import {cssModulesUtils} from 'pageflow/ui';

describe('uiFromCssModule', () => {
  it('it turns class name mapping into ui mapping', () => {
    const styles = {
      container: 'css-module-generated-string'
    };
    const result = cssModulesUtils.ui(styles, 'container');

    expect(result).toEqual({
      container: '.css-module-generated-string'
    });
  });

  it('can handle composed class names', () => {
    const styles = {
      container: 'css-module composed-class-name'
    };
    const result = cssModulesUtils.ui(styles, 'container');

    expect(result).toEqual({
      container: '.css-module.composed-class-name'
    });
  });

  it('fails if class name not found', () => {
    const styles = {};

    expect(() =>
      cssModulesUtils.ui(styles, 'not-there')
    ).toThrow(/Unknown class name/);
  });
});

describe('events', () => {
  it('replaces class names in event mapping', () => {
    const styles = {
      container: 'css-module-generated-string'
    };
    const events = {
      'click container': () => {}
    }
    const result = cssModulesUtils.events(styles, events);

    expect(result).toEqual({
      'click .css-module-generated-string': events['click container']
    });
  });

  it('can handle composed class names', () => {
    const styles = {
      container: 'css-module composed-class-name'
    };
    const events = {
      'click container': () => {}
    }
    const result = cssModulesUtils.events(styles, events);

    expect(result).toEqual({
      'click .css-module.composed-class-name': events['click container']
    });
  });
});

describe('selector', () => {
  it('creates selector from class names', () => {
    const styles = {
      container: 'css-module-generated-string'
    };

    const result = cssModulesUtils.selector(styles, 'container');

    expect(result).toEqual('.css-module-generated-string');
  });

  it('can handle composed class names', () => {
    const styles = {
      container: 'css-module composed-class-name'
    };

    const result = cssModulesUtils.selector(styles, 'container');

    expect(result).toEqual('.css-module.composed-class-name');
  });
});
