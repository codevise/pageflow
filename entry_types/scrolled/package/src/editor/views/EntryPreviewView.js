import $ from 'jquery';
import Marionette from 'backbone.marionette';
import {cssModulesUtils} from 'pageflow/ui';
import {PreviewMessageController} from '../controllers/PreviewMessageController'
import {BlankEntryView} from './BlankEntryView';

import styles from './EntryPreviewView.module.css'

export const EntryPreviewView = Marionette.ItemView.extend({
  template: () => `
     <iframe class="${styles.iframe}" />
  `,

  className: styles.root,

  ui: cssModulesUtils.ui(styles, 'iframe'),

  modelEvents: {
    'change:emulation_mode': 'updateEmulationMode'
  },

  onRender() {
    this.appendSubview(new BlankEntryView({model: this.model}));
  },

  onShow() {
    this.messageController = new PreviewMessageController({
      entry: this.model,
      editor: this.options.editor,
      iframeWindow: this.ui.iframe[0].contentWindow
    });

    inject(this.ui.iframe[0],
           unescape($('[data-template="iframe_seed"]').html()));
  },

  onClose() {
    this.messageController.dispose();
  },

  updateEmulationMode: function() {
    if (this.model.previous('emulation_mode')) {
      this.$el.removeClass(styles[this.emulationModeClassName(this.model.previous('emulation_mode'))]);
    }

    if (this.model.get('emulation_mode')) {
      this.$el.addClass(styles[this.emulationModeClassName(this.model.get('emulation_mode'))]);
    }
  },

  emulationModeClassName: function(mode) {
    return `${mode}EmulationMode`;
  }
});

function inject(iframe, html) {
  var doc = iframe.document ||
            iframe.contentDocument ||
            iframe.contentWindow.document;

  doc.open();
  doc.writeln(html);
  doc.close();
}

function unescape(text) {
  return text.replace(/<\\\//g, '</');
}
