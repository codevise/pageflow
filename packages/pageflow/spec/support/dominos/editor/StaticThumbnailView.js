import {Base} from '../Base';

export const StaticThumbnailView = Base.extend({
  selector: '.static_thumbnail',

  backgroundImage: function() {
    return this.$el.css('backgroundImage');
  }
});
