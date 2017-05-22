pageflow.ReferenceInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'pageflow/editor/templates/inputs/reference',
  className: 'reference_input',

  ui: {
    title: '.title',
    unsetButton: '.unset'
  },

  events: {
    'click .choose': function() {
      var view = this;

      this.chooseValue().then(function(id) {
        view.model.set(view.options.propertyName, id);
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

  chooseValue: function() {
    return this.choose().then(function(model) {
      return model.get('perma_id');
    });
  },

  choose: function() {
    throw 'Not implemented: Override ReferenceInputView#choose to return a promise';
  },

  getTarget: function(targetId) {
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
    this.ui.unsetButton.toggle(!!target && !this.options.hideUnsetButton);

    if (this.thumbnailView) {
      this.thumbnailView.close();
    }

    this.thumbnailView = this.subview(this.createThumbnailView(target));

    this.ui.title.before(this.thumbnailView.el);
  }
});
