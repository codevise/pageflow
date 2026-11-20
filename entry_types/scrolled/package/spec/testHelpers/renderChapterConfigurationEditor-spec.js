import {editor} from 'pageflow-scrolled/editor';
import {renderChapterConfigurationEditor} from 'pageflow-scrolled/testHelpers';
import {TextInputView} from 'pageflow/ui';
import {useEditorGlobals} from 'support';
import '@testing-library/jest-dom/extend-expect';

editor.widgetTypes.register('someSheet', {
  configurationEditorTabViewGroups: {
    ChapterExcursionSettings: function() {
      this.input('someSheetSetting', TextInputView, {
        placeholder: this.model.parent.entry.widgets.get('excursion')
          .configuration.get('defaultSetting')
      });
    }
  }
});

describe('renderChapterConfigurationEditor', () => {
  const {createEntry} = useEditorGlobals();

  it('renders configuration editor of chapter', () => {
    const entry = createEntry({
      storylines: [{id: 100, role: 'main'}],
      chapters: [{id: 1, storylineId: 100}]
    });

    const {getByInputPropertyName} = renderChapterConfigurationEditor({
      entry,
      chapter: entry.chapters.get(1)
    });

    expect(getByInputPropertyName('title')).toBeInTheDocument();
  });

  it('includes tab view groups of widgets of entry', () => {
    const entry = createEntry({
      widgets: [{
        role: 'excursion',
        typeName: 'someSheet',
        configuration: {defaultSetting: 'Some default'}
      }],
      storylines: [{id: 100, role: 'main'}, {id: 200}],
      chapters: [{id: 1, storylineId: 200}]
    });

    const {getByInputPropertyName, getByPlaceholderText} = renderChapterConfigurationEditor({
      entry,
      chapter: entry.chapters.get(1)
    });

    expect(getByInputPropertyName('someSheetSetting')).toBeInTheDocument();
    expect(getByPlaceholderText('Some default')).toBeInTheDocument();
  });
});
