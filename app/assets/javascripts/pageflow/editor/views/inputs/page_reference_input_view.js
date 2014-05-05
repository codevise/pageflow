pageflow.PageReferenceInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'templates/inputs/page_reference',
  className: 'page_reference_input',

  ui: {
    chapters: 'ul.chapters'
  },

  modelEvents: {
    'change:linked_page_ids': function() {
      this._highlightUsedPages();
    }
  },

  onRender: function() {
    this.model.page.set('linked_page_ids_editable', true);

    this.subview(new pageflow.CollectionView({
      el: this.ui.chapters,
      collection: pageflow.entry.chapters,
      itemViewConstructor: pageflow.ChapterItemView,
      itemViewOptions: {
        pageItemView: pageflow.DraggablePageItemView
      }
    }));

    this._highlightUsedPages();
  },

  onClose: function() {
    this.model.page.unset('linked_page_ids_editable');
  },

  _highlightUsedPages: function() {
    var model = this.model;

    this.$('ul.pages > li').each(function() {
      var usedPageIds = _.values(model.get('linked_page_ids') || {});
      $(this).toggleClass('used', _.contains(usedPageIds, $(this).data('permaId')));
    });
  }
});