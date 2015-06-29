/**
 * Manual interaction with the multimedia alert.
 *
 * @since edge
 */
pageflow.multimediaAlert = {
  /**
   * Display the multimedia alert.
   */
  show: function() {
    pageflow.events.trigger('request:multimedia_alert');
  }
};