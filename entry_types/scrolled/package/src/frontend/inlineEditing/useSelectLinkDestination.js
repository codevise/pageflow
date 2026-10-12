import {postSelectLinkDestinationMessage} from './postMessage';
import {isSameOriginMessage} from '../../shared/isSameOriginMessage';

let abortPreviousCall;

export function useSelectLinkDestination() {
  return (link, options) => {
    return new Promise((resolve, reject) => {
      if (abortPreviousCall) {
        abortPreviousCall();
      }

      abortPreviousCall = () => {
        window.removeEventListener('message', receive);
        reject();
      }

      postSelectLinkDestinationMessage(link, options);
      window.addEventListener('message', receive);

      function receive(message) {
        if (isSameOriginMessage(message)) {
          if (message.data.type === 'LINK_DESTINATION_SELECTED') {
            abortPreviousCall = null;

            window.removeEventListener('message', receive);
            resolve(message.data.payload);
          }
          else if (message.data.type === 'LINK_DESTINATION_REMOVED') {
            abortPreviousCall = null;

            window.removeEventListener('message', receive);
            resolve(null);
          }
        }
      }
    });
  };
}
