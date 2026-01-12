import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {inputView} from 'pageflow/ui';

export const EditDefaultsInputView = Marionette.ItemView.extend({
  mixins: [inputView],

  className: 'edit_defaults_button',

  template: () => `
    <button>
      ${I18n.t('pageflow.editor.views.inputs.edit_defaults_input_view.label')}
    </button>
  `,

  events: {
    'click button': function() {
      this.options.editor.navigate('/defaults', {trigger: true});
    }
  }
});
