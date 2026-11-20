import {editor, EditContentElementView} from 'pageflow-scrolled/editor';
import {ConfigurationEditorTabView} from 'pageflow/ui';
import {renderConfigurationEditorView} from 'pageflow/testHelpers';

/**
 * Render the configuration editor of a content element. Content element
 * packs can use this to assert how their editor integration behaves.
 *
 * Returns the queries of `@testing-library/dom` and the
 * `inputPropertyNameQueries` of `pageflow/testHelpers` bound to the
 * configuration editor, and the configuration editor element as
 * `container`.
 *
 * @param {Object} options
 * @param {Object} options.entry - Entry the content element belongs to.
 * @param {Object} options.contentElement - Content element to configure.
 *
 * @example
 * import {renderContentElementConfigurationEditor} from 'pageflow-scrolled/testHelpers';
 *
 * const {getByRole, queryByInputPropertyName} =
 *   renderContentElementConfigurationEditor({entry, contentElement});
 *
 * expect(getByRole('textbox', {name: 'Caption'})).toBeInTheDocument();
 * expect(queryByInputPropertyName('marqueeSpeed')).toBeNull();
 */
export function renderContentElementConfigurationEditor({entry, contentElement}) {
  // Normally contributed by the text inline file rights widget type
  // once the widgets of the entry have been set up.
  ConfigurationEditorTabView.groups.define(
    'ContentElementInlineFileRightsSettings', () => {}
  );

  return renderConfigurationEditorView(new EditContentElementView({
    model: contentElement,
    editor,
    entry
  }));
}
