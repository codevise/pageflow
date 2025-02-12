import {useEffect, useState} from 'react';

export function useIframeHeight({src, active}) {
  const [height, setHeight] = useState('400px');

  useEffect(() => {
    if (!active) {
      return;
    }

    window.addEventListener('message', receive);

    function receive(event) {
      const data = parse(event.data);

      if (src && data.context === 'iframe.resize' && data.src === src) {
        setHeight(data.height + 'px');
      }
    }

    return () => window.removeEventListener('message', receive);
  }, [active, src]);

  return height;
}

function parse(data) {
  try {
    return JSON.parse(data);
  }
  catch(e) {
    return {};
  }
}
