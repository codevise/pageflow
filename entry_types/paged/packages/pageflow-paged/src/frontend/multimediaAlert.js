import {events} from 'pageflow/frontend';
/**
 * Manual interaction with the multimedia alert.
 *
 * @since 0.9
 */
export const multimediaAlert = {
  /**
   * Display the multimedia alert.
   */
  show: function() {
    events.trigger('request:multimedia_alert');
  }
};