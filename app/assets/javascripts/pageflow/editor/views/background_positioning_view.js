pageflow.BackgroundPositioningView = Backbone.Marionette.ItemView.extend({
  template: 'templates/background_positioning',
  className: 'background_positioning dialog',

  mixins: [pageflow.dialogView],

  ui: {
    previews: '.previews > div',
    wrapper: '.wrapper',
  },

  previews: {
    ratio16to9: 16 / 9,
    ratio16to9Portrait: 9 / 16,
    ratio4to3: 4 / 3,
    ratio4to3Portrait: 3 / 4,
    banner: 5 / 1
  },

  events: {
    'click .save': function() {
      this.save();
      this.close();
    }
  },

  initialize: function() {
    this.transientModel = this.model.clone();
  },

  onRender: function() {
    this.ui.wrapper.append(this.subview(new pageflow.BackgroundPositioningSlidersView({
      model: this.transientModel,
      propertyName: this.options.propertyName,
      filesCollection: this.options.filesCollection
    })).el);

    this.createPreviews();
  },

  save: function() {
    this.model.setFilePositions(
      this.options.propertyName,
      this.transientModel.getFilePosition(this.options.propertyName, 'x'),
      this.transientModel.getFilePosition(this.options.propertyName, 'y')
    );
  },

  createPreviews: function() {
    var view = this;

    _.each(view.previews, function(ratio, name) {
      view.ui.previews.append(view.subview(new pageflow.BackgroundPositioningPreviewView({
        model: view.transientModel,
        propertyName: view.options.propertyName,
        filesCollection: view.options.filesCollection,
        ratio: ratio,
        maxSize: 200,
        label: I18n.t('pageflow.editor.templates.background_positioning.previews.' + name)
      })).el);
    });
  }
});

pageflow.BackgroundPositioningView.open = function(options) {
  pageflow.app.dialogRegion.show(new pageflow.BackgroundPositioningView(options).render());
};