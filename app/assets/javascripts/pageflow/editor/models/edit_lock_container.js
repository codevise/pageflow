pageflow.EditLockContainer = Backbone.Model.extend({
  initialize: function() {
    this.storageKey = 'pageflow.edit_lock.' + pageflow.entry.id;
  },

  aquire: function(options) {
    options = options || {};
    var container = this;

    var lock = new pageflow.EditLock({
      id: options.force ? null : sessionStorage[this.storageKey],
      force: options.force
    });

    lock.save(null, {
      polling: !!options.polling,
      success: function(lock) {
        sessionStorage[container.storageKey] = lock.id;

        container.lock = lock;
        container.trigger('aquired');

        container.startPolling();
      }
    });
  },

  startPolling: function() {
    if (!this.pollingInteval) {
      this.pollingInteval = setInterval(_.bind(function() {
        this.aquire({polling: true});
      }, this), 2000);
    }
  },

  stopPolling: function() {
    if (this.pollingInteval) {
      clearInterval(this.pollingInteval);
      this.pollingInteval = null;
    }
  },

  watchForErrors: function() {
    var container = this;

    $(document).ajaxSend(function(event, xhr) {
      if (container.lock) {
        xhr.setRequestHeader("X-Edit-Lock", container.lock.id);
      }
    });

    $(document).ajaxError(function(event, xhr, settings) {
      if (xhr.status === 409) {
        container.lock = null;
        container.trigger('locked',
                          xhr.responseJSON || {},
                          {
                            context: (settings.url.match(/\/edit_lock/) && !settings.polling) ? 'aquire' : 'other'
                          });

        container.stopPolling();
      }
    });
  },

  release: function() {
    if (this.lock) {
      var promise = this.lock.destroy();
      delete sessionStorage[this.storageKey];
      this.lock = null;
      return promise;
    }
  }
});