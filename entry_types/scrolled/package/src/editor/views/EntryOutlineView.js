import Marionette from 'backbone.marionette';

export const EntryOutlineView = Marionette.View.extend({
  className: 'entry_outline',

  render() {
    this.$el.text('Outline');
  }
});
