import {useEffect, useState} from 'react';

export function useIframeHeight(url) {
  const [height, setHeight] = useState('400px');

  useEffect(() => {
    window.addEventListener('message', receive);

    function receive(event) {
      if (typeof event.data['datawrapper-height'] !== 'undefined') {
        for (var chartId in event.data['datawrapper-height']) {
          if (url.indexOf(chartId) > -1) {
            setHeight(event.data['datawrapper-height'][chartId] + 'px');
          }
        }
      }
    }

    return () => window.removeEventListener('message', receive);
  }, [url]);

  return height;
}
