import {events} from 'pageflow/frontend';
import {ready} from './ready';

export const cookieNotice = {
  request: function() {
    ready.then(function() {
      events.trigger('cookie_notice:request');
    });
  },
};
