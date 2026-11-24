import 'widgets/excursionSheet/editor';

import {renderChapterConfigurationEditor} from 'pageflow-scrolled/testHelpers';
import {renderWidgetConfigurationEditor, useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';
import '@testing-library/jest-dom/extend-expect';

describe('excursionSheet widget type', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'en.pageflow_scrolled.public.exit_excursion': 'Exit excursion',
    'de.pageflow_scrolled.public.exit_excursion': 'Exkurs verlassen',
    'en.pageflow.ui.views.inputs.select_input_view.placeholder': 'Default (%{text})',
    'en.pageflow.editor.widgets.attributes.excursionSheet.returnButtonLabel.label':
      'Default return button label',
    'en.pageflow_scrolled.editor.edit_chapter.attributes.returnButtonLabel.label':
      'Return button label',
    'en.pageflow_scrolled.editor.edit_chapter.attributes.sheetWidth.label':
      'Overlay width',
    'en.pageflow_scrolled.editor.edit_chapter.attributes.sheetWidth.values.full':
      'Full width',
    'en.pageflow_scrolled.editor.edit_chapter.attributes.sheetWidth.values.inset':
      'With side margins'
  }, {multiLocale: true});

  describe('configuration editor', () => {
    it('uses public default text in entry locale as return button label placeholder', () => {
      const entry = createExcursionEntry({metadata: {locale: 'de'}});
      const {getByRole} = renderWidgetConfigurationEditor({entry, role: 'excursion'});

      expect(getByRole('textbox', {name: 'Default return button label'}))
        .toHaveAttribute('placeholder', 'Exkurs verlassen');
    });
  });

  describe('chapter excursion settings', () => {
    it('use public default text as return button label placeholder', () => {
      const entry = createExcursionEntry({metadata: {locale: 'en'}});
      const {getByRole} = renderChapterConfigurationEditor({entry, chapter: entry.chapters.get(1)});

      expect(getByRole('textbox', {name: 'Return button label'}))
        .toHaveAttribute('placeholder', 'Exit excursion');
    });

    it('use widget return button label as placeholder', () => {
      const entry = createExcursionEntry({
        widgetConfiguration: {returnButtonLabel: 'Back to story'}
      });
      const {getByRole} = renderChapterConfigurationEditor({entry, chapter: entry.chapters.get(1)});

      expect(getByRole('textbox', {name: 'Return button label'}))
        .toHaveAttribute('placeholder', 'Back to story');
    });

    it('offer full sheet width as default', () => {
      const entry = createExcursionEntry();
      const {getByRole} = renderChapterConfigurationEditor({entry, chapter: entry.chapters.get(1)});

      expect(getByRole('combobox', {name: 'Overlay width'}))
        .toHaveDisplayValue('Default (Full width)');
    });

    it('offer widget sheet width as default', () => {
      const entry = createExcursionEntry({widgetConfiguration: {sheetWidth: 'inset'}});
      const {getByRole} = renderChapterConfigurationEditor({entry, chapter: entry.chapters.get(1)});

      expect(getByRole('combobox', {name: 'Overlay width'}))
        .toHaveDisplayValue('Default (With side margins)');
    });
  });

  function createExcursionEntry({metadata, widgetConfiguration = {}} = {}) {
    return createEntry({
      metadata,
      widgets: [{
        role: 'excursion',
        typeName: 'excursionSheet',
        configuration: widgetConfiguration
      }],
      storylines: [
        {id: 100, role: 'main'},
        {id: 200}
      ],
      chapters: [
        {id: 1, storylineId: 200}
      ]
    });
  }
});
