import Backbone from 'backbone';
import _ from 'underscore';

import {ChapterConfiguration} from './ChapterConfiguration';
import {ChapterPagesCollection} from '../collections/ChapterPagesCollection';
import {delayedDestroying} from './mixins/delayedDestroying';
import {failureTracking} from './mixins/failureTracking';

import {state} from '$state';

export const Chapter = Backbone.Model.extend({
  modelName: 'chapter',
  paramRoot: 'chapter',
  i18nKey: 'pageflow/chapter',

  mixins: [failureTracking, delayedDestroying],

  initialize: function(attributes, options) {
    this.pages = new ChapterPagesCollection({
      pages: options.pages || state.pages,
      chapter: this
    });

    this.listenTo(this, 'change:title', function() {
      this.save();
    });

    this.configuration = new ChapterConfiguration(this.get('configuration') || {});

    this.listenTo(this.configuration, 'change', function() {
      this.save();
      this.trigger('change:configuration', this);
    });

    return attributes;
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
