pageflow.Chapter = Backbone.Model.extend({
  modelName: 'chapter',
  paramRoot: 'chapter',
  i18nKey: 'pageflow/chapter',

  mixins: [pageflow.failureTracking, pageflow.delayedDestroying],

  initialize: function(attributes, options) {
    this.pages = new pageflow.ChapterPagesCollection({
      pages: options.pages || pageflow.pages,
      chapter: this
    });

    this.listenTo(this, 'change:title', function() {
      this.save();
    });

    this.configuration = new pageflow.ChapterConfiguration(this.get('configuration') || {});

    this.listenTo(this.configuration, 'change', function() {
      this.save();
      this.trigger('change:configuration', this);
    });

    return attributes;
  },

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/chapters';
  },

  addPage: function(options) {
    options = options || {};

    var pos = ('position' in options) ? options.position : this.pages.length;

    var create_opts = {
      chapter_id: this.get('id'),
      position: pos
    };

    return this.pages.create(create_opts);
  },

  toJSON: function() {
    return _.extend(_.clone(this.attributes), {
      configuration: this.configuration.toJSON()
    });
  },

  destroy: function() {
    this.destroyWithDelay();
  }
});
