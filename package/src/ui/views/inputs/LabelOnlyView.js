import Marionette from 'backbone.marionette';

import {inputView} from '../mixins/inputView';

/**
 * Render an input that is only a label. Can be used to render
 * additional inline help.
 *
 * See {@link inputView} for further options
 *
 * @class
 */
export const LabelOnlyView = Marionette.ItemView.extend({
  mixins: [inputView],

  template: () => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
  `,

  ui: {
    label: 'label'
  }
});
