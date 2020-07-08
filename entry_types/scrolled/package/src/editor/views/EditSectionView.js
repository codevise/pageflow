import {EditConfigurationView, FileInputView, ColorInputView} from 'pageflow/editor';
import {SelectInputView, CheckBoxInputView} from 'pageflow/ui';
import I18n from 'i18n-js';

import {EditMotifAreaDialogView} from './EditMotifAreaDialogView';

export const EditSectionView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_section',

  configure: function(configurationEditor) {
    configurationEditor.tab('section', function() {
      this.input('layout', SelectInputView, {
        values: ['left', 'right', 'center']
      });
      this.input('appearance', SelectInputView, {
        values: ['shadow', 'cards', 'transparent']
      });
      this.input('backdropType', SelectInputView, {
        values: ['image', 'color', 'video'],
        texts: ['Bild', 'Farbe', 'Video']
      });
      this.input('backdropImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'image',
        positioning: false,
        dropDownMenuItems: [
          {
            name: 'editMofifArea',
            label: I18n.t('pageflow_scrolled.editor.edit_section.edit_motif_area'),

            selected({inputModel, propertyName, file}) {
              EditMotifAreaDialogView.show({
                model: inputModel,
                propertyName,
                file
              });
            }
          }
        ]
      });
      this.input('backdropImageMobile', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'image',
        positioning: false,
        dropDownMenuItems: [
          {
            name: 'editMofifArea',
            label: I18n.t('pageflow_scrolled.editor.edit_section.edit_motif_area'),

            selected({inputModel, propertyName, file}) {
              EditMotifAreaDialogView.show({
                model: inputModel,
                propertyName,
                file
              });
            }
          }
        ]
      });
      this.input('backdropColor', ColorInputView, {
        visibleBinding: 'backdropType',
        visibleBindingValue: 'color'
      });
      this.input('backdropVideo', FileInputView, {
        collection: 'video_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'video',
        positioning: false
      });
      this.input('invert', CheckBoxInputView);
      this.input('fullHeight', CheckBoxInputView);
      
      this.input('atmoAudioFileId', FileInputView, {
        collection: 'audio_files',
        fileSelectionHandler: 'sectionConfiguration',
        positioning: false
      });
    });
  }
});
