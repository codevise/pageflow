import Backbone from 'backbone';
import {Effect} from '../models/Effect';

export const EffectsCollection = Backbone.Collection.extend({
  model: Effect,

  getUnusedEffects() {
    const effects = this;
    const unusedEffects = new Backbone.Collection(
      Effect.names
        .filter(name => !this.findWhere({name}))
        .map(name => ({name})),
      {
        comparator: 'name',

        model: Backbone.Model.extend({
          initialize({name}) {
            this.set('label', Effect.getLabel(name));
          },

          selected() {
            effects.add({name: this.get('name')});
          }
        })
      }
    );

    this.listenTo(this, 'add', effect =>
      unusedEffects.remove(unusedEffects.findWhere({name: effect.get('name')}))
    );

    this.listenTo(this, 'remove', effect =>
      unusedEffects.add({name: effect.get('name')})
    );

    return unusedEffects;
  }
});
