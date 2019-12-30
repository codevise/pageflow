import $ from 'jquery';
import Marionette from 'backbone.marionette';
import {cssModulesUtils} from 'pageflow/ui';
import {watchCollections} from '../../useEntryState';

import styles from './EntryPreviewView.module.css'

export const EntryPreviewView = Marionette.ItemView.extend({
  template: () => `
     <iframe class="${styles.iframe}" />
  `,

  className: styles.root,

  ui: cssModulesUtils.ui(styles, 'iframe'),

  initialize() {
    this.messageListener = this.onMessage.bind(this)
  },

  onShow() {
    window.addEventListener('message', this.messageListener);

    inject(this.ui.iframe[0],
           unescape($('[data-template="iframe_seed"]').html()));
  },

  onClose() {
    window.removeEventListener('message', this.messageListener);
  },

  onMessage(message) {
    if (window.location.href.indexOf(message.origin) === 0 &&
        message.data.type === 'READY') {

      watchCollections(this.model, {
        dispatch: action =>
          this.ui.iframe[0].contentWindow.postMessage(
            {type: 'ACTION', payload: action},
            window.location.origin
          )
      });
    }
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
