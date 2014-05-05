pageflow.PageLinkEmbeddedView = Backbone.Marionette.ItemView.extend({
  template: 'templates/embedded/page_link',

  modelEvents: {
    'change': 'update'
  },

  ui: {
    title: 'span.title'
  },

  events: {
    'click .reset': function() {
      this.save(null);
    },

    'click .thumbnail': function () {
      if (!this.$el.hasClass('editable')) {
        pageflow.slides.goToById(this.linkedPage().id);
      }

      return false;
    },

    'mousedown': function() {
      if (this.$el.hasClass('editable') && !this.$el.hasClass('unassigned')) {
        return false;
      }
    }
  },

  onRender: function() {
    var view = this;

    this.$el.droppable({
      tolerance: 'pointer',

      accept: function() {
        return view.$el.hasClass('editable') && view.$el.hasClass('unassigned');
      },

      activate: function() {
        view.$el.addClass('droppable');
      },

      deactivate: function() {
        view.$el.removeClass('droppable over');
      },

      over: function() {
        view.$el.addClass('over');
      },

      out: function() {
        view.$el.removeClass('over');
      },

      drop: function(event, ui) {
        view.$el.removeClass('droppable over');
        view.save(ui.draggable.data('permaId'));
      }
    });

    this.$el.draggable({
      disabled: true,

      helper: 'clone',

      revert: function(droppable) {
        if (droppable) {
          view.save(null);
        }

        return !droppable;
      },

      start: function() {
        view.$el.addClass('dragged');
      },

      stop: function() {
        view.$el.removeClass('dragged');
      },

      revertDuration: 200
    });

    this.listenTo(this.model.page, 'change:' + this.options.propertyName + '_editable', function() {
      view.updateClassName();
      view.updateDraggable();
      view.options.container.refreshScroller();
    });

    this.update();
  },

  update: function() {
    var linkedPage = this.linkedPage();

    this.$el.data('permaId', linkedPage ? linkedPage.get('perma_id') : null);

    this.updateTitle();
    this.updateThumbnailView();
    this.updateClassName();
    this.updateDraggable();
  },

  updateTitle: function() {
    var linkedPage = this.linkedPage();

    this.ui.title.text(linkedPage ? linkedPage.configuration.get('description') : '');
  },

  updateThumbnailView: function() {
    var linkedPage = this.linkedPage();

    if (this.currentLinkedPage !== linkedPage) {
      if (this.currentLinkedPage) {
        this.stopListening(this.currentLinkedPage, 'change:highlighted');
        this.stopListening(this.currentLinkedPage.configuration, 'change:description');
      }

      this.currentLinkedPage = linkedPage;

      if (this.thumbnailView) {
        this.thumbnailView.close();
      }

      if (linkedPage) {
        this.thumbnailView = this.subview(new pageflow.PageThumbnailView({
          model: linkedPage,
          imageUrlPropertyName: 'link_thumbnail_url'
        }));

        this.$el.append(this.thumbnailView.el);

        this.listenTo(linkedPage, 'change:highlighted', this.updateClassName);
        this.listenTo(linkedPage.configuration, 'change:description', this.updateTitle);
      }
    }
  },

  updateClassName: function() {
    var editable = this.model.page.get(this.options.propertyName + '_editable');
    var linkedPage = this.linkedPage();

    this.$el.toggleClass('title_hover', !editable);
    this.$el.toggleClass('editable', !!editable);
    this.$el.toggleClass('empty', !linkedPage && !editable);
    this.$el.toggleClass('unassigned', !linkedPage);
    this.$el.toggleClass('highlighted', !!linkedPage && !!linkedPage.get('highlighted'));
  },

  updateDraggable: function() {
    this.$el.draggable('option', 'disabled', !this.$el.hasClass('editable') || this.$el.hasClass('unassigned'));
  },

  save: function(pagePermaId) {
    var references = _.clone(this.model.get(this.options.propertyName) || {});
    references[this.keyName()] = pagePermaId;

    this.model.set(this.options.propertyName, references);
  },

  linkedPage: function() {
    return pageflow.pages.getByPermaId(this.linkedPagePermaId());
  },

  linkedPagePermaId: function() {
    return (this.model.get(this.options.propertyName) || {})[this.keyName()];
  },

  keyName: function() {
    return this.$el.data('referenceKey');
  }
});