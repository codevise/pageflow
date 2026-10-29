import {ChapterItemView} from 'editor/views/ChapterItemView';
import {ListSelection} from 'pageflow/editor';
import {SortableCollectionView} from 'pageflow/ui';
import {FragmentLibraryDialogView} from 'editor/views/FragmentLibraryDialogView';

import {useEditorGlobals, useFakeXhr} from 'support';
import {screen} from '@testing-library/dom';
import {
  useFakeFeatures,
  useFakeTranslations,
  renderBackboneView as render
} from 'pageflow/testHelpers';
import '@testing-library/jest-dom/extend-expect';

describe('ChapterItemView', () => {
  useFakeXhr();

  useFakeTranslations({
    'pageflow_scrolled.editor.chapter_item.chapter': 'Chapter',
    'pageflow_scrolled.editor.chapter_item.drag_hint': 'Drag',
    'pageflow_scrolled.editor.chapter_item.save_error': 'Error',
    'pageflow_scrolled.editor.chapter_item.hidden_in_navigation': 'Hidden in navigation',
    'pageflow_scrolled.editor.chapter_item.add_section': 'New section',
    'pageflow_scrolled.editor.chapter_item.insert_fragment': 'Insert fragment'
  });

  const {createEntry} = useEditorGlobals();
  it('renders chapter link', async () => {
    const entry = createEntry({
      chapters: [
        {
          id: 1,
          permaId: 100,
          position: 0,
          configuration: {
            title: 'Some title'
          }
        }
      ]
    });
    const chapter = entry.chapters.get(1)
    const view = new ChapterItemView({
      entry,
      model: chapter
    });

    render(view);

    expect(screen.getByRole('link', {name: /Chapter 1 Some title/})).toBeInTheDocument();
  });

  it('updates number when preceding chapter is removed', () => {
    const entry = createEntry({
      chapters: [
        {id: 1, permaId: 100, position: 0, configuration: {title: 'First'}},
        {id: 2, permaId: 101, position: 1, configuration: {title: 'Second'}}
      ]
    });
    const view = new ChapterItemView({
      entry,
      model: entry.chapters.get(2)
    });

    render(view);
    entry.chapters.remove(entry.chapters.get(1));

    expect(screen.getByRole('link', {name: /Chapter 1 Second/})).toBeInTheDocument();
  });

  it('does not fail when own chapter is removed', () => {
    const entry = createEntry({
      chapters: [{id: 1, permaId: 100, position: 0}]
    });
    const view = new ChapterItemView({
      entry,
      model: entry.chapters.get(1)
    });

    render(view);

    expect(() => entry.chapters.remove(entry.chapters.get(1))).not.toThrow();
  });

  it('marks chapter as hidden in navigation', async () => {
    const entry = createEntry({
      chapters: [
        {
          id: 1,
          permaId: 100,
          position: 0,
          configuration: {
            title: 'Some title',
            hideInNavigation: true
          }
        }
      ]
    });
    const chapter = entry.chapters.get(1)
    const view = new ChapterItemView({
      entry,
      model: chapter
    });

    render(view);

    expect(screen.getByRole('generic', {name: 'Hidden in navigation'})).toBeInTheDocument();
  });

  it('adds empty section when new section link is clicked', () => {
    const entry = createEntry({
      chapters: [{id: 1, permaId: 100, position: 0, configuration: {}}]
    });
    const chapter = entry.chapters.get(1);
    const addSection = jest.spyOn(chapter, 'addSection').mockImplementation(() => {});
    const view = new ChapterItemView({entry, model: chapter});

    render(view);
    screen.getByRole('link', {name: 'New section'}).click();

    expect(addSection).toHaveBeenCalledWith({});
  });

  it('does not render fragment button without fragments feature', () => {
    const entry = createEntry({
      chapters: [{id: 1, permaId: 100, position: 0, configuration: {}}]
    });
    const view = new ChapterItemView({entry, model: entry.chapters.get(1)});

    render(view);

    expect(screen.queryByRole('button', {name: 'Insert fragment'})).toBeNull();
  });

  describe('with section selection', () => {
    function renderChapterItem() {
      const entry = createEntry({chapters: [{id: 1}], sections: [{id: 10, chapterId: 1}]});
      const sectionSelection = new ListSelection();
      const view = new ChapterItemView({entry, model: entry.chapters.get(1), sectionSelection});

      render(view);

      return {entry, sectionSelection};
    }

    afterEach(() => jest.restoreAllMocks());

    it('disables sorting of sections while selection is active', () => {
      const disableSorting = jest.spyOn(SortableCollectionView.prototype, 'disableSorting');
      const {sectionSelection} = renderChapterItem();

      sectionSelection.start();

      expect(disableSorting).toHaveBeenCalled();
    });

    it('enables sorting of sections again when selection ends', () => {
      const {sectionSelection} = renderChapterItem();
      sectionSelection.start();
      const enableSorting = jest.spyOn(SortableCollectionView.prototype, 'enableSorting');

      sectionSelection.stop();

      expect(enableSorting).toHaveBeenCalled();
    });
  });

  describe('with fragments feature', () => {
    useFakeFeatures('editor', ['fragments']);

    it('opens fragment library dialog from fragment button', () => {
      const show = jest.spyOn(FragmentLibraryDialogView, 'show').mockImplementation(() => {});
      const entry = createEntry({
        chapters: [{id: 1, permaId: 100, position: 0, configuration: {}}]
      });
      const chapter = entry.chapters.get(1);
      const view = new ChapterItemView({entry, model: chapter});

      render(view);
      screen.getByRole('button', {name: 'Insert fragment'}).click();

      expect(show).toHaveBeenCalledWith({entry, chapter});

      show.mockRestore();
    });
  });
});
