import {editor} from 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, normalizeSeed} from 'support';

describe('ContentElement', () => {
  describe('getAvailablePositions', () => {
    beforeEach(() => {
      editor.contentElementTypes.register('inlineImage', {});
      editor.contentElementTypes.register('soundDisclaimer', {supportedPositions: ['inline']});
    });

    it('returns positions for left layout by default', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailablePositions()).toEqual(['inline', 'sticky', 'wide', 'full']);
    });

    it('returns positions for left layout if parent section uses that', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1, configuration: {layout: 'left'}}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailablePositions()).toEqual(['inline', 'sticky', 'wide', 'full']);
    });

    it('returns positions for center layout if parent section uses that', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1, configuration: {layout: 'center'}}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailablePositions()).toEqual(['inline', 'left', 'right', 'wide', 'full']);
    });

    it('returns positions for centerRagged layout if parent section uses that', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1, configuration: {layout: 'centerRagged'}}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailablePositions()).toEqual(['inline', 'left', 'right', 'wide', 'full']);
    });

    it('filters by positions supported by content element type', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'soundDisclaimer'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailablePositions()).toEqual(['inline']);
    });
  });

  describe('transientState', () => {
    it('stays in sync with transientState attribute', () => {
      editor.contentElementTypes.register('someElement', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 5, typeName: 'someElement'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      contentElement.set('transientState', {some: 'value'});

      expect(contentElement.transientState.get('some')).toEqual('value');
    });

    it('posts TRANSIENT_STATE_UPDATE command when model is changed', () => {
      const listener = jest.fn();

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 5, typeName: 'someElement'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);
      contentElement.on('postCommand', listener)
      contentElement.transientState.set('text', 'some text');

      expect(listener).toHaveBeenCalledWith(contentElement.id, {
        type: 'TRANSIENT_STATE_UPDATE',
        payload: {
          text: 'some text'
        }
      });
    });

    it('does not post command when state is changed from preivew', () => {
      const listener = jest.fn();

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 5, typeName: 'someElement'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);
      contentElement.on('postCommand', listener)
      contentElement.set('transientState', {text: 'some text'});

      expect(listener).not.toHaveBeenCalled();
    });

  });
});
