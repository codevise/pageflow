import $ from 'jquery';
import Marionette from 'backbone.marionette';
import {cssModulesUtils} from 'pageflow/ui';
import {PreviewMessageController} from '../controllers/PreviewMessageController'
import styles from './EntryPreviewView.module.css'

export const EntryPreviewView = Marionette.ItemView.extend({
  template: () => `
     <iframe class="${styles.iframe}" />
  `,

  className: styles.root,

  ui: cssModulesUtils.ui(styles, 'iframe'),

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
