pageflow.ChapterItemView = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: 'templates/chapter_item',

  ui: {
    title: '> a > .title',
    number: '> a > .number',
    pages: 'ul.pages'
  },

  modelEvents: {
    change: 'update'
  },

  onRender: function() {
    this.subview(new pageflow.SortableCollectionView({
      el: this.ui.pages,
      collection: this.model.pages,
      itemViewConstructor: this.options.pageItemView || pageflow.NavigatablePageItemView,
      itemViewOptions: this.options.pageItemViewOptions,
      connectWith: 'ul.pages'
    }));

    this.update();
  },

  update: function() {
    this.ui.title.text(this.model.get('title') || '(Unbenannt)');
    this.ui.number.text('Kapitel ' + (this.model.get('position') + 1));
  }
});