pageflow.Page = Backbone.Model.extend({
  modelName: 'page',
  paramRoot: 'page',
  i18nKey: 'pageflow/page',

  defaults: function() {
    return {
      template: 'background_image',
      configuration: {},
      active: false,
      perma_id: ''
    };
  },

  mixins: [pageflow.failureTracking, pageflow.delayedDestroying],

  initialize: function() {
    this.configuration = new pageflow.Configuration(this.get('configuration') || {});
    this.configuration.parent = this.configuration.page = this;

    this.listenTo(this.configuration, 'change', function() {
      this.trigger('change:configuration', this);
    });

    this.listenTo(this.configuration, 'change:title', function() {
      this.trigger('change:title');
    });

    this.listenTo(this.configuration, 'change', function() {
      this.save();
    });

    this.listenTo(this, 'change:template', function() {
      this.save();
    });
  },

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/pages';
  },

  chapterPosition: function() {
    return (this.chapter && this.chapter.get('position')) || -1;
  },

  title: function() {
    return this.configuration.get('title') || this.configuration.get('additional_title');
  },

  thumbnailFile: function() {
    var configuration = this.configuration;

    return _.reduce(this.pageType().thumbnail_candidates, function(result, candidate) {
      return result || configuration.getReference(candidate.attribute, candidate.file_collection);
    }, null);
  },

  pageType: function() {
    return pageflow.Page.typesByName[this.get('template')];
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

pageflow.Page.transitions = ['fade', 'scroll'];
pageflow.Page.linkedPagesLayouts = ['default', 'hero_top_left', 'hero_top_right'];
pageflow.Page.textPositions = ['left', 'right'];
