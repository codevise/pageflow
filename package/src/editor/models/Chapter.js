import Backbone from 'backbone';
import _ from 'underscore';

import {ChapterConfiguration} from './ChapterConfiguration';
import {ChapterPagesCollection} from '../collections/ChapterPagesCollection';
import {configurationContainer} from './mixins/configurationContainer';
import {delayedDestroying} from './mixins/delayedDestroying';
import {failureTracking} from './mixins/failureTracking';

import {state} from '$state';

export const Chapter = Backbone.Model.extend({
  modelName: 'chapter',
  paramRoot: 'chapter',
  i18nKey: 'pageflow/chapter',

  mixins: [
    configurationContainer({
      autoSave: true,
      includeAttributesInJSON: true,
      configurationModel: ChapterConfiguration
    }),
    failureTracking,
    delayedDestroying
  ],

  initialize: function(attributes, options) {
    this.pages = new ChapterPagesCollection({
      pages: options.pages || state.pages,
      chapter: this
    });

    this.listenTo(this, 'change:title', function() {
      this.save();
    });
  },

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/chapters';
  },

  storylinePosition: function() {
    return (this.storyline && this.storyline.get('position')) || -1;
  },

  addPage: function(attributes) {
    var page = this.buildPage(attributes);
    page.save();

    return page;
  },

  buildPage: function(attributes) {
    var defaults = {
      chapter_id: this.id,
      position: this.pages.length
    };

    return this.pages.addAndReturnModel(_.extend(defaults, attributes));
  },

  toJSON: function() {
    return _.extend(_.clone(this.attributes), {
      configuration: this.configuration.toJSON()
    });
  },

  destroy: function() {
    this.destroyWithDelay();
  }
});
