pageflow.SidebarFooterView = Backbone.Marionette.View.extend({
  className: 'sidebar_footer',

  render: function() {
    if (pageflow.features.isEnabled('editor_emulation_mode')) {
      this.appendSubview(new pageflow.EmulationModeButtonView({model: this.model}));
    }

    this.appendSubview(new pageflow.HelpButtonView());
    return this;
  }
});
