import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {EntryPreviewView} from 'editor/views/EntryPreviewView';
import {InsertContentElementDialogView} from 'editor/views/InsertContentElementDialogView'
import {postInsertContentElementMessage} from 'frontend/inlineEditing/postMessage';
import {normalizeSeed, tick, factories} from 'support';

describe('EntryPreviewView', () => {
  let view;

  afterEach(() => {
    // Remove post message event listener
    view.onClose();
  });

  it('renders seed html in iframe', () => {
    const seedHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview</title>
        </head>
        <body>
          <script></script>
          <div class="entry"></entry>
        </body>
      </html>
    `;
    const escapedSeedHtml = seedHtml.replace(/<\//g, '<\\/');
    document.body.innerHTML = `
      <script type="text/html" data-template="iframe_seed">
        ${escapedSeedHtml}
      </script>
    `;
    view = new EntryPreviewView();

    view.render();
    document.body.appendChild(view.el);
    view.onShow();

    expect(view.ui.iframe[0].contentWindow.document.body.querySelector('div.entry')).toBeTruthy();
  });

  const seedBodyFragment = `
    <script type="text/html" data-template="iframe_seed">
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview</title>
        </head>
        <body>
        </body>
      </html>
    </script>
  `;

  it('responds to READY message sent by iframe with ACTION message', () => {
    document.body.innerHTML = seedBodyFragment;
    const entry = factories.entry(ScrolledEntry, {}, {entryTypeSeed: normalizeSeed()});
    view = new EntryPreviewView({model: entry});

    view.render();
    document.body.appendChild(view.el);
    view.onShow();

    return expect(new Promise(resolve => {
      const iframeWindow = view.ui.iframe[0].contentWindow;
      iframeWindow.addEventListener('message', event => {
        resolve(event.data)
      });
      window.postMessage({type: 'READY'}, '*');
    })).resolves.toMatchObject({type: 'ACTION'});
  });

  it('sets current section index in model on CHANGE_SECTION message', () => {
    document.body.innerHTML = seedBodyFragment;
    const entry = factories.entry(ScrolledEntry, {}, {entryTypeSeed: normalizeSeed()});
    view = new EntryPreviewView({model: entry});

    view.render();
    document.body.appendChild(view.el);
    view.onShow();

    return expect(new Promise(resolve => {
      entry.once('change:currentSectionIndex', (model, value) => resolve(value));
      window.postMessage({type: 'CHANGE_SECTION', payload: {index: 4}}, '*');
    })).resolves.toBe(4);
  });

  it('sends SCROLL_TO_SECTION message to iframe on scrollToSection event on model', async () => {
    document.body.innerHTML = seedBodyFragment;
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [{id: 1}, {id: 2}, {id: 3}]
      })
    });
    view = new EntryPreviewView({model: entry});

    view.render();
    document.body.appendChild(view.el);
    view.onShow();

    window.postMessage({type: 'READY'}, '*');
    await tick(); // Wait for async processing of message.

    return expect(new Promise(resolve => {
      const iframeWindow = view.ui.iframe[0].contentWindow;
      iframeWindow.addEventListener('message', event => {
        if (event.data.type === 'SCROLL_TO_SECTION') {
          resolve(event.data);
        }
      });
      entry.trigger('scrollToSection', entry.sections.at(2));
    })).resolves.toMatchObject({type: 'SCROLL_TO_SECTION', payload: {index: 2}});
  });

  it('sends SELECT message to iframe on selectContentElement event on model', async () => {
    document.body.innerHTML = seedBodyFragment;
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 1}]
      })
    });
    view = new EntryPreviewView({model: entry});

    view.render();
    document.body.appendChild(view.el);
    view.onShow();

    window.postMessage({type: 'READY'}, '*');
    await tick(); // Wait for async processing of message.

    return expect(new Promise(resolve => {
      const iframeWindow = view.ui.iframe[0].contentWindow;
      iframeWindow.addEventListener('message', event => {
        if (event.data.type === 'SELECT') {
          resolve(event.data);
        }
      });
      entry.trigger('selectContentElement', entry.contentElements.first());
    })).resolves.toMatchObject({type: 'SELECT', payload: {id: 1, type: 'contentElement'}});
  });

  it('sends SELECT message to iframe on resetSelection event on model', async () => {
    document.body.innerHTML = seedBodyFragment;
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 1}]
      })
    });
    view = new EntryPreviewView({model: entry});

    view.render();
    document.body.appendChild(view.el);
    view.onShow();

    window.postMessage({type: 'READY'}, '*');
    await tick(); // Wait for async processing of message.

    return expect(new Promise(resolve => {
      const iframeWindow = view.ui.iframe[0].contentWindow;
      iframeWindow.addEventListener('message', event => {
        if (event.data.type === 'SELECT') {
          resolve(event.data);
        }
      });
      entry.trigger('resetSelection', entry.contentElements.first());
    })).resolves.toMatchObject({type: 'SELECT', payload: null});
  });

  it('navigates to edit content element route on SELECTED message', () => {
    document.body.innerHTML = seedBodyFragment;
    const editor = factories.editorApi();
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 1}]
      })
    });
    view = new EntryPreviewView({editor, model: entry});

    view.render();
    document.body.appendChild(view.el);
    view.onShow();

    return expect(new Promise(resolve => {
      editor.on('navigate', resolve);
      window.postMessage({type: 'SELECTED', payload: {id: 1}}, '*');
    })).resolves.toBe('/scrolled/content_elements/1');
  });

  it('displays insert dialog on INSERT_CONTENT_ELEMENT message', () => {
    document.body.innerHTML = seedBodyFragment;
    const editor = factories.editorApi();
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 1}]
      })
    });
    view = new EntryPreviewView({editor, model: entry});

    view.render();
    document.body.appendChild(view.el);
    view.onShow();

    return expect(new Promise(resolve => {
      jest.spyOn(InsertContentElementDialogView, 'show').mockImplementation(resolve);
      postInsertContentElementMessage({id: 1, position: 'split', at: 3});
    })).resolves.toEqual({entry, editor, insertOptions: {id: 1, position: 'split', at: 3}});
  });

  it('navigates to root on SELECTED message without type', () => {
    document.body.innerHTML = seedBodyFragment;
    const editor = factories.editorApi();
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [{id: 1}]
      })
    });
    view = new EntryPreviewView({editor, model: entry});

    view.render();
    document.body.appendChild(view.el);
    view.onShow();

    return expect(new Promise(resolve => {
      editor.on('navigate', resolve);
      window.postMessage({type: 'SELECTED', payload: {}}, '*');
    })).resolves.toBe('/');
  });
})
