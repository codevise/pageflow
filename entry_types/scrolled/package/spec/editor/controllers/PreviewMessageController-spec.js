import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {PreviewMessageController} from 'editor/controllers/PreviewMessageController';
import {InsertContentElementDialogView} from 'editor/views/InsertContentElementDialogView'
import {
  postInsertContentElementMessage,
  postUpdateContentElementMessage
} from 'frontend/inlineEditing/postMessage';
import {setupGlobals} from 'pageflow/testHelpers';
import {normalizeSeed, factories, createIframeWindow} from 'support';

describe('PreviewMessageController', () => {
  let controller;

  afterEach(() => {
    // Remove post message event listener
    controller.dispose();
  });

  setupGlobals({
    // Required for url generation of content elements
    entry: () => factories.entry(ScrolledEntry)
  });

  it('responds to READY message sent by iframe with ACK message', () => {
    const entry = factories.entry(ScrolledEntry, {}, {entryTypeSeed: normalizeSeed()});
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow});

    return expect(new Promise(resolve => {
      iframeWindow.addEventListener('message', event => {
        if (event.data.type === 'ACK') {
          resolve(event.data)
        }
      });
      window.postMessage({type: 'READY'}, '*');
    })).resolves.toMatchObject({type: 'ACK'});
  });

  it('sets current section index in model on CHANGE_SECTION message', () => {
    const entry = factories.entry(ScrolledEntry, {}, {entryTypeSeed: normalizeSeed()});
        const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow});

    return expect(new Promise(resolve => {
      entry.once('change:currentSectionIndex', (model, value) => resolve(value));
      window.postMessage({type: 'CHANGE_SECTION', payload: {index: 4}}, '*');
    })).resolves.toBe(4);
  });

  it('sends SCROLL_TO_SECTION message to iframe on scrollToSection event on model', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [{id: 1}, {id: 2}, {id: 3}]
      })
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow});

    await postReadyMessageAndWaitForAcknowledgement(iframeWindow);

    return expect(new Promise(resolve => {
      iframeWindow.addEventListener('message', event => {
        if (event.data.type === 'SCROLL_TO_SECTION') {
          resolve(event.data);
        }
      });
      entry.trigger('scrollToSection', entry.sections.at(2));
    })).resolves.toMatchObject({type: 'SCROLL_TO_SECTION', payload: {index: 2}});
  });

  it('sends SELECT message to iframe on selectContentElement event on model', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 1}]
      })
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow});

    await postReadyMessageAndWaitForAcknowledgement(iframeWindow);

    return expect(new Promise(resolve => {
      iframeWindow.addEventListener('message', event => {
        if (event.data.type === 'SELECT') {
          resolve(event.data);
        }
      });
      entry.trigger('selectContentElement', entry.contentElements.first());
    })).resolves.toMatchObject({type: 'SELECT', payload: {id: 1, type: 'contentElement'}});
  });

  it('sends SELECT message to iframe on resetSelection event on model', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 1}]
      })
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow});

    await postReadyMessageAndWaitForAcknowledgement(iframeWindow);

    return expect(new Promise(resolve => {
      iframeWindow.addEventListener('message', event => {
        if (event.data.type === 'SELECT') {
          resolve(event.data);
        }
      });
      entry.trigger('resetSelection', entry.contentElements.first());
    })).resolves.toMatchObject({type: 'SELECT', payload: null});
  });

  it('navigates to edit content element route on SELECTED message', () => {
    const editor = factories.editorApi();
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 1}]
      })
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow, editor});

    return expect(new Promise(resolve => {
      editor.on('navigate', resolve);
      window.postMessage({type: 'SELECTED', payload: {id: 1}}, '*');
    })).resolves.toBe('/scrolled/content_elements/1');
  });

  it('displays insert dialog on INSERT_CONTENT_ELEMENT message', () => {
    const editor = factories.editorApi();
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 1}]
      })
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow, editor});

    return expect(new Promise(resolve => {
      jest.spyOn(InsertContentElementDialogView, 'show').mockImplementation(resolve);
      postInsertContentElementMessage({id: 1, position: 'split', at: 3});
    })).resolves.toEqual({entry, editor, insertOptions: {id: 1, position: 'split', at: 3}});
  });

  it('navigates to root on SELECTED message without type', () => {
    const editor = factories.editorApi();
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 1}]
      })
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow, editor});

    return expect(new Promise(resolve => {
      editor.on('navigate', resolve);
      window.postMessage({type: 'SELECTED', payload: {}}, '*');
    })).resolves.toBe('/');
  });

  it('updates configuration on UPDATE_CONTENT_ELEMENT message', () => {
    const editor = factories.editorApi();
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 1}]
      })
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow, editor});

    return expect(new Promise(resolve => {
      const contentElement = entry.contentElements.get(1);
      contentElement.on('change:configuration', () => {
        resolve(contentElement.configuration.get('some'));
      });
      postUpdateContentElementMessage({id: 1, configuration: {some: 'value'}});
    })).resolves.toEqual('value');
  });
});

function postReadyMessageAndWaitForAcknowledgement(iframeWindow) {
  window.postMessage({type: 'READY'}, '*');

  return new Promise(resolve => {
    function handler(event) {
      if (event.data.type === 'ACK') {
        iframeWindow.removeEventListener('message', handler);
        resolve();
      }
    }

    iframeWindow.addEventListener('message', handler);
  });
}
