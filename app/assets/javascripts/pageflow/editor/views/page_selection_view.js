pageflow.PageSelectionView = Backbone.Marionette.ItemView.extend({
  template: 'templates/page_selection',
  className: 'page_selection dialog',

  mixins: [pageflow.dialogView],

  ui: {
    storylines: '.storyline_picker',
    chapters: '.chapters',
  },

  events: {
    'click ul.pages li': function(event) {
      this.options.onSelect(pageflow.pages.get($(event.currentTarget).data('id')));
      this.close();
    }
  },

  onRender: function() {
    this.subview(new pageflow.StorylinePickerView({
      el: this.ui.storylines
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