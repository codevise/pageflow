import {DestroyContentElementMenuItem} from 'editor/models/contentElementMenuItems';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {factories, normalizeSeed} from 'support';

describe('ContentElementMenuItems', () => {
  describe('DestroyContentElementMenuItem', () => {
    useFakeTranslations({
      'pageflow_scrolled.editor.destroy_content_element_menu_item.destroy': 'Delete element',
      'pageflow_scrolled.editor.destroy_content_element_menu_item.confirm_destroy': 'Really delete this element?'
    });

    it('has Delete element label', () => {
      const editor = factories.editorApi();
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          contentElements: [{id: 1, typeName: 'textBlock'}]
        })
      });
      const contentElement = entry.contentElements.get(1);

      const menuItem = new DestroyContentElementMenuItem({}, {
        contentElement,
        entry,
        editor
      });

      expect(menuItem.get('label')).toBe('Delete element');
    });

    it('calls deleteContentElement on entry when confirmed', () => {
      const editor = factories.editorApi();
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          contentElements: [{id: 1, typeName: 'textBlock'}]
        })
      });
      const contentElement = entry.contentElements.get(1);
      entry.deleteContentElement = jest.fn();
      editor.contentElementTypes.register('textBlock', {});

      const menuItem = new DestroyContentElementMenuItem({}, {
        contentElement,
        entry,
        editor
      });
      window.confirm = jest.fn().mockReturnValue(true);

      menuItem.selected();

      expect(window.confirm).toHaveBeenCalledWith('Really delete this element?');
      expect(entry.deleteContentElement).toHaveBeenCalledWith(contentElement);
    });

    it('calls handleDestroy if content element type defines it', () => {
      const editor = factories.editorApi();
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          contentElements: [{id: 1, typeName: 'textBlock'}]
        })
      });
      const contentElement = entry.contentElements.get(1);
      const handleDestroy = jest.fn();
      entry.deleteContentElement = jest.fn();
      editor.contentElementTypes.register('textBlock', {handleDestroy});

      const menuItem = new DestroyContentElementMenuItem({}, {
        contentElement,
        entry,
        editor
      });
      window.confirm = jest.fn().mockReturnValue(true);

      menuItem.selected();

      expect(handleDestroy).toHaveBeenCalledWith(contentElement);
      expect(entry.deleteContentElement).toHaveBeenCalled();
    });

    it('does not call deleteContentElement if handleDestroy returns false', () => {
      const editor = factories.editorApi();
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          contentElements: [{id: 1, typeName: 'textBlock'}]
        })
      });
      const contentElement = entry.contentElements.get(1);
      entry.deleteContentElement = jest.fn();
      editor.contentElementTypes.register('textBlock', {
        handleDestroy() {
          return false;
        }
      });

      const menuItem = new DestroyContentElementMenuItem({}, {
        contentElement,
        entry,
        editor
      });
      window.confirm = jest.fn().mockReturnValue(true);

      menuItem.selected();

      expect(entry.deleteContentElement).not.toHaveBeenCalled();
    });

    it('does not delete when cancelled', () => {
      const editor = factories.editorApi();
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          contentElements: [{id: 1, typeName: 'textBlock'}]
        })
      });
      const contentElement = entry.contentElements.get(1);
      entry.deleteContentElement = jest.fn();
      editor.contentElementTypes.register('textBlock', {});

      const menuItem = new DestroyContentElementMenuItem({}, {
        contentElement,
        entry,
        editor
      });
      window.confirm = jest.fn().mockReturnValue(false);

      menuItem.selected();

      expect(entry.deleteContentElement).not.toHaveBeenCalled();
    });
  });
});
