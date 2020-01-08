import Backbone from 'backbone';
import {EntryPreviewView} from 'editor/views/EntryPreviewView';

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

  it('responds to READY message sent by iframe with ACTION message', () => {
    const seedHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview</title>
        </head>
        <body>
        </body>
      </html>
    `;
    document.body.innerHTML = `
      <script type="text/html" data-template="iframe_seed">
        ${seedHtml}
      </script>
    `;
    const entry = new Backbone.Model();
    entry.chapters = new Backbone.Collection();
    entry.sections = new Backbone.Collection();
    entry.contentElements = new Backbone.Collection();
    entry.files = {};
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
})
