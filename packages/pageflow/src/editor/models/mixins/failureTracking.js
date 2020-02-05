/**
 * Mixin for Backbone models that shall be watched by {@link
 * modelLifecycleTrackingView} mixin.
 */
export const failureTracking = {
  initialize: function() {
    this._saveFailed = false;

    this.listenTo(this, 'sync', function() {
      this._saveFailed = false;
      this._failureMessage = null;
      this.trigger('change:failed');
    });

    this.listenTo(this, 'error', function(model, xhr) {
      this._saveFailed = true;
      this._failureMessage = this.translateStatus(xhr);
      this.trigger('change:failed');
    });
  },

  isFailed: function() {
    return this._saveFailed;
  },

  getFailureMessage: function() {
    return this._failureMessage;
  },

  translateStatus: function(xhr) {
    if (xhr.status === 401) {
      return 'Sie müssen angemeldet sein, um diese Aktion auszuführen.';
    }
    else if (xhr.status === 403) {
      return 'Sie sind nicht berechtigt diese Aktion auszuführen.';
    }
    else if (xhr.status === 404) {
      return 'Der Datensatz konnte auf dem Server nicht gefunden werden.';
    }
    else if (xhr.status === 409) {
      return 'Die Reportage wurde außerhalb dieses Editors bearbeitet.';
    }
    else if (xhr.status >= 500 && xhr.status < 600) {
      return 'Der Server hat einen internen Fehler gemeldet.';
    }
    else if (xhr.statusText === 'timeout') {
      return 'Der Server ist nicht erreichbar.';
    }
    return '';
  }
};