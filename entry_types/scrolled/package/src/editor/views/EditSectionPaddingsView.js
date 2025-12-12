import I18n from 'i18n-js';

import {EditConfigurationView, SeparatorView} from 'pageflow/editor';
import {SliderInputView, RadioButtonGroupInputView, CheckBoxInputView} from 'pageflow/ui';

import {SectionPaddingVisualizationView} from './inputs/SectionPaddingVisualizationView';
import {EditMotifAreaInputView} from './inputs/EditMotifAreaInputView';
import paddingTopIcon from './images/paddingTop.svg';
import paddingBottomIcon from './images/paddingBottom.svg';
import styles from './EditSectionPaddingsView.module.css';

const i18nPrefix = 'pageflow_scrolled.editor.edit_section_paddings';

export const EditSectionPaddingsView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_section_paddings',
  hideDestroyButton: true,

  className: styles.view,

  goBackPath() {
    return `/scrolled/sections/` + this.model.get('id')
  },

  configure: function(configurationEditor) {
    const entry = this.options.entry;
    const section = this.model;
    const configuration = section.configuration;

    const [paddingTopValues, paddingTopTexts] = entry.getScale('sectionPaddingTop');
    const [paddingBottomValues, paddingBottomTexts] = entry.getScale('sectionPaddingBottom');

    configurationEditor.tab('sectionPaddings', function() {
      paddingInputs(this, {entry, section, paddingTopValues, paddingTopTexts, paddingBottomValues, paddingBottomTexts});
    });

    if (!hasPortraitBackdrop(configuration)) {
      return;
    }

    configurationEditor.tab('portrait', function() {
      this.listenTo(this.model, 'change:customPortraitPaddings', () => {
        configurationEditor.refresh();
      });

      this.input('samePortraitPaddings', CheckBoxInputView, {
        storeInverted: 'customPortraitPaddings'
      });

      const usePortraitProperties = this.model.get('customPortraitPaddings');

      paddingInputs(this, {
        entry,
        section,
        prefix: usePortraitProperties ? 'portrait' : '',
        portrait: true,
        paddingTopValues, paddingTopTexts, paddingBottomValues, paddingBottomTexts,
        disabledOptions: usePortraitProperties ? {} : {disabled: true}
      });
    });
  }
});

