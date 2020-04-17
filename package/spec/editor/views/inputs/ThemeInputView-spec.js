import Backbone from 'backbone';

import {ThemesCollection, app, ThemeInputView} from 'pageflow/editor';

import {ReferenceInput, ThemeItem} from '$support/dominos/editor';

describe('ThemeInputView', () => {
  it('updates attribute on clicking "use theme button"', () => {
    var model = new Backbone.Model({theme_name: 'default'});
    var themes = new ThemesCollection([
      {name: 'default', preview_image_url: '/assets/pageflow/themes/default/preview.png'},
      {name: 'acme', preview_image_url: '/assets/pageflow/themes/test_theme/preview.png'}
    ]);
    var view = new ThemeInputView({
      model: model,
      propertyName: 'theme_name',
      themes: themes
    });

    ReferenceInput.render(view).clickChooseButton();
    var themeItemView = ThemeItem.findByName('acme', {
      inView: app.dialogRegion.currentView
    });

    themeItemView.clickUseButton();

    expect(model.get('theme_name')).toBe('acme');
  });
});
