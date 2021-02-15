import {events} from './events';

export const consentTrigger = {
  request: function(consentRequest) {
    events.trigger('cookie_notice:request', consentRequest);
  },
};
