import {EditConfigurationView, FileInputView, ColorInputView} from 'pageflow/editor';
import {SelectInputView, CheckBoxInputView} from 'pageflow/ui';

export const EditSectionView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_section',

  configure: function(configurationEditor) {
    configurationEditor.tab('section', function() {
      this.input('layout', SelectInputView, {
        values: ['left', 'right', 'center']
      });
      this.input('backdropType', SelectInputView, {
        values: ['image', 'color'],
        texts: ['Bild', 'Farbe']
      });
      this.input('backdropImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'image'
      });
      this.input('backdropImage', ColorInputView, {
        visibleBinding: 'backdropType',
        visibleBindingValue: 'color'
      });
      this.input('invert', CheckBoxInputView);
    });
  }
});
