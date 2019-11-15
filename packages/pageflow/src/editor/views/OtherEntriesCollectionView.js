pageflow.OtherEntriesCollectionView = Backbone.Marionette.View.extend({
  initialize: function() {
    this.otherEntries = new pageflow.OtherEntriesCollection();

    this.listenTo(this.otherEntries, 'sync', function() {
      if (this.otherEntries.length === 1) {
        this.options.selection.set('entry', this.otherEntries.first());
      }
    });
  },

  render: function() {
    this.subview(new pageflow.CollectionView({
      el: this.el,
      collection: this.otherEntries,
      itemViewConstructor: pageflow.OtherEntryItemView,
      itemViewOptions: {
        selection: this.options.selection
      },
      blankSlateViewConstructor: Backbone.Marionette.ItemView.extend({
        template: 'templates/other_entries_blank_slate',
        tagName: 'li',
        className: 'blank_slate'
      }),
      loadingViewConstructor: pageflow.LoadingView
    }));

    this.otherEntries.fetch();

    return this;
  }
});
