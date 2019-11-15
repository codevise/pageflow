import _ from 'underscore';

export const polling = {
  togglePolling: function(enabled) {
    if (enabled) {
      this.startPolling();
    }
    else {
      this.stopPolling();
    }
  },

  startPolling: function() {
    if (!this.pollingInterval) {
      this.pollingInterval = setInterval(_.bind(function() {
        this.fetch();
      }, this), 1000);
    }
  },

  stopPolling: function() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
};