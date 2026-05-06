import {useEffect} from 'react';

export function usePostMessageListener(receiveData) {
  useEffect(() => {
    if (window.parent !== window) {
      window.addEventListener('message', receive)
    }

    return () => window.removeEventListener('message', receive);

    function receive(message) {
      if (window.location.href.indexOf(message.origin) === 0) {
        receiveData(message.data);
      }
    }
  }, [receiveData]);
}
