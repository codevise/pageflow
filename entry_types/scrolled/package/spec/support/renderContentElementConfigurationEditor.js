import {editor} from 'pageflow-scrolled/editor';
import {ConfigurationEditorTabView} from 'pageflow/ui';
import {ConfigurationEditor, renderBackboneView} from 'pageflow/testHelpers';

import {EditContentElementView} from 'editor/views/EditContentElementView';

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
