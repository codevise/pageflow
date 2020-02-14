import $ from 'jquery';
import Marionette from 'backbone.marionette';
import {cssModulesUtils} from 'pageflow/ui';
import {watchCollections} from '../../entryState';

import styles from './EntryPreviewView.module.css'

export const EntryPreviewView = Marionette.ItemView.extend({
  template: () => `
     <iframe class="${styles.iframe}" />
  `,

  className: styles.root,

  ui: cssModulesUtils.ui(styles, 'iframe'),

  initialize() {
    this.messageListener = this.onMessage.bind(this);
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
    if (window.location.href.indexOf(message.origin) === 0) {
      if (message.data.type === 'READY') {
        const postMessage = message => {
          this.ui.iframe[0].contentWindow.postMessage(message, window.location.origin);
        };

        watchCollections(this.model, {
          dispatch: action =>
            postMessage({type: 'ACTION', payload: action})
        });

        this.listenTo(this.model, 'scrollToSection', section =>
          postMessage({
            type: 'SCROLL_TO_SECTION',
            payload: {
              index: this.model.sections.indexOf(section)
            }
          })
        );
      }
      else if (message.data.type === 'CHANGE_SECTION') {
        this.model.set('currentSectionIndex', message.data.payload.index);
      }
      else if (message.data.type === 'SELECTED') {
        const {id} = message.data.payload;
        const editor = this.options.editor;

        if (id) {
          editor.navigate(`/scrolled/content_elements/${id}`, {trigger: true})
        }
        else {
          editor.navigate('/', {trigger: true})
        }
      }
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
