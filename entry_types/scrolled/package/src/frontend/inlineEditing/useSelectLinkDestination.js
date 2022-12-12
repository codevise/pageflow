import {postSelectLinkDestinationMessage} from './postMessage';

export function useSelectLinkDestination() {
  return () => {
    return new Promise((resolve, reject) => {
      postSelectLinkDestinationMessage();

      window.addEventListener('message', receive);

      function receive(message) {
        if (window.location.href.indexOf(message.origin) === 0) {
          if (message.data.type === 'LINK_DESTINATION_SELECTED') {
            window.removeEventListener('message', receive);
            resolve(message.data.payload);
          }
          else if (message.data.type === 'LINK_DESTINATION_SELECTION_ABORTED') {
            window.removeEventListener('message', receive);
            reject();
          }
        }
      }
    });
  };
}
