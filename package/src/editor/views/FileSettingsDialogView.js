import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {TabsView} from 'pageflow/ui';

import {app} from '../app';

import {dialogView} from './mixins/dialogView';

import template from '../templates/fileSettingsDialog.jst';

export const FileSettingsDialogView = Marionette.ItemView.extend({
  template,
  className: 'file_settings_dialog editor dialog',

  mixins: [dialogView],

  ui: {
    content: '.content'
  },

  onRender: function() {
    this.tabsView = new TabsView({
      model: this.model,
      i18n: 'pageflow.editor.files.settings_dialog_tabs',
      defaultTab: this.options.tabName
    });

    _.each(this.model.fileType().settingsDialogTabs, function(options) {
      this.tabsView.tab(options.name, _.bind(function() {
        return this.subview(new options.view(
          _.extend({model: this.model}, options.viewOptions)));
      }, this));
    }, this);

    this.ui.content.append(this.subview(this.tabsView).el);
  }
});

FileSettingsDialogView.open = function(options) {
  app.dialogRegion.show(new FileSettingsDialogView(options));
};
