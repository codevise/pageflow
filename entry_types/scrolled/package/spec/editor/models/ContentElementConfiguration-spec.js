import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, normalizeSeed} from 'support';
import {setupGlobals} from 'pageflow/testHelpers';

describe('ContentElementConfiguration', () => {
  let testContext;

  beforeEach(() => {
    const entry = factories.entry(
      ScrolledEntry,
      {},
      {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 1}
          ],
          contentElements: [
            {id: 5, permaId: 50, sectionId: 1, typeName: 'inlineVideo'},
            {id: 6, permaId: 60, sectionId: 1, typeName: 'inlineVideo'}
          ]
        })
      }
    );

    testContext = {entry};
  });

  setupGlobals({
    entry: () => testContext.entry
  });

  describe('setting position to backdrop', () => {
    it('sets backdropType of section to contentElement', () => {
      const contentElement = testContext.entry.contentElements.get(5);
      const section = testContext.entry.sections.get(1);

      contentElement.configuration.set('position', 'backdrop');

      expect(section.configuration.get('backdropType')).toEqual('contentElement');
    });

    it('sets backdropContentElement of section to contentElement', () => {
      const contentElement = testContext.entry.contentElements.get(5);
      const section = testContext.entry.sections.get(1);

      contentElement.configuration.set('position', 'backdrop');

      expect(section.configuration.get('backdropContentElement')).toEqual(
        contentElement.get('permaId')
      );
    });

    it('sets backdrop attribute of section', () => {
      const contentElement = testContext.entry.contentElements.get(5);
      const section = testContext.entry.sections.get(1);

      contentElement.configuration.set('position', 'backdrop');

      expect(section.configuration.get('backdrop')).toEqual({
        contentElement: contentElement.get('permaId')
      });
    });

    it('resets position of existing backdrop content element to inline', () => {
      const otherContentElement = testContext.entry.contentElements.get(6);
      const contentElement = testContext.entry.contentElements.get(5);

      otherContentElement.configuration.set('position', 'backdrop');
      contentElement.configuration.set('position', 'backdrop');

      expect(otherContentElement.configuration.get('position')).toEqual('inline');
    });
  });

  describe('resetting position from backdrop', () => {
    it('restores previous backdropType of section', () => {
      const contentElement = testContext.entry.contentElements.get(5);
      const section = testContext.entry.sections.get(1);

      section.configuration.set('backdropType', 'video');
      contentElement.configuration.set('position', 'backdrop');
      contentElement.configuration.set('position', 'inline');

      expect(section.configuration.get('backdropType')).toEqual('video');
    });

    it('restores previous backdropType even if position is set multiple times', () => {
      const contentElement = testContext.entry.contentElements.get(5);
      const section = testContext.entry.sections.get(1);

      section.configuration.set('backdropType', 'video');
      contentElement.configuration.set('position', 'backdrop');
      contentElement.configuration.set('position', 'backdrop');
      contentElement.configuration.set('position', 'inline');

      expect(section.configuration.get('backdropType')).toEqual('video');
    });

    it('restores previous backdrop attribute of section', () => {
      const contentElement = testContext.entry.contentElements.get(5);
      const section = testContext.entry.sections.get(1);

      section.configuration.set('backdropType', 'image');
      section.configuration.set('backdropImage', 1);
      contentElement.configuration.set('position', 'backdrop');
      contentElement.configuration.set('position', 'inline');

      expect(section.configuration.get('backdrop')).toEqual({image: 1});
    });

    it('does not restores backdropType of section if keepBackdropType option is true', () => {
      const contentElement = testContext.entry.contentElements.get(5);
      const section = testContext.entry.sections.get(1);

      section.configuration.set('backdropType', 'video');
      contentElement.configuration.set('position', 'backdrop');
      contentElement.configuration.set('position', 'inline', {keepBackdropType: true});

      expect(section.configuration.get('backdropType')).toEqual('contentElement');
    });

    it('resets backdropContentElement of section', () => {
      const contentElement = testContext.entry.contentElements.get(5);
      const section = testContext.entry.sections.get(1);

      contentElement.configuration.set('position', 'backdrop');
      contentElement.configuration.set('position', 'inline');

      expect(section.configuration.get('backdropContentElement')).toBeNull();
    });

    it('resets backdropContentElement of section even with keepBackdropType', () => {
      const contentElement = testContext.entry.contentElements.get(5);
      const section = testContext.entry.sections.get(1);

      contentElement.configuration.set('position', 'backdrop');
      contentElement.configuration.set('position', 'inline', {keepBackdropType: true});

      expect(section.configuration.get('backdropContentElement')).toBeNull();
    });
  });
});
