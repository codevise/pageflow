import _ from 'underscore';
import {Configuration} from './Configuration';
import {EntryMetadataConfiguration} from './EntryMetadataConfiguration';

export const EntryMetadata = Configuration.extend({
  modelName: 'entry',
  i18nKey: 'pageflow/entry',

  defaults: {},

  initialize: function(attributes, options) {
    Configuration.prototype.initialize.apply(this, attributes, options);
    this.configuration =
      new EntryMetadataConfiguration(_.clone(attributes.configuration) || {});

    this.listenTo(this.configuration, 'change', function() {
      this.trigger('change');
      this.parent.save();
    });
  },

  // Pageflow Scrolled only synchronizes saved records to entry state.
  isNew() {
    return false;
  }
});
