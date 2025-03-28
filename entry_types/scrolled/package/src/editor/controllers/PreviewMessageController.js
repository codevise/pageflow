import {Object} from 'pageflow/ui';
import {watchCollections} from '../../entryState';
import {InsertContentElementDialogView} from '../views/InsertContentElementDialogView'
import {SelectLinkDestinationDialogView} from '../views/SelectLinkDestinationDialogView'

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
    const postMessage = message => {
      this.iframeWindow.postMessage(message, window.location.origin);
    };

    if (window.location.href.indexOf(message.origin) === 0) {
      if (message.data.type === 'READY') {
        watchCollections(this.entry, {
          dispatch: action => {
            postMessage({type: 'ACTION', payload: action})
          }
        });

        this.listenTo(this.entry, 'scrollToSection', (section, options) =>
          postMessage({
            type: 'SCROLL_TO_SECTION',
            payload: {
              id: section.id,
              ...options
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

        this.listenTo(this.entry, 'selectSectionTransition', section =>
          postMessage({
            type: 'SELECT',
            payload: {
              id: section.id,
              type: 'sectionTransition'
            }
          })
        );

        this.listenTo(this.entry, 'selectContentElement', (contentElement, options) => {
          postMessage({
            type: 'SELECT',
            payload: {
              id: contentElement.id,
              range: options?.range,
              type: 'contentElement'
            }
          })
        });

        this.listenTo(this.entry, 'selectWidget', widget => {
          postMessage({
            type: 'SELECT',
            payload: {
              id: widget.get('role'),
              type: 'widget'
            }
          })
        });

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
          const contentElement = this.entry.contentElements.get(id);
          this.editor.navigate(contentElement.getEditorPath(), {trigger: true})
        }
        else if (type === 'sectionSettings') {
          this.editor.navigate(`/scrolled/sections/${id}`, {trigger: true})
        }
        else if (type === 'sectionTransition') {
          this.editor.navigate(`/scrolled/sections/${id}/transition`, {trigger: true})
        }
        else if (type === 'widget') {
          this.editor.navigate(`/widgets/${id}`, {trigger: true})
        }
        else {
          this.editor.navigate('/', {trigger: true})
        }
      }
      else if (message.data.type === 'SELECT_LINK_DESTINATION') {
        SelectLinkDestinationDialogView.show({
          entry: this.entry,

          onSelect(result){
            postMessage({
              type: 'LINK_DESTINATION_SELECTED',
              payload: result
            });
          }
        });
      }
      else if (message.data.type === 'INSERT_CONTENT_ELEMENT') {
        const {id, at, splitPoint} = message.data.payload;

        InsertContentElementDialogView.show({
          entry: this.entry,
          insertOptions: {at, id, splitPoint},
          editor: this.editor
        });
      }
      else if (message.data.type === 'MOVE_CONTENT_ELEMENT') {
        const {id, range, to} = message.data.payload;
        this.entry.moveContentElement({id, range}, to);
      }
      else if (message.data.type === 'UPDATE_CONTENT_ELEMENT') {
        const {id, configuration} = message.data.payload;
        this.entry.contentElements.get(id).configuration.set(configuration, {ignoreInWatchCollection: true});
      }
      else if (message.data.type === 'UPDATE_TRANSIENT_CONTENT_ELEMENT_STATE') {
        const {id, state} = message.data.payload;
        const contentElement = this.entry.contentElements.get(id);

        contentElement && contentElement.set('transientState', state);
      }
      else if (message.data.type === 'SAVED_SCROLL_POINT' && this.currentScrollPointCallback) {
        this.currentScrollPointCallback();
        this.currentScrollPointCallback = null;

        setTimeout(() => postMessage({type: 'RESTORE_SCROLL_POINT'}), 100);
      }
    }
  },

  preserveScrollPoint(callback) {
    this.currentScrollPointCallback = callback;
    this.iframeWindow.postMessage({type: 'SAVE_SCROLL_POINT'}, window.location.origin);
  }
});
