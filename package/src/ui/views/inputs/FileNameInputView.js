import {TextInputView} from './TextInputView';

import template from '../../templates/inputs/fileNameInput.jst';

export const FileNameInputView = TextInputView.extend({
  template,
  className: 'file_name_input',

  ui: Object.assign({}, TextInputView.prototype.ui, {
    extension: '.file_name_input-extension'
  }),

  onRender: function() {
    TextInputView.prototype.onRender.call(this);
  },

  save: function() {
    const baseName = this.ui.input.val();
    const extension = this.ui.extension.text();
    this.model.set(this.options.propertyName, baseName + extension);
  },

  load: function() {
    const fullName = this.model.get(this.options.propertyName) || '';
    const match = fullName.match(/^(.*?)(\.[^.]+)?$/);
    const baseName = match ? match[1] : fullName;
    const extension = match && match[2] ? match[2] : '';

    this.ui.input.val(baseName);
    this.ui.extension.text(extension);

    this.options.maxLength = this.options.maxLength || 255;
  }
});
