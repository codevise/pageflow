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
    var collectionView = this.options.sortable ? pageflow.SortableCollectionView : pageflow.CollectionView;

    this.subview(new collectionView({
      el: this.ui.pages,
      collection: this.model.pages,
      itemViewConstructor: this.options.pageItemView || pageflow.NavigatablePageItemView,
      itemViewOptions: this.options.pageItemViewOptions,
      connectWith: 'ul.pages'
    }));

    this.update();
    this.adjustScrollPosition();
  },

  update: function() {
    this.ui.title.text(this.model.get('title') || I18n.t('pageflow.editor.views.chapter_item_view.unnamed'));
    this.ui.number.text(I18n.t('pageflow.editor.views.chapter_item_view.chapter') + ' ' + (this.model.get('position') + 1));
  },

  adjustScrollPosition: function() {
    var active = this.$el.find('li.active')[0];
    if (active !== undefined) {
      var scrolling = $('.scrolling')[0];
      if (scrolling !== undefined) {
        this._scroll(active, scrolling);
      }
    }
  },

  _scroll: function(element, parent) {
    setTimeout(function() {

      $(parent).animate({
        scrollTop: $(parent).scrollTop() + $(element).offset().top - $(parent).offset().top
        - $(element).height()
      }, {
        duration: 'slow',
        easing: 'easeOutBack'
      });

    }, 0); // setTimeout
  }
});
