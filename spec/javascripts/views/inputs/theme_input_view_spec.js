describe('ThemeInputView', function() {
  it('updates attribute on clicking "use theme button"', function() {
    var model = new Backbone.Model({theme_name: 'default'});
    var themes = new pageflow.ThemesCollection([
      {name: 'default', preview_image_url: 'path_to_default_preview_image'},
      {name: 'acme', preview_image_url: 'path_to_acme_preview_image'}
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

    expect(model.get('theme_name')).to.equal('acme');
  });
});
