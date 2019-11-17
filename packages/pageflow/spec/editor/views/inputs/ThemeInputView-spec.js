describe('ThemeInputView', () => {
  test('updates attribute on clicking "use theme button"', () => {
    var model = new Backbone.Model({theme_name: 'default'});
    var themes = new pageflow.ThemesCollection([
      {name: 'default', preview_image_url: '/assets/pageflow/themes/default/preview.png'},
      {name: 'acme', preview_image_url: '/assets/pageflow/themes/test_theme/preview.png'}
    ]);
    var view = new pageflow.ThemeInputView({
      model: model,
      propertyName: 'theme_name',
      themes: themes
    });

    support.dom.ReferenceInputView.render(view).clickChooseButton();
    var themeItemView = support.dom.ThemeItemView.findByName('acme', {
      inView: pageflow.app.dialogRegion.currentView
    });

    themeItemView.clickUseButton();

    expect(model.get('theme_name')).toBe('acme');
  });
});
