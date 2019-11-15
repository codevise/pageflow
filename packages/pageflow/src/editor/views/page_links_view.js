pageflow.PageLinksView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/editor/templates/page_links',
  className: 'page_links',

  ui: {
    links: 'ul.links',
    addButton: '.add_link'
  },

  events: {
    'click .add_link': function() {
      var view = this;

      pageflow.editor.selectPage().then(function(page) {
        view.model.pageLinks().addLink(page.get('perma_id'));
      });

      return false;
    }
  },

  onRender: function() {
    var pageLinks = this.model.pageLinks();
    var collectionViewConstructor = pageLinks.saveOrder ? pageflow.SortableCollectionView : pageflow.CollectionView;

    this.subview(new collectionViewConstructor({
      el: this.ui.links,
      collection: pageLinks,
      itemViewConstructor: pageflow.PageLinkItemView,
      itemViewOptions: {
        pageLinks: pageLinks
      }
    }));

    this.listenTo(pageLinks, 'add remove', function() {
      this.updateAddButton(pageLinks);
    });

    this.updateAddButton(pageLinks);
  },

  updateAddButton: function(pageLinks) {
    this.ui.addButton.css('display', pageLinks.canAddLink() ? 'inline-block' : 'none');
  }
});