pageflow.StorylineOutlineView = Backbone.Marionette.Layout.extend({
  template: 'templates/storyline_outline',
  className: 'storyline_outline',

  ui: {
    chapters: 'ul.storyline_outline_chapters'
  },

  events: {
    'click a.add_chapter': function() {
      this.model.scaffoldChapter();
    }
  },

  onRender: function() {
    this.ui.chapters.toggleClass('outline navigatable', !!this.options.navigatable);

    var collectionView = this.options.sortable ? pageflow.SortableCollectionView : pageflow.CollectionView;

    new collectionView({
      el: this.ui.chapters,
      collection: this.model.chapters,
      itemViewConstructor: this.options.navigatable ? pageflow.NavigatableChapterItemView : pageflow.ChapterItemView,
      itemViewOptions: {
        sortable: this.options.sortable,
        pageItemView: this.options.navigatable ? pageflow.NavigatablePageItemView : pageflow.PageItemView,
        pageItemViewOptions: _.extend({
          displayInNavigationHint: this.options.displayInNavigationHint
        }, this.options.pageItemViewOptions || {})
      }
    }).render();
  }
});