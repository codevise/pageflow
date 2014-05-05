pageflow.subviewContainer = {
  subview: function(view) {
    this.subviews = this.subviews || new Backbone.ChildViewContainer();
    this.subviews.add(view.render());
    return view;
  },

  onClose: function() {
    if (this.subviews) {
      this.subviews.call('close');
    }
  }
};

Cocktail.mixin(Backbone.Marionette.View, pageflow.subviewContainer);