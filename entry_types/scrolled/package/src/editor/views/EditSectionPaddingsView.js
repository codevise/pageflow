import Backbone from 'backbone';
import I18n from 'i18n-js';

import {EditConfigurationView, SeparatorView} from 'pageflow/editor';
import {SliderInputView, RadioButtonGroupInputView, CheckBoxInputView, SelectInputView} from 'pageflow/ui';

import {getAppearanceSectionScopeName} from 'pageflow-scrolled/frontend';
import {SectionPaddingVisualizationView} from './inputs/SectionPaddingVisualizationView';
import {EditMotifAreaInputView} from './inputs/EditMotifAreaInputView';
import paddingTopIcon from './images/paddingTop.svg';
import paddingBottomIcon from './images/paddingBottom.svg';
import styles from './EditSectionPaddingsView.module.css';

const i18nPrefix = 'pageflow_scrolled.editor.edit_section_paddings';

export const EditSectionPaddingsView = EditConfigurationView.extend({
  translationKeyPrefix: i18nPrefix,
  hideDestroyButton: true,

  className: styles.view,

  goBackPath() {
    return `/scrolled/sections/` + this.model.get('id')
  },

  defaultTab() {
    if (this.options.entry.get('emulation_mode') === 'phone') {
      return 'portrait';
    }
  },

  configure: function(configurationEditor) {
    const entry = this.options.entry;
    const section = this.model;
    const configuration = section.configuration;
    const backdrop = configuration.getBackdrop();

    const scope = getAppearanceSectionScopeName(configuration.get('appearance'));
    const paddingTopScale = entry.getScale('sectionPaddingTop', {scope});
    const paddingBottomScale = entry.getScale('sectionPaddingBottom', {scope});

    const hasPortrait = !!backdrop.getFile({portrait: true});

    let transientStateModel = null;

    this.listenTo(backdrop, 'change:motifArea', () => {
      persistMotifBasedPadding();
      configurationEditor.refresh();
    });

    configurationEditor.tab('sectionPaddings', function() {
      if (hasPortrait && entry.has('emulation_mode')) {
        entry.unset('emulation_mode');
      }

      paddingInputs(this);
      remainingVerticalSpaceInputs(this);
    });

    if (hasPortrait) {
      configurationEditor.tab('portrait', function() {
        if (!entry.has('emulation_mode')) {
          entry.set('emulation_mode', 'phone');
        }

        this.listenTo(configuration, 'change:customPortraitPaddings', () => {
          configurationEditor.refresh();
        });

        this.input('samePortraitPaddings', CheckBoxInputView, {
          storeInverted: 'customPortraitPaddings'
        });

        const portraitOptions = configuration.get('customPortraitPaddings') ?
          {paddingTopProperty: 'portraitPaddingTop', paddingBottomProperty: 'portraitPaddingBottom'} :
          {disabled: true};

        paddingInputs(this, {portrait: true, ...portraitOptions});
      });
    }

    function paddingInputs(tab, {
      portrait,
      disabled,
      paddingTopProperty = 'paddingTop',
      paddingBottomProperty = 'paddingBottom'
    } = {}) {
      const backdropFile = backdrop.getFile({portrait});

      if (!backdropFile) {
        simpleTopPaddingInputs(tab, {portrait, disabled, paddingTopProperty});
      }
      else if (backdropHasAnyMotifArea('defined') || backdropHasAnyMotifArea('ignored')) {
        if (!backdropHasAnyMotifArea('defined')) {
          displayAsManualPadding();
        }

        toggleExposeMotifAreaInputs(tab, {portrait, disabled, paddingTopProperty});
      }
      else {
        tab.listenTo(backdropFile, 'change:configuration:ignoreMissingMotif', () => {
          configurationEditor.refresh();
        });

        advertiseMotifAreaInputs(tab, {portrait, disabled, paddingTopProperty});
      }

      bottomPaddingInputs(tab, {portrait, disabled, paddingBottomProperty});
    }

    function remainingVerticalSpaceInputs(tab) {
      tab.view(SeparatorView);

      tab.input('remainingVerticalSpace', SelectInputView, {
        values: ['around', 'above', 'below'],
        defaultValue: 'around',
        disabledBinding: 'fullHeight',
        disabled: fullHeight => !fullHeight
      });
    }

    function simpleTopPaddingInputs(tab, {portrait, disabled, paddingTopProperty, infoText}) {
      tab.input('topPaddingVisualization', SectionPaddingVisualizationView, {
        variant: 'topPadding',
        portrait,
        disabled,
        infoText,
        hideLabel: !!infoText,
      });
      tab.input(paddingTopProperty, SliderInputView, {
        hideLabel: true,
        icon: paddingTopIcon,
        values: paddingTopScale.values,
        texts: paddingTopScale.texts,
        defaultValue: paddingTopScale.defaultValue,
        saveOnSlide: true,
        onInteractionStart: scrollToSectionStart,
        disabled
      });
    }

    function toggleExposeMotifAreaInputs(tab, {portrait, disabled, paddingTopProperty}) {
      tab.input('topPaddingVisualization', SectionPaddingVisualizationView, {
        variant: 'intersectingAuto',
        portrait,
        visibleBinding: 'exposeMotifArea',
        visibleBindingModel: transientStateModel,
        visible: exposeMotifArea => exposeMotifArea,
        disabled
      });
      tab.input('topPaddingVisualization', SectionPaddingVisualizationView, {
        variant: 'intersectingManual',
        portrait,
        visibleBinding: 'exposeMotifArea',
        visibleBindingModel: transientStateModel,
        visible: exposeMotifArea => !exposeMotifArea,
        disabled
      });
      tab.input('exposeMotifArea', RadioButtonGroupInputView, {
        hideLabel: true,
        values: [true, false],
        texts: [
          I18n.t(`${i18nPrefix}.attributes.exposeMotifArea.values.true`),
          I18n.t(`${i18nPrefix}.attributes.exposeMotifArea.values.false`)
        ],
        ...(transientStateModel && {model: transientStateModel}),
        disabled: portrait
      });
      tab.input('editMotifArea', EditMotifAreaInputView, {
        hideLabel: true,
        portrait,
        required: true,
        visibleBinding: 'exposeMotifArea',
        visibleBindingModel: transientStateModel,
        visible: exposeMotifArea => exposeMotifArea
      });

      tab.input('sideBySideVisualization', SectionPaddingVisualizationView, {
        hideLabel: true,
        variant: 'sideBySide',
        portrait,
        infoText: I18n.t(`${i18nPrefix}.side_by_side_info`),
        visibleBinding: ['exposeMotifArea', 'layout'],
        visibleBindingModel: transientStateModel,
        visible: ([exposeMotifArea, layout]) =>
          exposeMotifArea && layout !== 'center' && layout !== 'centerRagged',
        disabled
      });
      tab.input(paddingTopProperty, SliderInputView, {
        hideLabel: true,
        icon: paddingTopIcon,
        values: paddingTopScale.values,
        texts: paddingTopScale.texts,
        defaultValue: paddingTopScale.defaultValue,
        saveOnSlide: true,
        visibleBinding: ['exposeMotifArea', 'layout'],
        visibleBindingModel: transientStateModel,
        visible: ([exposeMotifArea, layout]) =>
          !exposeMotifArea || (layout !== 'center' && layout !== 'centerRagged'),
        onInteractionStart: scrollToSectionStart,
        disabled
      });
    }

    function advertiseMotifAreaInputs(tab, {portrait, disabled, paddingTopProperty}) {
      tab.input('topPaddingVisualization', SectionPaddingVisualizationView, {
        variant: 'intersectingAuto',
        portrait,
        disabled
      });
      tab.input('editMotifArea', EditMotifAreaInputView, {
        hideLabel: true,
        portrait,
        showIgnoreOption: true,
        highlight: 'boxBelow',
        infoText: I18n.t(`${i18nPrefix}.attributes.exposeMotifArea.values.true`)
      });
      simpleTopPaddingInputs(tab, {
        infoText: I18n.t(`${i18nPrefix}.attributes.exposeMotifArea.values.false`),
        portrait,
        disabled,
        paddingTopProperty,
      });
    }

    function bottomPaddingInputs(tab, {portrait, disabled, paddingBottomProperty}) {
      tab.view(SeparatorView);

      tab.input('bottomPaddingVisualization', SectionPaddingVisualizationView, {
        variant: 'bottomPadding',
        portrait,
        disabled
      });
      tab.input(paddingBottomProperty, SliderInputView, {
        hideLabel: true,
        icon: paddingBottomIcon,
        values: paddingBottomScale.values,
        texts: paddingBottomScale.texts,
        defaultValue: paddingBottomScale.defaultValue,
        saveOnSlide: true,
        onInteractionStart: scrollToSectionEnd,
        disabled
      });
    }

    function backdropHasAnyMotifArea(status) {
      return backdrop.getMotifAreaStatus({portrait: false}) === status ||
             backdrop.getMotifAreaStatus({portrait: true}) === status;
    }

    function displayAsManualPadding() {
      if (!transientStateModel) {
        transientStateModel = new Backbone.Model({exposeMotifArea: false});
      }
    }

    function persistMotifBasedPadding() {
      if (transientStateModel?.get('exposeMotifArea')) {
        configuration.set('exposeMotifArea', true);
        transientStateModel = null;
      }
    }

    function scrollToSectionStart() {
      entry.trigger('scrollToSection', section, {ifNeeded: true});
    }

    function scrollToSectionEnd() {
      entry.trigger('scrollToSection', section, {align: 'nearEnd', ifNeeded: true});
    }
  }
});
