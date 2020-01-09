import Marionette from 'backbone.marionette';

export const EntryMetaDataAppearanceView = Marionette.View.extend({
  className: 'entry_meta_data_appearance',

  render() {
    this.$el.text('Scrolled Appearance');
    return this;
  }
});
