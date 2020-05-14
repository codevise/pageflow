import {Configuration} from '../Configuration';
import _ from 'underscore';

/**
 * Mixins for models with a nested configuration model.
 *
 * Triggers events on the parent model of the form
 * `change:configuration` and `change:configuration:<attribute>`, when
 * the configuration changes.
 *
 * @param {Object} [options]
 * @param {Function} [options.configurationModel] -
 *   Backbone model to use for nested configuration model.
 * @param {Boolean} [options.autoSave] -
 *   Save model when configuration changes.
 * @param {Boolean|Array<String>} [options.includeAttributesInJSON] -
 *   Include all or specific attributes of the parent model in the
 *   data returned by `toJSON` besides the `configuration` property.
 * @returns {Object} - Mixin to be included in model.
 *
 * @example
 *
 * import {configurationContainer} from 'pageflow/editor';
 *
 * const Section = Backbone.Model.extend({
 *   mixins: [configurationContainer({autoSave: true})]
 * });
 *
 * const section = new Section({configuration: {some: 'value'}});
 * section.configuration.get('some') // => 'value';
 */
export function configurationContainer({configurationModel, autoSave, includeAttributesInJSON} = {}) {
  configurationModel = configurationModel || Configuration.extend({
    defaults: {}
  });

  return {
    initialize() {
      this.configuration = new configurationModel(this.get('configuration'));
      this.configuration.parent = this;

      this.listenTo(this.configuration, 'change', function(model, options) {
        if (!this.isNew() &&
            (!this.isDestroying || !this.isDestroying()) &&
            (!this.isDestroyed || !this.isDestroyed()) &&
            autoSave &&
            options.autoSave !== false) {
          this.save();
        }

        this.trigger('change:configuration', this, undefined, options);

        _.chain(this.configuration.changed).keys().each(function(name) {
          this.trigger('change:configuration:' + name, this, this.configuration.get(name));
        }, this);
      });
    },

    toJSON() {
      let attributes = {};

      if (includeAttributesInJSON === true) {
        attributes = _.clone(this.attributes);
      }
      else if (includeAttributesInJSON) {
        attributes = _.pick(this.attributes, includeAttributesInJSON);
      }

      return _.extend(attributes, {
        configuration: this.configuration.toJSON()
      });
    }
  };
}
