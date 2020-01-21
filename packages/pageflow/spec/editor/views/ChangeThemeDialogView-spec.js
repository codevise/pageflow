import {ChangeThemeDialogView, ThemesCollection} from 'pageflow/editor';

import sinon from 'sinon';
import {ThemeItem} from '$support/dominos/editor';

describe('ChangeThemeDialogView', () => {
  it('shows preview on item hover', () => {
    var view = new ChangeThemeDialogView({
      themes: new ThemesCollection([
        {name: 'default', preview_image_url: '/assets/pageflow/themes/default/preview.png'},
        {name: 'acme', preview_image_url: '/assets/pageflow/themes/test_theme/preview.png'}
      ]),
      themeInUse: 'default'
    });

    view.render();
    var themeItem = ThemeItem.findByName('acme', {inView: view});

    themeItem.hover();

    expect(view.ui.previewImage).toHaveAttr('src',
                                               '/assets/pageflow/themes/test_theme/preview.png');
  });

  it('shows preview on item click', () => {
    var view = new ChangeThemeDialogView({
      themes: new ThemesCollection([
        {name: 'default', preview_image_url: '/assets/pageflow/themes/default/preview.png'},
        {name: 'acme', preview_image_url: '/assets/pageflow/themes/test_theme/preview.png'}
      ]),
      themeInUse: 'default'
    });

    view.render();
    var themeItem = ThemeItem.findByName('acme', {inView: view});

    themeItem.click();

    expect(view.ui.previewImage).toHaveAttr('src',
                                               '/assets/pageflow/themes/test_theme/preview.png');
  });

  it(
    'calls onUse with theme model when clicking use theme button',
    () => {
      var themes = new ThemesCollection([
        {name: 'default', preview_image_url: '/assets/pageflow/themes/default/preview.png'},
        {name: 'acme', preview_image_url: '/assets/pageflow/themes/test_theme/preview.png'}
      ]);
      var onUseHandler = sinon.spy();
      var view = new ChangeThemeDialogView({
        themes: themes,
        onUse: onUseHandler,
        themeInUse: 'default'
      });

      view.render();
      var themeItem = ThemeItem.findByName('acme', {inView: view});

      themeItem.clickUseButton();

      expect(onUseHandler).toHaveBeenCalledWith(themes.findByName('acme'));
    }
  );
});
