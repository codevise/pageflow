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
});
