pageflow.subviewContainer = {
  subview: function(view) {
    this.subviews = this.subviews || new Backbone.ChildViewContainer();
    this.subviews.add(view.render());
    return view;
  },

  appendSubview: function(view) {
    return this.$el.append(this.subview(view).el);
  },

  onClose: function() {
    if (this.subviews) {
      this.subviews.call('close');
    }
  }
};

Cocktail.mixin(Backbone.Marionette.View, pageflow.subviewContainer);