import $ from 'jquery';
import Backbone from 'backbone';
import _ from 'underscore';

import {EditLock} from './EditLock';

import {state} from '$state';

export const EditLockContainer = Backbone.Model.extend({
  initialize: function() {
    this.storageKey = 'pageflow.edit_lock.' + state.entry.id;
  },

  acquire: function(options) {
    options = options || {};
    var container = this;

    var lock = new EditLock({
      id: options.force ? null : sessionStorage[this.storageKey],
      force: options.force
    });

    lock.save(null, {
      polling: !!options.polling,
      success: function(lock) {
        sessionStorage[container.storageKey] = lock.id;

        container.lock = lock;
        container.trigger('acquired');

        container.startPolling();
      }
    });
  },

  startPolling: function() {
    if (!this.pollingInteval) {
      this.pollingInteval = setInterval(_.bind(function() {
        this.acquire({polling: true});
      }, this), state.config.editLockPollingIntervalInSeconds * 1000);
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
      switch(xhr.status) {
      case 409:
        container.handleConflict(xhr, settings);
        break;
      case 401:
      case 422:
        container.handleUnauthenticated();
        break;
      default:
        container.handleError();
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
  },

  handleConflict: function(xhr, settings) {
    this.lock = null;
    this.trigger('locked',
                 xhr.responseJSON || {},
                 {
                   context: (settings.url.match(/\/edit_lock/) && !settings.polling) ? 'acquire' : 'other'
                 });

    this.stopPolling();

  },

  handleUnauthenticated: function() {
    this.stopPolling();
    this.trigger('unauthenticated');
  },

  handleError: function() {
  }
});