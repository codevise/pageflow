import {consentTrigger} from './consentTrigger';

export const consent = {
  request: () => {
    consentTrigger.request();
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
        console.log('Timeout finished');
      }, 1000);
    });
  }
};
