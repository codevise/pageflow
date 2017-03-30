/**
 * Base class for input views that reference models.
 *
 * @class
 * @memberof module:pageflow/editor
 */
pageflow.ReferenceInputView = Backbone.Marionette.ItemView.extend(
/** @lends module:pageflow/editor.pageflow.ReferenceInputView# */{

  mixins: [pageflow.inputView],

  template: 'pageflow/editor/templates/inputs/reference',
  className: 'reference_input',

  ui: {
    title: '.title',
    unsetButton: '.unset',
    buttons: 'button'
  },

  events: {
    'click .choose': function() {
      var view = this;

      this.choose().then(function(site) {
        view.model.set(view.options.propertyName, site.get('perma_id'));
      });

      return false;
    },

    'click .unset': function() {
      this.model.unset(this.options.propertyName);
      return false;
    }
  },

  initialize: function() {
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.update);
  },

  onRender: function() {
    this.update();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.update);
  },

  choose: function() {
    throw 'Not implemented: Override ReferenceInputView#choose to return a promise';
  },

  getTarget: function() {
    throw 'Not implemented: Override ReferenceInputView#getTarget';
  },

  createThumbnailView: function(target) {
    return new pageflow.ModelThumbnailView({
      model: target
    });
  },

  update: function() {
    var target = this.getTarget(this.model.get(this.options.propertyName));

    this.ui.title.text(target ? target.title() : I18n.t('pageflow.editor.views.inputs.reference_input_view.none'));
    this.ui.unsetButton.toggle(!!target);

    this.updateDisabledAttribute(this.ui.buttons);

    if (this.thumbnailView) {
      this.thumbnailView.close();
    }

    this.thumbnailView = this.subview(this.createThumbnailView(target));

    this.ui.title.before(this.thumbnailView.el);
  }
});
