import {Base} from '../../ui/inputs/Base';
import {DropDownButton} from '../DropDownButton';

export const FileInput = Base.extend({
  menuItemNames: function() {
    return DropDownButton.find(this.$el).menuItemNames();
  },

  selectMenuItemByName: function(name) {
    DropDownButton.find(this.$el).selectMenuItemByName(name);
  }
});
