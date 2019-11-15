import Marionette from 'backbone.marionette';

import {state} from '$state';

export const HelpImageView = Marionette.View.extend({
  tagName: 'img',
  className: 'help_image',

  render: function() {
    this.$el.attr('src', state.editorAssetUrls.help[this.options.imageName]);
    return this;
  }
});
