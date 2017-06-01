describe('ChangeThemeDialogView', function() {
  it('shows preview on item hover', function() {
    var view = new pageflow.ChangeThemeDialogView({
      themes: new pageflow.ThemesCollection([
        {name: 'default', preview_image_url: 'path_to_default_preview_image'},
        {name: 'acme', preview_image_url: 'path_to_acme_preview_image'}
      ]),
      themeInUse: 'default'
    });

    view.render();
    var themeItem = support.dom.ThemeItemView.findByName('acme', {inView: view});

    themeItem.hover();

    expect(view.ui.previewImage).to.have.$attr('src', 'path_to_acme_preview_image');
  });

  it('shows preview on item click', function() {
    var view = new pageflow.ChangeThemeDialogView({
      themes: new pageflow.ThemesCollection([
        {name: 'default', preview_image_url: 'path_to_default_preview_image'},
        {name: 'acme', preview_image_url: 'path_to_acme_preview_image'}
      ]),
      themeInUse: 'default'
    });

    view.render();
    var themeItem = support.dom.ThemeItemView.findByName('acme', {inView: view});

    themeItem.click();

    expect(view.ui.previewImage).to.have.$attr('src', 'path_to_acme_preview_image');
  });

  it('calls onUse with theme model when clicking use theme button',
     function() {
       var themes = new pageflow.ThemesCollection([
         {name: 'default', preview_image_url: 'path_to_default_preview_image'},
         {name: 'acme', preview_image_url: 'path_to_acme_preview_image'}
       ]);
       var onUseHandler = sinon.spy();
       var view = new pageflow.ChangeThemeDialogView({
         themes: themes,
         onUse: onUseHandler,
         themeInUse: 'default'
       });

       view.render();
       var themeItem = support.dom.ThemeItemView.findByName('acme', {inView: view});

       themeItem.clickUseButton();

       expect(onUseHandler).to.have.been.calledWith(themes.findByName('acme'));
     }
    );
});
