import {
  CopyPermalinkMenuItem,
  ExtractFragmentMenuItem,
  ToggleExcursionMenuItem,
  DestroyChapterMenuItem
} from 'editor/models/chapterMenuItems';

import {app} from 'pageflow/editor';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('ChapterMenuItems', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.chapter_menu_items.copy_permalink': 'Copy permalink',
    'pageflow_scrolled.editor.chapter_menu_items.move_to_main': 'Move to main',
    'pageflow_scrolled.editor.chapter_menu_items.move_to_excursions': 'Move to excursions',
    'pageflow_scrolled.editor.chapter_menu_items.extract_fragment': 'Add to shared fragments',
    'pageflow_scrolled.editor.chapter_menu_items.extracting_fragment': 'Adding to shared fragments...',
    'pageflow_scrolled.editor.chapter_menu_items.extracted_fragment': 'Added to shared fragments',
    'pageflow_scrolled.editor.chapter_menu_items.extract_fragment_failed': 'Could not add chapter.',
    'pageflow_scrolled.editor.chapter_menu_items.extract_fragment_forbidden': 'Not allowed.',
    'pageflow_scrolled.editor.destroy_chapter_menu_item.destroy': 'Delete chapter',
    'pageflow_scrolled.editor.destroy_chapter_menu_item.confirm_destroy': 'Really delete this chapter?'
  });

  const {createEntry} = useEditorGlobals();

  describe('CopyPermalinkMenuItem', () => {
    it('has Copy permalink label', () => {
      const entry = createEntry({chapters: [{id: 1}]});
      const chapter = entry.chapters.get(1);
      const menuItem = new CopyPermalinkMenuItem({}, {entry, chapter});

      expect(menuItem.get('label')).toBe('Copy permalink');
    });

    it('supports separated attribute', () => {
      const entry = createEntry({chapters: [{id: 1}]});
      const chapter = entry.chapters.get(1);
      const menuItem = new CopyPermalinkMenuItem({separated: true}, {entry, chapter});

      expect(menuItem.get('separated')).toBe(true);
    });

    it('copies permalink to clipboard when selected', () => {
      const entry = createEntry({chapters: [{id: 1}]});
      entry.getChapterPermalink = jest.fn().mockReturnValue('http://example.com/chapter');
      const chapter = entry.chapters.get(1);
      const menuItem = new CopyPermalinkMenuItem({}, {entry, chapter});
      navigator.clipboard = {writeText: jest.fn()};

      menuItem.selected();

      expect(entry.getChapterPermalink).toHaveBeenCalledWith(chapter);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://example.com/chapter');
    });
  });

  describe('ToggleExcursionMenuItem', () => {
    it('has Move to excursions label when chapter is in main storyline', () => {
      const entry = createEntry({chapters: [{id: 1}]});
      const chapter = entry.chapters.get(1);
      const menuItem = new ToggleExcursionMenuItem({}, {chapter});

      expect(menuItem.get('label')).toBe('Move to excursions');
    });

    it('has Move to main label when chapter is an excursion', () => {
      const entry = createEntry({
        storylines: [{id: 1, configuration: {main: true}}, {id: 2}],
        chapters: [{id: 1, storylineId: 2}]
      });
      const chapter = entry.chapters.get(1);
      const menuItem = new ToggleExcursionMenuItem({}, {chapter});

      expect(menuItem.get('label')).toBe('Move to main');
    });

    it('calls toggleExcursion on chapter when selected', () => {
      const entry = createEntry({chapters: [{id: 1}]});
      const chapter = entry.chapters.get(1);
      chapter.toggleExcursion = jest.fn();
      const menuItem = new ToggleExcursionMenuItem({}, {chapter});

      menuItem.selected();

      expect(chapter.toggleExcursion).toHaveBeenCalled();
    });
  });

  describe('ExtractFragmentMenuItem', () => {
    function createMenuItem(extraction) {
      const entry = createEntry({chapters: [{id: 1}]});
      const chapter = entry.chapters.get(1);
      chapter.extractToFragmentLibrary = jest.fn().mockReturnValue(extraction);

      return {chapter, menuItem: new ExtractFragmentMenuItem({}, {chapter})};
    }

    function pendingExtraction() {
      return new Promise(() => {});
    }

    it('has Add to shared fragments label', () => {
      const {menuItem} = createMenuItem(pendingExtraction());

      expect(menuItem.get('label')).toBe('Add to shared fragments');
    });

    it('extracts chapter when selected', () => {
      const {chapter, menuItem} = createMenuItem(pendingExtraction());

      menuItem.selected();

      expect(chapter.extractToFragmentLibrary).toHaveBeenCalled();
    });

    it('is disabled while extraction is pending', () => {
      const {menuItem} = createMenuItem(pendingExtraction());

      menuItem.selected();

      expect(menuItem.get('label')).toBe('Adding to shared fragments...');
      expect(menuItem.get('disabled')).toBe(true);
    });

    it('stays disabled once chapter has been added', async () => {
      const {menuItem} = createMenuItem(Promise.resolve());

      await menuItem.selected();

      expect(menuItem.get('label')).toBe('Added to shared fragments');
      expect(menuItem.get('disabled')).toBe(true);
    });

    it('is enabled again and reports error when extraction fails', async () => {
      const {menuItem} = createMenuItem(Promise.reject({status: 500}));
      const errors = [];
      app.on('error', error => errors.push(error.message));

      await menuItem.selected();

      expect(menuItem.get('label')).toBe('Add to shared fragments');
      expect(menuItem.get('disabled')).toBe(false);
      expect(errors).toEqual(['Could not add chapter.']);
      app.off('error');
    });

    it('reports missing permission', async () => {
      const {menuItem} = createMenuItem(Promise.reject({status: 403}));
      const errors = [];
      app.on('error', error => errors.push(error.message));

      await menuItem.selected();

      expect(errors).toEqual(['Not allowed.']);
      app.off('error');
    });
  });

  describe('DestroyChapterMenuItem', () => {
    it('has Delete chapter label', () => {
      const entry = createEntry({chapters: [{id: 1}]});
      const chapter = entry.chapters.get(1);
      const menuItem = new DestroyChapterMenuItem({}, {chapter});

      expect(menuItem.get('label')).toBe('Delete chapter');
    });

    it('calls destroyWithDelay on chapter when confirmed', () => {
      const entry = createEntry({chapters: [{id: 1}]});
      const chapter = entry.chapters.get(1);
      chapter.destroyWithDelay = jest.fn();
      const menuItem = new DestroyChapterMenuItem({}, {chapter});
      window.confirm = jest.fn().mockReturnValue(true);

      menuItem.selected();

      expect(window.confirm).toHaveBeenCalledWith('Really delete this chapter?');
      expect(chapter.destroyWithDelay).toHaveBeenCalled();
    });
  });
});
