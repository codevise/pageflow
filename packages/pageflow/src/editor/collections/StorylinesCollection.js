import Backbone from 'backbone';

import {Storyline} from '../models/Storyline';
import {orderedCollection} from './mixins/orderedCollection';

import {state} from '$state';

export const StorylinesCollection = Backbone.Collection.extend({
  autoConsolidatePositions: false,

  mixins: [orderedCollection],

  model: Storyline,

  url: function() {
    return '/entries/' + state.entry.get('id') + '/storylines';
  },

  initialize: function() {
    this.listenTo(this, 'change:main', function(model, value) {
      if (value) {
        this.each(function(storyline) {
          if (storyline.isMain() && storyline !== model) {
            storyline.configuration.unset('main');
          }
        });
      }
    });
  },

  main: function() {
    return this.find(function(storyline) {
      return storyline.configuration.get('main');
    }) || this.first();
  },

  comparator: function(chapter) {
    return chapter.get('position');
  }
});