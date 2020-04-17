import {Base} from '../Base';

export const FileThumbnail = Base.extend({
  selector: '.file_thumbnail',

  backgroundImage: function() {
    return this.$el.css('backgroundImage');
  }
});
