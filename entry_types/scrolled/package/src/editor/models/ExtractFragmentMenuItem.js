import Backbone from 'backbone';
import I18n from 'i18n-js';
import {app} from 'pageflow/editor';

import {ExtractFragmentDialogView} from '../views/ExtractFragmentDialogView';

export const ExtractFragmentMenuItem = Backbone.Model.extend({
  initialize() {
    this.update('label', {disabled: false});
  },

  selected() {
    ExtractFragmentDialogView.show({
      onSubmit: title => this.extract(title)
    });
  },

  extract(title) {
    this.update('extracting', {disabled: true});

    return this.extractToFragmentLibrary({title}).then(
      () => this.update('extracted', {disabled: true}),
      ({status}) => {
        this.update('label', {disabled: false});
        app.trigger('error', {
          message: I18n.t(`${this.translationKeyPrefix}.${status === 403 ? 'forbidden' : 'failed'}`)
        });
      }
    );
  },

  update(labelKey, {disabled}) {
    this.set({
      label: I18n.t(`${this.translationKeyPrefix}.${labelKey}`),
      disabled
    });
  }
});
