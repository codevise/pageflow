pageflow.PageLink = Backbone.Model.extend({
  mixins: [pageflow.transientReferences],

  i18nKey: 'pageflow/page_link',

  targetPage: function() {
    return pageflow.pages.getByPermaId(this.get('target_page_id'));
  },

  label: function() {
    return this.get('label');
  },

  editPath: function() {
    return '/page_links/' + this.id;
  },

  getPageId: function() {
    return this.collection.page.id;
  },

  toSerializedJSON: function() {
    return _.omit(this.attributes, 'highlighted', 'position');
  },

  highlight: function() {
    this.set('highlighted', true);
  },

  resetHighlight: function() {
    this.unset('highlighted');
  },

  remove: function() {
    this.collection.remove(this);
  }
});