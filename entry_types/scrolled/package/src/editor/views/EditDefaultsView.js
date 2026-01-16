import I18n from 'i18n-js';
import {EditConfigurationView, InfoBoxView} from 'pageflow/editor';
import {CheckBoxInputView, SelectInputView, SliderInputView} from 'pageflow/ui';
import {features} from 'pageflow/frontend';

import {editor} from '../api';
import {ContentElementTypeSeparatorView} from './ContentElementTypeSeparatorView';
import {SectionPaddingVisualizationView} from './inputs/SectionPaddingVisualizationView';

import defaultPictogram from './images/defaultPictogram.svg';
import paddingTopIcon from './images/paddingTop.svg';
import paddingBottomIcon from './images/paddingBottom.svg';

export const EditDefaultsView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_defaults',
  goBackPath: '/meta_data/widgets',

  configure: function(configurationEditor) {
    const entry = this.options.entry;

    configurationEditor.tab('sections', function() {
      this.view(InfoBoxView, {
        text: I18n.t('pageflow_scrolled.editor.edit_defaults.sections_info'),
        level: 'info'
      });

      this.input('defaultSectionLayout', SelectInputView, {
        values: ['left', 'right', 'center', 'centerRagged']
      });

      if (features.isEnabled('section_paddings')) {
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
      }
    });

    configurationEditor.tab('content_elements', function() {
      this.view(InfoBoxView, {
        text: I18n.t('pageflow_scrolled.editor.edit_defaults.content_elements_info'),
        level: 'info'
      });

      this.view(ContentElementTypeSeparatorView, {
        typeName: I18n.t('pageflow_scrolled.editor.edit_defaults.all_elements')
      });

      this.input('defaultContentElementFullWidthInPhoneLayout', CheckBoxInputView);

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
});
