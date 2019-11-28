import Backbone from 'backbone';
import _ from 'underscore';

import {PageLink} from '../models/PageLink';

export const PageLinksCollection = Backbone.Collection.extend({
  model: PageLink,

  initialize: function(models, options) {
    this.configuration = options.configuration;
    this.page = options.configuration.page;

    this.load();

    this.listenTo(this, 'add remove change', this.save);
    this.listenTo(this.configuration, 'change:page_links', this.load);
  },

  addLink: function(targetPageId) {
    this.addWithPosition(this.defaultPosition(), targetPageId);
  },

  canAddLink: function(targetPageId) {
    return true;
  },

  updateLink: function(link, targetPageId) {
    link.set('target_page_id', targetPageId);
  },

  removeLink: function(link) {
    this.remove(link);
  },

  addWithPosition: function(position, targetPageId) {
    this.add(this.pageLinkAttributes(position, targetPageId));
  },

  removeByPosition: function(position) {
    this.remove(this.findByPosition(position));
  },

  findByPosition: function(position) {
    return this.findWhere({position: position});
  },

  load: function() {
    this.set(this.pageLinksAttributes());
  },

  save: function() {
    this.configuration.set('page_links', this.map(function(pageLink) {
      return pageLink.toSerializedJSON();
    }));
  },

  defaultPosition: function() {
    return Math.max(0, _.max(this.map(function(pageLink) {
      return pageLink.get('position');
    }))) + 1;
  },

  pageLinksAttributes: function() {
    return this.configuration.get('page_links') || [];
  },

  pageLinkAttributes: function(position, targetPageId, id) {
    return {
      id: id || this.getUniqueId(),
      target_page_id: targetPageId,
      position: position
    };
  },

  /** @private */
  getUniqueId: function() {
    var maxId = Math.max(0, _.max(this.map(function(pageLink) {
      return parseInt(pageLink.id.split(':').pop(), 10);
    })));

    return this.configuration.page.get('perma_id') + ':' + (maxId + 1);
  }
});
