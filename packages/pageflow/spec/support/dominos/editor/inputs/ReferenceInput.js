import {Base} from '../../Base';

export const ReferenceInput = Base.extend({
  clickChooseButton: function() {
    this.$el.find('.choose').trigger('click');
  }
});
