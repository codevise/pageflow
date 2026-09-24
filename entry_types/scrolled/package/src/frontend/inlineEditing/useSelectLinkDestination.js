import {postSelectLinkDestinationMessage} from './postMessage';
import {isSameOriginMessage} from '../../shared/isSameOriginMessage';

let abortPreviousCall;

export function useSelectLinkDestination() {
  return () => {
    return new Promise((resolve, reject) => {
      if (abortPreviousCall) {
        abortPreviousCall();
      }

      abortPreviousCall = () => {
        window.removeEventListener('message', receive);
        reject();
      }

      postSelectLinkDestinationMessage();
      window.addEventListener('message', receive);

      function receive(message) {
        if (isSameOriginMessage(message)) {
          if (message.data.type === 'LINK_DESTINATION_SELECTED') {
            abortPreviousCall = null;

            window.removeEventListener('message', receive);
            resolve(message.data.payload);
          }
        }
      }
    });
  };
}
