import {ThemesCollection} from '$pageflow/editor';

import {ChangeThemeDialogView} from '$pageflow/editor';

import * as support from '$support';
import sinon from 'sinon';
import {ThemeItemView} from '$support/dominos/editor';

describe('ChangeThemeDialogView', () => {
  test('shows preview on item hover', () => {
    var view = new ChangeThemeDialogView({
      themes: new ThemesCollection([
        {name: 'default', preview_image_url: '/assets/pageflow/themes/default/preview.png'},
        {name: 'acme', preview_image_url: '/assets/pageflow/themes/test_theme/preview.png'}
      ]),
      themeInUse: 'default'
    });

    view.render();
    var themeItem = ThemeItemView.findByName('acme', {inView: view});

    themeItem.hover();

    expect(view.ui.previewImage).to.have.$attr('src',
                                               '/assets/pageflow/themes/test_theme/preview.png');
  });

  test('shows preview on item click', () => {
    var view = new ChangeThemeDialogView({
      themes: new ThemesCollection([
        {name: 'default', preview_image_url: '/assets/pageflow/themes/default/preview.png'},
        {name: 'acme', preview_image_url: '/assets/pageflow/themes/test_theme/preview.png'}
      ]),
      themeInUse: 'default'
    });

    view.render();
    var themeItem = ThemeItemView.findByName('acme', {inView: view});

    themeItem.click();

    expect(view.ui.previewImage).to.have.$attr('src',
                                               '/assets/pageflow/themes/test_theme/preview.png');
  });

  test(
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
      var themeItem = ThemeItemView.findByName('acme', {inView: view});

      themeItem.clickUseButton();

      expect(onUseHandler).to.have.been.calledWith(themes.findByName('acme'));
    }
  );
});
