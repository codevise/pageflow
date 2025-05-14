import {EffectsCollection} from 'editor/collections/EffectsCollection';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {features} from 'pageflow/frontend';

describe('EffectsCollection', () => {
  beforeEach(() => features.enabledFeatureNames = []);

  describe('#getUnusedEffects', () => {
    useFakeTranslations({
      'pageflow_scrolled.editor.backdrop_effects.blur.label': 'Blur'
    });

    it('sets label based on translation', () => {
      const effects = new EffectsCollection();

      const unusedEffects = effects.getUnusedEffects();

      expect(unusedEffects.pluck('label')).toContain('Blur');
    });

    it('allows getting unused effects', () => {
      const effects = new EffectsCollection([{name: 'brightness', value: 50}]);

      const unusedEffects = effects.getUnusedEffects();

      expect(unusedEffects.pluck('name')).toContain('blur');
      expect(unusedEffects.pluck('name')).not.toContain('brightness');
    });

    it('does not include decoration effects by default', () => {
      const effects = new EffectsCollection();

      const unusedEffects = effects.getUnusedEffects();

      expect(unusedEffects.pluck('name')).not.toContain('frame');
    });

    it('includes decoration effects if feature is enabled', () => {
      const effects = new EffectsCollection();
      features.enable('frontend', ['decoration_effects']);

      const unusedEffects = effects.getUnusedEffects();

      expect(unusedEffects.pluck('name')).toContain('frame');
    });

    it('selecting an unused effects adds it to the collection', () => {
      const effects = new EffectsCollection();

      const unusedEffects = effects.getUnusedEffects();
      unusedEffects.first().selected();

      expect(effects.pluck('name')).toEqual(['blur']);
    });

    it('removes effect when added to collection', () => {
      const effects = new EffectsCollection();

      const unusedEffects = effects.getUnusedEffects();
      unusedEffects.findWhere({name: 'brightness'}).selected();

      expect(unusedEffects.pluck('name')).not.toContain('brightness');
    });

    it('restores effect once removed from collection', () => {
      const effects = new EffectsCollection([{name: 'blur', value: 50}]);

      const unusedEffects = effects.getUnusedEffects();
      effects.remove(effects.first());

      expect(unusedEffects.pluck('name')).toContain('blur');
    });

    it('separates first animation effect', () => {
      const effects = new EffectsCollection();

      const unusedEffects = effects.getUnusedEffects();

      expect(unusedEffects.findWhere({name: 'sepia'}).get('separated')).toEqual(false);
      expect(unusedEffects.findWhere({name: 'autoZoom'}).get('separated')).toEqual(true);
      expect(unusedEffects.findWhere({name: 'scrollParallax'}).get('separated')).toEqual(false);
    });

    it('updates separation when effect is selected', () => {
      const effects = new EffectsCollection();

      const unusedEffects = effects.getUnusedEffects();
      unusedEffects.findWhere({name: 'autoZoom'}).selected();

      expect(unusedEffects.findWhere({name: 'sepia'}).get('separated')).toEqual(false);
      expect(unusedEffects.findWhere({name: 'scrollParallax'}).get('separated')).toEqual(true);
    });

    it('updates separation when effect is removed', () => {
      const effects = new EffectsCollection([{name: 'autoZoom', value: 50}]);

      const unusedEffects = effects.getUnusedEffects();
      effects.remove(effects.first());

      expect(unusedEffects.findWhere({name: 'sepia'}).get('separated')).toEqual(false);
      expect(unusedEffects.findWhere({name: 'autoZoom'}).get('separated')).toEqual(true);
      expect(unusedEffects.findWhere({name: 'scrollParallax'}).get('separated')).toEqual(false);
    });
  });
});
