export function waitForIframeMessage(element) {
  return new Promise((resolve) => {
    const checkForIframe = () => {
      const iframe = element.querySelector('iframe');

      if (iframe) {
        const handleMessage = (event) => {
          if (event.source === iframe.contentWindow) {
            const hasHeight = typeof event.data === 'object'
              ? event.data && 'height' in event.data
              : typeof event.data === 'string' && event.data.includes('height');

            if (hasHeight) {
              window.removeEventListener('message', handleMessage);
              resolve();
            }
          }
        };

        window.addEventListener('message', handleMessage);
      } else {
        setTimeout(checkForIframe, 50);
      }
    };

    checkForIframe();
  });
}
