import {MultiCollection} from './MultiCollection';

/**
 * Watch Backbone collections to track which models are currently
 * being saved. Used to update the notifications view displaying
 * saving status/failutes.
 */
export const SavingRecordsCollection = MultiCollection.extend({
  /**
   * Listen to events of models in collection to track when they are
   * being saved.
   *
   * @param {Backbone.Collection} collection - Collection to watch.
   */
  watch: function(collection) {
    var that = this;

    this.listenTo(collection, 'request', function(model, xhr) {
      that.add(model);

      xhr.always(function() {
        that.remove(model);
      });
    });
  }
});
