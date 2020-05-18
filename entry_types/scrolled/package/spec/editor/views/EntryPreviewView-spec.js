import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {EntryPreviewView} from 'editor/views/EntryPreviewView';
import {InsertContentElementDialogView} from 'editor/views/InsertContentElementDialogView'
import {
  postInsertContentElementMessage,
  postUpdateContentElementMessage
} from 'frontend/inlineEditing/postMessage';
import {setupGlobals} from 'pageflow/testHelpers';
import {normalizeSeed, tick, factories} from 'support';

describe('EntryPreviewView', () => {
  let view;

  afterEach(() => {
    // Remove post message event listener
    view.onClose();
  });

  setupGlobals({
    // Required for url generation of content elements
    entry: () => factories.entry(ScrolledEntry)
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
});
