import ChildViewContainer from 'backbone.babysitter';
import Cocktail from 'cocktail';
import Marionette from 'backbone.marionette';

export const subviewContainer = {
  subview: function(view) {
    this.subviews = this.subviews || new ChildViewContainer();
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

Cocktail.mixin(Marionette.View, subviewContainer);