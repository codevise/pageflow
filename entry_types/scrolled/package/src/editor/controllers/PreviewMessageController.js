import {Object} from 'pageflow/ui';
import {watchCollections} from '../../entryState';
import {InsertContentElementDialogView} from '../views/InsertContentElementDialogView'

export const PreviewMessageController = Object.extend({
  initialize({entry, iframeWindow, editor}) {
    this.entry = entry;
    this.iframeWindow = iframeWindow;
    this.editor = editor;

    this.listener = this.handleMessage.bind(this);
    window.addEventListener('message', this.listener);
  },

  dispose() {
    window.removeEventListener('message', this.listener);
  },

  handleMessage(message) {
    if (window.location.href.indexOf(message.origin) === 0) {
      if (message.data.type === 'READY') {
        const postMessage = message => {
          this.iframeWindow.postMessage(message, window.location.origin);
        };

        watchCollections(this.entry, {
          dispatch: action => {
            postMessage({type: 'ACTION', payload: action})
          }
        });

        this.listenTo(this.entry, 'scrollToSection', section =>
          postMessage({
            type: 'SCROLL_TO_SECTION',
            payload: {
              index: this.entry.sections.indexOf(section)
            }
          })
        );

        this.listenTo(this.entry.contentElements, 'postCommand', (contentElementId, command) =>
          postMessage({
            type: 'CONTENT_ELEMENT_EDITOR_COMMAND',
            payload: {
              contentElementId,
              command
            }
          })
        );

        this.listenTo(this.entry, 'selectSection', section =>
          postMessage({
            type: 'SELECT',
            payload: {
              id: section.id,
              type: 'section'
            }
          })
        );

        this.listenTo(this.entry, 'selectSectionSettings', section =>
          postMessage({
            type: 'SELECT',
            payload: {
              id: section.id,
              type: 'sectionSettings'
            }
          })
        );

        this.listenTo(this.entry, 'selectContentElement', contentElement =>
          postMessage({
            type: 'SELECT',
            payload: {
              id: contentElement.id,
              type: 'contentElement'
            }
          })
        );

        this.listenTo(this.entry, 'resetSelection', contentElement =>
          postMessage({
            type: 'SELECT',
            payload: null
          })
        );

        this.listenTo(this.entry, 'change:emulation_mode', entry =>
          postMessage({
            type: 'CHANGE_EMULATION_MODE',
            payload: this.entry.get('emulation_mode')
          })
        );

        postMessage({type: 'ACK'})
      }
      else if (message.data.type === 'CHANGE_SECTION') {
        this.entry.set('currentSectionIndex', message.data.payload.index);
      }
      else if (message.data.type === 'SELECTED') {
        const {type, id} = message.data.payload;

        if (type === 'contentElement') {
          this.editor.navigate(`/scrolled/content_elements/${id}`, {trigger: true})
        }
        else if (type === 'sectionSettings') {
          this.editor.navigate(`/scrolled/sections/${id}`, {trigger: true})
        }
        else if (type === 'sectionTransition') {
          this.editor.navigate(`/scrolled/sections/${id}/transition`, {trigger: true})
        }
        else {
          this.editor.navigate('/', {trigger: true})
        }
      }
      else if (message.data.type === 'INSERT_CONTENT_ELEMENT') {
        const {id, at, splitPoint} = message.data.payload;

        InsertContentElementDialogView.show({
          entry: this.entry,
          insertOptions: {at, id, splitPoint},
          editor: this.editor
        });
      }
      else if (message.data.type === 'UPDATE_CONTENT_ELEMENT') {
        const {id, configuration} = message.data.payload;
        this.entry.contentElements.get(id).configuration.set(configuration, {ignoreInWatchCollection: true});
      }
      else if (message.data.type === 'UPDATE_TRANSIENT_CONTENT_ELEMENT_STATE') {
        const {id, state} = message.data.payload;
        this.entry.contentElements.get(id).set('transientState', state);
      }
    }
  }
});
