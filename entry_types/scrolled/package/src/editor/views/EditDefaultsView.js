import I18n from 'i18n-js';
import {EditConfigurationView, InfoBoxView} from 'pageflow/editor';
import {CheckBoxInputView, SelectInputView, SliderInputView} from 'pageflow/ui';
import {editor} from '../api';
import {createDefaultsEntry} from '../models/createDefaultsEntry';
import {ContentElementTypeSeparatorView} from './ContentElementTypeSeparatorView';
import {SectionPaddingVisualizationView} from './inputs/SectionPaddingVisualizationView';

import defaultPictogram from './images/defaultPictogram.svg';
import paddingTopIcon from './images/paddingTop.svg';
import paddingBottomIcon from './images/paddingBottom.svg';

export const EditDefaultsView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_defaults',
  goBackPath: '/meta_data/widgets',

  configure: function(configurationEditor) {
    defineEntryDefaultsInputs(configurationEditor, {
      entry: this.options.entry,
      renderInfoBox
    });
  }
});

export function defineEntryDefaultsInputs(configurationEditor, {
  entry,
  model,
  renderInfoBox = () => {}
}) {
  configurationEditor.tab('sections', {model}, function() {
    renderInfoBox(this, 'sections');

    this.input('defaultSectionLayout', SelectInputView, {
      values: ['left', 'right', 'center', 'centerRagged']
    });

    this.input('defaultSectionAppearance', SelectInputView, {
      values: ['shadow', 'cards', 'transparent']
    });

    const paddingTopScale = entry.getScale('sectionPaddingTop');
    const paddingBottomScale = entry.getScale('sectionPaddingBottom');

    this.input('topPaddingVisualization', SectionPaddingVisualizationView, {
      variant: 'topPadding'
    });
    this.input('defaultSectionPaddingTop', SliderInputView, {
      hideLabel: true,
      icon: paddingTopIcon,
      values: paddingTopScale.values,
      texts: paddingTopScale.texts,
      defaultValue: paddingTopScale.defaultValue
    });

    this.input('bottomPaddingVisualization', SectionPaddingVisualizationView, {
      variant: 'bottomPadding'
    });
    this.input('defaultSectionPaddingBottom', SliderInputView, {
      hideLabel: true,
      icon: paddingBottomIcon,
      values: paddingBottomScale.values,
      texts: paddingBottomScale.texts,
      defaultValue: paddingBottomScale.defaultValue
    });
  });

  configurationEditor.tab('content_elements', {model}, function() {
    renderInfoBox(this, 'content_elements');

    this.view(ContentElementTypeSeparatorView, {
      typeName: I18n.t('pageflow_scrolled.editor.edit_defaults.all_elements')
    });

    this.input('defaultContentElementFullWidthInPhoneLayout', CheckBoxInputView);

    const [captionVariants, captionVariantTexts] =
      entry.getComponentVariants({name: 'figureCaption'});

    if (captionVariants.length) {
      this.input('defaultCaptionVariant', SelectInputView, {
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' +
                             'common_content_element_attributes.' +
                             'captionVariant.blank',
        values: captionVariants,
        texts: captionVariantTexts
      });
    }

    if (editor.entryType.supportsExtendedFileRights) {
      this.input('defaultFileRightsDisplay', SelectInputView, {
        values: ['credits', 'inline']
      });
    }

    const tabView = this;
    editor.contentElementTypes.toArray().forEach(contentElementType => {
      if (contentElementType.defaultsInputs) {
        tabView.view(ContentElementTypeSeparatorView, {
          pictogram: contentElementType.pictogram || defaultPictogram,
          typeName: contentElementType.displayName
        });

        const context = editor.contentElementTypes.createDefaultsInputContext(
          tabView,
          contentElementType.typeName
        );
        contentElementType.defaultsInputs.call(context);
      }
    });
  });
}

export function defineEntryDefaultsInputsFromSeed(configurationEditor, {
  seed,
  themeName,
  model,
  renderInfoBox
}) {
  defineEntryDefaultsInputs(configurationEditor, {
    entry: createDefaultsEntry({seed, themeName}),
    model,
    renderInfoBox
  });
}

function renderInfoBox(tab, name) {
  tab.view(InfoBoxView, {
    text: I18n.t(`pageflow_scrolled.editor.edit_defaults.${name}_info`),
    level: 'info'
  });
}
