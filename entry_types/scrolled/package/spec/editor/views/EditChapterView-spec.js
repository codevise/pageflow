import {EditChapterView} from 'editor/views/EditChapterView';

import {ConfigurationEditor, useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('EditChapterView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.editor.edit_chapter.tabs.chapter': 'Chapter',
    'pageflow_scrolled.editor.edit_chapter.tabs.excursion': 'Excursion'
  });

  it('uses chapter tab for main storyline chapters', () => {
    const entry = createEntry({
      storylines: [
        {id: 100, configuration: {main: true}}
      ],
      chapters: [
        {id: 1, storylineId: 100}
      ]
    });

    const view = new EditChapterView({
      model: entry.chapters.get(1),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.tabNames()).toContain('chapter');
    expect(configurationEditor.tabNames()).not.toContain('excursion');
  });

  it('uses excursion tab for excursion chapters', () => {
    const entry = createEntry({
      storylines: [
        {id: 100, configuration: {main: true}},
        {id: 200}
      ],
      chapters: [
        {id: 1, storylineId: 100},
        {id: 2, storylineId: 200}
      ]
    });

    const view = new EditChapterView({
      model: entry.chapters.get(2),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.tabNames()).toContain('excursion');
    expect(configurationEditor.tabNames()).not.toContain('chapter');
  });
});
