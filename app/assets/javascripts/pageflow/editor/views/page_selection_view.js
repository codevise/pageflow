pageflow.PageSelectionView = Backbone.Marionette.ItemView.extend({
  template: 'templates/page_selection',
  className: 'page_selection dialog',

  mixins: [pageflow.dialogView],

  ui: {
    chapters: 'ul.chapters',
  },

  events: {
    'click ul.pages li': function(event) {
      this.options.onSelect(pageflow.pages.get($(event.currentTarget).data('id')));
      this.close();
    }
  },

  onRender: function() {
    var onSelect = this.onSelect;

    this.subview(new pageflow.CollectionView({
      el: this.ui.chapters,
      collection: this.model.chapters,
      itemViewConstructor: pageflow.ChapterItemView,
      itemViewOptions: {
        pageItemView: pageflow.PageItemView,
        sortable: false
      }
    }));
  }
});

pageflow.PageSelectionView.selectPage = function() {
  return $.Deferred(function(deferred) {
    var view = new pageflow.PageSelectionView({
      model: pageflow.entry,
      onSelect: deferred.resolve
    });

    view.on('close', function() {
      deferred.reject();
    });

    pageflow.app.dialogRegion.show(view.render());
  }).promise();
};