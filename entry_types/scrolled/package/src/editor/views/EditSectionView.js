import {EditConfigurationView, FileInputView, ColorInputView} from 'pageflow/editor';
import {
  SelectInputView,
  CheckBoxInputView,
  SeparatorView,
  SliderInputView
} from 'pageflow/ui';
import {EffectListInputView} from './inputs/EffectListInputView';
import I18n from 'i18n-js';

import {EditMotifAreaDialogView} from './EditMotifAreaDialogView';

export const EditSectionView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_section',

  configure: function(configurationEditor) {
    const entry = this.options.entry;

    const editMotifAreaMenuItem = {
      name: 'editMotifArea',
      label: I18n.t('pageflow_scrolled.editor.edit_section.edit_motif_area'),

      selected({inputModel, propertyName, file}) {
        EditMotifAreaDialogView.show({
          model: inputModel,
          propertyName,
          file
        });
      }
    };

    configurationEditor.tab('section', function() {
      this.input('fullHeight', CheckBoxInputView);

      this.input('backdropType', SelectInputView, {
        values: ['image', 'video', 'color'],
      });
      this.input('backdropImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'image',
        positioning: false,
        dropDownMenuItems: [editMotifAreaMenuItem]
      });
      this.input('backdropVideo', FileInputView, {
        collection: 'video_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'video',
        positioning: false,
        dropDownMenuItems: [editMotifAreaMenuItem]
      });
      this.input('backdropEffects', EffectListInputView, {
        visibleBinding: ['backdropType', 'backdropImage'],
        visible: ([backdropType]) =>
          (backdropType === 'image' &&
           this.model.getReference('backdropImage',
                                   'image_files')) ||
          (backdropType === 'video' &&
           this.model.getReference('backdropVideo',
                                   'video_files'))
      });
      this.input('backdropImageMobile', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'image',
        positioning: false,
        dropDownMenuItems: [editMotifAreaMenuItem]
      });
      this.input('backdropVideoMobile', FileInputView, {
        collection: 'video_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'video',
        positioning: false,
        dropDownMenuItems: [editMotifAreaMenuItem]
      });
      this.input('backdropEffectsMobile', EffectListInputView, {
        visibleBinding: ['backdropType', 'backdropImageMobile'],
        visible: ([backdropType]) =>
          (backdropType === 'image' &&
           this.model.getReference('backdropImageMobile',
                                   'image_files')) ||
          (backdropType === 'video' &&
           this.model.getReference('backdropVideoMobile',
                                   'video_files'))
      });
      this.input('backdropColor', ColorInputView, {
        visibleBinding: 'backdropType',
        visibleBindingValue: 'color'
      });

      this.view(SeparatorView);

      this.input('layout', SelectInputView, {
        values: ['left', 'right', 'center', 'centerRagged']
      });
      if (entry.supportsSectionWidths()) {
        this.input('width', SelectInputView, {
          values: ['wide', 'narrow']
        });
      }
      this.input('appearance', SelectInputView, {
        values: ['shadow', 'cards', 'transparent']
      });
      this.input('invert', CheckBoxInputView);
      this.input('exposeMotifArea', CheckBoxInputView, {
        displayUncheckedIfDisabled: true,
        visibleBinding: ['backdropType'],
        visible: ([backdropType]) => {
          return backdropType !== 'color';
        },
        disabledBinding: motifAreaDisabledBinding,
        disabled: motifAreaDisabled,
      });
      this.input('staticShadowOpacity', SliderInputView, {
        defaultValue: 70,
        visibleBinding: 'appearance',
        visible: appearance => !appearance || appearance === 'shadow',
      });
      this.input('dynamicShadowOpacity', SliderInputView, {
        defaultValue: 70,
        visibleBinding: ['backdropType', 'appearance'],
        visible: ([backdropType, appearance]) => {
          return backdropType !== 'color' &&
                 (!appearance || appearance === 'shadow');
        },
        disabledBinding: ['exposeMotifArea', ...motifAreaDisabledBinding],
        disabled: ([exposeMotifArea, ...motifAreaDisabledBindingValues]) =>
          !exposeMotifArea || motifAreaDisabled(motifAreaDisabledBindingValues)
      });

      this.view(SeparatorView);

      this.input('atmoAudioFileId', FileInputView, {
        collection: 'audio_files',
        fileSelectionHandler: 'sectionConfiguration',
        positioning: false
      });
    });
  }
});

const motifAreaDisabledBinding = [
  'backdropType',
  'backdropImageMotifArea', 'backdropImageMobileMotifArea', 'backdropVideoMotifArea',
  'backdropImage', 'backdropImageMobile', 'backdropVideo'
];

function motifAreaDisabled([
  backdropType,
  backdropImageMotifArea, backdropImageMobileMotifArea, backdropVideoMotifArea,
  backdropImage, backdropImageMobile, backdropVideo
]) {
  if (backdropType === 'video') {
    return !backdropVideo || !backdropVideoMotifArea;
  }
  else if (backdropType !== 'color') {
    return (!backdropImage || !backdropImageMotifArea) &&
           (!backdropImageMobile || !backdropImageMobileMotifArea);
  }

  return true;
}
