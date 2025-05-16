import Backbone from 'backbone';
import {features} from 'pageflow/frontend';
import {Effect} from '../models/Effect';

const DEFAULT_TYPES = {
  blur: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 50,
    kind: 'filter'
  },
  brightness: {
    minValue: -100,
    maxValue: 100,
    defaultValue: -20,
    kind: 'filter'
  },
  contrast: {
    minValue: -100,
    maxValue: 100,
    defaultValue: 20,
    kind: 'filter'
  },
  grayscale: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 100,
    kind: 'filter'
  },
  saturate: {
    minValue: -100,
    maxValue: 100,
    defaultValue: 20,
    kind: 'filter'
  },
  sepia: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 100,
    kind: 'filter'
  },
  autoZoom: {
    minValue: 1,
    maxValue: 100,
    defaultValue: 50,
    kind: 'animation'
  },
  scrollParallax: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 50,
    kind: 'animation'
  },
  frame: {
    kind: 'decoration',
    inputType: 'color',
    defaultValue: '#ffffff'
  }
};

export const EffectsCollection = Backbone.Collection.extend({
  model: Effect,

  initialize(models, options = {}) {
    this.types = options.types || {};
  },

  getUnusedEffects() {
    const effects = this;
    const unusedEffects = new Backbone.Collection(
      Object.keys(this.types)
        .filter(name => features.isEnabled('decoration_effects') ||
                        Effect.getKind(name, this.types) !== 'decoration')
        .filter(name => !this.findWhere({name}))
        .map(name => ({name})),
      {
        comparator: effect => Object.keys(this.types).indexOf(effect.get('name')),

        model: Backbone.Model.extend({
          initialize({name}) {
            this.set('label', Effect.getLabel(name, effects.types));
          },

          selected() {
            effects.add({name: this.get('name')}, {types: effects.types});
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

    this.listenTo(unusedEffects, 'add remove', () =>
      updateSeparation(unusedEffects, this.types)
    );

    updateSeparation(unusedEffects, this.types);

    return unusedEffects;
  }
});

EffectsCollection.withDefaultTypes = function(models) {
  return new EffectsCollection(models, {types: DEFAULT_TYPES});
};

function updateSeparation(effects, types) {
  effects.reduce((previous, effect) => {
    effect.set('separated',
               previous &&
               Effect.getKind(effect.get('name'), types) !== Effect.getKind(previous.get('name'), types));
    return effect;
  }, null);
}
