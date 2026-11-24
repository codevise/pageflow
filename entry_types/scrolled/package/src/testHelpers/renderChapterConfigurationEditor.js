import {EditChapterView} from 'pageflow-scrolled/editor';
import {ConfigurationEditorTabView} from 'pageflow/ui';
import {renderConfigurationEditorView} from 'pageflow/testHelpers';

/**
 * Render the configuration editor of a chapter including tab view
 * groups contributed by the widgets of the entry. Widget packs can use
 * this to assert how their editor integration behaves.
 *
 * Returns the same queries and `container` as
 * {@link renderContentElementConfigurationEditor}.
 *
 * @param {Object} options
 * @param {Object} options.entry - Entry the chapter belongs to.
 * @param {Object} options.chapter - Chapter to configure.
 *
 * @example
 * import {renderChapterConfigurationEditor} from 'pageflow-scrolled/testHelpers';
 */
export function renderChapterConfigurationEditor({entry, chapter}) {
  entry.widgets.setupConfigurationEditorTabViewGroups(ConfigurationEditorTabView.groups);

  return renderConfigurationEditorView(new EditChapterView({
    model: chapter,
    entry
  }));
}
