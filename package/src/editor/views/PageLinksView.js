import Marionette from 'backbone.marionette';

import {CollectionView, SortableCollectionView} from 'pageflow/ui';

import {editor} from '../base';

import {PageLinkItemView} from './PageLinkItemView';

import template from '../templates/pageLinks.jst';

export const PageLinksView = Marionette.ItemView.extend({
  template,
  className: 'page_links',

  ui: {
    links: 'ul.links',
    addButton: '.add_link'
  },

  events: {
    'click .add_link': function() {
      var view = this;

      editor.selectPage().then(function(page) {
        view.model.pageLinks().addLink(page.get('perma_id'));
      });

      return false;
    }
  },

  onRender: function() {
    var pageLinks = this.model.pageLinks();
    var collectionViewConstructor = pageLinks.saveOrder ? SortableCollectionView : CollectionView;

    this.subview(new collectionViewConstructor({
      el: this.ui.links,
      collection: pageLinks,
      itemViewConstructor: PageLinkItemView,
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