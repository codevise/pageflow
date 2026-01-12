import I18n from 'i18n-js';
import {EditConfigurationView, InfoBoxView} from 'pageflow/editor';
import {SelectInputView, SliderInputView} from 'pageflow/ui';
import {features} from 'pageflow/frontend';

import {SectionPaddingVisualizationView} from './inputs/SectionPaddingVisualizationView';

import paddingTopIcon from './images/paddingTop.svg';
import paddingBottomIcon from './images/paddingBottom.svg';

export const EditDefaultsView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_defaults',
  hideDestroyButton: true,
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
  }
});
