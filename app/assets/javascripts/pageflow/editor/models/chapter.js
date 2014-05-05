pageflow.Chapter = Backbone.Model.extend({
  modelName: 'chapter',
  paramRoot: 'chapter',

  mixins: [pageflow.failureTracking, pageflow.delayedDestroying],

  initialize: function(attributes, options) {
    this.pages = new pageflow.SubsetCollection({
      parent: pageflow.pages,
      parentModel: this,

      filter: function(item) {
        return item.get('chapter_id') === attributes.id;
      },

      comparator: function(item) {
        return item.get('position');
      }
    });

    this.pages.each(function(page) { page.chapter = this; }, this);

    this.listenTo(this, 'change:title', function() {
      this.save();
    });

    this.listenTo(this.pages, 'add', function(model) {
      model.chapter = this;
    });

    this.listenTo(this.pages, 'remove', function(model) {
      model.chapter = null;
    });

    this.listenTo(this, 'destroy', function() {
      this.pages.clear();
    });

    return attributes;
  },

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/chapters';
  },

  addPage: function() {
    this.pages.create({
      chapter_id: this.get('id'),
      position: this.pages.length
    });
  },

  destroy: function() {
    this.destroyWithDelay();
  }
});