import Backbone from 'backbone';
import I18n from 'i18n-js';
import _ from 'underscore';

import {ChapterScaffold} from './ChapterScaffold';
import {StorylineChaptersCollection} from '../collections/StorylineChaptersCollection';
import {StorylineConfiguration} from './StorylineConfiguration';
import {StorylineTransitiveChildPages} from './StorylineTransitiveChildPages';
import {configurationContainer} from './mixins/configurationContainer';
import {delayedDestroying} from './mixins/delayedDestroying';
import {failureTracking} from './mixins/failureTracking';
import {state} from '$state';

export const Storyline = Backbone.Model.extend({
  modelName: 'storyline',
  paramRoot: 'storyline',
  i18nKey: 'pageflow/storyline',

  mixins: [
    configurationContainer({
      autoSave: true,
      configurationModel: StorylineConfiguration
    }),
    failureTracking,
    delayedDestroying
  ],

  initialize: function(attributes, options) {
    this.chapters = new StorylineChaptersCollection({
      chapters: options.chapters || state.chapters,
      storyline: this
    });

    this.listenTo(this, 'change:configuration:main', function(model, value) {
      this.trigger('change:main', this, value);
    });
  },

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/storylines';
  },

  displayTitle: function() {
    return _([
      this.title() ||
        (!this.isMain() && I18n.t('pageflow.storylines.untitled')),
      this.isMain() && I18n.t('pageflow.storylines.main')
    ]).compact().join(' - ');
  },

  title: function() {
    return this.configuration.get('title');
  },

  isMain: function() {
    return !!this.configuration.get('main');
  },

  lane: function() {
    return this.configuration.get('lane');
  },

  row: function() {
    return this.configuration.get('row');
  },

  parentPagePermaId: function() {
    return this.configuration.get('parent_page_perma_id');
  },

  parentPage: function() {
    return state.pages.getByPermaId(this.parentPagePermaId());
  },

  transitiveChildPages: function() {
    return new StorylineTransitiveChildPages(this, state.storylines, state.pages);
  },

  addChapter: function(attributes) {
    var chapter = this.buildChapter(attributes);
    chapter.save();

    return chapter;
  },

  buildChapter: function(attributes) {
    var defaults = {
      storyline_id: this.id,
      title: '',
      position: this.chapters.length
    };

    return this.chapters.addAndReturnModel(_.extend(defaults, attributes));
  },

  scaffoldChapter: function(options) {
    var scaffold = new ChapterScaffold(this, options);
    scaffold.create();

    return scaffold;
  },

  destroy: function() {
    this.destroyWithDelay();
  }
});
