import Marionette from 'backbone.marionette';

/**
 * Round check button that adds a model to or removes it from a
 * {@link ListSelection}.
 *
 * Has class `marking` while the selection is active and
 * class `marked` while the model is included. Triggers a `toggle`
 * event after the selection changed.
 *
 * @param {Object} options
 *
 * @param {Backbone.Model} options.model
 *
 * @param {ListSelection} options.selection
 *
 * @param {String} options.label
 *   Accessible label and title.
 *
 * @param {String} [options.startMarkingLabel]
 *   Label to use instead while the selection is not active.
 *
 * @class
 */
export const MarkButtonView = Marionette.ItemView.extend({
  tagName: 'button',
  className: 'mark_button',
  template: () => '',

  attributes: {
    type: 'button'
  },

  events: {
    'click': function() {
      this.options.selection.toggle(this.model);
      this.trigger('toggle');

      return false;
    }
  },

  initialize: function() {
    this.listenTo(this.options.selection, 'add remove reset change:selecting', this.update);
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    var selection = this.options.selection;
    var marking = selection.isActive();
    var marked = selection.includes(this.model);
    var label = marking ?
                this.options.label :
                this.options.startMarkingLabel || this.options.label;

    this.$el.toggleClass('marking', marking);
    this.$el.toggleClass('marked', marked);

    this.$el.attr({
      'aria-pressed': marked ? 'true' : 'false',
      'aria-label': label,
      title: label
    });
  }
});
