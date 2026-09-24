import {useEffect} from 'react';

import {isSameOriginMessage} from './isSameOriginMessage';

export function usePostMessageListener(receiveData) {
  useEffect(() => {
    if (window.parent !== window) {
      window.addEventListener('message', receive)
    }

    return () => window.removeEventListener('message', receive);

    function receive(message) {
      if (isSameOriginMessage(message)) {
        receiveData(message.data);
      }
    }
  }, [receiveData]);
}
