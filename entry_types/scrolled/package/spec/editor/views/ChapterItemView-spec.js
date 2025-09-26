import {ChapterItemView} from 'editor/views/ChapterItemView';

import {useEditorGlobals, useFakeXhr} from 'support';
import {screen} from '@testing-library/dom';
import {useFakeTranslations, renderBackboneView as render} from 'pageflow/testHelpers';
import '@testing-library/jest-dom/extend-expect';

describe('ChapterItemView', () => {
  useFakeXhr();

  useFakeTranslations({
    'pageflow_scrolled.editor.chapter_item.chapter': 'Chapter',
    'pageflow_scrolled.editor.chapter_item.drag_hint': 'Drag',
    'pageflow_scrolled.editor.chapter_item.save_error': 'Error',
    'pageflow_scrolled.editor.chapter_item.hidden_in_navigation': 'Hidden in navigation',
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
});
