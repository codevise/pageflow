import Backbone from 'backbone';
import Cocktail from 'cocktail';
import jQuery from 'jquery';

export const persistedPromise = {
  persisted: function() {
    var model = this;

    this._persistedDeferred = this._persistedDeferred || jQuery.Deferred(function(deferred) {
      if (model.isNew()) {
        model.once('change:id', deferred.resolve);
      }
      else {
        deferred.resolve();
      }
    });

    return this._persistedDeferred.promise();
  }
};

Cocktail.mixin(Backbone.Model, persistedPromise);
