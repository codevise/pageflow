import {Fragment} from 'editor/models/Fragment';

import {normalizeSeed, useEditorGlobals} from 'support';

describe('Fragment', () => {
  describe('#seed with section', () => {
    const {createEntry} = useEditorGlobals();

    function createFragment() {
      return new Fragment({
        sections: [{id: 10, permaId: 1000}],
        collections: {
          sections: [{id: 10, permaId: 1000, chapterId: 1, configuration: {}}],
          contentElements: [
            {id: 20, permaId: 2000, sectionId: 10, typeName: 'heading', configuration: {}}
          ]
        }
      });
    }

    function entrySeed() {
      return normalizeSeed();
    }

    function fragmentSection(seed) {
      return seed.collections.sections.find(section => section.permaId === 1000);
    }

    it('uses layout, appearance and invert of section', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {
          layout: 'center', appearance: 'cards', invert: true, transition: 'fade'
        }}]
      });

      const seed = createFragment().seed(entrySeed(), {section: entry.sections.get(1)});

      expect(fragmentSection(seed).configuration).toEqual({
        layout: 'center', appearance: 'cards', invert: true
      });
    });

    it('ignores backdrop of section', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdrop: {color: '#f00'}}}]
      });

      const seed = createFragment().seed(entrySeed(), {section: entry.sections.get(1)});

      expect(fragmentSection(seed).configuration).not.toHaveProperty('backdrop');
    });

    it('does not change fragment without section', () => {
      const fragment = createFragment();

      const seed = fragment.seed(entrySeed());

      expect(seed.collections.sections).toEqual(fragment.get('collections').sections);
    });
  });
});
