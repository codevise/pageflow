import {EntryPreviewView} from 'editor/views/EntryPreviewView';

describe('EntryPreviewView', () => {
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
    const view = new EntryPreviewView();

    view.render();
    document.body.appendChild(view.el);
    view.onShow();

    expect(view.ui.iframe[0].contentWindow.document.body.querySelector('div.entry')).toBeTruthy();
  });
})
