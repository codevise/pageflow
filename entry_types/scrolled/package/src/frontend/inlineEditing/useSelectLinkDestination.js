import {postSelectLinkDestinationMessage} from './postMessage';

export function useSelectLinkDestination() {
  return () => {
    return new Promise(resolve => {
      postSelectLinkDestinationMessage();

      window.addEventListener('message', receive);

      function receive(message) {
        if (window.location.href.indexOf(message.origin) === 0 &&
            message.data.type === 'LINK_DESTINATION_SELECTED') {
          window.removeEventListener('message', receive);
          resolve(message.data.payload);
        }
      }
    });
  };
}
