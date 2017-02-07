pageflow.PagePreviewView = Backbone.Marionette.View.extend({
  tagName: 'section',
  className: 'page',

  modelEvents: {
    'change:template': 'updateTemplate',

    'change:configuration': 'update',

    'change:position': 'updateChapterBeginningClass',

    'change:id': function() {
      this.$el.attr('data-id', this.model.id);
      this.$el.attr('data-perma-id', this.model.get('perma_id'));
      this.$el.attr('id', this.model.get('perma_id'));
    }
  },

  events: {
    pageactivate: function() {
      this.model.set('active', true);
    },

    pagedeactivate: function() {
      this.model.set('active', false);
    }
  },

  render: function() {
    this.$el.html(this.pageTemplate());

    this.$el.attr('data-id', this.model.id);
    this.$el.attr('data-perma-id', this.model.get('perma_id'));
    this.$el.attr('id', this.model.get('perma_id'));
    this.$el.attr('data-chapter-id', this.model.get('chapter_id'));

    this.$el.data('template', this.model.get('template'));
    this.$el.data('configuration', this.model.get('configuration'));

    this.$el.on('pageenhanced', _.bind(function() {
      this.update();
      this.initEmbeddedViews();

      this.$el.page('reactivate');
    }, this));

    return this;
  },

  onClose: function() {
    this.$el.page('cleanup');
  },

  updateTemplate: function() {
    this.$el.page('cleanup');
    this.$el.html(this.pageTemplate());
    this.$el.data('template', this.model.get('template'));

    setTimeout(_.bind(function() {
      this.$el.page('reinit');
    }, this), 0);
  },

  update: function() {
    this.$el.page('update', this.model.configuration);

    pageflow.events.trigger('page:update', this.model);

    this.refreshScroller();
    this.ensureTargetBlankForContentLinks();
    this.updateChapterBeginningClass();
  },

  updateChapterBeginningClass: function() {
    var chapterBeginning = this.model.get('position') === 0;
    this.$el.toggleClass('chapter_beginning', chapterBeginning);
  },

  pageTypeHooks: function() {
    return pageflow.pageType.get(this.model.get('template'));
  },

  pageTemplate: function() {
    return this._unescape($('script[data-template="' + this.model.get('template') + '_page"]').html());
  },

  refreshScroller: function() {
    this.$el.page('refreshScroller');
  },

  ensureTargetBlankForContentLinks: function() {
    pageflow.links.ensureTargetBlankForContentLinks(this.el);
  },

  initEmbeddedViews: function() {
    var view = this;

    if (view.embeddedViews) {
      view.embeddedViews.call('close');
    }

    view.embeddedViews = new Backbone.ChildViewContainer();

    _.each(view.embeddedViewDefinitions(), function(item, selector) {
      view.$(selector).each(function() {
        view.embeddedViews.add(new item.view(_.extend(item.options || {}, {
          el: this,
          model: view.model.configuration,
          container: view
        })).render());
      });
    });
  },

  embeddedViewDefinitions: function() {
    return _.extend(
      {},
      this.pageTypeHooks().embeddedEditorViews() || {},
      this.model.pageType().embeddedViews()
    );
  },

  _unescape: function(text) {
    return $('<div/>').html(text).text();
  }
});
