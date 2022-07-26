import {EffectsCollection} from 'editor/collections/EffectsCollection';

import {useFakeTranslations} from 'pageflow/testHelpers';

describe('EffectsCollection', () => {
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
  });
});
