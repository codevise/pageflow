import {Base} from '../../Base';

export const ReferenceInputView = Base.extend({
  clickChooseButton: function() {
    this.$el.find('.choose').trigger('click');
  }
});
