import {events} from 'pageflow/frontend';

export const consentTrigger = {
  request: function() {
    events.trigger('cookie_notice:request');
  },
};
