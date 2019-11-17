describe('ChangeThemeDialogView', function() {
  it('shows preview on item hover', function() {
    var view = new pageflow.ChangeThemeDialogView({
      themes: new pageflow.ThemesCollection([
        {name: 'default', preview_image_url: '/assets/pageflow/themes/default/preview.png'},
        {name: 'acme', preview_image_url: '/assets/pageflow/themes/test_theme/preview.png'}
      ]),
      themeInUse: 'default'
    });

    view.render();
    var themeItem = support.dom.ThemeItemView.findByName('acme', {inView: view});

    themeItem.hover();

    expect(view.ui.previewImage).to.have.$attr('src',
                                               '/assets/pageflow/themes/test_theme/preview.png');
  });

  it('shows preview on item click', function() {
    var view = new pageflow.ChangeThemeDialogView({
      themes: new pageflow.ThemesCollection([
        {name: 'default', preview_image_url: '/assets/pageflow/themes/default/preview.png'},
        {name: 'acme', preview_image_url: '/assets/pageflow/themes/test_theme/preview.png'}
      ]),
      themeInUse: 'default'
    });

    view.render();
    var themeItem = support.dom.ThemeItemView.findByName('acme', {inView: view});

    themeItem.click();

    expect(view.ui.previewImage).to.have.$attr('src',
                                               '/assets/pageflow/themes/test_theme/preview.png');
  });

  it('calls onUse with theme model when clicking use theme button',
     function() {
       var themes = new pageflow.ThemesCollection([
         {name: 'default', preview_image_url: '/assets/pageflow/themes/default/preview.png'},
         {name: 'acme', preview_image_url: '/assets/pageflow/themes/test_theme/preview.png'}
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
