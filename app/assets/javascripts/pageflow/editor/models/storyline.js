pageflow.Storyline = Backbone.Model.extend({
  modelName: 'storyline',
  paramRoot: 'storyline',
  i18nKey: 'pageflow/storyline',

  mixins: [pageflow.failureTracking, pageflow.delayedDestroying],

  initialize: function(attributes, options) {
    this.chapters = new pageflow.StorylineChaptersCollection({
      chapters: options.chapters || pageflow.chapters,
      storyline: this
    });

    this.configuration = new pageflow.StorylineConfiguration(this.get('configuration') || {});

    this.listenTo(this.configuration, 'change', function() {
      if (!this.isNew()) {
        this.save();
      }
      this.trigger('change:configuration', this);
    });

    this.listenTo(this.configuration, 'change:main', function(model, value) {
      this.trigger('change:main', this, value);
    });
  },

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/storylines';
  },

  displayTitle: function() {
    return _([
      this.title() ||
        (!this.isMain() && I18n.t('pageflow.storylines.untitled')),
      this.isMain() && I18n.t('pageflow.storylines.main')
    ]).compact().join(' - ');
  },

  title: function() {
    return this.configuration.get('title');
  },

  isMain: function() {
    return !!this.configuration.get('main');
  },

  lane: function() {
    return this.configuration.get('lane');
  },

  row: function() {
    return this.configuration.get('row');
  },

  parentPagePermaId: function() {
    return this.configuration.get('parent_page_perma_id');
  },

  parentPage: function() {
    return pageflow.pages.getByPermaId(this.parentPagePermaId());
  },

  transitiveChildPages: function() {
    return new pageflow.StorylineTransitiveChildPages(this, pageflow.storylines, pageflow.pages);
  },

  addChapter: function(attributes) {
    var chapter = this.buildChapter(attributes);
    chapter.save();

    return chapter;
  },

  buildChapter: function(attributes) {
    var defaults = {
      storyline_id: this.id,
      title: '',
      position: this.chapters.length
    };

    return this.chapters.addAndReturnModel(_.extend(defaults, attributes));
  },

  scaffoldChapter: function(options) {
    var scaffold = new pageflow.ChapterScaffold(this, options);
    scaffold.create();

    return scaffold;
  },

  toJSON: function() {
    return {
      configuration: this.configuration.toJSON()
    };
  },

  destroy: function() {
    this.destroyWithDelay();
  }
});