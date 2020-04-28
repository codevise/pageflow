import {SubsetCollection} from './SubsetCollection';
import {orderedCollection} from './mixins/orderedCollection';

/**
 * A Backbone collection that is automatically updated to only
 * contain models with a foreign key matching the id of a parent
 * model.
 *
 * @param {Object} options
 * @param {Backbone.Model} options.parentModel -
 *   Model whose id is compared to foreign keys.
 * @param {Backbone.Collection} options.parent -
 *   Collection to filter items with matching foreign key from.
 * @param {String} options.foreignKeyAttribute -
 *   Attribute to compare to id of parent model.
 * @param {String} options.parentReferenceAttribute -
 *   Set reference to parent model on models in collection.
 *
 * @since 15.1
 */
export const ForeignKeySubsetCollection = SubsetCollection.extend({
  mixins: [orderedCollection],

  constructor: function(options) {
    var parent = options.parent;
    var parentModel = options.parentModel;

    this.autoConsolidatePositions = options.autoConsolidatePositions;

    SubsetCollection.prototype.constructor.call(this, {
      parent,
      parentModel,

      filter: function(item) {
        return !parentModel.isNew() &&
               item.get(options.foreignKeyAttribute) === parentModel.id;
      },

      comparator: function(item) {
        return item.get('position');
      }
    });

    this.listenTo(this, 'add', function(model) {
      if (options.parentReferenceAttribute) {
        model[options.parentReferenceAttribute] = parentModel;
      }

      model.set(options.foreignKeyAttribute, parentModel.id);
    });

    this.listenTo(parentModel, 'destroy', function() {
      this.clear();
    });

    if (options.parentReferenceAttribute) {
      this.each(model => model[options.parentReferenceAttribute] = parentModel);

      this.listenTo(this, 'remove', function(model) {
        model[options.parentReferenceAttribute] = null;
      });
    }
  }
});
