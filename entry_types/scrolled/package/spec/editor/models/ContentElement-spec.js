import {editor} from 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, normalizeSeed} from 'support';
import {features} from 'pageflow/frontend';

describe('ContentElement', () => {
  describe('getAvailablePositions', () => {
    beforeEach(() => {
      features.enable('frontend', ['backdrop_content_elements']);

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

      expect(contentElement.getAvailablePositions()).toEqual(
        ['inline', 'side', 'sticky', 'standAlone', 'backdrop']
      );
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

      expect(contentElement.getAvailablePositions()).toEqual(
        ['inline', 'side', 'sticky', 'standAlone', 'backdrop']
      );
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

      expect(contentElement.getAvailablePositions()).toEqual(
        ['inline', 'left', 'right', 'standAlone', 'backdrop']
      );
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

      expect(contentElement.getAvailablePositions()).toEqual(
        ['inline', 'left', 'right', 'standAlone', 'backdrop']
      );
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

  describe('getWidth', () => {
    beforeEach(() => {
      editor.contentElementTypes.register('inlineImage', {
        supportedWidthRange: ['xxs', 'full']
      });
    });

    it('returns md by default', () => {
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

      expect(contentElement.getWidth()).toEqual(0);
    });

    it('returns current width', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage',
               configuration: {
                 width: 2
               }
              }
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getWidth()).toEqual(2);
    });

    it('excludes xxs/full in sticky position', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage', configuration: {
                position: 'sticky',
                width: -3

              }}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getWidth()).toEqual(-2);
    });

    it('excludes xxs/full in side position', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage', configuration: {
                position: 'side',
                width: -3

              }}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getWidth()).toEqual(-2);
    });

    it('excludes xxs/full in floated position', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1, configuration: {layout: 'center'}}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage',
               configuration: {
                 position: 'left',
                 width: 3
               }
              }
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getWidth()).toEqual(2);
    });

    it('does not exclude xxs/full if position is not supported by layout', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1, configuration: {layout: 'center'}}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage',
               configuration: {
                 position: 'sticky',
                 width: 3
               }
              }
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getWidth()).toEqual(3);
    });
  });

  describe('getMinWidth/getMaxWidth', () => {
    beforeEach(() => {
      editor.contentElementTypes.register('heading', {
        supportedWidthRange: ['md', 'xl']
      });
      editor.contentElementTypes.register('soundDisclaimer', {});
      editor.contentElementTypes.register('inlineImage', {
        supportedWidthRange: ['xxs', 'full']
      });
    });

    it('does not support different widths by default', () => {
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

      expect(contentElement.getAvailableMinWidth()).toEqual(0);
      expect(contentElement.getAvailableMaxWidth()).toEqual(0);
    });

    it('limits width according to element type support', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'heading'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailableMinWidth()).toEqual(0);
      expect(contentElement.getAvailableMaxWidth()).toEqual(2);
    });

    it('excludes xxs/full in sticky position', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage', configuration: {position: 'sticky'}}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailableMinWidth()).toEqual(-2);
      expect(contentElement.getAvailableMaxWidth()).toEqual(2);
    });

    it('excludes xxs/full in floated position', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1, configuration: {layout: 'center'}}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage', configuration: {position: 'left'}}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailableMinWidth()).toEqual(-2);
      expect(contentElement.getAvailableMaxWidth()).toEqual(2);
    });

    it('only offer md position in backdrop position', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage', configuration: {position: 'backdrop'}}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailableMinWidth()).toEqual(0);
      expect(contentElement.getAvailableMaxWidth()).toEqual(0);
    });

    it('does not exclude xxs/full if position is not supported by layout', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1, configuration: {layout: 'center'}}
            ],
            contentElements: [
              {id: 5, sectionId: 1, typeName: 'inlineImage', configuration: {position: 'sticky'}}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getAvailableMinWidth()).toEqual(-3);
      expect(contentElement.getAvailableMaxWidth()).toEqual(3);
    });
  });

  describe('supportsFullWidthInPhoneLayout', () => {
    beforeEach(() => {
      editor.contentElementTypes.register('headisng', {
        supportedWidthRange: ['md', 'xl'],
        customMargin: true
      });
      editor.contentElementTypes.register('imageGallery', {
        supportedWidthRange: ['md', 'full'],
        customMargin: true
      });
      editor.contentElementTypes.register('inlineImage', {
        supportedWidthRange: ['xxs', 'full']
      });
    });

    it('returns true for types that support full but do not have custom margin', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 4, typeName: 'heading'},
              {id: 5, typeName: 'imageGallery'},
              {id: 6, typeName: 'inlineImage'}
            ]
          })
        }
      );

      expect(entry.contentElements.get(4).supportsFullWidthInPhoneLayout()).toEqual(false);
      expect(entry.contentElements.get(5).supportsFullWidthInPhoneLayout()).toEqual(false);
      expect(entry.contentElements.get(6).supportsFullWidthInPhoneLayout()).toEqual(true);
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

  describe('#getEditorPath', () => {
    it('returns content element path by default', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 5, typeName: 'inlineImage'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getEditorPath()).toEqual('/scrolled/content_elements/5');
    });

    it('can be overriden via content element type', () => {
      editor.contentElementTypes.register('customElement', {
        editorPath(contentElement) {
          return `/scrolled/custom/${contentElement.id}`;
        }
      });
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 5, typeName: 'customElement'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      expect(contentElement.getEditorPath()).toEqual('/scrolled/custom/5');
    });
  });
});
