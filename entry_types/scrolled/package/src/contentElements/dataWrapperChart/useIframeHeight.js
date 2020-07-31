import {useEffect, useRef} from 'react';

export function useIframeHeight(url) {
  const height = useRef('400px');
  useEffect(() => {
    window.addEventListener('message', receive);

    function receive(event) {            
      if (typeof event.data['datawrapper-height'] !== 'undefined') {
        let chartId = event.data['datawrapper-height']['id'];
        if (chartId && url.indexOf(chartId) > -1) {
          const receivedHeight = event.data['datawrapper-height']['height'] + 'px';          
          height.current = receivedHeight;
        }
      }
    }
    return () => document.removeEventListener('message', receive);
  }, [url]);

  return height.current;
}
