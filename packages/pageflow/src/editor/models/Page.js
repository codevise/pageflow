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

  storylinePosition: function() {
    return (this.chapter && this.chapter.storylinePosition()) || -1;
  },

  chapterPosition: function() {
    return this.chapter && this.chapter.has('position') ? this.chapter.get('position') : -1;
  },

  isFirstPage: function() {
    return this.isChapterBeginning() &&
           this.chapterPosition() === 0 &&
           this.storylinePosition() === 1;
  },

  isChapterBeginning: function() {
    return this.get('position') === 0;
  },

  title: function() {
    return this.configuration.get('title') ||
      this.configuration.get('additional_title') ||
      '';
  },

  thumbnailFile: function() {
    var configuration = this.configuration;

    return _.reduce(this.pageType().thumbnailCandidates(), function(result, candidate) {
      if (candidate.condition && !conditionMet(candidate.condition, configuration)) {
        return result;
      }

      return result || configuration.getReference(candidate.attribute, candidate.file_collection);
    }, null);
  },

  pageLinks: function() {
    return this.pageType().pageLinks(this.configuration);
  },

  pageType: function() {
    return pageflow.editor.pageTypes.findByName(this.get('template'));
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

function conditionMet(condition, configuration) {
  if (condition.negated) {
    return configuration.get(condition.attribute) != condition.value;
  }
  else {
    return configuration.get(condition.attribute) == condition.value;
  }
}

pageflow.Page.linkedPagesLayouts = ['default', 'hero_top_left', 'hero_top_right'];
pageflow.Page.textPositions = ['left', 'center', 'right'];
pageflow.Page.textPositionsWithoutCenterOption = ['left', 'right'];

pageflow.Page.scrollIndicatorModes = ['all', 'only_back', 'only_next', 'non'];
pageflow.Page.scrollIndicatorOrientations = ['vertical', 'horizontal'];
pageflow.Page.delayedTextFadeIn = ['no_fade', 'short', 'medium', 'long'];
