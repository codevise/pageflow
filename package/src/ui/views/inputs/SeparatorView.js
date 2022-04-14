import Marionette from 'backbone.marionette';

/**
 * Render a separator in a {@link ConfigurationEditorView} tab.
 *
 * @example
 *
 * this.view(SeparatorView);
 *
 * @class
 */
export const SeparatorView = Marionette.View.extend({
  className: 'separator'
});
