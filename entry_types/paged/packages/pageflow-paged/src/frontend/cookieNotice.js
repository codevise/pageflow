import {events} from 'pageflow/frontend';

export const cookieNotice = {
  request: function() {
    events.trigger('cookie_notice:request');
  },
};
