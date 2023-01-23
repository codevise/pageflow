import {postSelectLinkDestinationMessage} from './postMessage';

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
        if (window.location.href.indexOf(message.origin) === 0) {
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
