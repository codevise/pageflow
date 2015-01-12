pageflow.PageLinkInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'pageflow/editor/templates/inputs/page_link_input',
  className: 'page_link_input',

  ui: {
    pageTitle: '.page_title',
    unsetButton: '.unset'
  },

  events: {
    'click .choose': function() {
      var view = this;

      pageflow.editor.selectPage().then(function(page) {
        view.model.set(view.options.propertyName, page.get('perma_id'));
      });

      return false;
    },

    'click .unset': function() {
      this.model.unset(this.options.propertyName);
      return false;
    }
  },

  onRender: function() {
    this.update();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.update);
  },

  update: function() {
    var page = this._getPage();

    this.ui.pageTitle.text(page ? page.title() : I18n.t('pageflow.editor.views.inputs.page_link_input_view.none'));
    this.ui.unsetButton.toggle(!!page);

    if (this.pageThumbnailView) {
      this.pageThumbnailView.close();
    }

    this.pageThumbnailView = this.subview(new pageflow.PageThumbnailView({
      model: page
    }));

    this.ui.pageTitle.before(this.pageThumbnailView.el);
  },

  _getPage: function() {
    return pageflow.pages.getByPermaId(this.model.get(this.options.propertyName));
  }
});