function paddingInputs(tab, options) {
  const {
    entry,
    section,
    prefix = '',
    portrait = false,
    paddingTopValues, paddingTopTexts, paddingBottomValues, paddingBottomTexts,
    disabledOptions
  } = options;

  const paddingTopProperty = prefix ? `${prefix}PaddingTop` : 'paddingTop';
  const paddingBottomProperty = prefix ? `${prefix}PaddingBottom` : 'paddingBottom';
  const exposeMotifArea = prefix ? `${prefix}ExposeMotifArea` : 'exposeMotifArea';

  const scrollToSectionStart = () => entry.trigger('scrollToSection', section, {ifNeeded: true});
  const scrollToSectionEnd = () => entry.trigger('scrollToSection', section, {align: 'nearEnd', ifNeeded: true});

  tab.input('topPaddingVisualization', SectionPaddingVisualizationView, {
    variant: 'intersectingAuto',
    portrait,
    visibleBinding: [exposeMotifArea, ...motifAreaBinding],
    visible: ([exposeMotifAreaValue, ...motifAreaValues]) =>
      exposeMotifAreaValue && !motifAreaUnavailable(motifAreaValues),
    ...disabledOptions
  });
  tab.input('topPaddingVisualization', SectionPaddingVisualizationView, {
    variant: 'intersectingManual',
    portrait,
    visibleBinding: [exposeMotifArea, ...motifAreaBinding],
    visible: ([exposeMotifAreaValue, ...motifAreaValues]) =>
      !exposeMotifAreaValue && !motifAreaUnavailable(motifAreaValues),
    ...disabledOptions
  });
  tab.input('topPaddingVisualization', SectionPaddingVisualizationView, {
    variant: 'topPadding',
    portrait,
    visibleBinding: motifAreaBinding,
    visible: motifAreaUnavailable,
    ...disabledOptions
  });
  tab.input(exposeMotifArea, RadioButtonGroupInputView, {
    hideLabel: true,
    values: [true, false],
    texts: [
      I18n.t(`${i18nPrefix}.attributes.exposeMotifArea.values.true`),
      I18n.t(`${i18nPrefix}.attributes.exposeMotifArea.values.false`)
    ],
    visibleBinding: motifAreaBinding,
    visible: values => !motifAreaUnavailable(values),
    ...disabledOptions
  });
  tab.input('editMotifArea', EditMotifAreaInputView, {
    hideLabel: true,
    portrait,
    visibleBinding: [exposeMotifArea, ...motifAreaBinding],
    visible: ([exposeMotifAreaValue, ...motifAreaValues]) =>
      exposeMotifAreaValue && !motifAreaUnavailable(motifAreaValues)
  });

  const imageMotifAreaPropertyName = portrait ? 'backdropImageMobileMotifArea' : 'backdropImageMotifArea';
  const videoMotifAreaPropertyName = portrait ? 'backdropVideoMobileMotifArea' : 'backdropVideoMotifArea';
  const motifAreaNotDefinedBinding = [
    exposeMotifArea, 'backdropType', imageMotifAreaPropertyName, videoMotifAreaPropertyName
  ];

  tab.input('sideBySideVisualization', SectionPaddingVisualizationView, {
    hideLabel: true,
    variant: 'sideBySide',
    portrait,
    infoText: I18n.t(`${i18nPrefix}.side_by_side_info`),
    visibleBinding: [exposeMotifArea, 'layout', ...motifAreaBinding],
    visible: ([exposeMotifAreaValue, layout, ...motifAreaValues]) =>
      exposeMotifAreaValue &&
      layout !== 'center' &&
      layout !== 'centerRagged' &&
      !motifAreaUnavailable(motifAreaValues),
    disabledBinding: motifAreaNotDefinedBinding,
    disabled: motifAreaNotDefined
  });

  tab.input(paddingTopProperty, SliderInputView, {
    hideLabel: true,
    icon: paddingTopIcon,
    texts: paddingTopTexts,
    values: paddingTopValues,
    saveOnSlide: true,
    onInteractionStart: scrollToSectionStart,
    disabledBinding: motifAreaNotDefinedBinding,
    disabled: motifAreaNotDefined,
    ...disabledOptions
  });

  tab.view(SeparatorView);

  tab.input('bottomPaddingVisualization', SectionPaddingVisualizationView, {
    variant: 'bottomPadding',
    portrait,
    ...disabledOptions
  });
  tab.input(paddingBottomProperty, SliderInputView, {
    hideLabel: true,
    icon: paddingBottomIcon,
    texts: paddingBottomTexts,
    values: paddingBottomValues,
    saveOnSlide: true,
    onInteractionStart: scrollToSectionEnd,
    ...disabledOptions
  });
}

const motifAreaBinding = ['backdropType'];

function motifAreaUnavailable([backdropType]) {
  return backdropType === 'color';
}

function motifAreaNotDefined([exposeMotifAreaValue, backdropType, imageMotifArea, videoMotifArea]) {
  if (backdropType === 'color') {
    return false;
  }

  const motifArea = backdropType === 'video' ? videoMotifArea : imageMotifArea;
  return exposeMotifAreaValue && !motifArea;
}

function hasPortraitBackdrop(configuration) {
  const backdropType = configuration.get('backdropType');

  if (backdropType === 'color') {
    return false;
  }

  const propertyName = backdropType === 'video' ? 'backdropVideoMobile' : 'backdropImageMobile';
  const collection = backdropType === 'video' ? 'video_files' : 'image_files';

  return !!configuration.getReference(propertyName, collection);
}
