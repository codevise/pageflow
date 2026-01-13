import {EditConfigurationView, FileInputView, ColorInputView} from 'pageflow/editor';
import {
  SelectInputView,
  CheckBoxInputView,
  SeparatorView,
  SliderInputView
} from 'pageflow/ui';
import {BackdropContentElementInputView} from './inputs/BackdropContentElementInputView';
import {EditMotifAreaInputView} from './inputs/EditMotifAreaInputView';
import {EffectListInputView} from './inputs/EffectListInputView';
import {SectionPaddingsInputView} from './inputs/SectionPaddingsInputView';
import {InlineFileRightsMenuItem} from '../models/InlineFileRightsMenuItem'
import {createSectionMenuItems} from '../models/SectionMenuItems';
import I18n from 'i18n-js';
import {features} from 'pageflow/frontend';

import {EditMotifAreaDialogView} from './EditMotifAreaDialogView';

export const EditSectionView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_section',

  getActionsMenuItems() {
    return [
      ...createSectionMenuItems({entry: this.options.entry, section: this.model}),
      this.getDestroyMenuItem()
    ];
  },

  configure: function(configurationEditor) {
    const entry = this.options.entry;
    const editor = this.options.editor;

    const editMotifAreaMenuItem = {
      name: 'editMotifArea',
      label: I18n.t('pageflow_scrolled.editor.edit_motif_area_menu_item'),

      selected({inputModel, propertyName, file}) {
        EditMotifAreaDialogView.show({
          model: inputModel,
          propertyName,
          file
        });
      }
    };

    configurationEditor.tab('section', function() {
      this.input('backdropType', SelectInputView, {
        values: features.isEnabled('backdrop_content_elements') ?
                ['image', 'video', 'color', 'contentElement'] :
                ['image', 'video', 'color'],
      });

      this.input('fullHeight', CheckBoxInputView, {
        disabledBinding: 'backdropType',
        disabled: backdropType => backdropType === 'contentElement',
        displayCheckedIfDisabled: true
      });

      if (features.isEnabled('backdrop_size')) {
        this.input('backdropSize', SelectInputView, {
          visibleBinding: 'backdropType',
          visible: backdropType => backdropType === 'image' ||
                                 backdropType === 'video',
          values: ['coverViewport', 'coverSection']
        });
      }

      this.input('backdropImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'image',
        positioning: false,
        dropDownMenuItems: [editMotifAreaMenuItem, InlineFileRightsMenuItem],
        dropDownMenuName: 'backdropImageFileInput'
      });
      this.input('backdropVideo', FileInputView, {
        collection: 'video_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'video',
        positioning: false,
        dropDownMenuItems: [editMotifAreaMenuItem, InlineFileRightsMenuItem]
      });
      this.input('editMotifArea', EditMotifAreaInputView, {
        infoText: I18n.t('pageflow_scrolled.editor.edit_section.motif_area_info_text'),
        hideLabel: true,
        showIgnoreOption: true,
        onlyShowWhenMissing: true,
        highlight: 'boxWithArrow'
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
        dropDownMenuItems: [editMotifAreaMenuItem, InlineFileRightsMenuItem]
      });
      this.input('backdropVideoMobile', FileInputView, {
        collection: 'video_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'video',
        positioning: false,
        dropDownMenuItems: [editMotifAreaMenuItem, InlineFileRightsMenuItem]
      });
      this.input('editMotifArea', EditMotifAreaInputView, {
        portrait: true,
        infoText: I18n.t('pageflow_scrolled.editor.edit_section.motif_area_info_text'),
        hideLabel: true,
        showIgnoreOption: true,
        onlyShowWhenMissing: true,
        highlight: 'boxWithArrow'
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
        visibleBindingValue: 'color',
        swatches: entry.getUsedSectionBackgroundColors()
      });

      this.input('backdropContentElement', BackdropContentElementInputView, {
        editor,
        entry,
        visibleBinding: 'backdropType',
        visibleBindingValue: 'contentElement'
      });

      this.view(SeparatorView);

      this.input('layout', SelectInputView, {
        values: ['left', 'right', 'center', 'centerRagged']
      });

      if (features.isEnabled('section_paddings')) {
        this.input('sectionPaddings', SectionPaddingsInputView, {
          entry
        });
      }

      if (entry.supportsSectionWidths()) {
        this.input('width', SelectInputView, {
          values: ['wide', 'narrow']
        });
      }
      this.input('appearance', SelectInputView, {
        values: ['shadow', 'cards', 'transparent']
      });
      this.input('invert', CheckBoxInputView);

      if (!features.isEnabled('section_paddings')) {
        this.input('exposeMotifArea', CheckBoxInputView, {
          displayUncheckedIfDisabled: true,
          visibleBinding: ['backdropType'],
          visible: ([backdropType]) => {
            return backdropType !== 'color' && backdropType !== 'contentElement';
          },
          disabledBinding: motifAreaDisabledBinding,
          disabled: motifAreaDisabled,
        });
      }

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
        disabledBinding: ['backdropType', 'exposeMotifArea', ...motifAreaDisabledBinding],
        disabled: ([backdropType, exposeMotifArea, ...motifAreaDisabledBindingValues]) =>
          (!exposeMotifArea || motifAreaDisabled(motifAreaDisabledBindingValues)) && backdropType !== 'contentElement'
      });

      if (features.isEnabled('custom_palette_colors')) {
        this.input('cardSurfaceColor', ColorInputView, {
          visibleBinding: 'appearance',
          visibleBindingValue: 'cards',
          placeholder: I18n.t('pageflow_scrolled.editor.edit_section.attributes.cardSurfaceColor.auto'),
          placeholderColorBinding: 'invert',
          placeholderColor: invert => invert ? '#101010' : '#ffffff',
          swatches: entry.getUsedSectionBackgroundColors()
        });
      }

      this.view(SeparatorView);

      this.input('atmoAudioFileId', FileInputView, {
        collection: 'audio_files',
        fileSelectionHandler: 'sectionConfiguration',
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
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
