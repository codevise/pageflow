import {editor} from 'pageflow-scrolled/editor';
import {CheckBoxInputView} from 'pageflow/ui';

editor.widgetTypes.register('textInlineFileRights', {
  configurationEditorTabViewGroups: {
    ContentElementInlineFileRightsSettings: function({disableWhenNoFileRights = true}) {
      this.input('showTextInlineFileRightsBackdrop', CheckBoxInputView, {
        disabledBindingModel: this.model.parent.transientState,
        disabledBinding: 'hasFileRights',
        disabled: hasFileRights => disableWhenNoFileRights && !hasFileRights,
        displayUncheckedIfDisabled: true,
        attributeTranslationKeyPrefixes: [
          'pageflow_scrolled.editor.content_element_text_inline_file_rights_attributes'
        ],
      });
    }
  }
});
