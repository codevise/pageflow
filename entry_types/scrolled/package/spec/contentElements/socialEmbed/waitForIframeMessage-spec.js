import {waitForIframeMessage} from 'contentElements/socialEmbed/waitForIframeMessage';

describe('waitForIframeMessage', () => {
  it('resolves when message with height object key is received', async () => {
    const element = document.createElement('div');
    const iframe = document.createElement('iframe');
    element.appendChild(iframe);

    const promise = waitForIframeMessage(element);

    setTimeout(() => {
      window.dispatchEvent(new MessageEvent('message', {
        source: iframe.contentWindow,
        data: {height: 500}
      }));
    }, 100);

    await expect(promise).resolves.toBeUndefined();
  });

  it('resolves when message with height in string is received', async () => {
    const element = document.createElement('div');
    const iframe = document.createElement('iframe');
    element.appendChild(iframe);

    const promise = waitForIframeMessage(element);

    setTimeout(() => {
      window.dispatchEvent(new MessageEvent('message', {
        source: iframe.contentWindow,
        data: 'height:500'
      }));
    }, 100);

    await expect(promise).resolves.toBeUndefined();
  });

  it('waits for iframe to be added before listening for messages', async () => {
    const element = document.createElement('div');

    const promise = waitForIframeMessage(element);

    setTimeout(() => {
      const iframe = document.createElement('iframe');
      element.appendChild(iframe);

      setTimeout(() => {
        window.dispatchEvent(new MessageEvent('message', {
          source: iframe.contentWindow,
          data: {height: 500}
        }));
      }, 50);
    }, 100);

    await expect(promise).resolves.toBeUndefined();
  });
});
