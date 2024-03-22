import 'editor/config';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {PreviewMessageController} from 'editor/controllers/PreviewMessageController';
import {InsertContentElementDialogView} from 'editor/views/InsertContentElementDialogView';
import {SelectLinkDestinationDialogView} from 'editor/views/SelectLinkDestinationDialogView';
import {
  postInsertContentElementMessage,
  postUpdateContentElementMessage,
  postUpdateTransientContentElementStateMessage,
  postSelectLinkDestinationMessage
} from 'frontend/inlineEditing/postMessage';
import {setupGlobals} from 'pageflow/testHelpers';
import {useFakeXhr, normalizeSeed, factories, createIframeWindow} from 'support';

describe('PreviewMessageController', () => {
  let controller, testContext;

  beforeEach(() => testContext = {});
  useFakeXhr(() => testContext);

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
      entry.trigger('scrollToSection', entry.sections.get(2));
    })).resolves.toMatchObject({type: 'SCROLL_TO_SECTION', payload: {id: 2}});
  });

  it('supports sending SCROLL_TO_SECTION message with align property', async () => {
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
      entry.trigger('scrollToSection', entry.sections.get(2), {align: 'start'});
    })).resolves.toMatchObject({type: 'SCROLL_TO_SECTION', payload: {id: 2, align: 'start'}});
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

  it('passes on range from selectContentElement event', async () => {
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
      entry.trigger('selectContentElement', entry.contentElements.first(), {range: [1, 2]});
    })).resolves.toMatchObject({type: 'SELECT', payload: {
      id: 1,
      range: [1, 2],
      type: 'contentElement'
    }});
  });

  it('sends SELECT message to iframe on selectSection event on model', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [{id: 1}]
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
      entry.trigger('selectSection', entry.sections.first());
    })).resolves.toMatchObject({type: 'SELECT', payload: {id: 1, type: 'section'}});
  });

  it('sends SELECT message to iframe on selectSectionSettings event on model', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [{id: 1}]
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
      entry.trigger('selectSectionSettings', entry.sections.first());
    })).resolves.toMatchObject({type: 'SELECT', payload: {id: 1, type: 'sectionSettings'}});
  });

  it('sends SELECT message to iframe on selectSectionTransition event on model', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [{id: 1}]
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
      entry.trigger('selectSectionTransition', entry.sections.first());
    })).resolves.toMatchObject({type: 'SELECT', payload: {id: 1, type: 'sectionTransition'}});
  });

  it('supports sending CONTENT_ELEMENT_EDITOR_COMMAND message to iframe', async () => {
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
        if (event.data.type === 'CONTENT_ELEMENT_EDITOR_COMMAND') {
          resolve(event.data.payload);
        }
      });
      entry.contentElements.first().postCommand({some: 'COMMAND'});
    })).resolves.toMatchObject({contentElementId: 1, command: {some: 'COMMAND'}});
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

  it('navigates to edit content element route on SELECTED message for content element', () => {
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
      window.postMessage({type: 'SELECTED', payload: {id: 1, type: 'contentElement'}}, '*');
    })).resolves.toBe('/scrolled/content_elements/1');
  });

  it('navigates to edit section route on SELECTED message for section settings', () => {
    const editor = factories.editorApi();
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [{id: 1}]
      })
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow, editor});

    return expect(new Promise(resolve => {
      editor.on('navigate', resolve);
      window.postMessage({type: 'SELECTED', payload: {id: 1, type: 'sectionSettings'}}, '*');
    })).resolves.toBe('/scrolled/sections/1');
  });

  it('navigates to edit section transition route on SELECTED message for section transition', () => {
    const editor = factories.editorApi();
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [{id: 1}]
      })
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow, editor});

    return expect(new Promise(resolve => {
      editor.on('navigate', resolve);
      window.postMessage({type: 'SELECTED', payload: {id: 1, type: 'sectionTransition'}}, '*');
    })).resolves.toBe('/scrolled/sections/1/transition');
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
      postInsertContentElementMessage({id: 1, at: 'split', splitPoint: 3});
    })).resolves.toEqual({entry, editor, insertOptions: {id: 1, at: 'split', splitPoint: 3}});
  });

  it('displays link destination dialog on SELECT_LINK_DESTINATION message', () => {
    const editor = factories.editorApi();
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed()
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow, editor});

    return expect(new Promise(resolve => {
      jest.spyOn(SelectLinkDestinationDialogView, 'show').mockImplementation(resolve);
      postSelectLinkDestinationMessage();
    })).resolves.toMatchObject({onSelect: expect.any(Function)});
  });

  it('sends LINK_DESTINATION_SELECTED message when callback passed to link destination dialog is invoked', () => {
    const editor = factories.editorApi();
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed()
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow, editor});

    return expect(new Promise(resolve => {
      iframeWindow.addEventListener('message', event => {
        if (event.data.type === 'LINK_DESTINATION_SELECTED') {
          resolve(event.data.payload);
        }
      });

      jest.spyOn(SelectLinkDestinationDialogView, 'show').mockImplementation(
        ({onSelect}) => onSelect({url: 'https://example.com'})
      );
      postSelectLinkDestinationMessage();
    })).resolves.toEqual({url: 'https://example.com'});
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
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 1}]
      })
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow});

    return expect(new Promise(resolve => {
      const contentElement = entry.contentElements.get(1);
      contentElement.on('change:configuration', () => {
        resolve(contentElement.configuration.get('some'));
      });
      postUpdateContentElementMessage({id: 1, configuration: {some: 'value'}});
    })).resolves.toEqual('value');
  });

  it('sends ACTION message for content element updates', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 1}]
      })
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow});

    await postReadyMessageAndWaitForAcknowledgement(iframeWindow);

    return expect(new Promise(async resolve => {
      iframeWindow.addEventListener('message', event => {
        if (event.data.type === 'ACTION') {
          const action = event.data.payload;
          resolve(action.payload.collectionName);
        }
      });

      entry.contentElements.first().configuration.set({title: 'update'});
    })).resolves.toEqual('contentElements');
  });

  it('surpresses ACTION message for change caused by UPDATE_CONTENT_ELEMENT message', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 1}]
      })
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow});

    await postReadyMessageAndWaitForAcknowledgement(iframeWindow);

    // First update content element via UPDATE_CONTENT_ELEMENT
    // message. Then update chapter. Expect the first posted ACTION
    // message to be about chapters, thus proving that the ACTION for
    // the content element update has been skipped.
    return expect(new Promise(async resolve => {
      iframeWindow.addEventListener('message', event => {
        if (event.data.type === 'ACTION') {
          const action = event.data.payload;
          resolve(action.payload.collectionName);
        }
      });

      postUpdateContentElementMessage({id: 1, configuration: {some: 'ignored update'}});
      entry.chapters.first().configuration.set({title: 'next update'});
    })).resolves.toEqual('chapters');
  });

  it('updates transient state on UPDATE_TRANSIENT_CONTENT_ELEMENT_STATE message', () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 5}]
      })
    });
    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow});

    return expect(new Promise(resolve => {
      const contentElement = entry.contentElements.get(5);
      contentElement.on('change:transientState', () => {
        resolve(contentElement.get('transientState'));
      });
      postUpdateTransientContentElementStateMessage({id: 5, state: {some: 'state'}});
    })).resolves.toEqual({some: 'state'});
  });

  it('sends CHANGE_EMULATION_MODE message to iframe on change:emulation_mode event on model', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [{id: 1}]
      })
    });

    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow});

    await postReadyMessageAndWaitForAcknowledgement(iframeWindow);

    return expect(new Promise(resolve => {
      iframeWindow.addEventListener('message', event => {
        if (event.data.type === 'CHANGE_EMULATION_MODE') {
          resolve(event.data);
        }
      });
      entry.set('emulation_mode', 'phone');
    })).resolves.toMatchObject({type: 'CHANGE_EMULATION_MODE', payload: 'phone'});
  });

  it('sends SAVE_SCROLL_POINT message on preserveScrollPoint', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed()
    });

    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow});

    await postReadyMessageAndWaitForAcknowledgement(iframeWindow);

    return expect(new Promise(resolve => {
      iframeWindow.addEventListener('message', event => {
        if (event.data.type === 'SAVE_SCROLL_POINT') {
          resolve('received');
        }
      });
      controller.preserveScrollPoint(() => {});
    })).resolves.toEqual('received');
  });

  it('invokes preserveScrollPoint callback on SAVED_SCROLL_POINT message', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed()
    });

    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow});

    await postReadyMessageAndWaitForAcknowledgement(iframeWindow);

    return expect(new Promise(resolve => {
      controller.preserveScrollPoint(() => resolve('called'));
      window.postMessage({type: 'SAVED_SCROLL_POINT'}, '*');
    })).resolves.toEqual('called');
  });

  it('responds to SAVED_SCROLL_POINT with RESTORE_SCROLL_POINT message', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed()
    });

    const iframeWindow = createIframeWindow();
    controller = new PreviewMessageController({entry, iframeWindow});

    await postReadyMessageAndWaitForAcknowledgement(iframeWindow);

    return expect(new Promise(resolve => {
      iframeWindow.addEventListener('message', event => {
        if (event.data.type === 'RESTORE_SCROLL_POINT') {
          resolve('received');
        }
      });
      controller.preserveScrollPoint(() => {});
      window.postMessage({type: 'SAVED_SCROLL_POINT'}, '*');
    })).resolves.toEqual('received');
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
