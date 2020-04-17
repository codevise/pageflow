import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {i18nUtils} from 'pageflow/ui';

import template from '../templates/fileMetaDataItem.jst';

export const FileMetaDataItemView = Marionette.ItemView.extend({
  tagName: 'tr',
  template,

  ui: {
    label: 'th',
    value: 'td'
  },

  onRender: function() {
    this.subview(new this.options.valueView(_.extend({
      el: this.ui.value,
      model: this.model,
      name: this.options.name
    }, this.options.valueViewOptions || {})));

    this.ui.label.text(this.labelText());
  },

  labelText: function() {
    return i18nUtils.attributeTranslation(this.options.name, 'label', {
      prefixes: [
        'pageflow.editor.files.attributes.' + this.model.fileType().collectionName,
        'pageflow.editor.files.common_attributes'
      ],
      fallbackPrefix: 'activerecord.attributes',
      fallbackModelI18nKey: this.model.i18nKey
    });
  }
});