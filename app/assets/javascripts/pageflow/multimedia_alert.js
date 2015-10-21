/**
 * Manual interaction with the multimedia alert.
 *
 * @since 0.9
 */
pageflow.multimediaAlert = {
  /**
   * Display the multimedia alert.
   */
  show: function() {
    pageflow.events.trigger('request:multimedia_alert');
  }
};