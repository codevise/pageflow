pageflow.OtherEntryItemView = Backbone.Marionette.ItemView.extend({
  template: 'templates/other_entry_item',
  className: 'other_entry_item',
  tagName: 'li',

  mixins: [pageflow.selectableView],

  ui: {
    title: '.title'
  },

  events: {
    'click': 'select'
  },

  onRender: function() {
    this.ui.title.text(this.model.titleOrSlug());
  }
});
