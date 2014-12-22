pageflow.PagePreviewView = Backbone.Marionette.View.extend({
  tagName: 'section',
  className: 'page',

  modelEvents: {
    'change:template': 'updateTemplate',

    'change:configuration': 'update',

    'change:position': 'updateChapterBeginningClass',

    'sync': function() {
      this.$el.attr('data-id', this.model.id);
      this.$el.attr('data-perma-id', this.model.get('perma_id'));
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
    this.$el.data('template', this.model.get('template'));
    this.$el.data('configuration', this.model.get('configuration'));

    this.$el.page();
    this.updateChapterBeginningClass();
    this.update();
    this.$el.page('reactivate');

    this.initEmbeddedViews();

    return this;
  },

  updateTemplate: function() {
    this.$el.page('cleanup');

    this.$el.html(this.pageTemplate());
    this.$el.data('template', this.model.get('template'));

    this.$el.page('reinit');
    this.updateChapterBeginningClass();
    this.update();
    this.$el.page('reactivate');

    this.initEmbeddedViews();
  },

  update: function() {
    this.$el.removeClass(pageflow.Page.transitions.join(' ')).addClass(this.model.configuration.get('transition'));

    this.pageType().update(this.$el, this.model.configuration);
    _.extend(this.$el.data('configuration'), this.model.configuration.attributes);

    this.refreshScroller();
    this.ensureTargetBlankForContentLinks();
  },

  updateChapterBeginningClass: function() {
    var chapterBeginning = this.model.get('position') === 0;
    this.$el.toggleClass('chapter_beginning', chapterBeginning);
  },

  pageType: function() {
    return this.$el.data('pageType');
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

    _.each(view.pageType().embeddedEditorViews(), function(item, selector) {
      view.$(selector).each(function() {
        view.embeddedViews.add(new item.view(_.extend(item.options || {}, {
          el: this,
          model: view.model.configuration,
          container: view
        })).render());
      });
    });
  },

  _unescape: function(text) {
    return $('<div/>').html(text).text();
  }
});
