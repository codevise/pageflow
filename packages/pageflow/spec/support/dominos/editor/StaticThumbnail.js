import {Base} from '../Base';

export const StaticThumbnail = Base.extend({
  selector: '.static_thumbnail',

  backgroundImage: function() {
    return this.$el.css('backgroundImage');
  }
});
