import {editor, EditContentElementView} from 'pageflow-scrolled/editor';
import {ConfigurationEditorTabView} from 'pageflow/ui';
import {ConfigurationEditor, renderBackboneView} from 'pageflow/testHelpers';

/**
 * Render the configuration editor of a content element. Content element
 * packs can use this to assert how their editor integration behaves.
 *
 * @param {Object} options
 * @param {Object} options.entry - Entry the content element belongs to.
 * @param {Object} options.contentElement - Content element to configure.
 *
 * @example
 * import {renderContentElementConfigurationEditor} from 'pageflow-scrolled/testHelpers';
 */
export function renderContentElementConfigurationEditor({entry, contentElement}) {
  // Normally contributed by the text inline file rights widget type
  // once the widgets of the entry have been set up.
  ConfigurationEditorTabView.groups.define(
    'ContentElementInlineFileRightsSettings', () => {}
  );

  const view = new EditContentElementView({
    model: contentElement,
    editor,
    entry
  });

  renderBackboneView(view);

  return ConfigurationEditor.find(view);
}
