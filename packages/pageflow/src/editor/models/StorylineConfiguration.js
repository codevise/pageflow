import {Configuration} from './Configuration';

export const StorylineConfiguration = Configuration.extend({
  modelName: 'storyline',
  i18nKey: 'pageflow/storyline',

  defaults: {
  },

  initialize: function() {
    this.listenTo(this, 'change:main', function(model, value) {
      if (value) {
        this.unset('parent_page_perma_id');
      }
    });
  }
});
