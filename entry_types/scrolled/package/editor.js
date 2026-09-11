import 'pageflow-scrolled/editor.css';
import 'pageflow-scrolled/review.css';
import { features, browser } from 'pageflow/frontend';
import { inputView, cssModulesUtils, i18nUtils, ColorInputView, attributeBindingUtils, CollectionView, ColorPicker, ConfigurationEditorTabView, SliderInputView, SelectInputView, CheckBoxInputView, Object as Object$1, SortableCollectionView, TextInputView, TextAreaInputView, SeparatorView, RadioButtonGroupInputView, TabsView as TabsView$1, ConfigurationEditorView } from 'pageflow/ui';
import React, { useCallback, forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import classNames from 'classnames';
import Backbone from 'backbone';
import ReactDOM from 'react-dom';
import { Listbox } from '@headlessui/react';
import Marionette from 'backbone.marionette';
import I18n, { t } from 'i18n-js';
import { watchCollections, collectionsSnapshot, normalizeSectionConfigurationData, EntryStateProvider, useEntryStateDispatch } from 'pageflow-scrolled/entryState';
import { StandaloneSectionThumbnail, getViewTimelineProgress, getAvailableTransitionNames, utils, getAppearanceSectionScopeName } from 'pageflow-scrolled/frontend';
import 'jquery-ui';
import * as globalInterop from 'pageflow/editor';
import { DropDownButtonView, editor as editor$1, configurationContainer, ForeignKeySubsetCollection, entryTypeEditorControllerUrls, orderedCollection, Configuration, delayedDestroying, failureTracking, getLocalStorage, Entry, EditConfigurationView, InfoBoxView, TabsView, app, DestroyMenuItem, modelLifecycleTrackingView, CollectionView as CollectionView$1, cssModulesUtils as cssModulesUtils$1, FileInputView, ColorInputView as ColorInputView$1, SeparatorView as SeparatorView$1 } from 'pageflow/editor';
import { createReviewSession } from 'pageflow/review';
import { watchUnreadComments, ReviewMessageHandler, ReviewStateProvider, LocatedCommentThreadsProvider, ScrollHighlightedThreadIntoViewProvider, useLocatedCommentThreads, ThreadList, matchesResolution, ActivityList, NewThreadForm } from 'pageflow-scrolled/review';
import slugify from 'slugify';
import $ from 'jquery';
import { buttonStyles, editor as editor$2 } from 'pageflow-scrolled/editor';
import _ from 'underscore';

var styles = {"preview":"TypographyVariantSelectInputView-module_preview__12fCl","cardsAppearance":"TypographyVariantSelectInputView-module_cardsAppearance__1bjfD"};

var styles$1 = {"container":"ListboxInputView-module_container__vNkJh","button":"ListboxInputView-module_button__3ZTnw","options":"ListboxInputView-module_options__Yp2CJ","option":"ListboxInputView-module_option__2Umwh","activeOption":"ListboxInputView-module_activeOption__Mo1YN"};

const ListboxInputView = Marionette.ItemView.extend({
  mixins: [inputView],
  className: styles$1.view,
  template: () => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    <div class="${styles$1.container}"></div>
  `,
  ui: cssModulesUtils.ui(styles$1, 'container'),
  modelEvents() {
    return {
      [`change:${this.options.propertyName}`]: 'renderDropdown'
    };
  },
  initialize() {
    if (!this.options.texts) {
      if (!this.options.translationKeys) {
        var translationKeyPrefix = i18nUtils.findKeyWithTranslation(this.attributeTranslationKeys('values'));
        this.options.translationKeys = this.options.values.map(value => translationKeyPrefix + '.' + value);
      }
      this.options.texts = this.options.translationKeys.map(key => I18n.t(key));
    }
    this.items = [...this.options.values.map((value, i) => ({
      value,
      text: this.options.texts[i]
    }))];
    if (this.options.includeBlank) {
      this.items.unshift({
        value: '',
        text: I18n.t(this.options.blankTranslationKey)
      });
    }
  },
  renderSelectedItem(item) {
    return item.text;
  },
  renderItem(item) {
    return item.text;
  },
  onRender() {
    this.renderDropdown();
  },
  updateDisabled() {
    this.renderDropdown();
  },
  renderDropdown(value, text) {
    ReactDOM.render(React.createElement(Dropdown, {
      items: this.items,
      disabled: this.isDisabled(),
      renderSelectedItem: item => this.renderSelectedItem(item),
      renderItem: item => this.renderItem(item),
      selectedItem: this.items.find(item => item.value === (this.model.get(this.options.propertyName) || this.options.defaultValue)) || this.items[0],
      onChange: value => {
        if (this.options.defaultValue && value === this.options.defaultValue) {
          this.model.unset(this.options.propertyName);
        } else {
          this.model.set(this.options.propertyName, value);
        }
      }
    }), this.ui.container[0]);
  }
});
function Dropdown({
  items,
  disabled,
  renderItem,
  renderSelectedItem,
  selectedItem,
  onChange
}) {
  return /*#__PURE__*/React.createElement(Listbox, {
    value: selectedItem.value,
    disabled: disabled,
    onChange: onChange
  }, /*#__PURE__*/React.createElement(Listbox.Button, {
    className: styles$1.button
  }, renderSelectedItem(selectedItem)), /*#__PURE__*/React.createElement(Listbox.Options, {
    className: styles$1.options
  }, items.map(item => /*#__PURE__*/React.createElement(Listbox.Option, {
    key: item.value || 'blank',
    value: item.value
  }, ({
    active
  }) => /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.option, {
      [styles$1.activeOption]: active
    })
  }, renderItem(item))))));
}

const TypographyVariantSelectInputView = ListboxInputView.extend({
  onRender() {
    ListboxInputView.prototype.onRender.call(this);
    this.previewVersion = 0;
    this.setupAttributeBinding('previewConfiguration', () => {
      if (!this.isClosed) {
        this.previewVersion++;
        this.renderDropdown();
      }
    });
  },
  renderItem(item) {
    return /*#__PURE__*/React.createElement(Preview, {
      key: this.previewVersion,
      entry: this.options.entry,
      contentElement: this.options.contentElement,
      item: item,
      getPreviewConfiguration: this.options.getPreviewConfiguration
    });
  }
});
function Preview({
  entry,
  contentElement,
  item,
  getPreviewConfiguration
}) {
  const subscribe = useCallback(dispatch => {
    watchCollections(buildEntry(entry, contentElement, item, getPreviewConfiguration), {
      dispatch
    });
  }, [entry, contentElement, item, getPreviewConfiguration]);
  const appearance = contentElement.section.configuration.get('appearance');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.preview, styles[`${appearance}Appearance`]),
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(StandaloneSectionThumbnail, {
    scale: false,
    seed: entry.scrolledSeed,
    sectionPermaId: 1,
    subscribe: subscribe
  })), item.text);
}
function buildEntry(entry, contentElement, item, getPreviewConfiguration) {
  const section = contentElement.section;
  const fakeContentElement = new Backbone.Model(contentElement.attributes);
  fakeContentElement.configuration = new Backbone.Model(getPreviewConfiguration(contentElement.configuration.attributes, item.value));
  const fakeSection = new Backbone.Model({
    ...section.attributes,
    permaId: 1
  });
  fakeSection.configuration = new Backbone.Model({
    ...section.configuration.attributes,
    transition: 'preview',
    fullHeight: false,
    layout: 'left',
    exposeMotifArea: false,
    paddingTop: 'xxxs',
    backdrop: {
      ...section.configuration.attributes.backdrop,
      imageMotifArea: null,
      imageMobileMotifArea: null,
      videoMotifArea: null
    }
  });
  return {
    id: entry.id,
    metadata: entry.metadata,
    widgets: entry.widgets,
    files: entry.files,
    storylines: entry.storylines,
    chapters: new Backbone.Collection([section.chapter]),
    sections: new Backbone.Collection([fakeSection]),
    contentElements: new Backbone.Collection([fakeContentElement])
  };
}

var styles$2 = {"container":"ColorSelectOrCustomColorInputView-module_container__2PXjM"};

var styles$3 = {"item":"ColorSelectInputView-module_item__1qpQU","swatch":"ColorSelectInputView-module_swatch__36Kqr","text":"ColorSelectInputView-module_text__1wuLd","blank":"ColorSelectInputView-module_blank__16xMd"};

const ColorSelectInputView = ListboxInputView.extend({
  renderItem,
  renderSelectedItem: renderItem
});
function renderItem(item) {
  const swatches = this.options.swatches || [{
    cssColorPropertyPrefix: '--theme-palette-color'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$3.item, {
      [styles$3.blank]: !item.value || item.value === 'custom'
    })
  }, swatches.map((swatch, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: styles$3.swatch,
    style: {
      '--color': `var(${swatch.cssColorPropertyPrefix}-${item.value})`
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: styles$3.text
  }, item.text));
}

const ColorSelectOrCustomColorInputView = Marionette.View.extend({
  mixins: [inputView],
  className: styles$2.container,
  initialize() {
    const value = this.model.get(this.options.propertyName);
    this.viewModel = new Backbone.Model((value === null || value === void 0 ? void 0 : value.startsWith('#')) ? {
      value: 'custom',
      color: value
    } : {
      value
    });
    this.listenTo(this.viewModel, `change:value`, (model, value) => {
      if (value === 'custom') {
        this.model.set(this.options.propertyName, model.get('color'));
      } else {
        this.model.set(this.options.propertyName, value);
      }
      this.updateCustomColorInputView();
    });
    this.listenTo(this.viewModel, `change:color`, (model, color) => {
      if (model.get('value') === 'custom') {
        this.model.set(this.options.propertyName, color);
      }
    });
  },
  getBindingOptions() {
    return {
      ...this.getBindingOptionsFor('visible'),
      ...this.getBindingOptionsFor('disabled')
    };
  },
  getBindingOptionsFor(optionName) {
    const result = {};
    const bindingKey = `${optionName}Binding`;
    const bindingValueKey = `${optionName}BindingValue`;
    const bindingModelKey = `${optionName}BindingModel`;
    if (optionName in this.options) {
      result[optionName] = this.options[optionName];
    }
    if (this.options[bindingKey]) {
      result[bindingKey] = this.options[bindingKey];
      result[bindingModelKey] = this.options[bindingModelKey] || this.model;
      if (bindingValueKey in this.options) {
        result[bindingValueKey] = this.options[bindingValueKey];
      }
    }
    return result;
  },
  render() {
    this.colorSelectInputView = new ColorSelectInputView({
      ...this.options,
      ...this.getBindingOptions(),
      label: this.labelText(),
      model: this.viewModel,
      propertyName: 'value',
      values: [...this.options.values, 'custom'],
      texts: [...this.options.texts, I18n.t(this.options.customColorTranslationKey)]
    });
    this.appendSubview(this.colorSelectInputView);
    this.updateCustomColorInputView();
    return this;
  },
  updateCustomColorInputView() {
    const customColor = this.viewModel.get('value') === 'custom';
    if (customColor && !this.colorInputView) {
      this.colorInputView = new ColorInputView({
        ...this.getBindingOptions(),
        model: this.viewModel,
        propertyName: 'color'
      });
      this.appendSubview(this.colorInputView);
    } else if (!customColor && this.colorInputView) {
      this.colorInputView.close();
      this.colorInputView = null;
    }
  }
});

var styles$4 = {"visualization":"ContentElementVisualization-module_visualization__Gl62-","backdropPosition":"ContentElementVisualization-module_backdropPosition__1X1Vi","section":"ContentElementVisualization-module_section__1UG3H","content":"ContentElementVisualization-module_content__25k-f","centerLayout":"ContentElementVisualization-module_centerLayout__2HzeU","block":"ContentElementVisualization-module_block__zOV5n","centerRaggedLayout":"ContentElementVisualization-module_centerRaggedLayout__3xtbL","rightLayout":"ContentElementVisualization-module_rightLayout__2vE_L","textBlock":"ContentElementVisualization-module_textBlock__1am8q","textBlockWord":"ContentElementVisualization-module_textBlockWord__19xZg","leftPosition":"ContentElementVisualization-module_leftPosition__1KDKk","rightPosition":"ContentElementVisualization-module_rightPosition__zoh9C","sidePosition":"ContentElementVisualization-module_sidePosition__1SA1q","wrapper":"ContentElementVisualization-module_wrapper__3n5u-","stickyPosition":"ContentElementVisualization-module_stickyPosition__2VWbn ContentElementVisualization-module_sidePosition__1SA1q","standAlonePosition":"ContentElementVisualization-module_standAlonePosition__1Xh0_","narrowBlock":"ContentElementVisualization-module_narrowBlock__2WKez","scrollRoom":"ContentElementVisualization-module_scrollRoom__3-_pq","viewportCenter":"ContentElementVisualization-module_viewportCenter__1DD07"};

const ContentElementVisualization = forwardRef(function ContentElementVisualization({
  position,
  layout,
  narrowBlock,
  scrollRoom,
  viewportCenter,
  children
}, ref) {
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: classNames(styles$4.visualization, styles$4[`${position}Position`], styles$4[`${layout}Layout`], {
      [styles$4.narrowBlock]: narrowBlock,
      [styles$4.scrollRoom]: scrollRoom
    }),
    "aria-hidden": "true"
  }, viewportCenter && /*#__PURE__*/React.createElement("div", {
    className: styles$4.viewportCenter
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$4.section
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$4.content
  }, /*#__PURE__*/React.createElement(TextBlock, {
    words: 40
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$4.group
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$4.wrapper
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$4.block
  }, children)), /*#__PURE__*/React.createElement("div", {
    className: styles$4.content
  }, /*#__PURE__*/React.createElement(TextBlock, {
    words: 30
  }), /*#__PURE__*/React.createElement(TextBlock, {
    words: 40
  }))), /*#__PURE__*/React.createElement("div", {
    className: styles$4.content
  }, /*#__PURE__*/React.createElement(TextBlock, {
    words: 70
  }))));
});
function TextBlock({
  words
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$4.textBlock
  }, Array(words).fill().map((i, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: styles$4.textBlockWord
  })));
}
function pinsElement(position) {
  return position === 'sticky' || position === 'standAlone';
}
function measureViewTimelineProgress({
  scroller,
  position,
  range
}) {
  const scrollerRect = scroller.getBoundingClientRect();
  const {
    subject,
    element
  } = findViewTimelineElements(scroller, position);
  return getViewTimelineProgress({
    range,
    subjectRect: relativeRect(subject, scrollerRect),
    elementRect: relativeRect(element, scrollerRect),
    viewportHeight: scrollerRect.height
  });
}

// The lifecycle of a content element observes the element's own rect, no
// matter whether something pins it: It turns visible once the rect intersects
// the viewport and active once the rect crosses the center. Offsets are
// fractions of the viewport height, like the root margins of the intersection
// observers behind them.
function measureElementTop({
  scroller,
  position
}) {
  const scrollerRect = scroller.getBoundingClientRect();
  const {
    element
  } = findViewTimelineElements(scroller, position);
  return relativeRect(element, scrollerRect).top / scrollerRect.height;
}
function measureScrollTimeline({
  scroller,
  position,
  until
}) {
  const scrollerRect = scroller.getBoundingClientRect();
  const {
    subject
  } = findViewTimelineElements(scroller, position);
  const subjectRect = subject.getBoundingClientRect();
  const subjectTop = subjectRect.top - scrollerRect.top + scroller.scrollTop;

  // The element has completely left the viewport once its bottom edge has
  // reached the top edge of it.
  const end = until !== null && until !== void 0 ? until : -subjectRect.height / scrollerRect.height;
  return {
    from: Math.max(subjectTop - scrollerRect.height, 0),
    to: subjectTop - scrollerRect.height * end
  };
}
function findViewTimelineElements(scroller, position) {
  if (position === 'sticky') {
    const wrapper = scroller.querySelector(`.${styles$4.wrapper}`);
    return {
      subject: wrapper.parentElement,
      element: wrapper
    };
  } else if (position === 'standAlone') {
    return {
      subject: scroller.querySelector(`.${styles$4.wrapper}`),
      element: scroller.querySelector(`.${styles$4.block}`)
    };
  } else {
    const block = scroller.querySelector(`.${styles$4.block}`);
    return {
      subject: block,
      element: block
    };
  }
}
function relativeRect(node, scrollerRect) {
  const {
    top,
    height
  } = node.getBoundingClientRect();
  return {
    top: top - scrollerRect.top,
    height
  };
}

function useScrollAnimation(ref, {
  scrollTop,
  duration = 3000,
  rest = 0,
  onScroll
}) {
  const callbacksRef = useRef();
  callbacksRef.current = {
    scrollTop,
    onScroll
  };
  useEffect(() => {
    const startTime = new Date().getTime();
    function update() {
      const scroller = ref.current;
      const elapsed = (new Date().getTime() - startTime) % (2 * duration + rest);

      // Capping the way back keeps progress at the end of the animation while
      // it rests there.
      const t = elapsed <= duration ? elapsed / duration : Math.min((2 * duration + rest - elapsed) / duration, 1);
      scroller.scrollTop = callbacksRef.current.scrollTop(scroller, easeInOut(t));
      if (callbacksRef.current.onScroll) {
        callbacksRef.current.onScroll(scroller);
      }
    }

    // Without this the unscrolled preview shows until the first
    // interval elapses.
    update();
    const interval = setInterval(update, 10);
    return () => clearInterval(interval);
  }, [ref, duration, rest]);
}
function easeInOut(t) {
  t = t * 2;
  if (t < 1) return t ** 2 / 2;
  t = t - 1;
  return t - t ** 2 / 2 + 1 / 2;
}

var styles$5 = {"outer":"PositionSelectInputView-module_outer__uPbtA","inlineHelp":"PositionSelectInputView-module_inlineHelp__13pS6"};

const PositionSelectInputView = ListboxInputView.extend({
  renderItem(item) {
    return /*#__PURE__*/React.createElement(Preview$1, {
      item: item,
      layout: this.options.sectionLayout,
      inlineHelpTranslationKeyPrefix: i18nUtils.findKeyWithTranslation(this.attributeTranslationKeys('item_inline_help_texts'))
    });
  }
});
function Preview$1({
  item,
  layout,
  inlineHelpTranslationKeyPrefix
}) {
  const ref = useRef();
  const distance = item.value === 'sticky' || item.value === 'standAlone' ? 200 : 100;
  useScrollAnimation(ref, {
    scrollTop: (scroller, progress) => distance * progress
  });
  return /*#__PURE__*/React.createElement("div", {
    className: styles$5.outer
  }, /*#__PURE__*/React.createElement(ContentElementVisualization, {
    ref: ref,
    position: item.value,
    layout: layout
  }), /*#__PURE__*/React.createElement("span", {
    className: classNames('inline_help', styles$5.inlineHelp)
  }, I18n.t(item.value, {
    scope: inlineHelpTranslationKeyPrefix
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$5.description
  }, item.text));
}

const Style = Backbone.Model.extend({
  initialize({
    name
  }, {
    types,
    bindingModel
  }) {
    this.types = types;
    if (!this.has('value')) {
      this.set('value', this.defaultValue());
    }
    const type = types[name];
    if ((type === null || type === void 0 ? void 0 : type.binding) && bindingModel) {
      attributeBindingUtils.setup({
        binding: type.binding,
        model: bindingModel,
        listener: this,
        option: type.when,
        callback: available => this.set({
          available
        })
      });
    }
  },
  label() {
    var _this$types$name$item;
    const name = this.get('name');
    const label = Style.getLabel(name, this.types);
    const item = (_this$types$name$item = this.types[name].items) === null || _this$types$name$item === void 0 ? void 0 : _this$types$name$item.find(item => this.valueMatches(item.value));
    if (item) {
      return `${label}: ${item.label}`;
    } else {
      return label;
    }
  },
  valueMatches(partial) {
    const value = this.get('value');
    if (partial && typeof partial === 'object') {
      if (!value || typeof value !== 'object') {
        return false;
      }
      return Object.entries(partial).every(([key, expected]) => value[key] === expected);
    }
    return value === partial;
  },
  getColor() {
    return readColor(this.get('value'));
  },
  setColor(color) {
    const value = this.get('value');
    if (value && typeof value === 'object') {
      this.set('value', {
        ...value,
        color
      });
    } else {
      this.set('value', color);
    }
  },
  defaultValue() {
    return this.types[this.get('name')].defaultValue;
  },
  defaultColor() {
    return readColor(this.defaultValue());
  },
  minValue() {
    return this.types[this.get('name')].minValue;
  },
  maxValue() {
    return this.types[this.get('name')].maxValue;
  },
  values() {
    return this.types[this.get('name')].values;
  },
  texts() {
    return this.types[this.get('name')].texts;
  },
  propertyName() {
    return this.types[this.get('name')].propertyName;
  },
  inputType() {
    return this.types[this.get('name')].inputType || 'none';
  },
  inputOptions() {
    return this.types[this.get('name')].inputOptions || {};
  }
});
function readColor(value) {
  if (value && typeof value === 'object') {
    return value.color;
  }
  return value;
}
Style.getLabel = function (name, types) {
  return types[name].label || I18n.t(`pageflow_scrolled.editor.backdrop_effects.${name}.label`);
};
Style.getKind = function (name, types) {
  return types[name].kind;
};
const allEffectTypes = {
  blur: {
    inputType: 'slider',
    minValue: 0,
    maxValue: 100,
    defaultValue: 50,
    kind: 'filter'
  },
  brightness: {
    inputType: 'slider',
    minValue: -100,
    maxValue: 100,
    defaultValue: -20,
    kind: 'filter'
  },
  contrast: {
    inputType: 'slider',
    minValue: -100,
    maxValue: 100,
    defaultValue: 20,
    kind: 'filter'
  },
  grayscale: {
    inputType: 'slider',
    minValue: 0,
    maxValue: 100,
    defaultValue: 100,
    kind: 'filter'
  },
  saturate: {
    inputType: 'slider',
    minValue: -100,
    maxValue: 100,
    defaultValue: 20,
    kind: 'filter'
  },
  sepia: {
    inputType: 'slider',
    minValue: 0,
    maxValue: 100,
    defaultValue: 100,
    kind: 'filter'
  },
  autoZoom: {
    inputType: 'slider',
    minValue: 1,
    maxValue: 100,
    defaultValue: 50,
    kind: 'animation'
  },
  scrollParallax: {
    inputType: 'slider',
    minValue: 0,
    maxValue: 100,
    defaultValue: 50,
    kind: 'animation'
  }
};
Style.getEffectTypes = function ({
  entry
}) {
  const frameType = getBackdropFrameEffectType(entry);
  return {
    ...allEffectTypes,
    ...(frameType && {
      frame: frameType
    })
  };
};
function getBackdropFrameEffectType(entry) {
  const [designs, labels] = entry.getComponentVariants({
    name: 'backdropFrame',
    translationKeysScope: 'backdrop_effects'
  });
  if (designs.length === 0) {
    return null;
  }
  return {
    kind: 'decoration',
    inputType: 'color',
    defaultValue: {
      color: '#ffffff'
    },
    items: designs.map((design, index) => ({
      value: {
        design
      },
      label: labels[index]
    }))
  };
}
Style.getTypesForContentElement = function ({
  entry,
  contentElement
}) {
  const marginScale = entry.getScale('contentElementMargin');
  const defaultConfig = contentElement.getType().defaultConfig || {};
  const result = {};
  const supportedStyles = contentElement.getType().supportedStyles || [];
  function findSupportedStyle(name) {
    return supportedStyles.find(s => s === name || s.name === name);
  }
  function bindingOptions(name) {
    const style = findSupportedStyle(name);
    if (!style || typeof style === 'string') return {};
    const {
      binding,
      when
    } = style;
    return {
      ...(binding && {
        binding,
        when
      })
    };
  }
  if (marginScale.values.length > 0) {
    result.marginTop = {
      kind: 'spacing',
      label: I18n.t('pageflow_scrolled.editor.content_element_style_list_input.marginTop'),
      propertyName: 'marginTop',
      inputType: 'slider',
      values: marginScale.values,
      texts: marginScale.texts,
      defaultValue: marginScale.defaultValue,
      ...('marginTop' in defaultConfig && {
        resetValue: defaultConfig.marginTop
      })
    };
    result.marginBottom = {
      kind: 'spacing',
      label: I18n.t('pageflow_scrolled.editor.content_element_style_list_input.marginBottom'),
      propertyName: 'marginBottom',
      inputType: 'slider',
      values: marginScale.values,
      texts: marginScale.texts,
      defaultValue: marginScale.defaultValue,
      ...('marginBottom' in defaultConfig && {
        resetValue: defaultConfig.marginBottom
      })
    };
  }
  if (findSupportedStyle('boxShadow')) {
    const boxShadowScale = entry.getScale('contentElementBoxShadow');
    if (boxShadowScale.values.length > 0) {
      result.boxShadow = {
        kind: 'decoration',
        label: I18n.t('pageflow_scrolled.editor.content_element_style_list_input.boxShadow'),
        propertyName: 'boxShadow',
        inputType: 'slider',
        values: boxShadowScale.values,
        texts: boxShadowScale.texts,
        defaultValue: boxShadowScale.defaultValue,
        ...bindingOptions('boxShadow')
      };
    }
  }
  if (findSupportedStyle('outline')) {
    var _themeProperties$root;
    const themeProperties = entry.getThemeProperties();
    result.outlineColor = {
      kind: 'decoration',
      label: I18n.t('pageflow_scrolled.editor.content_element_style_list_input.outlineColor'),
      propertyName: 'outlineColor',
      inputType: 'color',
      defaultValue: (_themeProperties$root = themeProperties.root) === null || _themeProperties$root === void 0 ? void 0 : _themeProperties$root.outlineColor,
      inputOptions: {
        alpha: true,
        swatches: entry.getUsedContentElementColors('outlineColor')
      },
      ...bindingOptions('outline')
    };
  }
  return result;
};
Style.getImageModifierTypes = function ({
  entry
}) {
  const [values, labels] = entry.getAspectRatios();
  const borderRadiusScale = entry.getScale('contentElementBoxBorderRadius');
  const result = {
    crop: {
      items: [...values.map((value, index) => ({
        label: labels[index],
        value
      })), {
        label: I18n.t('pageflow_scrolled.editor.crop_types.circle'),
        value: 'circle',
        incompatibleWith: ['rounded']
      }]
    }
  };
  if (borderRadiusScale.values.length > 0) {
    const items = borderRadiusScale.values.map((value, index) => {
      const item = {
        label: borderRadiusScale.texts[index],
        value
      };
      if (borderRadiusScale.defaultValue === value) {
        item.default = true;
      }
      return item;
    });
    if (borderRadiusScale.defaultValue) {
      const noneLabel = I18n.t('pageflow_scrolled.editor.scales.contentElementBoxBorderRadius.none');
      items.unshift({
        label: noneLabel,
        value: 'none',
        disabled: false
      });
    }
    result.rounded = {
      items
    };
  }
  return result;
};

const StylesCollection = Backbone.Collection.extend({
  model: Style,
  initialize(models, options = {}) {
    this.types = options.types || {};
    this.bindingModel = options.bindingModel;
  },
  getUnusedStyles() {
    const unusedStyles = new Backbone.Collection(Object.keys(this.types).map(name => ({
      name
    })), {
      comparator: style => Object.keys(this.types).indexOf(style.get('name')),
      styles: this,
      bindingModel: this.bindingModel,
      model: UnusedStyle
    });
    this.listenTo(unusedStyles, 'change:hidden', () => updateSeparation(unusedStyles, this.types));
    updateSeparation(unusedStyles, this.types);
    return unusedStyles;
  }
});
function updateSeparation(styles, types) {
  styles.where({
    hidden: false
  }).reduce((previous, style) => {
    style.set('separated', previous && Style.getKind(style.get('name'), types) !== Style.getKind(previous.get('name'), types));
    return style;
  }, null);
}
const UnusedStyle = Backbone.Model.extend({
  initialize({
    name
  }, {
    styles,
    bindingModel
  }) {
    const type = styles.types[name];
    const {
      items
    } = type;
    this.set('label', Style.getLabel(name, styles.types));
    if (items) {
      this.set('items', new Backbone.Collection(items, {
        model: UnusedStyleItem,
        styles,
        styleName: name
      }));
    } else {
      this.selected = () => {
        styles.add({
          name: this.get('name')
        }, {
          types: styles.types,
          bindingModel: styles.bindingModel
        });
      };
    }
    const updateHidden = () => {
      const inUse = !!styles.findWhere({
        name: this.get('name')
      }) && !items;
      this.set({
        hidden: inUse || !this.get('available')
      });
    };
    this.listenTo(styles, 'add remove', updateHidden);
    if (type.binding && bindingModel) {
      attributeBindingUtils.setup({
        binding: type.binding,
        model: bindingModel,
        listener: this,
        option: type.when,
        callback: available => {
          this.set({
            available
          });
          updateHidden();
        }
      });
    } else {
      this.set({
        available: true
      });
    }
    updateHidden();
  }
});
const UnusedStyleItem = Backbone.Model.extend({
  initialize(attributes, {
    styles,
    styleName
  }) {
    this.styles = styles;
    this.styleName = styleName;
    this.isDefault = !!attributes.default;
    this._setLabelWithSuffix(attributes);
    this._setupDisabledStateTracking();
  },
  _setLabelWithSuffix(attributes) {
    let label = attributes.label;
    if (this.isDefault) {
      const defaultSuffix = I18n.t('pageflow_scrolled.editor.common.default_suffix');
      label = label + defaultSuffix;
    }
    this.set('label', label);
  },
  _setupDisabledStateTracking() {
    const update = () => {
      const disabled = this._calculateDisabledState();
      this.set({
        disabled
      });
    };
    this.listenTo(this.styles, 'add remove', update);
    update();
  },
  _calculateDisabledState() {
    const currentStyle = this.styles.findWhere({
      name: this.styleName
    });
    const isCurrentlySelected = !!(currentStyle === null || currentStyle === void 0 ? void 0 : currentStyle.valueMatches(this.get('value')));
    if (this.isDefault) {
      return !currentStyle;
    } else {
      return isCurrentlySelected;
    }
  },
  selected() {
    const currentStyle = this.styles.findWhere({
      name: this.styleName
    });
    if (this._shouldResetToDefault(currentStyle)) {
      this._resetToDefault(currentStyle);
    } else {
      this._applyStyle(currentStyle);
    }
  },
  _shouldResetToDefault(currentStyle) {
    return this.isDefault && currentStyle;
  },
  _resetToDefault(currentStyle) {
    this.styles.remove(currentStyle);
  },
  _applyStyle(currentStyle) {
    const newValue = this._buildNewValue(currentStyle);
    this.styles.remove(currentStyle);
    this._removeIncompatibleStyles();
    this.styles.add({
      name: this.styleName,
      value: newValue
    }, {
      types: this.styles.types,
      bindingModel: this.styles.bindingModel
    });
  },
  _buildNewValue(currentStyle) {
    const itemValue = this.get('value');
    if (!itemValue || typeof itemValue !== 'object') {
      return itemValue;
    }
    const baseValue = existingObjectValue(currentStyle, this.styles.types[this.styleName]);
    return {
      ...baseValue,
      ...itemValue
    };
  },
  _removeIncompatibleStyles() {
    const incompatibleWith = this.get('incompatibleWith');
    if (incompatibleWith) {
      incompatibleWith.forEach(incompatibleStyleName => {
        const incompatibleStyle = this.styles.findWhere({
          name: incompatibleStyleName
        });
        if (incompatibleStyle) {
          this.styles.remove(incompatibleStyle);
        }
      });
    }
    this.styles.each(style => {
      const styleType = this.styles.types[style.get('name')];
      if (styleType === null || styleType === void 0 ? void 0 : styleType.items) {
        var _currentItem$incompat;
        const currentItem = styleType.items.find(item => style.valueMatches(item.value));
        if (currentItem === null || currentItem === void 0 ? void 0 : (_currentItem$incompat = currentItem.incompatibleWith) === null || _currentItem$incompat === void 0 ? void 0 : _currentItem$incompat.includes(this.styleName)) {
          this.styles.remove(style);
        }
      }
    });
  }
});
function existingObjectValue(currentStyle, type) {
  if (currentStyle) {
    const value = currentStyle.get('value');
    if (value && typeof value === 'object') {
      return value;
    }
    if (typeof value === 'string' && (type === null || type === void 0 ? void 0 : type.inputType) === 'color') {
      return {
        color: value
      };
    }
  }
  if ((type === null || type === void 0 ? void 0 : type.defaultValue) && typeof type.defaultValue === 'object') {
    return type.defaultValue;
  }
  return {};
}

var styles$6 = {"view":"StyleListInputView-module_view__2-XKg icons-module_plusCircled__20FlJ icons-module_icon__16IVx","negativeMarginTop":"StyleListInputView-module_negativeMarginTop__1o2vY","allUsed":"StyleListInputView-module_allUsed__1pLSz","item":"StyleListInputView-module_item__3O-Q1","label":"StyleListInputView-module_label__y2504","value":"StyleListInputView-module_value__pWWnA","input-none":"StyleListInputView-module_input-none__jpaXc","widget":"StyleListInputView-module_widget__23i_R","centerZero":"StyleListInputView-module_centerZero__1AY56","colorInput":"StyleListInputView-module_colorInput__2W3qp","controls":"StyleListInputView-module_controls__1QM4X","unavailable":"StyleListInputView-module_unavailable__3S9dj","remove":"StyleListInputView-module_remove__3oGwM icons-module_cancel__1PjiX icons-module_icon__16IVx"};

const StyleListInputView = Marionette.ItemView.extend({
  className: styles$6.view,
  template: () => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>`,
  mixins: [inputView],
  initialize() {
    this.styles = new StylesCollection(this.readFromModel(), {
      types: this.options.types,
      bindingModel: this.model
    });
    this.listenTo(this.styles, 'add remove change', () => {
      this.saveToModel();
    });
  },
  readFromModel() {
    const stored = this.model.get(this.options.propertyName) || [];
    const isKnown = ({
      name
    }) => name in this.options.types;
    this._unsupportedStyles = stored.filter(entry => !isKnown(entry));
    const fromProperties = Object.entries(this.options.types).filter(([, type]) => {
      if (!type.propertyName || !this.model.has(type.propertyName)) {
        return false;
      }
      return !type.values || type.values.includes(this.model.get(type.propertyName));
    }).map(([name, type]) => ({
      name,
      value: this.model.get(type.propertyName)
    }));
    return [...stored.filter(isKnown), ...fromProperties];
  },
  saveToModel() {
    const serialized = [];
    const setProperties = new Set();
    this.styles.each(style => {
      const propertyName = style.propertyName();
      if (propertyName) {
        this.model.set(propertyName, style.get('value'));
        setProperties.add(propertyName);
      } else {
        serialized.push(style.toJSON());
      }
    });
    Object.values(this.options.types).forEach(type => {
      if (type.propertyName && !setProperties.has(type.propertyName)) {
        if ('resetValue' in type) {
          this.model.set(type.propertyName, type.resetValue);
        } else {
          this.model.unset(type.propertyName);
        }
      }
    });
    this.model.set(this.options.propertyName, [...serialized, ...(this._unsupportedStyles || [])]);
  },
  onRender() {
    if (this.options.hideLabel) {
      this.$el.addClass(styles$6.negativeMarginTop);
    }
    this.appendSubview(new CollectionView({
      itemViewConstructor: StyleListItemView,
      itemViewOptions: {
        styles: this.styles,
        translationKeyPrefix: this.options.translationKeyPrefix
      },
      collection: this.styles
    }));
    const unusedStyles = this.styles.getUnusedStyles();
    this.appendSubview(new DropDownButtonView({
      label: I18n.t(`${this.options.translationKeyPrefix}.add`),
      fullWidth: true,
      openOnClick: true,
      items: unusedStyles
    }));
    const update = () => this.$el.toggleClass(styles$6.allUsed, unusedStyles.where({
      hidden: false
    }).length === 0);
    update();
    this.listenTo(unusedStyles, 'change:hidden', update);
  }
});
const StyleListItemView = Marionette.ItemView.extend({
  className: styles$6.item,
  template: data => `
    <div class="${styles$6.controls}">
      <div class="${styles$6.label}">${data.label}</div>
      ${renderInput(data.inputType)}
    </div>
    <button class="${styles$6.remove}"
            title="${data.removeButtonTitle}">
    </button>
            `,
  modelEvents: {
    'change:available': 'updateAvailability'
  },
  serializeData() {
    return {
      label: this.model.label(),
      inputType: this.model.inputType(),
      removeButtonTitle: I18n.t(`${this.options.translationKeyPrefix}.remove`)
    };
  },
  ui: cssModulesUtils.ui(styles$6, 'controls', 'widget', 'value', 'colorInput'),
  events: cssModulesUtils.events(styles$6, {
    'click remove': function () {
      this.options.styles.remove(this.model);
    },
    'slide widget': function (event, ui) {
      const values = this.model.values();
      if (values) {
        this.ui.value.text(this.model.texts()[ui.value]);
        this.model.set('value', values[ui.value]);
      }
    },
    'slidechange widget': function () {
      if (!this.model.values()) {
        const value = this.ui.widget.slider('option', 'value');
        this.ui.value.text(value);
        this.model.set('value', value);
      }
    }
  }),
  updateAvailability() {
    const unavailable = this.model.get('available') === false;
    this.$el.toggleClass(styles$6.unavailable, unavailable);
    this.ui.controls.attr('inert', unavailable ? '' : null);
  },
  onRender() {
    this.updateAvailability();
    this.$el.addClass(styles$6[`input-${this.model.inputType()}`]);
    const values = this.model.values();
    if (values) {
      this.ui.widget.slider({
        animate: 'fast',
        min: 0,
        max: values.length - 1
      });
      const storedValue = this.model.get('value') || this.model.defaultValue();
      const index = values.indexOf(storedValue);
      this.ui.widget.slider('option', 'value', index);
      this.ui.value.text(this.model.texts()[index]);
    } else {
      this.ui.widget.toggleClass(styles$6.centerZero, this.model.minValue() < 0);
      this.ui.widget.slider({
        animate: 'fast',
        min: this.model.minValue(),
        max: this.model.maxValue()
      });
      this.ui.widget.slider('option', 'value', this.model.get('value') || 50);
    }
    const colorInput = this.ui.colorInput[0];
    if (colorInput) {
      colorInput.value = this.model.getColor() || this.model.defaultColor() || '';
      this._colorPicker = new ColorPicker(colorInput, {
        defaultValue: this.model.defaultColor(),
        ...this.model.inputOptions(),
        onChange: color => {
          this.model.setColor(color || '');
        }
      });
    }
  },
  onBeforeClose() {
    if (this._colorPicker) {
      this._colorPicker.destroy();
    }
  }
});
function renderInput(inputType) {
  if (inputType === 'color') {
    return `<input class="${styles$6.colorInput}" />`;
  } else if (inputType === 'slider') {
    return `<div class="${styles$6.value}"></div>
            <div class="${styles$6.widget}"></div>`;
  } else {
    return '';
  }
}

const ContentElementStyleListInputView = function (options) {
  return new StyleListInputView({
    ...options,
    types: Style.getTypesForContentElement({
      entry: options.entry,
      contentElement: options.contentElement
    }),
    translationKeyPrefix: 'pageflow_scrolled.editor.content_element_style_list_input'
  });
};

ConfigurationEditorTabView.groups.define('ContentElementPosition', function ({
  entry
}) {
  const contentElement = this.model.parent;
  if (contentElement.getAvailablePositions().length > 1) {
    this.input('position', PositionSelectInputView, {
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
      values: contentElement.getAvailablePositions(),
      sectionLayout: this.model.parent.section.configuration.get('layout')
    });
  }
  this.input('width', SliderInputView, {
    attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
    displayText: value => ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'][value + 3],
    saveOnSlide: true,
    minValueBinding: 'position',
    maxValueBinding: 'position',
    visibleBinding: 'position',
    minValue: () => contentElement.getAvailableMinWidth(),
    maxValue: () => contentElement.getAvailableMaxWidth(),
    visible: () => contentElement.getAvailableMinWidth() !== contentElement.getAvailableMaxWidth(),
    defaultValue: this.model.get('position') === 'wide' ? 2 : this.model.get('position') === 'full' ? 3 : 0
  });
  this.input('alignment', SelectInputView, {
    attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
    values: ['center', 'left', 'right'],
    defaultValue: 'center',
    visibleBinding: ['position', 'width'],
    visible: () => ['inline', 'standAlone'].includes(contentElement.getResolvedPosition()) && contentElement.getWidth() < 0
  });
  if (contentElement.supportsFullWidthInPhoneLayout()) {
    this.input('fullWidthInPhoneLayout', CheckBoxInputView, {
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
      disabledBinding: 'width',
      disabled: () => contentElement.getWidth() === 3,
      displayCheckedIfDisabled: true,
      visibleBinding: 'position',
      visible: () => contentElement.getPosition() !== 'backdrop'
    });
  }
  this.input('styles', ContentElementStyleListInputView, {
    entry,
    contentElement,
    attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes']
  });
});
ConfigurationEditorTabView.groups.define('ContentElementTypographyVariant', function ({
  entry,
  model,
  prefix,
  getPreviewConfiguration,
  previewConfigurationBindingModel,
  previewConfigurationBinding
}) {
  const contentElement = this.model.parent;
  if (entry.getTypographyVariants({
    contentElement
  })[0].length) {
    const [variants, texts] = entry.getTypographyVariants({
      contentElement,
      prefix
    });
    this.input('typographyVariant', TypographyVariantSelectInputView, {
      entry,
      model: model || this.model,
      contentElement: contentElement,
      prefix,
      getPreviewConfiguration,
      previewConfigurationBindingModel,
      previewConfigurationBinding,
      includeBlank: true,
      blankTranslationKey: 'pageflow_scrolled.editor.' + 'common_content_element_attributes.' + 'typographyVariant.blank',
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
      disabled: !variants.length,
      values: variants,
      texts
    });
  }
});
ConfigurationEditorTabView.groups.define('ContentElementTypographySize', function ({
  entry,
  model,
  prefix,
  getPreviewConfiguration,
  previewConfigurationBindingModel,
  previewConfigurationBinding
}) {
  const contentElement = this.model.parent;
  const [sizes, texts] = entry.getTypographySizes({
    contentElement,
    prefix
  });
  this.input('typographySize', TypographyVariantSelectInputView, {
    entry,
    model: model || this.model,
    contentElement,
    prefix,
    getPreviewConfiguration,
    previewConfigurationBindingModel,
    previewConfigurationBinding,
    attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
    disabled: sizes.length <= 1,
    defaultValue: 'md',
    values: sizes,
    texts
  });
});
ConfigurationEditorTabView.groups.define('ContentElementVariant', function ({
  entry
}) {
  const [variants, texts] = entry.getContentElementVariants({
    contentElement: this.model.parent
  });
  if (variants.length) {
    this.input('variant', SelectInputView, {
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
      includeBlank: true,
      blankTranslationKey: 'pageflow_scrolled.editor.' + 'common_content_element_attributes.' + 'variant.blank',
      values: variants,
      texts
    });
  }
});
ConfigurationEditorTabView.groups.define('PaletteColor', function ({
  propertyName,
  entry,
  model,
  visibleBinding,
  visible
}) {
  const [values, texts] = entry.getPaletteColors();
  const inputView = features.isEnabled('custom_palette_colors') ? ColorSelectOrCustomColorInputView : ColorSelectInputView;
  if (values.length) {
    this.input(propertyName, inputView, {
      model: model || this.model,
      includeBlank: true,
      blankTranslationKey: 'pageflow_scrolled.editor.' + 'common_content_element_attributes.' + 'palette_color.blank',
      customColorTranslationKey: 'pageflow_scrolled.editor.' + 'common_content_element_attributes.' + 'palette_color.custom',
      values,
      texts,
      visibleBinding,
      visible: visible || true
    });
  }
});
ConfigurationEditorTabView.groups.define('ContentElementCaption', function ({
  entry,
  disableWhenNoCaption = true
}) {
  const [variants, texts] = entry.getComponentVariants({
    name: 'figureCaption'
  });
  if (variants.length) {
    this.input('captionVariant', SelectInputView, {
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
      includeBlank: true,
      blankTranslationKey: 'pageflow_scrolled.editor.' + 'common_content_element_attributes.' + 'captionVariant.blank',
      values: variants,
      texts,
      disabledBindingModel: this.model.parent.transientState,
      disabledBinding: 'hasCaption',
      disabled: hasCaption => disableWhenNoCaption && !hasCaption
    });
  }
});

ConfigurationEditorTabView.groups.define('LinkButtonVariant', function ({
  entry,
  visibleBinding,
  visible
}) {
  const [variants, texts] = entry.getComponentVariants({
    name: 'linkButton'
  });
  if (variants.length) {
    this.input('linkButtonVariant', SelectInputView, {
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.link_button_variant_attributes'],
      includeBlank: true,
      values: variants,
      texts,
      visibleBinding,
      visible: visible || true
    });
  }
});

editor$1.widgetTypes.registerRole('header', {
  isOptional: false
});
editor$1.widgetTypes.registerRole('footer', {
  isOptional: true
});
editor$1.widgetTypes.registerRole('inlineFileRights', {
  isOptional: false
});

/**
 * Integrate new content types into the editor.
 * @name editor_contentElementTypes
 */
class ContentElementTypeRegistry {
  constructor({
    features
  }) {
    this.features = features;
    this.contentElementTypes = {};
  }

  /**
   * Register a new type of content element in the editor.
   *
   * @param {string} typeName - Name of the content element type.
   * @param {Object} options
   * @param {Function} options.configurationEditor -
   *   Function that is evaluated in the context of a
   *   `ConfigurationEditorView` (see `pageflow/ui`) which will
   *   be used to edit the configuration of content elements of
   *   this type. Receives an options object with an `entry`
   *   property containing the entry model.
   * @param {Object} options.defaultConfig -
   *   Object that is set as initial config for the content element.
   * @param {Function} [options.split] -
   *   Function that receives configuration attributes and a split point
   *   and needs to return a two element array of configuration attributes
   *   objects representing the content elements that arise from splitting
   *   a content element with the given configuration at the specified
   *   split point. Called when inserting content elements at custom split
   *   points.
   * @param {Function} [options.merge] -
   *   Function that receives two configuration attributes objects and
   *   needs to return a single merged configuration. If provided, this
   *   will function will be called whenever two content elements of this
   *   type become adjacent because a common neighbor has been deleted.
   * @param {string[]} [options.supportedPositions] -
   *   Pass array containing a subset of the positions `left`, `right`,
   *   `sticky` and `inline`. By default all positions are supported.
   * @param {string[]} [options.supportedWidthRange] -
   *   Pass array consisting of two widths of the form `xxs`, `xs`, `sm`,
   *   `md`, `lg`, `xl` or `full` representing the smallest andlargest
   *   supported width. By default only width `md` is supported.
   * @param {Function} [options.configurationPlace] -
   *   Function that receives a content element and the path of one of
   *   its configuration properties. Can return a `label` naming that
   *   property and a `select` function revealing where it is edited.
   *   Both are optional. Root properties are named by the label of
   *   their configuration editor input unless the returned object
   *   says otherwise. Used by the list of places that reference a
   *   file.
   * @memberof editor_contentElementTypes
   *
   * @example
   *
   * // editor.js
   * editor.contentElementTypes.register('inlineImage', {
   *   supportedWidthRange: ['xss', 'full'],
   *
   *   configurationEditor() {
   *     this.tab('general', function() {
   *       this.input('caption', TextInputView);
   *     });
   *   }
   * });
   */
  register(typeName, options) {
    this.contentElementTypes[typeName] = options;
  }
  setupConfigurationEditor(typeName, configurationEditorView, options) {
    return this.findByTypeName(typeName).configurationEditor.call(configurationEditorView, options);
  }
  findByTypeName(typeName) {
    if (!this.contentElementTypes[typeName]) {
      throw new Error(`Unknown content element type ${typeName}`);
    }
    return {
      ...this.contentElementTypes[typeName],
      displayName: I18n.t(`pageflow_scrolled.editor.content_elements.${typeName}.name`),
      description: I18n.t(`pageflow_scrolled.editor.content_elements.${typeName}.description`)
    };
  }
  findPictogram(typeName) {
    var _this$contentElementT;
    return (_this$contentElementT = this.contentElementTypes[typeName]) === null || _this$contentElementT === void 0 ? void 0 : _this$contentElementT.pictogram;
  }
  findConfigurationPlace(contentElement, path) {
    var _this$contentElementT2, _this$contentElementT3;
    return (_this$contentElementT2 = this.contentElementTypes[contentElement.get('typeName')]) === null || _this$contentElementT2 === void 0 ? void 0 : (_this$contentElementT3 = _this$contentElementT2.configurationPlace) === null || _this$contentElementT3 === void 0 ? void 0 : _this$contentElementT3.call(null, contentElement, path);
  }
  groupedByCategory() {
    const result = [];
    const categoriesByName = {};
    this.toArray().forEach(contentElementType => {
      const categoryName = contentElementType.category || 'basic';
      if (!categoriesByName[categoryName]) {
        categoriesByName[categoryName] = {
          name: categoryName,
          displayName: I18n.t(`pageflow_scrolled.editor.content_element_categories.${categoryName}.name`),
          contentElementTypes: []
        };
        result.push(categoriesByName[categoryName]);
      }
      categoriesByName[categoryName].contentElementTypes.push(contentElementType);
    });
    return result;
  }
  toArray() {
    return Object.keys(this.contentElementTypes).map(typeName => ({
      ...this.findByTypeName(typeName),
      typeName
    })).filter(contentElement => !contentElement.featureName || this.features.isEnabled(contentElement.featureName));
  }
  getDefaultsInputsMapping(typeName) {
    const type = this.contentElementTypes[typeName];
    if (!(type === null || type === void 0 ? void 0 : type.defaultsInputs)) {
      return {};
    }
    const mapping = {};
    type.defaultsInputs.call({
      input(propertyName) {
        mapping[`default-${typeName}-${propertyName}`] = propertyName;
      },
      view() {}
    });
    return mapping;
  }
  createDefaultsInputContext(tabView, typeName) {
    return {
      input(propertyName, View, options = {}) {
        tabView.input(`default-${typeName}-${propertyName}`, View, {
          ...options,
          attributeTranslationKeyPrefixes: [`pageflow_scrolled.editor.content_elements.${typeName}.defaults.attributes`, `pageflow_scrolled.editor.content_elements.${typeName}.attributes`, ...(options.attributeTranslationKeyPrefixes || [])],
          attributeTranslationPropertyName: propertyName
        });
      },
      view(View, options) {
        tabView.view(View, options);
      }
    };
  }
}

function extend(api) {
  return Object.assign(api, {
    contentElementTypes: new ContentElementTypeRegistry({
      features
    })
  });
}
const editor = extend(editor$1);

function ConsentVendors({
  urlMatchers
}) {
  return {
    fromUrl(url) {
      var _Object$entries$find;
      url = new URL(url);
      return (_Object$entries$find = Object.entries(urlMatchers).find(([matcher]) => new RegExp(matcher).test(url.host + url.pathname))) === null || _Object$entries$find === void 0 ? void 0 : _Object$entries$find[1];
    }
  };
}

const Storyline = Backbone.Model.extend({
  mixins: [configurationContainer({
    includeAttributesInJSON: ['position']
  })],
  initialize(attributes, options) {
    this.chapters = new ForeignKeySubsetCollection({
      parent: options.chapters,
      parentModel: this,
      foreignKeyAttribute: 'storylineId',
      parentReferenceAttribute: 'storyline',
      autoConsolidatePositions: false
    });
    this.entry = options.entry;
  },
  addChapter(attributes) {
    return this.chapters.create({
      position: this.chapters.length ? Math.max(...this.chapters.pluck('position')) + 1 : 0,
      storylineId: this.id,
      ...attributes
    }, {
      entry: this.entry,
      sections: this.entry.sections
    });
  },
  appendChapter(chapter) {
    const position = this.chapters.length ? Math.max(...this.chapters.pluck('position')) + 1 : 0;
    chapter.set('position', position);
    this.chapters.add(chapter);
    this.chapters.sort();
    this.chapters.saveOrder();
  },
  isMain() {
    return !!this.configuration.get('main');
  }
});

const StorylinesCollection = Backbone.Collection.extend({
  model: Storyline,
  mixins: [entryTypeEditorControllerUrls.forCollection({
    resources: 'storylines'
  }), orderedCollection],
  comparator: function (chapter) {
    return chapter.get('position');
  },
  main() {
    return this.at(0);
  },
  excursions() {
    return this.at(1);
  }
});

var img = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3c!--! Font Awesome Pro 6.1.1 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons%2c Inc. --%3e%3cpath fill='white' d='M411.4 175.5C417.4 185.4 417.5 197.7 411.8 207.8C406.2 217.8 395.5 223.1 384 223.1H192C180.5 223.1 169.8 217.8 164.2 207.8C158.5 197.7 158.6 185.4 164.6 175.5L260.6 15.54C266.3 5.897 276.8 0 288 0C299.2 0 309.7 5.898 315.4 15.54L411.4 175.5zM288 312C288 289.9 305.9 272 328 272H472C494.1 272 512 289.9 512 312V456C512 478.1 494.1 496 472 496H328C305.9 496 288 478.1 288 456V312zM0 384C0 313.3 57.31 256 128 256C198.7 256 256 313.3 256 384C256 454.7 198.7 512 128 512C57.31 512 0 454.7 0 384z'/%3e%3c/svg%3e";

function configurationPlace({
  chapter,
  subject,
  detail,
  pictogram,
  select
}) {
  return {
    label: chapter ? labelInChapter(chapter, subject) : subject,
    detail,
    pictogram: pictogram || img,
    select
  };
}
function labelInChapter(chapter, subject) {
  return I18n.t('pageflow_scrolled.editor.configuration_places.label', {
    chapter: chapter.getDisplayName(),
    subject
  });
}

var img$1 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M3 2h18'/%3e%3crect width='18' height='12' x='3' y='6' rx='2'/%3e%3cpath d='M3 22h18'/%3e%3c/svg%3e";

const SectionBackdrop = Object$1.extend({
  initialize({
    configuration
  }) {
    this.configuration = configuration;
    this.listenTo(configuration, 'change:backdropImageMotifArea change:backdropVideoMotifArea ' + 'change:backdropImageMobileMotifArea change:backdropVideoMobileMotifArea', () => this.trigger('change:motifArea'));
    this.listenTo(configuration, 'change:backdropType', () => this.trigger('change:type'));
    this.listenToFiles();
    this.listenTo(configuration, 'change:backdropType ' + 'change:backdropImage change:backdropImageMobile ' + 'change:backdropVideo change:backdropVideoMobile', this.listenToFiles);
  },
  getMotifAreaStatus({
    portrait
  } = {}) {
    const file = this.getFile({
      portrait
    });
    if (!file) {
      return null;
    }
    if (this.configuration.get(this.getMotifAreaPropertyName({
      portrait
    }))) {
      return 'defined';
    }
    if (file.configuration.get('ignoreMissingMotif')) {
      return 'ignored';
    }
    return 'missing';
  },
  getFile({
    portrait
  } = {}) {
    const backdropType = this.configuration.get('backdropType');
    if (backdropType === 'color') {
      return;
    }
    const propertyName = this.getFilePropertyName({
      portrait
    });
    const collection = backdropType === 'video' ? 'video_files' : 'image_files';
    return this.configuration.getReference(propertyName, collection);
  },
  getFilePropertyName({
    portrait
  } = {}) {
    const backdropType = this.configuration.get('backdropType');
    if (portrait) {
      return backdropType === 'video' ? 'backdropVideoMobile' : 'backdropImageMobile';
    } else {
      return backdropType === 'video' ? 'backdropVideo' : 'backdropImage';
    }
  },
  getMotifAreaPropertyName({
    portrait
  } = {}) {
    const backdropType = this.configuration.get('backdropType');
    if (portrait) {
      return backdropType === 'video' ? 'backdropVideoMobileMotifArea' : 'backdropImageMobileMotifArea';
    } else {
      return backdropType === 'video' ? 'backdropVideoMotifArea' : 'backdropImageMotifArea';
    }
  },
  listenToFiles() {
    this.listenToFile('currentFile', {
      portrait: false
    });
    this.listenToFile('currentPortraitFile', {
      portrait: true
    });
  },
  listenToFile(property, options) {
    if (this[property]) {
      this.stopListening(this[property].configuration);
    }
    this[property] = this.getFile(options);
    if (this[property]) {
      this.listenTo(this[property].configuration, 'change:ignoreMissingMotif', () => this.trigger('change:ignoreMissingMotif'));
    }
  }
});

const SectionConfiguration = Configuration.extend({
  defaults: {
    transition: 'fadeBg',
    fullHeight: true,
    exposeMotifArea: true,
    backdrop: {}
  },
  initialize() {
    Configuration.prototype.initialize.apply(this, arguments);
    this.attributes = {
      ...this.getAttributesFromBackdropAttribute(),
      ...this.attributes
    };
  },
  getAttributesFromBackdropAttribute() {
    const backdrop = this.attributes.backdrop || {};
    if (backdrop.image && backdrop.image.toString().startsWith('#')) {
      return {
        backdropType: 'color',
        backdropColor: backdrop.image
      };
    } else if (backdrop.color) {
      return {
        backdropType: 'color',
        backdropColor: backdrop.color
      };
    } else if (backdrop.video) {
      return {
        backdropType: 'video',
        backdropVideo: backdrop.video
      };
    } else {
      return {
        backdropType: 'image',
        backdropImage: backdrop.image,
        backdropImageMobile: backdrop.imageMobile
      };
    }
  },
  set: function (name, value) {
    let attrs;
    if (typeof name === 'object') {
      attrs = name;
    } else {
      attrs = {
        [name]: value
      };
    }
    if (!attrs.backdrop && Object.keys(attrs).some(key => key.startsWith('backdrop'))) {
      Configuration.prototype.set.call(this, {
        backdrop: this.getBackdropAttribute({
          ...this.attributes,
          ...attrs
        }),
        ...attrs
      });
    } else {
      Configuration.prototype.set.apply(this, arguments);
    }
    if (attrs.backdropType) {
      var _this$parent;
      const backdropContentElement = (_this$parent = this.parent) === null || _this$parent === void 0 ? void 0 : _this$parent.getBackdropContentElement();
      if (backdropContentElement) {
        backdropContentElement.configuration.set('position', attrs.backdropType === 'contentElement' ? 'backdrop' : 'inline');
      }
    }
  },
  getBackdropAttribute(nextAttributes) {
    switch (nextAttributes.backdropType) {
      case 'color':
        return {
          color: nextAttributes.backdropColor
        };
      case 'video':
        return {
          video: nextAttributes.backdropVideo,
          videoMotifArea: nextAttributes.backdropVideoMotifArea,
          videoInlineRightsHidden: nextAttributes.backdropVideoInlineRightsHidden,
          videoMobile: nextAttributes.backdropVideoMobile,
          videoMobileMotifArea: nextAttributes.backdropVideoMobileMotifArea,
          videoMobileInlineRightsHidden: nextAttributes.backdropVideoMobileInlineRightsHidden
        };
      case 'contentElement':
        return {
          contentElement: nextAttributes.backdropContentElement
        };
      default:
        return {
          image: nextAttributes.backdropImage,
          imageMotifArea: nextAttributes.backdropImageMotifArea,
          imageInlineRightsHidden: nextAttributes.backdropImageInlineRightsHidden,
          imageMobile: nextAttributes.backdropImageMobile,
          imageMobileMotifArea: nextAttributes.backdropImageMobileMotifArea,
          imageMobileInlineRightsHidden: nextAttributes.backdropImageMobileInlineRightsHidden
        };
    }
  },
  getBackdrop() {
    this._backdrop = this._backdrop || new SectionBackdrop({
      configuration: this
    });
    return this._backdrop;
  }
});
const FileSelectionHandler = function (options) {
  const section = options.entry.sections.get(options.id);
  this.call = function (file) {
    section.configuration.setReference(options.attributeName, file);
    section.configuration.set(`${options.attributeName}MotifArea`, file.configuration.get('motifArea'));
  };
  this.getReferer = function () {
    return '/scrolled/sections/' + section.id;
  };
};
editor$1.registerFileSelectionHandler('sectionConfiguration', FileSelectionHandler);

const Section = Backbone.Model.extend({
  mixins: [configurationContainer({
    autoSave: true,
    includeAttributesInJSON: ['position'],
    configurationModel: SectionConfiguration
  }), delayedDestroying, entryTypeEditorControllerUrls.forModel({
    resources: 'sections'
  }), failureTracking],
  initialize(attributes, options) {
    this.contentElements = new ForeignKeySubsetCollection({
      parent: options.contentElements,
      parentModel: this,
      foreignKeyAttribute: 'sectionId',
      parentReferenceAttribute: 'section',
      autoConsolidatePositions: false
    });
  },
  chapterPosition: function () {
    return this.chapter && this.chapter.has('position') ? this.chapter.get('position') : -1;
  },
  getTransition() {
    var _this$chapter;
    const entry = (_this$chapter = this.chapter) === null || _this$chapter === void 0 ? void 0 : _this$chapter.entry;
    if (!entry) {
      return 'scroll';
    }
    const sectionIndex = entry.sections.indexOf(this);
    const previousSection = entry.sections.at(sectionIndex - 1);
    const availableTransitions = previousSection ? getAvailableTransitionNames(this.configuration.attributes, previousSection.configuration.attributes) : [];
    const transition = this.configuration.get('transition');
    if (availableTransitions.includes(transition)) {
      return transition;
    } else {
      return 'scroll';
    }
  },
  getConfigurationPlace(path) {
    return configurationPlace({
      chapter: this.chapter,
      subject: I18n.t('pageflow_scrolled.editor.configuration_places.section', {
        number: this.chapter.sections.indexOf(this) + 1
      }),
      detail: I18n.t(`${editorAttributeName(path)}.label`, {
        scope: 'pageflow_scrolled.editor.edit_section.attributes'
      }),
      pictogram: img$1,
      select: () => {
        this.chapter.entry.trigger('selectSectionSettings', this);
        this.chapter.entry.trigger('scrollToSection', this, {
          ifNeeded: true
        });
      }
    });
  },
  getBackdropContentElement() {
    return this.contentElements.findWhere({
      permaId: this.configuration.get('backdropContentElement')
    });
  },
  isCurrent() {
    if (!this.chapter) {
      return false;
    }
    const entry = this.chapter.entry;
    const currentExcursionId = entry.get('currentExcursionId');
    const currentSectionIndex = entry.get('currentSectionIndex');
    if (currentExcursionId) {
      if (this.chapter.id !== currentExcursionId) {
        return false;
      }
      const sectionsInChapter = this.chapter.sections.models;
      const indexInChapter = sectionsInChapter.indexOf(this);
      return indexInChapter === currentSectionIndex;
    } else {
      return entry.sections.indexOf(this) === currentSectionIndex;
    }
  }
});
function editorAttributeName(path) {
  return path.map((segment, index) => index ? `${segment[0].toUpperCase()}${segment.slice(1)}` : segment).join('');
}

const Chapter = Backbone.Model.extend({
  mixins: [configurationContainer({
    autoSave: true,
    includeAttributesInJSON: ['position']
  }), delayedDestroying, entryTypeEditorControllerUrls.forModel({
    resources: 'chapters'
  }), failureTracking],
  initialize(attributes, options) {
    this.sections = new ForeignKeySubsetCollection({
      parent: options.sections,
      parentModel: this,
      foreignKeyAttribute: 'chapterId',
      parentReferenceAttribute: 'chapter',
      autoConsolidatePositions: false
    });
    this.entry = options.entry;
  },
  getDisplayTitle() {
    return this.configuration.get('title') || I18n.t('pageflow_scrolled.editor.chapter_item.unnamed');
  },
  getDisplayName() {
    return this.configuration.get('title') || (this.isExcursion() ? I18n.t('pageflow_scrolled.editor.chapter_item.excursion') : this.getDisplayNumber());
  },
  getDisplayNumber() {
    if (this.storyline.isMain()) {
      return I18n.t('pageflow_scrolled.editor.chapter_item.chapter') + ' ' + (this.get('position') + 1);
    }
  },
  isExcursion() {
    return !this.storyline.isMain();
  },
  toggleExcursion() {
    const targetStoryline = this.isExcursion() ? this.entry.storylines.main() : this.entry.storylines.excursions();
    targetStoryline.appendChapter(this);
    if (this.sections.length) {
      this.entry.trigger('selectSection', this.sections.first());
      this.entry.trigger('scrollToSection', this.sections.first());
    }
  },
  addSection(attributes, options = {}) {
    const defaultConfiguration = options.skipDefaults ? {} : {
      transition: this.entry.metadata.configuration.get('defaultTransition'),
      layout: this.entry.metadata.configuration.get('defaultSectionLayout'),
      appearance: this.entry.metadata.configuration.get('defaultSectionAppearance'),
      paddingTop: this.entry.metadata.configuration.get('defaultSectionPaddingTop'),
      paddingBottom: this.entry.metadata.configuration.get('defaultSectionPaddingBottom')
    };
    const section = this.sections.create(new Section({
      position: this.sections.length ? Math.max(...this.sections.pluck('position')) + 1 : 0,
      chapterId: this.id,
      configuration: defaultConfiguration,
      ...attributes
    }, {
      contentElements: this.entry.contentElements
    }), options);
    section.once('sync', (model, response) => {
      this.entry.trigger('selectSection', section);
      this.entry.trigger('scrollToSection', section);
      section.configuration.set(response.configuration, {
        autoSave: false
      });
      section.contentElements.add(response.contentElements);
    });
    return section;
  },
  insertSection({
    before,
    after
  }, options) {
    const position = before ? before.get('position') : after.get('position') + 1;
    this.sections.each(section => {
      if (section.get('position') >= position) {
        section.set('position', section.get('position') + 1);
      }
    });
    const newSection = this.addSection({
      position
    }, options);
    this.sections.sort();
    return newSection;
  },
  duplicateSection(section) {
    const newSection = this.insertSection({
      after: section
    }, {
      url: `${section.url()}/duplicate`,
      skipDefaults: true
    });
    return newSection;
  },
  moveSection(section, {
    after,
    before
  } = {}) {
    const targetSection = after || before;
    const sourceChapter = section.chapter;
    reindexPositions(sectionsInNewOrder(this.sections, section, targetSection, Boolean(after)));
    if (sourceChapter !== this) {
      this.sections.add(section);
    }
    this.sections.sort();
    this.sections.saveOrder();
    this.entry.trigger('selectSection', section);
    this.entry.trigger('scrollToSection', section);
  }
});
function sectionsInNewOrder(sections, section, targetSection, after) {
  const result = sections.filter(s => s !== section);
  if (!targetSection) {
    result.push(section);
    return result;
  }
  const targetIndex = result.indexOf(targetSection);
  const insertIndex = after ? targetIndex + 1 : targetIndex;
  result.splice(insertIndex, 0, section);
  return result;
}
function reindexPositions(sections) {
  sections.forEach((section, index) => section.set('position', index));
}

const ChaptersCollection = Backbone.Collection.extend({
  model: Chapter,
  mixins: [entryTypeEditorControllerUrls.forCollection({
    resources: 'chapters'
  })],
  comparator: function (chapter) {
    return chapter.get('position');
  }
});

const SectionsCollection = Backbone.Collection.extend({
  model: Section,
  mixins: [entryTypeEditorControllerUrls.forCollection({
    resources: 'sections'
  })],
  comparator: function (sectionA, sectionB) {
    var _sectionA$chapter, _sectionA$chapter$sto, _sectionB$chapter, _sectionB$chapter$sto;
    const aIsMain = (_sectionA$chapter = sectionA.chapter) === null || _sectionA$chapter === void 0 ? void 0 : (_sectionA$chapter$sto = _sectionA$chapter.storyline) === null || _sectionA$chapter$sto === void 0 ? void 0 : _sectionA$chapter$sto.isMain();
    const bIsMain = (_sectionB$chapter = sectionB.chapter) === null || _sectionB$chapter === void 0 ? void 0 : (_sectionB$chapter$sto = _sectionB$chapter.storyline) === null || _sectionB$chapter$sto === void 0 ? void 0 : _sectionB$chapter$sto.isMain();
    if (aIsMain && !bIsMain) {
      return -1;
    } else if (!aIsMain && bIsMain) {
      return 1;
    } else if (sectionA.chapterPosition() > sectionB.chapterPosition()) {
      return 1;
    } else if (sectionA.chapterPosition() < sectionB.chapterPosition()) {
      return -1;
    } else if (sectionA.get('position') > sectionB.get('position')) {
      return 1;
    } else if (sectionA.get('position') < sectionB.get('position')) {
      return -1;
    } else {
      return 0;
    }
  }
});

const ContentElementConfiguration = Configuration.extend({
  defaults: {},
  set(name, value, options) {
    const previousValue = this.get('position');
    Configuration.prototype.set.apply(this, arguments);
    if (name === 'position' && previousValue !== value) {
      const contentElement = this.parent;
      const section = contentElement.section;
      const currentBackdropContentElement = section.getBackdropContentElement();
      if (value === 'backdrop') {
        if (currentBackdropContentElement && currentBackdropContentElement !== contentElement) {
          currentBackdropContentElement.configuration.set('position', 'inline');
        }
        section.configuration.set({
          previousBackdropType: section.configuration.get('backdropType'),
          backdropContentElement: contentElement.get('permaId'),
          backdropType: 'contentElement'
        });
      } else if (currentBackdropContentElement === contentElement && section.configuration.get('backdropType') === 'contentElement') {
        section.configuration.set({
          backdropContentElement: null,
          backdropType: (options === null || options === void 0 ? void 0 : options.keepBackdropType) ? 'contentElement' : section.configuration.get('previousBackdropType')
        });
      }
    }
  },
  getFilePosition: function (attribute, coord) {
    const cropPosition = this.get(this.filePositionProperty(attribute));
    return cropPosition ? cropPosition[coord] : 50;
  },
  setFilePosition: function (attribute, coord, value) {
    this.set(this.filePositionProperty(attribute), {
      ...this.get(this.filePositionProperty(attribute)),
      [coord]: value
    });
  },
  setFilePositions: function (attribute, x, y) {
    this.set(this.filePositionProperty(attribute), {
      x,
      y
    });
  },
  filePositionProperty: function (attribute) {
    if (attribute === 'id') {
      return 'cropPosition';
    } else {
      return attribute.replace(/Id$/, 'CropPosition');
    }
  }
});

const widths = {
  xxs: -3,
  xs: -2,
  s: -1,
  md: 0,
  l: 1,
  xl: 2,
  full: 3
};
const ContentElement = Backbone.Model.extend({
  paramRoot: 'content_element',
  mixins: [configurationContainer({
    autoSave: true,
    includeAttributesInJSON: ['position', 'typeName'],
    configurationModel: ContentElementConfiguration
  }), delayedDestroying, entryTypeEditorControllerUrls.forModel({
    resources: 'content_elements'
  }), failureTracking],
  initialize() {
    this.transientState = new Backbone.Model(this.get('transientState'));
    this.listenTo(this, 'change:transientState', () => this.transientState.set(this.get('transientState'), {
      skipCommand: true
    }));
    this.listenTo(this.transientState, 'change', (model, {
      skipCommand
    }) => {
      if (!skipCommand) {
        this.postCommand({
          type: 'TRANSIENT_STATE_UPDATE',
          payload: model.changed
        });
      }
    });
  },
  getType(contentElement) {
    return editor.contentElementTypes.findByTypeName(this.get('typeName'));
  },
  postCommand(command) {
    this.trigger('postCommand', this.id, command);
  },
  getAdjacentContentElements() {
    const section = this.section;
    const index = section.contentElements.indexOf(this);
    return [section.contentElements.at(index - 1), section.contentElements.at(index + 1)];
  },
  applyDefaultConfiguration({
    entry,
    sibling
  }) {
    const defaultConfig = {
      ...this.getType().defaultConfig,
      ...this.getDefaultsFromEntryMetadata(entry)
    };
    const defaultPosition = sibling === null || sibling === void 0 ? void 0 : sibling.getPosition();
    const supportedPositions = this.getType().supportedPositions || [];
    if (this.configuration.has('position')) {
      delete defaultConfig.position;
    } else if (defaultPosition && defaultPosition !== 'inline' && supportedPositions.includes(defaultPosition)) {
      defaultConfig.position = defaultPosition;
    }
    this.configuration.set(defaultConfig);
  },
  getDefaultsFromEntryMetadata(entry) {
    const defaults = {};
    Object.entries(this.getEntryMetadataDefaultsMapping()).forEach(([metadataKey, propertyName]) => {
      const value = entry.metadata.configuration.get(metadataKey);
      if (value !== undefined) {
        defaults[propertyName] = value;
      }
    });
    return defaults;
  },
  getEntryMetadataDefaultsMapping() {
    const mapping = {
      ...editor.contentElementTypes.getDefaultsInputsMapping(this.get('typeName'))
    };
    if (this.supportsFullWidthInPhoneLayout()) {
      mapping.defaultContentElementFullWidthInPhoneLayout = 'fullWidthInPhoneLayout';
    }
    if (this.supportsCaption()) {
      mapping.defaultCaptionVariant = 'captionVariant';
    }
    return mapping;
  },
  getPosition() {
    return this.configuration.get('position');
  },
  getResolvedPosition() {
    const position = this.getPosition();
    return this.getAvailablePositions().includes(position) ? position : 'inline';
  },
  getAvailablePositions() {
    const layout = this.section.configuration.get('layout');
    const backdrop = features.isEnabled('backdrop_content_elements') ? 'backdrop' : null;
    const supportedByLayout = layout === 'center' || layout === 'centerRagged' ? ['inline', 'left', 'right', 'standAlone', backdrop] : ['inline', 'side', 'sticky', 'standAlone', backdrop];
    const supportedByType = this.getType().supportedPositions;
    if (supportedByType) {
      return supportedByLayout.filter(position => supportedByType.includes(position));
    } else {
      return supportedByLayout;
    }
  },
  getWidth() {
    return this.clampWidthByPosition(this.configuration.get('width') || 0);
  },
  getAvailableMinWidth() {
    var _this$getType$support;
    return this.clampWidthByPosition(widths[((_this$getType$support = this.getType().supportedWidthRange) === null || _this$getType$support === void 0 ? void 0 : _this$getType$support[0]) || 'md']);
  },
  getAvailableMaxWidth() {
    var _this$getType$support2;
    return this.clampWidthByPosition(widths[((_this$getType$support2 = this.getType().supportedWidthRange) === null || _this$getType$support2 === void 0 ? void 0 : _this$getType$support2[1]) || 'md']);
  },
  clampWidthByPosition(width) {
    if (this.getPosition() === 'backdrop') {
      return 0;
    } else if (['sticky', 'side', 'left', 'right'].includes(this.getResolvedPosition())) {
      return Math.min(Math.max(width, -2), 2);
    } else {
      return width;
    }
  },
  supportsFullWidthInPhoneLayout() {
    var _this$getType$support3;
    return !this.getType().customMargin && ((_this$getType$support3 = this.getType().supportedWidthRange) === null || _this$getType$support3 === void 0 ? void 0 : _this$getType$support3[1]) === 'full';
  },
  supportsCaption() {
    return !!this.getType().supportedCaptions;
  },
  getEditorPath() {
    var _this$getType$editorP;
    return ((_this$getType$editorP = this.getType().editorPath) === null || _this$getType$editorP === void 0 ? void 0 : _this$getType$editorP.call(null, this)) || `/scrolled/content_elements/${this.id}`;
  },
  getConfigurationPlace(path) {
    const typeName = this.get('typeName');
    const described = editor.contentElementTypes.findConfigurationPlace(this, path);
    const select = (described === null || described === void 0 ? void 0 : described.select) || (() => this.select());
    return configurationPlace({
      chapter: this.section.chapter,
      subject: I18n.t(`pageflow_scrolled.editor.content_elements.${typeName}.name`),
      detail: (described === null || described === void 0 ? void 0 : described.label) || attributeLabel(typeName, path),
      pictogram: editor.contentElementTypes.findPictogram(typeName),
      select: () => {
        select();
        this.scrollIntoView({
          align: 'center'
        });
      }
    });
  },
  select(options) {
    this.section.chapter.entry.trigger('selectContentElement', this, {
      navigate: true,
      ...options
    });
  },
  scrollIntoView(options) {
    this.section.chapter.entry.trigger('scrollToContentElement', this, options);
  }
});
function attributeLabel(typeName, path) {
  if (path.length > 1) {
    return undefined;
  }
  return I18n.lookup(`${path[0]}.label`, {
    scope: `pageflow_scrolled.editor.content_elements.${typeName}.attributes`
  });
}

const ContentElementsCollection = Backbone.Collection.extend({
  model: ContentElement,
  mixins: [entryTypeEditorControllerUrls.forCollection({
    resources: 'content_elements'
  })],
  comparator: 'position'
});

const resolutionStorageKey = 'pageflow.scrolled.editor.commentsResolution';
const alwaysShowStorageKey = 'pageflow.scrolled.editor.alwaysShowComments';
const CommentDisplayFilter = Backbone.Model.extend({
  defaults: {
    resolution: 'unresolved',
    alwaysShowComments: true
  },
  initialize() {
    const storage = getLocalStorage();
    if ((storage === null || storage === void 0 ? void 0 : storage[resolutionStorageKey]) === 'all') {
      this.set('resolution', 'all');
    }
    if ((storage === null || storage === void 0 ? void 0 : storage[alwaysShowStorageKey]) === 'false') {
      this.set('alwaysShowComments', false);
    }
    this.listenTo(this, 'change:resolution', function () {
      store(resolutionStorageKey, this.get('resolution'));
    });
    this.listenTo(this, 'change:alwaysShowComments', function () {
      store(alwaysShowStorageKey, this.get('alwaysShowComments'));
    });
  },
  showsResolved() {
    return this.get('resolution') === 'all';
  }
});
function store(storageKey, value) {
  const storage = getLocalStorage();
  if (storage) {
    storage[storageKey] = value;
  }
}

const Cutoff = Object$1.extend({
  initialize({
    entry
  }) {
    this.entry = entry;
    this.listenTo(this.entry.metadata.configuration, 'change:cutoff_section_perma_id', () => this.trigger('change'));
    this.listenTo(this.entry.sections, 'destroy', section => {
      if (this.isAtSection(section)) {
        this.reset();
      }
    });
  },
  isEnabled() {
    return !!this.entry.site.get('cutoff_mode_name');
  },
  isAtSection(section) {
    const cutoffSectionPermaId = this.entry.metadata.configuration.get('cutoff_section_perma_id');
    return !!cutoffSectionPermaId && cutoffSectionPermaId === section.get('permaId');
  },
  reset() {
    this.entry.metadata.configuration.unset('cutoff_section_perma_id');
  },
  setSection(section) {
    this.entry.metadata.configuration.set('cutoff_section_perma_id', section.get('permaId'));
  }
});

var img$2 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-3 -3 30 30'%3e%3cpath d='M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z'/%3e%3c/svg%3e";

// Allows recording changes to a section's content elements,
// persisting the changes to the server in a single request and
// applying them to the section once the requests succeeds.
function Batch(entry, section, {
  reviewSession
} = {}) {
  // Shallow copy of the section's list of content elements to store
  // ordering changes and newly inserted content elements.
  const contentElements = section.contentElements.toArray();

  // Since contentElements is only a shallow copy, we cannot write
  // configuration changes to the actual content elements.
  const changedConfigurations = {};

  // Content elements that have been removed from contentElements
  // and shall be deleted on the server.
  const markedForDeletion = [];

  // New ranges for comment threads, keyed by threadId. Includes the
  // post-shift range of threads being migrated.
  const threadRangeUpdates = {};

  // Target content elements of migrating comment threads, keyed by
  // threadId. Resolved to a perma id once the batch succeeds.
  const threadMigrations = {};

  // Track whether changes have been recorded which need to be
  // persisted to the server.
  let isDirty = false;
  return {
    getAdjacent,
    getLength,
    split,
    maybeMerge,
    insertBefore,
    insertAfter,
    markForUpdate,
    markForDeletion,
    remove,
    save,
    saveIfDirty
  };
  function getAdjacent(contentElement) {
    const index = contentElements.indexOf(contentElement);
    return [contentElements[index - 1], contentElements[index + 1]];
  }
  function getLength(contentElement) {
    return contentElement.getType().getLength ? contentElement.getType().getLength(getCurrentConfiguration(contentElement)) : 0;
  }

  // Higher level transformations based on the more low level
  // transformations below:

  function split(contentElement, splitPoint, {
    insertAt
  } = {}) {
    const {
      before,
      after
    } = normalizeSplitResult(contentElement.getType().split(getCurrentConfiguration(contentElement), splitPoint, {
      ranges: collectRanges(contentElement)
    }));
    let splitOffContentElement;
    if (insertAt === 'before') {
      splitOffContentElement = new ContentElement({
        typeName: contentElement.get('typeName'),
        configuration: before.configuration
      });
      insertBefore(contentElement, splitOffContentElement);
      markForUpdate(contentElement, after.configuration);
      recordRangeUpdates(after.ranges);
      recordThreadMigrations(before.ranges, splitOffContentElement);
    } else {
      splitOffContentElement = new ContentElement({
        typeName: contentElement.get('typeName'),
        configuration: after.configuration
      });
      markForUpdate(contentElement, before.configuration);
      insertAfter(contentElement, splitOffContentElement);
      recordRangeUpdates(before.ranges);
      recordThreadMigrations(after.ranges, splitOffContentElement);
    }
    return splitOffContentElement;
  }
  function maybeMerge(before, after) {
    if (!before || !after || before.get('typeName') !== after.get('typeName') || !before.getType().merge) {
      return;
    }
    const rangesA = collectRanges(before);
    const rangesB = collectRanges(after);
    const {
      configuration: mergedConfiguration,
      ranges: mergedRanges
    } = normalizeMergeResult(before.getType().merge(getCurrentConfiguration(before), getCurrentConfiguration(after), {
      rangesA,
      rangesB
    }));

    // Update the aleady persisted content element, if one has not yet
    // been persisted. For example, let X be a content element in
    // between two text blocks T1 and T2:
    //
    //   T1
    //     paragraph A
    //     paragraph B
    //   X
    //   T2
    //     paragraph C
    //
    // When X shall be moved between the two paragraphs of T1, the
    // second paragraph of T1 will first be split off into a new
    // content element T3:
    //
    //   T1
    //     paragraph A
    //   T3
    //     paragraph B
    //   X
    //   T2
    //     paragraph C
    //
    // Then X will be moved:
    //
    //   T1
    //     paragraph A
    //   X
    //   T3
    //     paragraph B
    //   T2
    //     paragraph C
    //
    // T3 and T2 become adjacent and need to be merged. We now want to
    // update T2 instead of creating T3 and deleting T2. Final state:
    //
    //   T1
    //     paragraph A
    //   X
    //   T2
    //     paragraph B
    //     paragraph C
    //
    const survivor = before.isNew() && !after.isNew() ? after : before;
    const removed = survivor === before ? after : before;
    const removedRanges = removed === before ? rangesA : rangesB;
    const survivorRanges = survivor === before ? rangesA : rangesB;
    markForUpdate(survivor, mergedConfiguration);
    remove(removed);
    if (!removed.isNew()) {
      markForDeletion(removed);
    }

    // A type's merge has to preserve every input thread id for
    // splitting `mergedRanges` along the input range maps to be exhaustive.
    recordThreadMigrations(pickRanges(mergedRanges, removedRanges), survivor);
    recordRangeUpdates(pickRanges(mergedRanges, survivorRanges));
    return survivor;
  }
  function insertBefore(sibling, contentElement) {
    isDirty = true;
    contentElements.splice(contentElements.indexOf(sibling), 0, contentElement);
  }
  function insertAfter(sibling, contentElement) {
    isDirty = true;
    contentElements.splice(contentElements.indexOf(sibling) + 1, 0, contentElement);
  }
  function markForUpdate(contentElement, configuration) {
    isDirty = true;
    if (contentElement.isNew()) {
      contentElement.configuration.set(configuration);
    } else {
      changedConfigurations[contentElement.id] = configuration;
    }
  }
  function markForDeletion(contentElement) {
    isDirty = true;
    markedForDeletion.push(contentElement);
  }
  function remove(contentElement) {
    // We do not mark the batch as dirty here to allow removing an
    // element and adding it to another section. We are fine with
    // the resulting gap in the position attributes of the section's
    // content elements.
    contentElements.splice(contentElements.indexOf(contentElement), 1);
  }
  function getCurrentConfiguration(contentElement) {
    return changedConfigurations[contentElement.id] || contentElement.configuration.attributes;
  }
  function collectRanges(contentElement) {
    if (!reviewSession) return {};
    const result = {};
    if (!contentElement.isNew()) {
      const threads = reviewSession.findThreadsFor({
        subjectType: 'ContentElement',
        subjectId: contentElement.get('permaId')
      });
      threads.forEach(thread => {
        // `findThreadsFor` reads `reviewSession`, which is only updated
        // once the batch succeeds.
        const migratedAway = thread.id in threadMigrations && threadMigrations[thread.id] !== contentElement;
        if (thread.subjectRange && !migratedAway) {
          result[thread.id] = thread.subjectRange;
        }
      });
    }
    Object.entries(threadMigrations).forEach(([threadId, target]) => {
      if (target === contentElement) {
        result[Number(threadId)] = threadRangeUpdates[threadId];
      }
    });
    return result;
  }
  function recordRangeUpdates(rangesByThreadId) {
    Object.entries(rangesByThreadId).forEach(([id, range]) => {
      threadRangeUpdates[Number(id)] = range;
    });
  }
  function recordThreadMigrations(rangesByThreadId, targetContentElement) {
    Object.entries(rangesByThreadId).forEach(([id, range]) => {
      recordThreadMigration(Number(id), targetContentElement, range);
    });
  }
  function recordThreadMigration(threadId, targetContentElement, newRange) {
    threadMigrations[threadId] = targetContentElement;
    threadRangeUpdates[threadId] = newRange;
    isDirty = true;
  }

  // Functionality to assemble and perform the batch request to
  // persist the recorded changes:

  function saveIfDirty(options) {
    if (isDirty) {
      save(options);
    }
  }
  function save({
    success
  } = {}) {
    isDirty = false;
    const commentThreadSubjectRanges = createCommentThreadSubjectRanges();
    Backbone.sync('update', section, {
      url: `${section.url()}/content_elements/batch`,
      attrs: {
        content_elements: createBatchItems(),
        ...(Object.keys(commentThreadSubjectRanges).length > 0 && {
          comment_thread_subject_ranges: commentThreadSubjectRanges
        })
      },
      success(response) {
        // Each step's intermediate state is observable in the iframe, so
        // the order resolves these dependencies:
        //
        // - permaIds before thread updates: thread migrations resolve
        //   `target.get('permaId')`.
        // - Thread updates before configuration changes: the value-flip
        //   render in `useCachedValue` clears rangeRefs and falls back
        //   to `thread.subjectRange`, which must already be migrated.
        // - Positions before additions: Backbone's collection comparator
        //   drops new elements into their sorted slot.
        // - Configuration changes before deletions: a delete-merge
        //   survivor grows before its sibling disappears.
        applyPermaIds(response);
        applyThreadUpdates();
        reconcileSectionPermaIds();
        applyConfigurationChanges();
        applyPositions();
        applyAdditions();
        applyDeletions();
        section.contentElements.sort();
        if (success) {
          success();
        }
      }
    });
  }
  function createBatchItems() {
    const migrateIdsByElement = groupMigrationsByElement();
    return [...contentElements.map(contentElement => {
      const migrateIds = migrateIdsByElement.get(contentElement) || [];
      const isNew = contentElement.isNew();
      const changedConfiguration = changedConfigurations[contentElement.id];
      return {
        ...(isNew ? {
          typeName: contentElement.get('typeName'),
          configuration: contentElement.configuration.attributes
        } : {
          id: contentElement.id
        }),
        ...(!isNew && changedConfiguration && {
          configuration: changedConfiguration
        }),
        ...(migrateIds.length > 0 && {
          migrate_comment_threads: migrateIds
        })
      };
    }), ...markedForDeletion.map(contentElement => ({
      id: contentElement.id,
      _delete: true
    }))];
  }
  function createCommentThreadSubjectRanges() {
    return reviewSession ? reviewSession.diffSubjectRangeUpdates(threadRangeUpdates) : {};
  }
  function groupMigrationsByElement() {
    return Object.entries(threadMigrations).reduce((map, [threadId, target]) => {
      const list = map.get(target) || [];
      list.push(Number(threadId));
      map.set(target, list);
      return map;
    }, new Map());
  }

  // Functionality to apply the recorded changes to the underlying
  // section once the request succeeded:

  function applyPermaIds(response) {
    contentElements.forEach((contentElement, index) => {
      if (contentElement.isNew()) {
        contentElement.set({
          id: response[index].id,
          permaId: response[index].permaId
        });
      }
    });
  }
  function applyAdditions() {
    contentElements.forEach(contentElement => {
      if (contentElement.section && contentElement.section !== section) {
        contentElement.section.contentElements.remove(contentElement);
        section.contentElements.add(contentElement);
      } else if (!section.contentElements.contains(contentElement)) {
        section.contentElements.add(contentElement);
      }
    });
  }
  function applyDeletions() {
    markedForDeletion.forEach(contentElement => entry.contentElements.remove(contentElement));
  }
  function applyPositions() {
    contentElements.forEach((contentElement, index) => contentElement.set('position', index, {
      autoSave: false
    }));
  }
  function applyConfigurationChanges() {
    contentElements.forEach(contentElement => {
      if (changedConfigurations[contentElement.id]) {
        contentElement.configuration.set(changedConfigurations[contentElement.id], {
          autoSave: false
        });
      }
    });
  }
  function applyThreadUpdates() {
    if (!reviewSession) return;
    const updates = {};
    Object.entries(threadRangeUpdates).forEach(([id, range]) => {
      updates[id] = {
        subjectRange: range
      };
    });
    Object.entries(threadMigrations).forEach(([id, target]) => {
      updates[id] = {
        ...updates[id],
        subjectId: target.get('permaId')
      };
    });
    reviewSession.applyThreadUpdates(updates);
  }

  // Runs after applyThreadUpdates so migrated threads are found on this
  // section's content elements.
  function reconcileSectionPermaIds() {
    if (!reviewSession) return;
    const sectionPermaId = section.get('permaId');
    const updates = {};
    contentElements.forEach(contentElement => {
      reviewSession.findThreadsFor({
        subjectType: 'ContentElement',
        subjectId: contentElement.get('permaId')
      }).forEach(thread => {
        if (thread.sectionPermaId !== sectionPermaId) {
          updates[thread.id] = {
            sectionPermaId
          };
        }
      });
    });
    reviewSession.applyThreadUpdates(updates);
  }
}

// Types may still return the plain [cBefore, cAfter] shape from split()
// and a bare configuration object from merge().
function normalizeSplitResult(result) {
  if (Array.isArray(result)) {
    return {
      before: {
        configuration: result[0],
        ranges: {}
      },
      after: {
        configuration: result[1],
        ranges: {}
      }
    };
  }
  return result;
}
function pickRanges(source, keysSource) {
  const result = {};
  Object.keys(keysSource).forEach(id => {
    result[id] = source[id];
  });
  return result;
}
function normalizeMergeResult(result) {
  if (result && typeof result === 'object' && 'configuration' in result && 'ranges' in result) {
    return result;
  }
  return {
    configuration: result,
    ranges: {}
  };
}

function maybeMergeWithAdjacent(batch, contentElement) {
  const [before, after] = batch.getAdjacent(contentElement);
  const range = createRange(batch, contentElement);
  const beforeLength = before ? batch.getLength(before) : 0;
  contentElement = batch.maybeMerge(contentElement, after) || contentElement;
  const mergedContentElement = batch.maybeMerge(before, contentElement);
  if (mergedContentElement) {
    return [mergedContentElement, translateRange(range, beforeLength)];
  }
  return [contentElement, range];
}
function createRange(batch, contentElement) {
  return batch.getLength(contentElement) ? [0, batch.getLength(contentElement)] : undefined;
}
function translateRange(range, delta) {
  return range && [range[0] + delta, range[1] + delta];
}

// Insert content element before, after or at a split of a sibling
// element (e.g. between two paragraphs of a text block).
function insertContentElement(entry, sibling, attributes, {
  at,
  splitPoint
}) {
  const batch = new Batch(entry, sibling.section, {
    reviewSession: entry.reviewSession
  });
  if (at === 'split') {
    batch.split(sibling, splitPoint, {
      insertAt: 'after'
    });
  }
  let contentElement = new ContentElement(attributes);
  contentElement.applyDefaultConfiguration({
    entry,
    sibling
  });
  if (at === 'before') {
    batch.insertBefore(sibling, contentElement);
  } else {
    batch.insertAfter(sibling, contentElement);
  }
  let targetRange;
  [contentElement, targetRange] = maybeMergeWithAdjacent(batch, contentElement);
  batch.save({
    success() {
      entry.trigger('selectContentElement', contentElement, {
        range: targetRange
      });
    }
  });
  return contentElement;
}

// Move content element inside section or between sections. Allow
// moving content elements to "split points" inside content elements
// with custom split functions (e.g. between two paragraphs of a text
// block). Merge content elements of the same type that become
// adjacent by moving a content element away (e.g. two text blocks
// surrounding an image that is moved away).
function moveContentElement(entry, contentElement, {
  range,
  sibling,
  at,
  splitPoint,
  success
}) {
  const batchOptions = {
    reviewSession: entry.reviewSession
  };
  const sourceBatch = new Batch(entry, contentElement.section, batchOptions);

  // If we move content elements between sections, merges will need to
  // be performed in the section where the content element came from.
  const targetBatch = sibling.section === contentElement.section ? sourceBatch : new Batch(entry, sibling.section, batchOptions);
  if (range && !rangeCoversWholeElement(sourceBatch, contentElement, range)) {
    if (contentElement === sibling && at === 'split') {
      // If we are moving part of a content element inside the content
      // element itself, we need to adjust the split point if the
      // moved range lies above the split point since moving a range
      // means first extracting/removing it from the source element.
      const delta = splitPoint > range[0] ? range[1] - range[0] : 0;
      splitPoint -= delta;
    }
    contentElement = extractRange(sourceBatch, contentElement, range);
  }
  if (at === 'split') {
    // When moving a content element to a split point in the adjacent
    // element below, insert split off element before sibling so that
    // is can directly be merged again. For example, let X be a
    // content element in between two text blocks T1 and T2:
    //
    //   T1
    //     paragraph A
    //   X
    //   T2
    //     paragraph B
    //     paragraph C
    //
    // When X shall be moved between the two paragraphs of T2, we want
    // to split off the first paragraph of T2 into a new content
    // element T3 and move X:
    //
    //   T1
    //     T1 paragraph A
    //   X
    //   T3
    //     T1 paragraph B
    //   T2
    //     T2 paragraph C
    //
    // T3 becomes the new sibling that we want to move X after:
    //
    //   T1
    //     T1 paragraph A
    //   T3
    //     T1 paragraph B
    //   X
    //   T2
    //     T2 paragraph C
    //
    // When we later merge T1 and T3, T1 will be updated making T3
    // disappear again without ever persisting it to the server:
    //
    //   T1
    //     T1 paragraph A
    //     T1 paragraph B
    //   X
    //   T2
    //     T2 paragraph C
    //
    if (sourceBatch.getAdjacent(contentElement)[1] === sibling) {
      sibling = targetBatch.split(sibling, splitPoint, {
        insertAt: 'before'
      });
    } else {
      targetBatch.split(sibling, splitPoint);
    }
  }
  const [before, after] = sourceBatch.getAdjacent(contentElement);
  let targetRange;

  // Check if element was dragged to same position where it came from.
  if (!(at === 'before' && !range && sibling === after) && !(at === 'after' && !range && sibling === before)) {
    sourceBatch.remove(contentElement);
    if (at === 'before') {
      targetBatch.insertBefore(sibling, contentElement);
    } else {
      targetBatch.insertAfter(sibling, contentElement);
    }
    [contentElement, targetRange] = maybeMergeWithAdjacent(targetBatch, contentElement);
    sourceBatch.maybeMerge(before, after);
  }

  // Dragging an element next to a sticky element, shall make the
  // moved element sticky as well.
  copyPositionIfAvailable(targetBatch, contentElement, sibling);
  targetBatch.saveIfDirty({
    success() {
      entry.trigger('selectContentElement', contentElement, {
        range: targetRange
      });
      if (success) {
        success();
      }
    }
  });
  sourceBatch.saveIfDirty();
}
function rangeCoversWholeElement(batch, contentElement, range) {
  return range[0] === 0 && range[1] === batch.getLength(contentElement);
}
function extractRange(batch, contentElement, range) {
  const extracted = batch.split(contentElement, range[0]);
  const suffix = batch.split(extracted, range[1] - range[0]);
  batch.maybeMerge(contentElement, suffix);
  return extracted;
}
function copyPositionIfAvailable(batch, contentElement, sibling) {
  if (contentElement.getPosition() !== sibling.getPosition() && contentElement.getAvailablePositions().includes(sibling.getPosition())) {
    batch.markForUpdate(contentElement, {
      ...contentElement.configuration.toJSON,
      position: sibling.getPosition()
    });
  }
}

// Delete element and merge its adjacent siblings if possible
// (e.g. two text blocks surrounding a deleted image).
function deleteContentElement(entry, contentElement) {
  const batch = new Batch(entry, contentElement.section, {
    reviewSession: entry.reviewSession
  });
  const [before, after] = batch.getAdjacent(contentElement);
  batch.remove(contentElement);
  batch.markForDeletion(contentElement);
  batch.maybeMerge(before, after);
  batch.save();
}

function duplicateContentElement(entry, contentElement) {
  const batch = new Batch(entry, contentElement.section, {
    reviewSession: entry.reviewSession
  });
  const newContentElement = new ContentElement({
    typeName: contentElement.get('typeName'),
    configuration: JSON.parse(JSON.stringify(contentElement.configuration.attributes))
  });
  batch.insertAfter(contentElement, newContentElement);
  batch.save({
    success() {
      entry.trigger('selectContentElement', newContentElement);
    }
  });
  return newContentElement;
}

/**
 * Find the file references a configuration contains.
 *
 * @param {Object} options
 * @param {Array} options.locations - File reference locations of the subject's schema.
 * @param {Object} options.configuration - Configuration to read perma ids from.
 *
 * @private
 */
function collectFileReferences({
  locations,
  configuration
}) {
  return locations.flatMap(location => valuesAt(configuration, location.path).map(({
    path,
    value
  }) => ({
    path,
    permaId: toPermaId(value)
  })).filter(({
    permaId
  }) => permaId).map(({
    path,
    permaId
  }) => ({
    collectionName: location.collection,
    permaId,
    path,
    active: isActive(location.activeIf, configuration)
  })));
}

// Backdrops of legacy sections store a color in the property that
// otherwise holds an image perma id.
function toPermaId(value) {
  const permaId = Number(value);
  return Number.isInteger(permaId) && permaId > 0 ? permaId : null;
}
function valuesAt(value, path, resolvedPath = []) {
  if (value === null || value === undefined) {
    return [];
  }
  if (!path.length) {
    return [{
      path: resolvedPath,
      value
    }];
  }
  const [segment, ...rest] = path;
  if (segment === '*') {
    return Object.entries(value).flatMap(([key, item]) => valuesAt(item, rest, [...resolvedPath, key]));
  }
  return valuesAt(value[segment], rest, [...resolvedPath, segment]);
}
function isActive(activeIf, configuration) {
  if (!activeIf) {
    return true;
  }
  return [activeIf].flat().every(condition => matches(condition, configuration));
}
function matches(condition, configuration) {
  const value = valueAt(configuration, condition.path);
  if ('present' in condition) {
    return (value !== null && value !== undefined) === condition.present;
  }
  if ('not' in condition) {
    return ![condition.not].flat().includes(value);
  }
  return [condition.value].flat().includes(value);
}
function valueAt(configuration, path) {
  return path.reduce((value, segment) => value === null || value === void 0 ? void 0 : value[segment], configuration);
}

/**
 * Find the file references of an entry, indexed by file.
 *
 * @param {Object} options
 * @param {Object} options.collections - Entry state collections.
 * @param {Object} options.locations - File reference locations by subject.
 * @param {Object} options.fileModelTypes - Model type by file collection name.
 *
 * @example
 *
 * const references = collectEntryFileReferences({collections, locations, fileModelTypes});
 * references.of('imageFiles', 5)
 * // => [{subject: {model: 'section', permaId: 12},
 * //      path: ['backdrop', 'image'], active: true}]
 *
 * @private
 */
function collectEntryFileReferences({
  collections,
  locations,
  fileModelTypes
}) {
  const references = {};
  subjects(collections, locations).forEach(subject => collectFileReferences({
    locations: subject.locations,
    configuration: subject.configuration
  }).forEach(reference => add(references, reference, subject.subject)));
  addNestedFileReferences(references, collections, fileModelTypes);
  return {
    of(collectionName, permaId) {
      return references[key({
        collectionName,
        permaId
      })] || [];
    }
  };
}
function subjects({
  entries = [],
  sections = [],
  contentElements = []
}, locations) {
  const bySectionId = groupBySectionId(contentElements);
  return [...entries.map(entry => ({
    subject: {
      model: 'entry'
    },
    configuration: entry,
    locations: locations.entry || []
  })), ...sections.flatMap(section => [{
    subject: {
      model: 'section',
      permaId: section.permaId
    },
    configuration: section.configuration,
    locations: locations.sections || []
  }, ...(bySectionId[section.id] || []).map(contentElement => ({
    subject: {
      model: 'contentElement',
      permaId: contentElement.permaId
    },
    configuration: contentElement.configuration,
    locations: (locations.contentElements || {})[contentElement.typeName] || []
  }))])];
}

// Text tracks and the like are not referenced by any configuration.
function addNestedFileReferences(references, collections, fileModelTypes = {}) {
  const filesById = indexFilesById(collections, fileModelTypes);
  Object.keys(fileModelTypes).forEach(collectionName => (collections[collectionName] || []).forEach(file => {
    var _references$key;
    if (!file.parentFileId) {
      return;
    }
    const parent = filesById[modelTypeAndId(file.parentFileModelType, file.parentFileId)];
    (_references$key = references[key(parent || {})]) === null || _references$key === void 0 ? void 0 : _references$key.forEach(({
      subject,
      path,
      active
    }) => add(references, {
      collectionName,
      permaId: file.permaId,
      path,
      active
    }, subject));
  }));
}
function indexFilesById(collections, fileModelTypes) {
  return Object.entries(fileModelTypes).reduce((result, [collectionName, modelType]) => {
    (collections[collectionName] || []).forEach(file => {
      result[modelTypeAndId(modelType, file.id)] = {
        collectionName,
        permaId: file.permaId
      };
    });
    return result;
  }, {});
}
function add(references, {
  collectionName,
  permaId,
  path,
  active
}, subject) {
  const list = references[key({
    collectionName,
    permaId
  })] = references[key({
    collectionName,
    permaId
  })] || [];
  list.push({
    subject,
    path,
    active
  });
}
function groupBySectionId(contentElements) {
  return contentElements.reduce((result, contentElement) => {
    (result[contentElement.sectionId] = result[contentElement.sectionId] || []).push(contentElement);
    return result;
  }, {});
}
function key({
  collectionName,
  permaId
}) {
  return `${collectionName}/${permaId}`;
}
function modelTypeAndId(modelType, id) {
  return `${modelType}/${id}`;
}

function fileReferences(entry) {
  const {
    config
  } = entry.scrolledSeed;
  const references = collectEntryFileReferences({
    collections: collectionsSnapshot(entry),
    locations: config.fileReferenceLocations,
    fileModelTypes: config.fileModelTypes
  });
  return {
    placesFor(file) {
      return references.of(camelize(file.fileType().collectionName), file.get('perma_id')).filter(({
        active
      }) => active).map(({
        subject,
        path
      }) => subjectModel(entry, subject).getConfigurationPlace(path));
    }
  };
}
function subjectModel(entry, {
  model,
  permaId
}) {
  if (model === 'entry') {
    return entry;
  }
  if (model === 'section') {
    return entry.sections.findWhere({
      permaId
    });
  }
  return entry.contentElements.findWhere({
    permaId
  });
}

// File collections are named in snake case in the editor and in camel
// case in entry state.
function camelize(collectionName) {
  return collectionName.replace(/_(.)/g, (match, character) => character.toUpperCase());
}

function updateContentElement(entry, contentElement, configuration, {
  commentThreadSubjectRanges
} = {}) {
  const changedRanges = diffAndApplySubjectRanges(entry.reviewSession, commentThreadSubjectRanges);
  contentElement.configuration.set(configuration, {
    autoSave: false,
    ignoreInWatchCollection: true
  });
  Backbone.sync('update', contentElement, {
    attrs: {
      content_element: {
        configuration
      },
      ...(Object.keys(changedRanges).length > 0 && {
        comment_thread_subject_ranges: changedRanges
      })
    }
  });
}
function diffAndApplySubjectRanges(reviewSession, ranges) {
  if (!reviewSession || !ranges) return {};
  const changed = reviewSession.diffSubjectRangeUpdates(ranges);
  reviewSession.applySubjectRangeUpdates(changed);
  return changed;
}

function sortColors(colors) {
  return colors.sort((hex1, hex2) => {
    const [h1, s1, l1] = hexToHSL(hex1);
    const [h2, s2, l2] = hexToHSL(hex2);
    return h1 - h2 || s1 - s2 || l1 - l2;
  });
}
function hexToHSL(hex) {
  let [r, g, b] = hexToRGB(hex);
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;
  if (delta === 0) h = 0;else if (cmax === r) h = (g - b) / delta % 6;else if (cmax === g) h = (b - r) / delta + 2;else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return [h, s, l];
}
function hexToRGB(hex) {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  return [r, g, b];
}

function Scale({
  scaleName,
  themeProperties,
  scaleTranslations,
  defaultValuePropertyName,
  scope
}) {
  const root = themeProperties.root || {};
  const scaleProperties = Object.keys(root).filter(name => name.indexOf(`${scaleName}-`) === 0);
  const values = scaleProperties.map(name => name.split('-').pop());
  const texts = values.map(value => {
    var _scaleTranslations$sc;
    return (_scaleTranslations$sc = scaleTranslations[scaleName]) === null || _scaleTranslations$sc === void 0 ? void 0 : _scaleTranslations$sc[value];
  });
  const cssValues = scaleProperties.map(propertyName => root[propertyName]);
  return {
    values,
    texts,
    defaultValue: getDefaultValue()
  };
  function getDefaultValue() {
    var _themeProperties$scop, _themeProperties$scop2, _themeProperties$root;
    if (!defaultValuePropertyName) {
      return undefined;
    }
    const defaultCssValue = (_themeProperties$scop = (_themeProperties$scop2 = themeProperties[scope]) === null || _themeProperties$scop2 === void 0 ? void 0 : _themeProperties$scop2[defaultValuePropertyName]) !== null && _themeProperties$scop !== void 0 ? _themeProperties$scop : (_themeProperties$root = themeProperties.root) === null || _themeProperties$root === void 0 ? void 0 : _themeProperties$root[defaultValuePropertyName];
    if (!defaultCssValue) {
      return undefined;
    }
    const index = cssValues.indexOf(defaultCssValue);
    return index >= 0 ? values[index] : undefined;
  }
}

function getChapterSlugs(chapters) {
  const result = {};
  const usedSlugs = {};
  chapters.forEach(chapter => {
    let chapterSlug = chapter.configuration.title;
    if (chapterSlug) {
      chapterSlug = slugify(chapterSlug, {
        lower: true,
        locale: 'de',
        strict: true
      });
      if (usedSlugs[chapterSlug]) {
        chapterSlug = chapterSlug + '-' + chapter.permaId;
      }
      usedSlugs[chapterSlug] = true;
    } else {
      chapterSlug = 'chapter-' + chapter.permaId;
    }
    result[chapter.permaId] = chapterSlug;
  });
  return result;
}

const typographySizeSuffixes = ['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs', 'xxxs'];
const scaleDefaultPropertyNames = {
  sectionPaddingTop: 'sectionDefaultPaddingTop',
  sectionPaddingBottom: 'sectionDefaultPaddingBottom',
  contentElementBoxBorderRadius: 'contentElementBoxBorderRadius',
  contentElementMargin: 'contentElementMarginStyleDefault',
  contentElementBoxShadow: 'contentElementBoxShadowStyleDefault'
};
const defaultAspectRatios = [{
  name: 'wide',
  ratio: 9 / 16
}, {
  name: 'narrow',
  ratio: 3 / 4
}, {
  name: 'square',
  ratio: 1
}, {
  name: 'portrait',
  ratio: 4 / 3
}];
const ScrolledEntry = Entry.extend({
  setupFromEntryTypeSeed(seed) {
    this.consentVendors = new ConsentVendors({
      urlMatchers: seed.consentVendorUrlMatchers
    });
    this.contentElements = new ContentElementsCollection(seed.collections.contentElements);
    this.sections = new SectionsCollection(seed.collections.sections, {
      contentElements: this.contentElements
    });
    this.chapters = new ChaptersCollection(seed.collections.chapters, {
      sections: this.sections,
      entry: this
    });
    this.chapters.parentModel = this;
    this.storylines = new StorylinesCollection(seed.collections.storylines, {
      chapters: this.chapters,
      entry: this
    });
    this.sections.sort();
    this.cutoff = new Cutoff({
      entry: this
    });
    editor$1.failures.watch(this.contentElements);
    editor$1.failures.watch(this.sections);
    editor$1.failures.watch(this.chapters);
    editor$1.savingRecords.watch(this.contentElements);
    editor$1.savingRecords.watch(this.sections);
    editor$1.savingRecords.watch(this.chapters);
    this.scrolledSeed = seed;
    this.commentDisplayFilter = new CommentDisplayFilter();
    if (features.isEnabled('commenting')) {
      this.reviewSession = createReviewSession({
        entryId: this.id
      });
      watchUnreadComments({
        entry: this,
        session: this.reviewSession
      });
    }
  },
  insertContentElement(attributes, {
    id,
    at,
    splitPoint
  }) {
    if (at === 'backdropOfSection') {
      const section = this.sections.get(id);
      const contentElement = this.insertContentElement({
        ...attributes,
        configuration: {
          position: 'backdrop'
        }
      }, section.contentElements.length > 0 ? {
        id: section.contentElements.first(),
        at: 'before'
      } : {
        id,
        at: 'endOfSection'
      });
      contentElement.once('change:id', () => {
        section.configuration.set('backdropContentElement', contentElement.get('permaId'));
      });
      return contentElement;
    } else if (at === 'endOfSection') {
      const contentElement = new ContentElement({
        position: this.contentElements.length,
        ...attributes
      });
      contentElement.applyDefaultConfiguration({
        entry: this
      });
      this.sections.get(id).contentElements.add(contentElement);
      contentElement.save();
      contentElement.once('sync', () => {
        this.trigger('selectContentElement', contentElement);
      });
      return contentElement;
    } else {
      return insertContentElement(this, this.contentElements.get(id), attributes, {
        at,
        splitPoint
      });
    }
  },
  moveContentElement({
    id: movedId,
    range: movedRange
  }, {
    id,
    at,
    splitPoint
  }, {
    success
  } = {}) {
    moveContentElement(this, this.contentElements.get(movedId), {
      range: movedRange,
      sibling: this.contentElements.get(id),
      at,
      splitPoint,
      success
    });
  },
  updateContentElement(contentElement, configuration, options = {}) {
    updateContentElement(this, contentElement, configuration, options);
  },
  deleteContentElement(contentElement) {
    deleteContentElement(this, contentElement);
  },
  duplicateContentElement(contentElement) {
    return duplicateContentElement(this, contentElement);
  },
  fileReferences() {
    return fileReferences(this);
  },
  getConfigurationPlace() {
    return configurationPlace({
      subject: I18n.t('pageflow_scrolled.editor.configuration_places.entry'),
      detail: I18n.t('activerecord.attributes.pageflow/entry.share_image_id'),
      pictogram: img$2,
      select: () => editor$1.navigate('/meta_data/social', {
        trigger: true
      })
    });
  },
  getTypographyVariants({
    contentElement,
    prefix
  }) {
    const typographyRuleNames = Object.keys(this.scrolledSeed.config.theme.options.typography || {});
    const legacyTypographyVariants = this.scrolledSeed.legacyTypographyVariants || {};
    const rulePrefix = [...[contentElement.get('typeName'), prefix].filter(Boolean), ''].join('-');
    const ruleNames = typographyRuleNames.filter(name => name.indexOf(rulePrefix) === 0).filter(name => !legacyTypographyVariants[name.split('-').pop()]).filter(name => !typographySizeSuffixes.includes(name.split('-').pop()));
    const values = ruleNames.map(name => name.split('-').pop());
    const texts = ruleNames.map(name => I18n.t(`pageflow_scrolled.editor.themes.${this.metadata.get('theme_name')}` + `.typography_variants.${name}`, {
      defaultValue: I18n.t(`pageflow_scrolled.editor.typography_variants.${name}`)
    }));
    return [values, texts];
  },
  getTypographySizes({
    contentElement,
    scaleCategory,
    prefix,
    texts: textsOption,
    order = 'desc'
  }) {
    const typographyRules = this.scrolledSeed.config.theme.options.typography || {};
    const rulePrefix = [scaleCategory || contentElement.get('typeName'), prefix].filter(Boolean).join('-');
    const suffixes = order === 'asc' ? [...typographySizeSuffixes].reverse() : typographySizeSuffixes;
    const values = suffixes.filter(sizeSuffix => typographyRules[`${rulePrefix}-${sizeSuffix}`] || sizeSuffix === 'md');
    const translationKey = textsOption === 'short' ? 'typography_sizes.short' : 'typography_sizes';
    const texts = values.map(name => I18n.t(`pageflow_scrolled.editor.themes.${this.metadata.get('theme_name')}` + `.${translationKey}.${name}`, {
      defaultValue: I18n.t(`pageflow_scrolled.editor.${translationKey}.${name}`)
    }));
    return [values, texts];
  },
  createLegacyTypographyVariantDelegator({
    model,
    paletteColorPropertyName
  }) {
    const delegator = Object.create(model);
    const mapping = this.scrolledSeed.legacyTypographyVariants || {};
    delegator.get = function (name) {
      const result = model.get(name);
      if (name === 'typographyVariant') {
        return mapping[result] ? mapping[result].variant : result;
      } else if (name === 'typographySize') {
        var _mapping$model$get;
        return ((_mapping$model$get = mapping[model.get('typographyVariant')]) === null || _mapping$model$get === void 0 ? void 0 : _mapping$model$get.size) || result;
      } else if (name === paletteColorPropertyName) {
        var _mapping$model$get2;
        return ((_mapping$model$get2 = mapping[model.get('typographyVariant')]) === null || _mapping$model$get2 === void 0 ? void 0 : _mapping$model$get2.paletteColor) || result;
      }
      return result;
    };
    delegator.set = function (name, value) {
      const mappedProperties = mapping[model.get('typographyVariant')];
      if ((name === paletteColorPropertyName || name === 'typographySize') && mappedProperties) {
        const changes = {
          typographyVariant: mapping[model.get('typographyVariant')].variant
        };
        if (!model.has('typographySize')) {
          changes.typographySize = mappedProperties.size;
        }
        if (!model.has(paletteColorPropertyName)) {
          changes[paletteColorPropertyName] = mappedProperties.paletteColor;
        }
        changes[name] = value;
        model.set(changes);
      } else {
        model.set.apply(this, arguments);
      }
    };
    return delegator;
  },
  getContentElementVariants({
    contentElement
  }) {
    return this.getComponentVariants({
      name: contentElement.get('typeName'),
      translationKeysScope: 'content_element_variants'
    });
  },
  getComponentVariants({
    name,
    translationKeysScope = 'component_variants'
  }) {
    const scopeNames = Object.keys(this.scrolledSeed.config.theme.options.properties || {});
    const scopeNamePrefix = `${name}-`;
    const matchingScopeNames = scopeNames.filter(name => name.indexOf(scopeNamePrefix) === 0);
    const values = matchingScopeNames.map(name => name.replace(scopeNamePrefix, ''));
    const texts = matchingScopeNames.map(name => I18n.t(`pageflow_scrolled.editor.themes.${this.metadata.get('theme_name')}` + `.${translationKeysScope}.${name}`, {
      defaultValue: I18n.t(`pageflow_scrolled.editor.${translationKeysScope}.${name}`)
    }));
    return [values, texts];
  },
  getSectionPermalink(section) {
    return `${this.get('pretty_url')}#section-${section.get('permaId')}`;
  },
  getChapterPermalink(chapter) {
    const allChapters = this.chapters.map(c => ({
      permaId: c.get('permaId'),
      configuration: c.configuration.attributes
    }));
    const chapterSlugs = getChapterSlugs(allChapters);
    return `${this.get('pretty_url')}#${chapterSlugs[chapter.get('permaId')]}`;
  },
  getPaletteColors({
    name
  } = {}) {
    var _themeOptions$palette, _themeOptions$propert;
    const themeOptions = this.scrolledSeed.config.theme.options;
    const values = (name ? ((_themeOptions$palette = themeOptions.palettes) === null || _themeOptions$palette === void 0 ? void 0 : _themeOptions$palette[name]) || [] : Object.keys(((_themeOptions$propert = themeOptions.properties) === null || _themeOptions$propert === void 0 ? void 0 : _themeOptions$propert.root) || {}).filter(key => key.indexOf('paletteColor') === 0)).map(key => dasherize(key.replace('paletteColor', '')));
    const texts = values.map(underscore).map(name => I18n.t(`pageflow_scrolled.editor.themes.${this.metadata.get('theme_name')}` + `.palette_colors.${name}`, {
      defaultValue: I18n.t(`pageflow_scrolled.editor.palette_colors.${name}`)
    }));
    return [values, texts];
  },
  getAspectRatios(options = {}) {
    const sortedValues = this._getDefinedAspectRatios().sort((a, b) => a.ratio - b.ratio).map(({
      name
    }) => name);
    if (options.includeOriginal) {
      sortedValues.push('original');
    }
    const texts = sortedValues.map(name => I18n.t(`pageflow_scrolled.editor.themes.${this.metadata.get('theme_name')}` + `.aspect_ratios.${name}`, {
      defaultValue: I18n.t(`pageflow_scrolled.editor.aspect_ratios.${name}`)
    }));
    return [sortedValues, texts];
  },
  getAspectRatio(name) {
    var _this$_getDefinedAspe;
    return (_this$_getDefinedAspe = this._getDefinedAspectRatios().find(aspectRatio => aspectRatio.name === name)) === null || _this$_getDefinedAspe === void 0 ? void 0 : _this$_getDefinedAspe.ratio;
  },
  _getDefinedAspectRatios() {
    var _themeOptions$propert2;
    const themeOptions = this.scrolledSeed.config.theme.options;
    const root = ((_themeOptions$propert2 = themeOptions.properties) === null || _themeOptions$propert2 === void 0 ? void 0 : _themeOptions$propert2.root) || {};
    const customRatios = Object.entries(root).filter(([key]) => key.indexOf('aspectRatio') === 0).map(([key, value]) => ({
      name: dasherize(key.replace('aspectRatio', '')),
      ratio: parseFloat(value)
    }));
    return defaultAspectRatios.concat(customRatios);
  },
  getScale(scaleName, {
    scope
  } = {}) {
    var _theme$translations;
    const theme = this.scrolledSeed.config.theme;
    return Scale({
      scaleName,
      themeProperties: theme.options.properties || {},
      scaleTranslations: ((_theme$translations = theme.translations) === null || _theme$translations === void 0 ? void 0 : _theme$translations.scales) || {},
      defaultValuePropertyName: scaleDefaultPropertyNames[scaleName],
      scope
    });
  },
  getUsedContentElementColors(propertyName) {
    const colors = new Set();
    this.contentElements.forEach(contentElement => {
      colors.add(contentElement.configuration.get(propertyName));
    });
    return sortColors([...colors].filter(Boolean));
  },
  getUsedSectionBackgroundColors() {
    const colors = new Set();
    this.sections.forEach(section => {
      const appearance = section.configuration.get('appearance');
      if (section.configuration.get('backdropType') === 'color') {
        colors.add(section.configuration.get('backdropColor'));
      }
      if (appearance === 'cards') {
        colors.add(section.configuration.get('cardSurfaceColor'));
      }
      if (appearance === 'split') {
        colors.add(section.configuration.get('splitOverlayColor'));
      }
      if (!appearance || appearance === 'shadow') {
        colors.add(section.configuration.get('shadowColor'));
      }
    });
    return sortColors([...colors].filter(Boolean));
  },
  getBackgroundColorPresets() {
    const presets = this.scrolledSeed.config.theme.options.presets || {};
    return (presets.backgroundColors || []).map(({
      value,
      name
    }) => ({
      value,
      text: name || value
    }));
  },
  getThemeProperties() {
    return this.scrolledSeed.config.theme.options.properties || {};
  },
  supportsSectionWidths() {
    const properties = this.getThemeProperties();
    return Object.keys(properties.root || {}).some(key => key.startsWith('narrowSection'));
  },
  isCurrentSectionInExcursion() {
    return !!this.get('currentExcursionId');
  }
});
function dasherize(text) {
  return (text[0] + text.slice(1).replace('_', '-').replace(/[A-Z]/g, match => `-${match}`)).toLowerCase();
}
function underscore(dasherizedWord) {
  return dasherizedWord.replace(/-/g, '_');
}

const ContentElementFileSelectionHandler = function (options) {
  const contentElement = options.entry.contentElements.get(options.id);
  this.call = function (file) {
    contentElement.configuration.setReference(options.attributeName, file);
  };
  this.getReferer = function () {
    return '/scrolled/content_elements/' + contentElement.id;
  };
};

// Bypasses the constructor, which requires a running editor. Only the
// theme-derived accessors work; anything else throws.
function createDefaultsEntry({
  seed,
  themeName
}) {
  const entry = Object.create(ScrolledEntry.prototype);
  entry.scrolledSeed = seed;
  entry.metadata = new Backbone.Model({
    theme_name: themeName
  });
  return entry;
}

var styles$7 = {"separator":"ContentElementTypeSeparatorView-module_separator__18sOD","typeName":"ContentElementTypeSeparatorView-module_typeName__2SANF","pictogram":"ContentElementTypeSeparatorView-module_pictogram__2yXB2","rule":"ContentElementTypeSeparatorView-module_rule__3zHzS"};

const ContentElementTypeSeparatorView = Marionette.ItemView.extend({
  className: styles$7.separator,
  template: data => `
    <span class="${styles$7.rule}"></span>
    <span class="${styles$7.typeName}">${data.typeName}</span>
    ${data.pictogram ? `<span class="${styles$7.pictogram}" style="mask-image: url('${escapeCssUrl(data.pictogram)}')"></span>` : ''}
    <span class="${styles$7.rule}"></span>
  `,
  serializeData() {
    return {
      pictogram: this.options.pictogram,
      typeName: this.options.typeName
    };
  }
});
function escapeCssUrl(url) {
  return url.replace(/'/g, "\\'").replace(/\n/g, '');
}

var styles$8 = {"infoText":"SectionPaddingVisualizationView-module_infoText__306R3","preview":"SectionPaddingVisualizationView-module_preview__2lLYu","svg":"SectionPaddingVisualizationView-module_svg__2pyR2","silhouette":"SectionPaddingVisualizationView-module_silhouette__16QJK","cornerMarker":"SectionPaddingVisualizationView-module_cornerMarker__20zav","spacingZone":"SectionPaddingVisualizationView-module_spacingZone__1jlO7","arrow":"SectionPaddingVisualizationView-module_arrow__3UN8L","textBlock":"SectionPaddingVisualizationView-module_textBlock__2BNnx"};

const prefix = 'pageflow_scrolled.editor.section_padding_visualization';
const SectionPaddingVisualizationView = Marionette.ItemView.extend({
  mixins: [inputView],
  template: data => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    ${data.infoText ? `<div class="${styles$8.infoText}">${data.infoText}</div>` : ''}
    <div class="${styles$8.preview}"></div>
  `,
  serializeData() {
    return {
      infoText: this.options.infoText
    };
  },
  ui: {
    preview: `.${styles$8.preview}`
  },
  onRender() {
    this.listenTo(this.model, 'change:layout', this.update);
    this.update();
  },
  update() {
    const svg = this.getSvg();
    this.ui.preview.html(svg);
  },
  getSvg() {
    const portrait = this.options.portrait;
    const layout = this.model.get('layout') || 'left';
    switch (this.options.variant) {
      case 'intersectingAuto':
        return intersectingAutoSvg(portrait, layout);
      case 'intersectingManual':
        return intersectingManualSvg(portrait, layout);
      case 'sideBySide':
        return sideBySideSvg(portrait, layout);
      case 'topPadding':
        return topPaddingSvg(portrait, layout);
      case 'bottomPadding':
        return bottomPaddingSvg(portrait, layout);
      default:
        return '';
    }
  }
});
function intersectingAutoSvg(portrait, layout) {
  if (portrait) {
    return intersectingAutoSvgPortrait(layout);
  }
  const right = layout === 'right';
  const center = layout === 'center' || layout === 'centerRagged';
  const centerRagged = layout === 'centerRagged';
  const arrowX = right ? '150;125;125;150' : '30;55;55;30';
  const textXY = right ? '100 62;63 41;63 41;100 62' : center ? '55 62;55 41;55 41;55 62' : '10 62;47 41;47 41;10 62';
  return `
    <svg viewBox="0 0 180 80" class="${styles$8.svg}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${I18n.t(`${prefix}.intersecting_auto`)}</title>
      <defs>
        <!-- Animated viewport clipping rect (full width to 4:3) -->
        <clipPath id="intersectingAutoViewport">
          <rect y="0" height="80">
            <animate attributeName="x" values="0;37;37;0" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
            <animate attributeName="width" values="180;106;106;180" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
          </rect>
        </clipPath>
${diagonalStripesPattern('autoDiagonalStripes')}
      </defs>

      <!-- Clipped viewport area -->
      <g clip-path="url(#intersectingAutoViewport)">
        <!-- Viewport background -->
        <rect fill="var(--ui-primary-color)" x="0" y="0" width="180" height="80" />

        <!-- Auto padding zone (striped, height animates with arrow + 3px bottom gap) -->
        <rect x="0" y="0" width="180" fill="url(#autoDiagonalStripes)">
          <animate attributeName="height" values="58;37;37;58" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
        </rect>

        <!-- Scaled silhouette (simulates cover behavior) -->
        <g style="transform-origin: 90px 3px">
          <animateTransform attributeName="transform" type="scale"
            values="1 1;0.589 0.589;0.589 0.589;1 1" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <g transform="translate(60, 3)">
            <!-- Head (ellipse) -->
            <ellipse class="${styles$8.silhouette}" cx="30" cy="18" rx="13" ry="14" />
            <!-- Shoulders (curved path) -->
            <path class="${styles$8.silhouette}" d="M8 52 Q8 34 30 34 Q52 34 52 52" />
          </g>
        </g>

        <!-- Corner markers (position-only animation, fixed size) -->
        <g class="${styles$8.cornerMarker}">
          <!-- Top-left -->
          <path d="M0 0 h5 M0 0 v5">
            <animateTransform attributeName="transform" type="translate"
              values="60 3;72 3;72 3;60 3" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
          <!-- Top-right -->
          <path d="M0 0 h-5 M0 0 v5">
            <animateTransform attributeName="transform" type="translate"
              values="120 3;108 3;108 3;120 3" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
          <!-- Bottom-left -->
          <path d="M0 0 h5 M0 0 v-5">
            <animateTransform attributeName="transform" type="translate"
              values="60 55;72 34;72 34;60 55" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
          <!-- Bottom-right -->
          <path d="M0 0 h-5 M0 0 v-5">
            <animateTransform attributeName="transform" type="translate"
              values="120 55;108 34;108 34;120 55" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
        </g>

        <!-- Arrow (centered between viewport edge and motif) -->
        <g class="${styles$8.arrow}">
          <animateTransform attributeName="transform" type="translate"
            values="${arrowX.split(';').map(x => `${x} 3`).join(';')}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <line x1="0" y1="0" x2="0" y2="52">
            <animate attributeName="y2" values="52;31;31;52" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </line>
          <polyline points="-4,4 0,0 4,4" />
          <polyline points="-4,48 0,52 4,48">
            <animateTransform attributeName="transform" type="translate"
              values="0 0;0 -21;0 -21;0 0" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </polyline>
        </g>

        <!-- Text lines (inside viewport, animated to follow motif and viewport edge) -->
        <g class="${styles$8.textBlock}">
          <animateTransform attributeName="transform" type="translate"
            values="${textXY}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <rect x="${centerRagged ? 0 : 0}" y="0" width="70" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 10 : 0}" y="6" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 5 : 0}" y="12" width="60" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 15 : 0}" y="18" width="40" height="1.4" rx="0.7" />
          <!-- Second paragraph (visible when text moves up) -->
          <rect x="${centerRagged ? 2.5 : 0}" y="30" width="65" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 7.5 : 0}" y="36" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 0 : 0}" y="42" width="70" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 17.5 : 0}" y="48" width="35" height="1.4" rx="0.7" />
        </g>
      </g>
    </svg>
  `;
}
function intersectingAutoSvgPortrait(layout) {
  // Canvas: 142x142, animates viewport width from 80 (9:16) to 142 (square)
  // Height stays fixed at 142. Only x and width animate.
  // 9:16: x=31, width=80 | Square: x=0, width=142
  // Scale factor: 80/142 ≈ 0.563 (motif scales with viewport width)
  const right = layout === 'right';
  const center = layout === 'center' || layout === 'centerRagged';
  const centerRagged = layout === 'centerRagged';
  const arrowX = right ? '104;129;129;104' : '38;13;13;38';
  const textX = right ? '48 62;79 108;79 108;48 62' : center ? '44 62;44 108;44 108;44 62' : '39 62;8 108;8 108;39 62';
  return `
    <svg viewBox="0 0 142 142" class="${styles$8.svg}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${I18n.t(`${prefix}.intersecting_auto`)}</title>
      <defs>
        <!-- Animated viewport clipping rect (9:16 to square, width only) -->
        <clipPath id="intersectingAutoViewportPortrait">
          <rect y="0" height="142">
            <animate attributeName="x" values="31;0;0;31" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
            <animate attributeName="width" values="80;142;142;80" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
          </rect>
        </clipPath>
${diagonalStripesPattern('autoDiagonalStripesPortrait')}
      </defs>

      <!-- Clipped viewport area -->
      <g clip-path="url(#intersectingAutoViewportPortrait)">
        <!-- Viewport background -->
        <rect fill="var(--ui-primary-color)" x="0" y="0" width="142" height="142" />

        <!-- Auto padding zone (striped, height animates with arrow) -->
        <rect x="0" y="0" width="142" fill="url(#autoDiagonalStripesPortrait)">
          <animate attributeName="height" values="58;103;103;58" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
        </rect>

        <!-- Scaled silhouette (simulates cover behavior) -->
        <g style="transform-origin: 71px 3px">
          <animateTransform attributeName="transform" type="scale"
            values="0.563 0.563;1 1;1 1;0.563 0.563" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <g transform="translate(26, 3)">
            <!-- Head (ellipse) -->
            <ellipse class="${styles$8.silhouette}" cx="45" cy="32" rx="26" ry="28" />
            <!-- Shoulders (curved path) -->
            <path class="${styles$8.silhouette}" d="M8 100 Q8 64 45 64 Q82 64 82 100" />
          </g>
        </g>

        <!-- Corner markers (position-only animation, fixed size) -->
        <g class="${styles$8.cornerMarker}">
          <!-- Top-left -->
          <path d="M0 0 h5 M0 0 v5">
            <animateTransform attributeName="transform" type="translate"
              values="45 3;26 3;26 3;45 3" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
          <!-- Top-right -->
          <path d="M0 0 h-5 M0 0 v5">
            <animateTransform attributeName="transform" type="translate"
              values="97 3;116 3;116 3;97 3" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
          <!-- Bottom-left -->
          <path d="M0 0 h5 M0 0 v-5">
            <animateTransform attributeName="transform" type="translate"
              values="45 55;26 100;26 100;45 55" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
          <!-- Bottom-right -->
          <path d="M0 0 h-5 M0 0 v-5">
            <animateTransform attributeName="transform" type="translate"
              values="97 55;116 100;116 100;97 55" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </path>
        </g>

        <!-- Arrow (centered between viewport edge and motif) -->
        <g class="${styles$8.arrow}" style="stroke-width: 2">
          <animateTransform attributeName="transform" type="translate"
            values="${arrowX.split(';').map(x => `${x} 3`).join(';')}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <line x1="0" y1="0" x2="0" y2="52">
            <animate attributeName="y2" values="52;97;97;52" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </line>
          <polyline points="-5,5 0,0 5,5" />
          <polyline points="-5,47 0,52 5,47">
            <animateTransform attributeName="transform" type="translate"
              values="0 0;0 45;0 45;0 0" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
          </polyline>
        </g>

        <!-- Text lines (inside viewport, animated to follow motif) -->
        <g class="${styles$8.textBlock}">
          <animateTransform attributeName="transform" type="translate"
            values="${textX}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <rect x="${centerRagged ? 0 : 0}" y="0" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 7.5 : 0}" y="6" width="40" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 2.5 : 0}" y="12" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 12.5 : 0}" y="18" width="30" height="1.4" rx="0.7" />
          <!-- Second paragraph -->
          <rect x="${centerRagged ? 2.5 : 0}" y="30" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 5 : 0}" y="36" width="45" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 0 : 0}" y="42" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 10 : 0}" y="48" width="35" height="1.4" rx="0.7" />
        </g>
      </g>
    </svg>
  `;
}
function intersectingManualSvg(portrait, layout) {
  if (portrait) {
    return intersectingManualSvgPortrait(layout);
  }
  const right = layout === 'right';
  const center = layout === 'center' || layout === 'centerRagged';
  const centerRagged = layout === 'centerRagged';
  const arrowX = right ? '125;150;150;125' : '55;30;30;55';
  const textX = right ? '63;100;100;63' : center ? '55;55;55;55' : '47;10;10;47';
  return `
    <svg viewBox="0 0 180 80" class="${styles$8.svg}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${I18n.t(`${prefix}.intersecting_manual`)}</title>
      <defs>
        <!-- Animated viewport clipping rect (4:3 to full width) -->
        <clipPath id="intersectingManualViewport">
          <rect y="0" height="80">
            <animate attributeName="x" values="37;0;0;37" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
            <animate attributeName="width" values="106;180;180;106" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
          </rect>
        </clipPath>
${diagonalStripesPattern('manualDiagonalStripes')}
      </defs>

      <!-- Clipped viewport area -->
      <g clip-path="url(#intersectingManualViewport)">
        <!-- Viewport background -->
        <rect fill="var(--ui-primary-color)" x="0" y="0" width="180" height="80" />

        <!-- Manual padding zone (striped, 3px gap below arrow) -->
        <rect x="0" y="0" width="180" height="26" fill="url(#manualDiagonalStripes)" />

        <!-- Dimmed motif and corners in manual mode -->
        <g style="opacity: 0.5">
          <!-- Scaled silhouette (simulates cover behavior, extends behind text) -->
          <g style="transform-origin: 90px 3px">
            <animateTransform attributeName="transform" type="scale"
              values="0.589 0.589;1 1;1 1;0.589 0.589" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
            <g transform="translate(60, 3)">
              <!-- Head (ellipse) -->
              <ellipse class="${styles$8.silhouette}" cx="30" cy="18" rx="13" ry="14" />
              <!-- Shoulders (curved path) -->
              <path class="${styles$8.silhouette}" d="M8 52 Q8 34 30 34 Q52 34 52 52" />
            </g>
          </g>

          <!-- Corner markers (position-only animation, fixed size) -->
          <g class="${styles$8.cornerMarker}">
            <!-- Top-left -->
            <path d="M0 0 h5 M0 0 v5">
              <animateTransform attributeName="transform" type="translate"
                values="72 3;60 3;60 3;72 3" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
            <!-- Top-right -->
            <path d="M0 0 h-5 M0 0 v5">
              <animateTransform attributeName="transform" type="translate"
                values="108 3;120 3;120 3;108 3" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
            <!-- Bottom-left -->
            <path d="M0 0 h5 M0 0 v-5">
              <animateTransform attributeName="transform" type="translate"
                values="72 34;60 55;60 55;72 34" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
            <!-- Bottom-right -->
            <path d="M0 0 h-5 M0 0 v-5">
              <animateTransform attributeName="transform" type="translate"
                values="108 34;120 55;120 55;108 34" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
          </g>
        </g>

        <!-- Arrow (horizontal animation only, fixed height, 7px gap to text) -->
        <g class="${styles$8.arrow}">
          <animateTransform attributeName="transform" type="translate"
            values="${arrowX.split(';').map(x => `${x} 3`).join(';')}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <line x1="0" y1="0" x2="0" y2="20" />
          <polyline points="-4,4 0,0 4,4" />
          <polyline points="-4,16 0,20 4,16" />
        </g>

        <!-- Text lines (horizontal animation, fixed y, intersects motif) -->
        <g class="${styles$8.textBlock}">
          <animateTransform attributeName="transform" type="translate"
            values="${textX.split(';').map(x => `${x} 30`).join(';')}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <!-- Main paragraph -->
          <rect x="${centerRagged ? 0 : 0}" y="0" width="70" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 10 : 0}" y="6" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 5 : 0}" y="12" width="60" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 15 : 0}" y="18" width="40" height="1.4" rx="0.7" />
          <!-- Clipped paragraph below -->
          <rect x="${centerRagged ? 2.5 : 0}" y="30" width="65" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 10 : 0}" y="36" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 0 : 0}" y="42" width="70" height="1.4" rx="0.7" />
        </g>
      </g>
    </svg>
  `;
}
function intersectingManualSvgPortrait(layout) {
  // Canvas: 142x142, animates viewport width from 142 (square) to 80 (9:16)
  // Height stays fixed at 142. Only x and width animate.
  // Square: x=0, width=142 | 9:16: x=31, width=80
  // Scale factor: 142/80 ≈ 1.775 → 0.563 (motif scales with viewport width)
  const right = layout === 'right';
  const center = layout === 'center' || layout === 'centerRagged';
  const centerRagged = layout === 'centerRagged';
  const arrowX = right ? '129;104;104;129' : '13;38;38;13';
  const textX = right ? '79 50;48 50;48 50;79 50' : center ? '44 50;44 50;44 50;44 50' : '8 50;39 50;39 50;8 50';
  return `
    <svg viewBox="0 0 142 142" class="${styles$8.svg}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${I18n.t(`${prefix}.intersecting_manual`)}</title>
      <defs>
        <!-- Animated viewport clipping rect (square to 9:16, width only) -->
        <clipPath id="intersectingManualViewportPortrait">
          <rect y="0" height="142">
            <animate attributeName="x" values="0;31;31;0" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
            <animate attributeName="width" values="142;80;80;142" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="${easing}" />
          </rect>
        </clipPath>
${diagonalStripesPattern('manualDiagonalStripesPortrait')}
      </defs>

      <!-- Clipped viewport area -->
      <g clip-path="url(#intersectingManualViewportPortrait)">
        <!-- Viewport background -->
        <rect fill="var(--ui-primary-color)" x="0" y="0" width="142" height="142" />

        <!-- Manual padding zone (striped, fixed height) -->
        <rect x="0" y="0" width="142" height="46" fill="url(#manualDiagonalStripesPortrait)" />

        <!-- Dimmed motif and corners in manual mode -->
        <g style="opacity: 0.5">
          <!-- Scaled silhouette (simulates cover behavior) -->
          <g style="transform-origin: 71px 3px">
            <animateTransform attributeName="transform" type="scale"
              values="1 1;0.563 0.563;0.563 0.563;1 1" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="${easing}" />
            <g transform="translate(26, 3)">
              <!-- Head (ellipse) -->
              <ellipse class="${styles$8.silhouette}" cx="45" cy="32" rx="26" ry="28" />
              <!-- Shoulders (curved path) -->
              <path class="${styles$8.silhouette}" d="M8 100 Q8 64 45 64 Q82 64 82 100" />
            </g>
          </g>

          <!-- Corner markers (position-only animation, fixed size) -->
          <g class="${styles$8.cornerMarker}">
            <!-- Top-left -->
            <path d="M0 0 h5 M0 0 v5">
              <animateTransform attributeName="transform" type="translate"
                values="26 3;45 3;45 3;26 3" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
            <!-- Top-right -->
            <path d="M0 0 h-5 M0 0 v5">
              <animateTransform attributeName="transform" type="translate"
                values="116 3;97 3;97 3;116 3" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
            <!-- Bottom-left -->
            <path d="M0 0 h5 M0 0 v-5">
              <animateTransform attributeName="transform" type="translate"
                values="26 100;45 55;45 55;26 100" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
            <!-- Bottom-right -->
            <path d="M0 0 h-5 M0 0 v-5">
              <animateTransform attributeName="transform" type="translate"
                values="116 100;97 55;97 55;116 100" dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="${easing}" />
            </path>
          </g>
        </g>

        <!-- Arrow (horizontal animation only, fixed height) -->
        <g class="${styles$8.arrow}" style="stroke-width: 2">
          <animateTransform attributeName="transform" type="translate"
            values="${arrowX.split(';').map(x => `${x} 3`).join(';')}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <line x1="0" y1="0" x2="0" y2="40" />
          <polyline points="-5,5 0,0 5,5" />
          <polyline points="-5,35 0,40 5,35" />
        </g>

        <!-- Text lines (horizontal animation, fixed y, intersects motif) -->
        <g class="${styles$8.textBlock}">
          <animateTransform attributeName="transform" type="translate"
            values="${textX}" dur="4s" repeatCount="indefinite"
            calcMode="spline" keySplines="${easing}" />
          <!-- Main paragraph -->
          <rect x="${centerRagged ? 0 : 0}" y="0" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 7.5 : 0}" y="6" width="40" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 2.5 : 0}" y="12" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 12.5 : 0}" y="18" width="30" height="1.4" rx="0.7" />
          <!-- Second paragraph -->
          <rect x="${centerRagged ? 2.5 : 0}" y="30" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 5 : 0}" y="36" width="45" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 0 : 0}" y="42" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 10 : 0}" y="48" width="35" height="1.4" rx="0.7" />
          <!-- Third paragraph -->
          <rect x="${centerRagged ? 0 : 0}" y="60" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 7.5 : 0}" y="66" width="40" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? 2.5 : 0}" y="72" width="50" height="1.4" rx="0.7" />
        </g>
      </g>
    </svg>
  `;
}
function sideBySideSvg(portrait, layout) {
  // Center layout not supported for side-by-side, fall back to left
  const right = layout === 'right';
  if (portrait) {
    const motifX = right ? 4 : 58;
    const textX = right ? 47 : 8;
    const arrowX = right ? 75 : 25;
    return `
      <svg viewBox="0 0 100 110" class="${styles$8.svg}"
           xmlns="http://www.w3.org/2000/svg" role="img">
        <title>${I18n.t(`${prefix}.side_by_side`)}</title>
        <defs>
          ${diagonalStripesPattern('diagonalStripesPortrait')}
        </defs>

        <!-- Viewport background -->
        <rect fill="var(--ui-primary-color)" x="0" y="0" width="100" height="110" />

        <!-- Manual padding zone (striped, extends to top corners) -->
        <rect fill="url(#diagonalStripesPortrait)" x="0" y="0" width="100" height="30" />

        ${staticArrow(arrowX, 5)}

        <!-- Motif area with corner markers and silhouette -->
        <g transform="translate(${motifX}, 35)">
          <!-- Corner markers (L-brackets, thinner style) -->
          <path class="${styles$8.cornerMarker}" d="M0 0 h5 M0 0 v5" />
          <path class="${styles$8.cornerMarker}" d="M38 0 h-5 M38 0 v5" />
          <path class="${styles$8.cornerMarker}" d="M0 38 h5 M0 38 v-5" />
          <path class="${styles$8.cornerMarker}" d="M38 38 h-5 M38 38 v-5" />

          <!-- Head (ellipse) -->
          <ellipse class="${styles$8.silhouette}" cx="19" cy="12" rx="10" ry="11" />

          <!-- Shoulders (curved path) -->
          <path class="${styles$8.silhouette}" d="M5 38 Q5 24 19 24 Q33 24 33 38" />
        </g>

        <!-- Text lines (side by side with motif) -->
        <g class="${styles$8.textBlock}" transform="translate(${textX}, 38)">
          <!-- Main paragraph -->
          <rect x="0" y="0" width="45" height="1.4" rx="0.7" />
          <rect x="0" y="6" width="35" height="1.4" rx="0.7" />
          <rect x="0" y="12" width="42" height="1.4" rx="0.7" />
          <rect x="0" y="18" width="30" height="1.4" rx="0.7" />
          <!-- Second paragraph -->
          <rect x="0" y="30" width="40" height="1.4" rx="0.7" />
          <rect x="0" y="36" width="45" height="1.4" rx="0.7" />
          <rect x="0" y="42" width="35" height="1.4" rx="0.7" />
          <rect x="0" y="48" width="42" height="1.4" rx="0.7" />
        </g>
      </svg>
    `;
  }
  const motifX = right ? 10 : 115;
  const textX = right ? 90 : 10;
  const arrowX = right ? 135 : 45;
  return `
    <svg viewBox="0 0 180 80" class="${styles$8.svg}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${I18n.t(`${prefix}.side_by_side`)}</title>
      <defs>
        ${diagonalStripesPattern('diagonalStripes')}
      </defs>

      <!-- Viewport background -->
      <rect fill="var(--ui-primary-color)" x="0" y="0" width="180" height="80" />

      <!-- Manual padding zone (striped, extends to top corners) -->
      <rect class="${styles$8.spacingZone}" x="0" y="0" width="180" height="30" />

      ${staticArrow(arrowX, 5)}

      <!-- Motif area with corner markers and silhouette (centered vertically) -->
      <g class="${styles$8.motifArea}" transform="translate(${motifX}, 20)">
        <!-- Corner markers (L-brackets) -->
        <path class="${styles$8.cornerMarker}" d="M0 0 h5 M0 0 v5" />
        <path class="${styles$8.cornerMarker}" d="M55 0 h-5 M55 0 v5" />
        <path class="${styles$8.cornerMarker}" d="M0 40 h5 M0 40 v-5" />
        <path class="${styles$8.cornerMarker}" d="M55 40 h-5 M55 40 v-5" />

        <!-- Head (ellipse) -->
        <ellipse class="${styles$8.silhouette}" cx="27" cy="13" rx="9" ry="10" />

        <!-- Shoulders (curved path) -->
        <path class="${styles$8.silhouette}" d="M14 40 Q14 25 27 25 Q40 25 40 40" />
      </g>

      <!-- Text lines -->
      <g class="${styles$8.textBlock}" transform="translate(${textX}, 35)">
        <!-- Main paragraph -->
        <rect x="0" y="0" width="80" height="1.4" rx="0.7" />
        <rect x="0" y="6" width="55" height="1.4" rx="0.7" />
        <rect x="0" y="12" width="70" height="1.4" rx="0.7" />
        <rect x="0" y="18" width="45" height="1.4" rx="0.7" />
        <!-- Clipped paragraph below -->
        <rect x="0" y="30" width="65" height="1.4" rx="0.7" />
        <rect x="0" y="36" width="50" height="1.4" rx="0.7" />
        <rect x="0" y="42" width="70" height="1.4" rx="0.7" />
      </g>
    </svg>
  `;
}
function topPaddingSvg(portrait, layout) {
  const right = layout === 'right';
  const center = layout === 'center' || layout === 'centerRagged';
  const centerRagged = layout === 'centerRagged';
  if (portrait) {
    const textX = center ? 10 : right ? 10 : 10;
    const arrowX = center ? 50 : 50;
    return `
      <svg viewBox="0 0 100 110" class="${styles$8.svg}"
           xmlns="http://www.w3.org/2000/svg" role="img">
        <title>${I18n.t(`${prefix}.top_padding`)}</title>
        <defs>
          ${diagonalStripesPattern('topPaddingStripesPortrait')}
        </defs>

        <!-- Viewport background -->
        <rect fill="var(--ui-primary-color)" x="0" y="0" width="100" height="110" />

        <!-- Top padding zone (striped) -->
        <rect fill="url(#topPaddingStripesPortrait)" x="0" y="0" width="100" height="30" />

        ${staticArrow(arrowX, 5)}

        <!-- Text lines -->
        <g class="${styles$8.textBlock}">
          <!-- Main paragraph -->
          <rect x="${centerRagged ? textX : textX}" y="35" width="80" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 12.5 : textX}" y="41" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 5 : textX}" y="47" width="70" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 17.5 : textX}" y="53" width="45" height="1.4" rx="0.7" />
          <!-- Second paragraph -->
          <rect x="${centerRagged ? textX + 2.5 : textX}" y="65" width="75" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 10 : textX}" y="71" width="60" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX : textX}" y="77" width="80" height="1.4" rx="0.7" />
          <!-- Clipped paragraph below -->
          <rect x="${centerRagged ? textX + 5 : textX}" y="89" width="70" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 15 : textX}" y="95" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 7.5 : textX}" y="101" width="65" height="1.4" rx="0.7" />
        </g>
      </svg>
    `;
  }
  const textX = right ? 90 : center ? 50 : 10;
  const arrowX = right ? 135 : center ? 90 : 45;
  return `
    <svg viewBox="0 0 180 80" class="${styles$8.svg}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${I18n.t(`${prefix}.top_padding`)}</title>
      <defs>
        ${diagonalStripesPattern('topPaddingStripes')}
      </defs>

      <!-- Viewport background -->
      <rect fill="var(--ui-primary-color)" x="0" y="0" width="180" height="80" />

      <!-- Top padding zone (striped) -->
      <rect fill="url(#topPaddingStripes)" x="0" y="0" width="180" height="30" />

      ${staticArrow(arrowX, 5)}

      <!-- Text lines -->
      <g class="${styles$8.textBlock}">
        <!-- Main paragraph -->
        <rect x="${centerRagged ? textX : textX}" y="35" width="80" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 12.5 : textX}" y="41" width="55" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 5 : textX}" y="47" width="70" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 17.5 : textX}" y="53" width="45" height="1.4" rx="0.7" />
        <!-- Clipped paragraph below -->
        <rect x="${centerRagged ? textX + 5 : textX}" y="65" width="70" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 15 : textX}" y="71" width="50" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 7.5 : textX}" y="77" width="65" height="1.4" rx="0.7" />
      </g>
    </svg>
  `;
}
function bottomPaddingSvg(portrait, layout) {
  const right = layout === 'right';
  const center = layout === 'center' || layout === 'centerRagged';
  const centerRagged = layout === 'centerRagged';
  if (portrait) {
    const textX = center ? 10 : right ? 10 : 10;
    const arrowX = center ? 50 : 50;
    return `
      <svg viewBox="0 0 100 110" class="${styles$8.svg}"
           xmlns="http://www.w3.org/2000/svg" role="img">
        <title>${I18n.t(`${prefix}.bottom_padding`)}</title>
        <defs>
          ${diagonalStripesPattern('bottomPaddingStripesPortrait')}
        </defs>

        <!-- Viewport background -->
        <rect fill="var(--ui-primary-color)" x="0" y="0" width="100" height="110" />

        <!-- Text lines (with clipped paragraph above to show continuation) -->
        <g class="${styles$8.textBlock}">
          <!-- Clipped paragraph above -->
          <rect x="${centerRagged ? textX + 5 : textX}" y="1" width="70" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 15 : textX}" y="7" width="50" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 7.5 : textX}" y="13" width="65" height="1.4" rx="0.7" />
          <!-- Main paragraph -->
          <rect x="${centerRagged ? textX : textX}" y="25" width="80" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 12.5 : textX}" y="31" width="55" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 5 : textX}" y="37" width="70" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 17.5 : textX}" y="43" width="45" height="1.4" rx="0.7" />
          <!-- Second paragraph -->
          <rect x="${centerRagged ? textX + 2.5 : textX}" y="55" width="75" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX + 10 : textX}" y="61" width="60" height="1.4" rx="0.7" />
          <rect x="${centerRagged ? textX : textX}" y="67" width="80" height="1.4" rx="0.7" />
        </g>

        <!-- Bottom padding zone (striped, extends to bottom corners) -->
        <rect fill="url(#bottomPaddingStripesPortrait)" x="0" y="80" width="100" height="30" />

        ${staticArrow(arrowX, 85)}
      </svg>
    `;
  }
  const textX = right ? 90 : center ? 50 : 10;
  const arrowX = right ? 135 : center ? 90 : 45;
  return `
    <svg viewBox="0 0 180 80" class="${styles$8.svg}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${I18n.t(`${prefix}.bottom_padding`)}</title>
      <defs>
        ${diagonalStripesPattern('bottomPaddingStripes')}
      </defs>

      <!-- Viewport background -->
      <rect fill="var(--ui-primary-color)" x="0" y="0" width="180" height="80" />

      <!-- Text lines (with clipped paragraph above to show continuation) -->
      <g class="${styles$8.textBlock}">
        <!-- Clipped paragraph above -->
        <rect x="${centerRagged ? textX + 5 : textX}" y="1" width="70" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 15 : textX}" y="7" width="50" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 7.5 : textX}" y="13" width="65" height="1.4" rx="0.7" />
        <!-- Main paragraph -->
        <rect x="${centerRagged ? textX : textX}" y="25" width="80" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 12.5 : textX}" y="31" width="55" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 5 : textX}" y="37" width="70" height="1.4" rx="0.7" />
        <rect x="${centerRagged ? textX + 17.5 : textX}" y="43" width="45" height="1.4" rx="0.7" />
      </g>

      <!-- Bottom padding zone (striped, extends to bottom corners) -->
      <rect fill="url(#bottomPaddingStripes)" x="0" y="50" width="180" height="30" />

      ${staticArrow(arrowX, 55)}
    </svg>
  `;
}
const easing = '0.4 0 0.2 1;0 0 1 1;0.4 0 0.2 1';
function diagonalStripesPattern(id) {
  return `
    <pattern id="${id}" patternUnits="userSpaceOnUse"
             width="6" height="6" patternTransform="rotate(45)">
      <rect x="0" y="0" width="3" height="6" fill="currentColor" opacity="0.1" />
    </pattern>
  `;
}
function staticArrow(x, y) {
  return `
    <g class="${styles$8.arrow}" transform="translate(${x}, ${y})">
      <line x1="0" y1="0" x2="0" y2="20" />
      <polyline points="-4,4 0,0 4,4" />
      <polyline points="-4,16 0,20 4,16" />
    </g>
  `;
}

var img$3 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 3 24 27' fill='none' stroke='hsl(197%2c 37%25%2c 24%25)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M12 22v-6'%3e%3c/path%3e%3cpath d='M4 12H2'%3e%3c/path%3e%3cpath d='M10 12H8'%3e%3c/path%3e%3cpath d='M16 12h-2'%3e%3c/path%3e%3cpath d='M22 12h-2'%3e%3c/path%3e%3cpath d='m15 19-3 3-3-3'%3e%3c/path%3e%3c/svg%3e";

var img$4 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 -3 24 21' fill='none' stroke='hsl(197%2c 37%25%2c 24%25)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M12 8V2'%3e%3c/path%3e%3cpath d='M4 12H2'%3e%3c/path%3e%3cpath d='M10 12H8'%3e%3c/path%3e%3cpath d='M16 12h-2'%3e%3c/path%3e%3cpath d='M22 12h-2'%3e%3c/path%3e%3cpath d='m15 5-3-3-3 3'%3e%3c/path%3e%3c/svg%3e";

const EditDefaultsView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_defaults',
  goBackPath: '/meta_data/widgets',
  configure: function (configurationEditor) {
    defineEntryDefaultsInputs(configurationEditor, {
      entry: this.options.entry,
      renderInfoBox
    });
  }
});
function defineEntryDefaultsInputs(configurationEditor, {
  entry,
  model,
  renderInfoBox = () => {}
}) {
  configurationEditor.tab('sections', {
    model
  }, function () {
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
      icon: img$3,
      values: paddingTopScale.values,
      texts: paddingTopScale.texts,
      defaultValue: paddingTopScale.defaultValue
    });
    this.input('bottomPaddingVisualization', SectionPaddingVisualizationView, {
      variant: 'bottomPadding'
    });
    this.input('defaultSectionPaddingBottom', SliderInputView, {
      hideLabel: true,
      icon: img$4,
      values: paddingBottomScale.values,
      texts: paddingBottomScale.texts,
      defaultValue: paddingBottomScale.defaultValue
    });
  });
  configurationEditor.tab('content_elements', {
    model
  }, function () {
    renderInfoBox(this, 'content_elements');
    this.view(ContentElementTypeSeparatorView, {
      typeName: I18n.t('pageflow_scrolled.editor.edit_defaults.all_elements')
    });
    this.input('defaultContentElementFullWidthInPhoneLayout', CheckBoxInputView);
    const [captionVariants, captionVariantTexts] = entry.getComponentVariants({
      name: 'figureCaption'
    });
    if (captionVariants.length) {
      this.input('defaultCaptionVariant', SelectInputView, {
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' + 'common_content_element_attributes.' + 'captionVariant.blank',
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
          pictogram: contentElementType.pictogram || img,
          typeName: contentElementType.displayName
        });
        const context = editor.contentElementTypes.createDefaultsInputContext(tabView, contentElementType.typeName);
        contentElementType.defaultsInputs.call(context);
      }
    });
  });
}
function defineEntryDefaultsInputsFromSeed(configurationEditor, {
  seed,
  themeName,
  model,
  renderInfoBox
}) {
  defineEntryDefaultsInputs(configurationEditor, {
    entry: createDefaultsEntry({
      seed,
      themeName
    }),
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

const StorylinesTabsView = Marionette.View.extend({
  initialize() {
    this.listenTo(this.options.entry, 'change:currentExcursionId', this.updateTab);
  },
  render() {
    this.tabsView = new TabsView({
      i18n: 'pageflow_scrolled.editor.storylines_tabs',
      defaultTab: this.options.entry.isCurrentSectionInExcursion() ? 'excursions' : 'main'
    });
    ['main', 'excursions'].forEach(name => {
      const storyline = this.options.entry.storylines[name]();
      if (storyline) {
        this.tabsView.tab(name, () => new this.options.itemViewContstuctor({
          model: storyline,
          ...this.options.itemViewOptions
        }));
      }
    });
    this.appendSubview(this.tabsView);
    return this;
  },
  updateTab() {
    if (this.tabsView) {
      const tabName = this.options.entry.isCurrentSectionInExcursion() ? 'excursions' : 'main';
      this.tabsView.changeTab(tabName);
    }
  }
});

var styles$9 = {"thumbnail":"SectionThumbnailView-module_thumbnail__RcXov"};

const SectionThumbnailView = Marionette.ItemView.extend({
  template: () => `
    <div class=${styles$9.thumbnail}></div>
  `,
  ui: cssModulesUtils.ui(styles$9, 'thumbnail'),
  modelEvents: {
    'change:id': 'renderThumbnail'
  },
  onRender() {
    this.timeout = setTimeout(() => {
      this.renderThumbnail();
    }, 100);
  },
  onClose() {
    clearTimeout(this.timeout);
    ReactDOM.unmountComponentAtNode(this.ui.thumbnail[0]);
  },
  renderThumbnail() {
    if (!this.model.isNew()) {
      ReactDOM.render(React.createElement(StandaloneSectionThumbnail, {
        sectionPermaId: this.model.get('permaId'),
        seed: this.options.entry.scrolledSeed,
        subscribe: dispatch => watchCollections(this.options.entry, {
          dispatch
        })
      }), this.ui.thumbnail[0]);
    }
  }
});

var styles$a = {"selectionColor":"var(--ui-selection-color)","selectionWidth":"3px","root":"SectionItemView-module_root__1Pp0d","withTransition":"SectionItemView-module_withTransition__wCxlq outline-module_sectionWithTransition__21DW-","hiddenIndicator":"SectionItemView-module_hiddenIndicator__3G8er","hidden":"SectionItemView-module_hidden__2QkaH","outline":"SectionItemView-module_outline__fTHiS","active":"SectionItemView-module_active__1tLN5","cutoffIndicator":"SectionItemView-module_cutoffIndicator__1Oofa","thumbnailContainer":"SectionItemView-module_thumbnailContainer__1Xe7C","thumbnail":"SectionItemView-module_thumbnail__1ecBT","clickMask":"SectionItemView-module_clickMask__2JYEH","dragHandle":"SectionItemView-module_dragHandle__nY7mf outline-module_dragHandle__3ATeR icons-module_drag__p7HUE icons-module_icon__16IVx","invert":"SectionItemView-module_invert__XRpuB","inner":"SectionItemView-module_inner__MwFda","dropDownButton":"SectionItemView-module_dropDownButton__34CFJ","creating":"SectionItemView-module_creating__3Pjx9","destroying":"SectionItemView-module_destroying__1m53s","failed":"SectionItemView-module_failed__1CR2R","editTransition":"SectionItemView-module_editTransition__2L7ZU outline-module_transition__2Re1s","transition":"SectionItemView-module_transition__8a57E","creatingIndicator":"SectionItemView-module_creatingIndicator__1GnKq outline-module_creatingIndicator__3O7Rw outline-module_indicator__2dw_X icons-module_arrowsCcw__3_nrJ icons-module_icon__16IVx animations-module_blink__32C5j","destroyingIndicator":"SectionItemView-module_destroyingIndicator__HtKWF outline-module_destroyingIndicator__2-mKh outline-module_indicator__2dw_X icons-module_trash__DH1EH icons-module_icon__16IVx animations-module_blink__32C5j","failedIndicator":"SectionItemView-module_failedIndicator__1HVHn outline-module_failedIndicator__2QK1F outline-module_indicator__2dw_X icons-module_attention__1sssG icons-module_icon__16IVx"};

var styles$b = {"selectionColor":"var(--ui-selection-color)","selectionWidth":"3px","insertLineWidth":"4px","insertLineColor":"var(--ui-selection-color)","selectable":"SelectableSectionItemView-module_selectable__1d94L","outline":"SelectableSectionItemView-module_outline__2JNhq","clickMask":"SelectableSectionItemView-module_clickMask___oD4l SectionItemView-module_clickMask__2JYEH","-webkit-mask":"SelectableSectionItemView-module_mask__1z_9M","mask":"SelectableSectionItemView-module_mask__1z_9M","upperMask":"SelectableSectionItemView-module_upperMask__1N8nx SelectableSectionItemView-module_mask__1z_9M","lowerMask":"SelectableSectionItemView-module_lowerMask__24t8P SelectableSectionItemView-module_mask__1z_9M","indicatorTooltip":"SelectableSectionItemView-module_indicatorTooltip__1gGk9 insertIndicator-module_tooltip__2bprP","insertBeforeMask":"SelectableSectionItemView-module_insertBeforeMask__3ih0K SelectableSectionItemView-module_upperMask__1N8nx SelectableSectionItemView-module_mask__1z_9M","insertAfterMask":"SelectableSectionItemView-module_insertAfterMask__3uA00 SelectableSectionItemView-module_lowerMask__24t8P SelectableSectionItemView-module_mask__1z_9M","indicatorTooltipTop":"SelectableSectionItemView-module_indicatorTooltipTop__1r3Ns SelectableSectionItemView-module_indicatorTooltip__1gGk9 insertIndicator-module_tooltip__2bprP","indicatorTooltipBottom":"SelectableSectionItemView-module_indicatorTooltipBottom__33pnn SelectableSectionItemView-module_indicatorTooltip__1gGk9 insertIndicator-module_tooltip__2bprP","insertAtBeginningMask":"SelectableSectionItemView-module_insertAtBeginningMask__BB-TW SelectableSectionItemView-module_upperMask__1N8nx SelectableSectionItemView-module_mask__1z_9M","insertAtEndMask":"SelectableSectionItemView-module_insertAtEndMask__3VR9y SelectableSectionItemView-module_lowerMask__24t8P SelectableSectionItemView-module_mask__1z_9M","indicatorTooltipInsideTop":"SelectableSectionItemView-module_indicatorTooltipInsideTop__2j8xV SelectableSectionItemView-module_indicatorTooltip__1gGk9 insertIndicator-module_tooltip__2bprP","indicatorTooltipInsideBottom":"SelectableSectionItemView-module_indicatorTooltipInsideBottom__k0AFJ SelectableSectionItemView-module_indicatorTooltip__1gGk9 insertIndicator-module_tooltip__2bprP"};

const SelectableSectionItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className() {
    return classNames(styles$a.root, {
      [styles$b.selectable]: !this.options.mode
    });
  },
  template: data => `
    <div class="${styles$b.outline} ${styles$a.outline}">
      <div class="${styles$a.thumbnailContainer}">
        <div class="${styles$a.thumbnail}"></div>
        ${data.mode === 'insertPosition' ? `
          <a class="${styles$b.insertBeforeMask}" href="">
            <span class="${styles$b.indicatorTooltipTop}">
              ${I18n.t('pageflow_scrolled.editor.selectable_section_item.insert_here')}
            </span>
          </a>
          <a class="${styles$b.insertAfterMask}" href="">
            <span class="${styles$b.indicatorTooltipBottom}">
              ${I18n.t('pageflow_scrolled.editor.selectable_section_item.insert_here')}
            </span>
          </a>
        ` : data.mode === 'sectionPart' ? `
          <a class="${styles$b.insertAtBeginningMask}" href="">
            <span class="${styles$b.indicatorTooltipInsideTop}">
              ${I18n.t('pageflow_scrolled.editor.selectable_section_item.insert_at_beginning')}
            </span>
          </a>
          <a class="${styles$b.insertAtEndMask}" href="">
            <span class="${styles$b.indicatorTooltipInsideBottom}">
              ${I18n.t('pageflow_scrolled.editor.selectable_section_item.insert_at_end')}
            </span>
          </a>
        ` : `
          <a class="${styles$b.clickMask}"
             href=""
             title="${I18n.t('pageflow_scrolled.editor.selectable_section_item.title')}">
          </a>
        `}
      </div>
    </div>
  `,
  ui: cssModulesUtils.ui(styles$a, 'thumbnail'),
  serializeData() {
    return {
      mode: this.options.mode
    };
  },
  events: cssModulesUtils.events(styles$b, {
    [`click clickMask`]: function (event) {
      event.preventDefault();
      this.options.onSelect(this.model);
    },
    [`click insertBeforeMask`]: function (event) {
      event.preventDefault();
      this.options.onSelectInsertPosition({
        section: this.model,
        position: 'before'
      });
    },
    [`click insertAfterMask`]: function (event) {
      event.preventDefault();
      this.options.onSelectInsertPosition({
        section: this.model,
        position: 'after'
      });
    },
    [`click insertAtBeginningMask`]: function (event) {
      event.preventDefault();
      this.options.onSelectSectionPart({
        section: this.model,
        part: 'beginning'
      });
    },
    [`click insertAtEndMask`]: function (event) {
      event.preventDefault();
      this.options.onSelectSectionPart({
        section: this.model,
        part: 'end'
      });
    }
  }),
  onRender() {
    this.subview(new SectionThumbnailView({
      el: this.ui.thumbnail,
      model: this.model,
      entry: this.options.entry
    }));
  }
});

var styles$c = {"indicatorIconColor":"var(--ui-primary-color-light)","root":"ChapterItemView-module_root__19GIF outline-module_chapter__2J-r6","selectableHover":"ChapterItemView-module_selectableHover__222px","header":"ChapterItemView-module_header__UadC0","link":"ChapterItemView-module_link__2dj_z ChapterItemView-module_header__UadC0","outlineLink":"ChapterItemView-module_outlineLink__1rY1x outline-module_chapterLink__3oEhM icons-module_rightOpen__9vsOG icons-module_icon__16IVx ChapterItemView-module_link__2dj_z ChapterItemView-module_header__UadC0","dragHandle":"ChapterItemView-module_dragHandle__GZ6T8 outline-module_dragHandle__3ATeR icons-module_drag__p7HUE icons-module_icon__16IVx","number":"ChapterItemView-module_number__1GjyC","title":"ChapterItemView-module_title__3jVXE","blank":"ChapterItemView-module_blank__QKWPp","hiddenInNavigation":"ChapterItemView-module_hiddenInNavigation__ijr6M","sections":"ChapterItemView-module_sections__3zg2a outline-module_sections__2wjfN","creating":"ChapterItemView-module_creating__c1q2b","creatingIndicator":"ChapterItemView-module_creatingIndicator__2zOEN outline-module_creatingIndicator__3O7Rw outline-module_indicator__2dw_X icons-module_arrowsCcw__3_nrJ icons-module_icon__16IVx animations-module_blink__32C5j","destroying":"ChapterItemView-module_destroying__2PP1l","destroyingIndicator":"ChapterItemView-module_destroyingIndicator__2YZaB outline-module_destroyingIndicator__2-mKh outline-module_indicator__2dw_X icons-module_trash__DH1EH icons-module_icon__16IVx animations-module_blink__32C5j","failed":"ChapterItemView-module_failed__2MtQW","failedIndicator":"ChapterItemView-module_failedIndicator__2s6Xk outline-module_failedIndicator__2QK1F outline-module_indicator__2dw_X icons-module_attention__1sssG icons-module_icon__16IVx","addSection":"ChapterItemView-module_addSection__3XQvI buttons-module_addButton__2pN-g buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_plusCircled__20FlJ icons-module_icon__16IVx outline-module_button__1HdOY"};

var styles$d = {"insertLineWidth":"4px","insertLineColor":"var(--ui-selection-color)","root":"SelectableChapterItemView-module_root__2tf69","empty":"SelectableChapterItemView-module_empty__ppHrN","emptyChapterInsertMask":"SelectableChapterItemView-module_emptyChapterInsertMask__25vJa","indicatorTooltip":"SelectableChapterItemView-module_indicatorTooltip__3xhUv insertIndicator-module_tooltip__2bprP"};

const SelectableChapterItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className() {
    return classNames(styles$c.root, styles$d.root, {
      [styles$d.empty]: this.model.sections.length === 0
    });
  },
  template: data => `
    ${data.selectable ? `
      <a class="${styles$c.link}"
         href=""
         title="${I18n.t(`pageflow_scrolled.editor.selectable_chapter_item.title`)}">
        <span class="${styles$c.number}"></span>
        <span class="${styles$c.title}"></span>
      </a>
    ` : `
      <span class="${styles$c.header}">
        <span class="${styles$c.number}"></span>
        <span class="${styles$c.title}"></span>
      </span>
    `}
    <ul class="${styles$c.sections}"></ul>
    ${data.mode === 'insertPosition' ? `
      <a class="${styles$d.emptyChapterInsertMask}" href="">
        <span class="${styles$d.indicatorTooltip}">
          ${I18n.t('pageflow_scrolled.editor.selectable_chapter_item.insert_here')}
        </span>
      </a>
    ` : ''}
    `,
  ui: cssModulesUtils.ui(styles$c, 'title', 'number', 'sections'),
  serializeData() {
    return {
      mode: this.options.mode,
      selectable: this.options.mode !== 'insertPosition' && this.options.mode !== 'sectionPart'
    };
  },
  events() {
    return {
      ...cssModulesUtils.events(styles$c, {
        'click link': function (event) {
          event.preventDefault();
          this.options.onSelectChapter(this.model);
        },
        'mouseenter link': function () {
          this.$el.addClass(styles$c.selectableHover);
        },
        'mouseleave link': function () {
          this.$el.removeClass(styles$c.selectableHover);
        }
      }),
      ...cssModulesUtils.events(styles$d, {
        'click emptyChapterInsertMask': function (event) {
          event.preventDefault();
          this.options.onSelectInsertPosition({
            chapter: this.model,
            position: 'into'
          });
        }
      })
    };
  },
  modelEvents: {
    change: 'update'
  },
  onRender() {
    this.subview(new CollectionView({
      el: this.ui.sections,
      collection: this.model.sections,
      itemViewConstructor: SelectableSectionItemView,
      itemViewOptions: {
        entry: this.options.entry,
        mode: this.options.mode,
        onSelect: this.options.onSelectSection,
        onSelectInsertPosition: this.options.onSelectInsertPosition,
        onSelectSectionPart: this.options.onSelectSectionPart
      }
    }));
    this.update();
  },
  update() {
    this.ui.title.text(this.model.getDisplayTitle());
    this.ui.number.text(this.model.getDisplayNumber());
  }
});

var styles$e = {"root":"StorylineItemView-module_root__tOb-J outline-module_storyline__2caVZ","collapsed":"StorylineItemView-module_collapsed__36KAp outline-module_collapsed__2L3iH","expandChapters":"StorylineItemView-module_expandChapters__2gFO_","expandChaptersButton":"StorylineItemView-module_expandChaptersButton__3Iioa buttons-module_saveButton__1M-qM buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_check__3Lkw9 icons-module_icon__16IVx","chapters":"StorylineItemView-module_chapters__3SlSX","addChapter":"StorylineItemView-module_addChapter__Bvchl buttons-module_addButton__2pN-g buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_plusCircled__20FlJ icons-module_icon__16IVx outline-module_button__1HdOY"};

var selectableStyles = {"blankSlate":"SelectableStorylineItemView-module_blankSlate__1p1Vg"};

function blankSlateView(isMain) {
  return Marionette.ItemView.extend({
    className: selectableStyles.blankSlate,
    template: data => I18n.t(data.translationKey),
    serializeData() {
      return {
        translationKey: isMain ? 'pageflow_scrolled.editor.selectable_storyline_item.blank_slate' : 'pageflow_scrolled.editor.selectable_storyline_item.blank_slate_excursions'
      };
    }
  });
}
const SelectableStorylineItemView = Marionette.ItemView.extend({
  template: () => `
    <ul class="${styles$e.chapters}"></ul>
  `,
  ui: cssModulesUtils.ui(styles$e, 'chapters'),
  onRender() {
    this.subview(new CollectionView({
      el: this.ui.chapters,
      collection: this.model.chapters,
      itemViewConstructor: SelectableChapterItemView,
      itemViewOptions: {
        entry: this.options.entry,
        mode: this.options.mode,
        onSelectChapter: this.options.onSelectChapter,
        onSelectSection: this.options.onSelectSection,
        onSelectInsertPosition: this.options.onSelectInsertPosition,
        onSelectSectionPart: this.options.onSelectSectionPart
      },
      blankSlateViewConstructor: blankSlateView(this.model.isMain())
    }));
  }
});

var styles$f = {"tabs":"SelectableEntryOutlineView-module_tabs__2IrQ7"};

const SelectableEntryOutlineView = Marionette.Layout.extend({
  template: () => `
    <div class="${styles$f.tabs}"></div>
  `,
  ui: cssModulesUtils.ui(styles$f, 'tabs'),
  onRender() {
    this.appendSubview(new StorylinesTabsView({
      entry: this.options.entry,
      itemViewContstuctor: SelectableStorylineItemView,
      itemViewOptions: {
        entry: this.options.entry,
        mode: this.options.mode,
        onSelectChapter: this.options.onSelectChapter,
        onSelectSection: this.options.onSelectSection,
        onSelectInsertPosition: this.options.onSelectInsertPosition,
        onSelectSectionPart: this.options.onSelectSectionPart
      }
    }), {
      to: this.ui.tabs
    });
  }
});

var dialogViewStyles = {"backdrop":"dialogView-module_backdrop__2Goe6","box":"dialogView-module_box__1Tgag","header":"dialogView-module_header__35Taz","hint":"dialogView-module_hint__2_hs9","footer":"dialogView-module_footer__347pC","close":"dialogView-module_close__EwMQp buttons-module_cancelButton__1xJCN buttons-module_secondaryIconButton__4LT0V secondary_icon_button icons-module_cancel__1PjiX icons-module_icon__16IVx"};

const dialogView = {
  events: cssModulesUtils.events(dialogViewStyles, {
    'mousedown backdrop': function (event) {
      if (!event.target.closest(`.${dialogViewStyles.box}`)) {
        this.close();
      }
    },
    'click close': function () {
      this.close();
    }
  })
};

var styles$g = {"box":"SelectMoveDestinationDialogView-module_box__3K3KM","outlineContainer":"SelectMoveDestinationDialogView-module_outlineContainer__udtwV"};

const SelectMoveDestinationDialogView = Marionette.ItemView.extend({
  template: data => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles$g.box}">
        <h1 class="${dialogViewStyles.header}">${I18n.t(`pageflow_scrolled.editor.select_move_destination.header_${data.mode}`)}</h1>
        <p class="${dialogViewStyles.hint}">${I18n.t('pageflow_scrolled.editor.select_move_destination.hint')}</p>

        <div class="${styles$g.outlineContainer}"></div>

        <div class="${dialogViewStyles.footer}">
          <button type="submit" class="${dialogViewStyles.close} ${styles$g.close}">
            ${I18n.t('pageflow_scrolled.editor.select_move_destination.cancel')}
          </button>
        </div>
      </div>
    </div>
  `,
  ui: cssModulesUtils.ui(styles$g, 'outlineContainer'),
  mixins: [dialogView],
  serializeData() {
    return {
      mode: this.options.mode
    };
  },
  onRender() {
    const outlineOptions = {
      entry: this.options.entry,
      mode: this.options.mode
    };
    if (this.options.mode === 'insertPosition') {
      outlineOptions.onSelectInsertPosition = result => {
        this.options.onSelect(result);
        this.close();
      };
    } else if (this.options.mode === 'sectionPart') {
      outlineOptions.onSelectSectionPart = result => {
        this.options.onSelect(result);
        this.close();
      };
    } else {
      outlineOptions.onSelectSection = section => {
        this.options.onSelect(section);
        this.close();
      };
    }
    this.ui.outlineContainer.append(this.subview(new SelectableEntryOutlineView(outlineOptions)).el);
  }
});
SelectMoveDestinationDialogView.show = function (options) {
  const view = new SelectMoveDestinationDialogView(options);
  app.dialogRegion.show(view.render());
};

const HideShowSectionMenuItem = Backbone.Model.extend({
  initialize(attributes, {
    section
  }) {
    this.section = section;
    this.listenTo(section.configuration, 'change:hidden', this.update);
    this.update();
  },
  selected() {
    if (this.section.configuration.get('hidden')) {
      this.section.configuration.unset('hidden');
    } else {
      this.section.configuration.set('hidden', true);
    }
  },
  update() {
    this.set('label', I18n.t(this.section.configuration.get('hidden') ? 'pageflow_scrolled.editor.section_menu_items.show' : 'pageflow_scrolled.editor.section_menu_items.hide'));
  }
});
const DuplicateSectionMenuItem = Backbone.Model.extend({
  initialize(attributes, {
    section
  }) {
    this.section = section;
    this.set('label', I18n.t('pageflow_scrolled.editor.section_menu_items.duplicate'));
  },
  selected() {
    this.section.chapter.duplicateSection(this.section);
  }
});
const InsertSectionAboveMenuItem = Backbone.Model.extend({
  initialize(attributes, {
    section
  }) {
    this.section = section;
    this.set('label', I18n.t('pageflow_scrolled.editor.section_menu_items.insert_section_above'));
  },
  selected() {
    this.section.chapter.insertSection({
      before: this.section
    });
  }
});
const InsertSectionBelowMenuItem = Backbone.Model.extend({
  initialize(attributes, {
    section
  }) {
    this.section = section;
    this.set('label', I18n.t('pageflow_scrolled.editor.section_menu_items.insert_section_below'));
  },
  selected() {
    this.section.chapter.insertSection({
      after: this.section
    });
  }
});
const CutoffSectionMenuItem = Backbone.Model.extend({
  initialize(attributes, {
    cutoff,
    section
  }) {
    this.cutoff = cutoff;
    this.section = section;
    this.listenTo(cutoff, 'change', this.update);
    this.update();
  },
  selected() {
    if (this.cutoff.isAtSection(this.section)) {
      this.cutoff.reset();
    } else {
      this.cutoff.setSection(this.section);
    }
  },
  update() {
    this.set('label', I18n.t(this.cutoff.isAtSection(this.section) ? 'pageflow_scrolled.editor.section_menu_items.reset_cutoff' : 'pageflow_scrolled.editor.section_menu_items.set_cutoff'));
  }
});
const CopyPermalinkMenuItem = Backbone.Model.extend({
  initialize(attributes, {
    entry,
    section
  }) {
    this.entry = entry;
    this.section = section;
    this.set('label', I18n.t('pageflow_scrolled.editor.section_menu_items.copy_permalink'));
  },
  selected() {
    navigator.clipboard.writeText(this.entry.getSectionPermalink(this.section));
  }
});
const MoveSectionMenuItem = Backbone.Model.extend({
  initialize(attributes, {
    entry,
    section
  }) {
    this.entry = entry;
    this.section = section;
    this.set('label', I18n.t('pageflow_scrolled.editor.section_menu_items.move'));
  },
  selected() {
    const section = this.section;
    SelectMoveDestinationDialogView.show({
      entry: this.entry,
      mode: 'insertPosition',
      onSelect: ({
        section: targetSection,
        chapter: targetChapter,
        position
      }) => {
        if (position === 'into') {
          targetChapter.moveSection(section);
        } else if (position === 'before') {
          targetSection.chapter.moveSection(section, {
            before: targetSection
          });
        } else {
          targetSection.chapter.moveSection(section, {
            after: targetSection
          });
        }
      }
    });
  }
});
const DestroySectionMenuItem = DestroyMenuItem.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.destroy_section_menu_item',
  initialize(attributes, options) {
    DestroyMenuItem.prototype.initialize.call(this, attributes, {
      destroyedModel: options.section
    });
  }
});
function createSectionMenuItems({
  entry,
  section
}) {
  return [new DuplicateSectionMenuItem({}, {
    section
  }), new MoveSectionMenuItem({}, {
    entry,
    section
  }), new InsertSectionAboveMenuItem({}, {
    section
  }), new InsertSectionBelowMenuItem({}, {
    section
  }), ...(entry.cutoff.isEnabled() ? [new CutoffSectionMenuItem({}, {
    cutoff: entry.cutoff,
    section
  })] : []), new CopyPermalinkMenuItem({
    separated: true
  }, {
    entry,
    section
  }), new HideShowSectionMenuItem({
    separated: true
  }, {
    section
  }), new DestroySectionMenuItem({}, {
    section
  })];
}

var img$5 = "data:image/svg+xml,%3csvg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='random' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3cpath fill='hsla(197%2c 26%25%2c 23%25%2c 0.8)' d='M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 0 1-8.773-3.812l-70.556-75.596 53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971l80 79.981zM12 176h84l52.781 56.551 53.333-57.143-70.556-75.596A11.999 11.999 0 0 0 122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12zm372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 0 0-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176h32z'%3e%3c/path%3e%3c/svg%3e";

var img$6 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%23274754'%3e %3cpath stroke-linecap='round' stroke-linejoin='round' d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88' /%3e%3c/svg%3e";

const SectionItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: `${styles$a.root} ${styles$a.withTransition}`,
  mixins: [modelLifecycleTrackingView({
    classNames: styles$a
  })],
  template: data => `
    <div class="${styles$a.cutoffIndicator}">
      ${I18n.t('pageflow_scrolled.editor.section_item.cutoff')}
    </div>
    <button class="${styles$a.editTransition}">
      <img src="${img$5}" width="11" height="16">
      <span class="${styles$a.transition}">Überblenden</span>
    </button>
    <div class="${styles$a.outline}">
      <div class="${styles$a.inner}">
        <div class="${styles$a.thumbnailContainer}">
          <div class="${styles$a.dropDownButton}"></div>
          <div class="${styles$a.thumbnail}"></div>
          <div class="${styles$a.clickMask}">
            <div class="${styles$a.dragHandle}"
                 title="${I18n.t('pageflow_scrolled.editor.section_item.drag_hint')}"></div>
          </div>
        </div>
        <span class="${styles$a.creatingIndicator}" />
        <span class="${styles$a.destroyingIndicator}" />
        <span class="${styles$a.failedIndicator}"
              title="${I18n.t('pageflow_scrolled.editor.section_item.save_error')}" />
        <img class="${styles$a.hiddenIndicator}"
             title="${I18n.t('pageflow_scrolled.editor.section_item.hidden')}"
             src="${img$6}"
             width="30"
             height="30">
      </div>
    </div>
  `,
  ui: cssModulesUtils.ui(styles$a, 'thumbnail', 'dropDownButton', 'editTransition', 'transition', 'cutoffIndicator'),
  events: cssModulesUtils.events(styles$a, {
    'click clickMask': function () {
      this.options.entry.trigger('selectSection', this.model);
      this.options.entry.trigger('scrollToSection', this.model);
    },
    'dblclick clickMask': function () {
      this.options.entry.trigger('selectSectionSettings', this.model);
      this.options.entry.trigger('scrollToSection', this.model);
    },
    'click editTransition': function () {
      this.options.entry.trigger('selectSectionTransition', this.model);
      this.options.entry.trigger('scrollToSection', this.model);
    }
  }),
  initialize() {
    this.listenTo(this.options.entry, 'change:currentSectionIndex change:currentExcursionId', () => {
      const active = this.updateActive();
      if (active) {
        this.$el[0].scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    });
    this.listenTo(this.options.entry.sections, 'add', () => {
      this.updateActive();
      this.updateTransition();
    });
    this.listenTo(this.options.entry.cutoff, 'change', () => {
      this.updateCutoffIndicator();
    });
    this.listenTo(this.model.configuration, 'change:hidden', () => {
      this.updateHidden();
    });
  },
  onRender() {
    this.updateTransition();
    this.updateCutoffIndicator();
    this.updateHidden();
    if (this.updateActive()) {
      setTimeout(() => this.$el[0].scrollIntoView({
        block: 'nearest'
      }), 10);
    }
    this.$el.toggleClass(styles$a.invert, !!this.model.configuration.get('invert'));
    this.subview(new SectionThumbnailView({
      el: this.ui.thumbnail,
      model: this.model,
      entry: this.options.entry
    }));
    const dropDownMenuItems = new Backbone.Collection(createSectionMenuItems({
      entry: this.options.entry,
      section: this.model
    }));
    this.appendSubview(new DropDownButtonView({
      items: dropDownMenuItems,
      alignMenu: 'right',
      ellipsisIcon: true,
      borderless: true,
      openOnClick: true
    }), {
      to: this.ui.dropDownButton
    });
  },
  updateTransition() {
    this.ui.transition.text(I18n.t(this.model.getTransition(), {
      scope: 'pageflow_scrolled.editor.section_item.transitions'
    }));
  },
  updateCutoffIndicator() {
    this.ui.cutoffIndicator.css('display', this.options.entry.cutoff.isEnabled() && this.options.entry.cutoff.isAtSection(this.model) ? '' : 'none');
  },
  updateActive() {
    const active = this.model.isCurrent();
    this.$el.toggleClass(styles$a.active, active);
    this.$el.attr('aria-current', active ? 'true' : null);
    return active;
  },
  updateHidden() {
    this.$el.toggleClass(styles$a.hidden, !!this.model.configuration.get('hidden'));
  }
});

const ChapterItemView = Marionette.Layout.extend({
  tagName: 'li',
  className: `${styles$c.root}`,
  mixins: [modelLifecycleTrackingView({
    classNames: styles$c
  })],
  template: () => `
     <a class="${styles$c.outlineLink}" href="">
       <span class="${styles$c.dragHandle}"
             title="${I18n.t('pageflow_scrolled.editor.chapter_item.drag_hint')}"></span>
       <span class="${styles$c.number}"></span>
       <span class="${styles$c.title}"></span>
       <span class="${styles$c.creatingIndicator}" />
       <span class="${styles$c.destroyingIndicator}" />
       <span class="${styles$c.failedIndicator}"
             title="${I18n.t('pageflow_scrolled.editor.chapter_item.save_error')}" />
     </a>

     <ul class="${styles$c.sections}"></ul>

     <a href="" class="${styles$c.addSection}">${I18n.t('pageflow_scrolled.editor.chapter_item.add_section')}</a>
  `,
  ui: cssModulesUtils.ui(styles$c, 'title', 'number', 'sections'),
  events: cssModulesUtils.events(styles$c, {
    'click addSection': function () {
      this.model.addSection({});
    },
    'click link': function () {
      if (!this.model.isNew() && !this.model.isDestroying()) {
        editor$1.navigate('/scrolled/chapters/' + this.model.get('id'), {
          trigger: true
        });
      }
      return false;
    }
  }),
  modelEvents: {
    change: 'update'
  },
  onRender() {
    this.subview(new SortableCollectionView({
      el: this.ui.sections,
      collection: this.model.sections,
      itemViewConstructor: SectionItemView,
      itemViewOptions: {
        entry: this.options.entry
      },
      connectWith: cssModulesUtils.selector(styles$c, 'sections'),
      forceDraggableFallback: browser.agent.matchesDesktopSafari()
    }));
    this.update();
  },
  update() {
    this.ui.title.toggleClass(styles$c.blank, !this.model.configuration.get('title') && !!this.model.getDisplayNumber());
    this.ui.title.text(this.model.getDisplayTitle());
    this.ui.number.text(this.model.getDisplayNumber());
    if (this.model.configuration.get('hideInNavigation')) {
      this.ui.title.attr('title', I18n.t('pageflow_scrolled.editor.chapter_item.hidden_in_navigation'));
      this.ui.title.addClass(styles$c.hiddenInNavigation);
    }
  }
});

var img$7 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-34 0 228 128' width='228' height='128'%3e %3cdefs%3e %3cstyle%3e %40keyframes excursion-main-scale %7b 0%25%2c 10%25 %7b transform: scale(1)%3b filter: blur(0px)%3b opacity: 1%3b %7d 20%25%2c 60%25 %7b transform: scale(0.94)%3b filter: blur(1px)%3b opacity: 0.7%3b %7d 70%25%2c 100%25 %7b transform: scale(1)%3b filter: blur(0px)%3b opacity: 1%3b %7d %7d %40keyframes excursion-backdrop-fade %7b 0%25%2c 10%25 %7b opacity: 0%3b %7d 20%25%2c 60%25 %7b opacity: 1%3b %7d 70%25%2c 100%25 %7b opacity: 0%3b %7d %7d %40keyframes excursion-sheet-slide %7b 0%25%2c 10%25 %7b transform: translateY(128px)%3b opacity: 0%3b %7d 20%25%2c 30%25 %7b transform: translateY(0)%3b opacity: 1%3b %7d 50%25%2c 60%25 %7b transform: translateY(-90px)%3b opacity: 1%3b %7d 70%25%2c 100%25 %7b transform: translateY(-90px)%3b opacity: 0%3b %7d %7d %40keyframes excursion-close-position %7b 0%25%2c 15%25 %7b opacity: 0%3b transform: translate(184px%2c 32px)%3b %7d 20%25%2c 30%25 %7b opacity: 1%3b transform: translate(184px%2c 32px)%3b %7d 50%25%2c 60%25 %7b opacity: 1%3b transform: translate(184px%2c 10px)%3b %7d 70%25%2c 100%25 %7b opacity: 0%3b transform: translate(184px%2c 10px)%3b %7d %7d .main-storyline %7b animation: excursion-main-scale 5s ease infinite%3b transform-origin: center center%3b %7d .excursion-backdrop %7b animation: excursion-backdrop-fade 5s ease infinite%3b %7d .excursion-sheet %7b animation: excursion-sheet-slide 5s ease infinite%3b %7d .excursion-close %7b animation: excursion-close-position 5s ease infinite%3b %7d %3c/style%3e %3c/defs%3e %3c!-- Background --%3e %3crect x='-34' width='228' height='128' rx='4' fill='%232a5a7a'/%3e %3c!-- Main storyline section (background) --%3e %3cg class='main-storyline'%3e %3crect x='-34' width='228' height='128' fill='%232a5a7a'/%3e %3c!-- Section content --%3e %3cg transform='translate(16%2c 26)'%3e %3c!-- Heading --%3e %3crect x='0' y='0' width='60' height='4' rx='2' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3c!-- Text lines --%3e %3crect x='0' y='10' width='55' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3crect x='0' y='14' width='55' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3crect x='0' y='18' width='55' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3crect x='0' y='22' width='38' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3c!-- Image with play button --%3e %3cg transform='translate(85%2c 10)'%3e %3crect width='50' height='38' rx='2' fill='rgba(255%2c255%2c255%2c0.6)'/%3e %3c!-- Play button --%3e %3cpath d='M 22%2c14 L 22%2c24 L 32%2c19 Z' fill='white'/%3e %3c/g%3e %3c!-- Second paragraph --%3e %3crect x='0' y='32' width='55' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3crect x='0' y='36' width='55' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3crect x='0' y='40' width='38' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3c!-- Third paragraph --%3e %3crect x='0' y='50' width='55' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3crect x='0' y='54' width='55' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3crect x='0' y='58' width='55' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3crect x='0' y='62' width='55' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3crect x='0' y='66' width='55' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3crect x='0' y='70' width='42' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3c!-- Fourth paragraph --%3e %3crect x='0' y='80' width='55' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3crect x='0' y='84' width='55' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3crect x='0' y='88' width='55' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3crect x='0' y='92' width='38' height='1' fill='rgba(255%2c255%2c255%2c0.3)'/%3e %3c/g%3e %3c/g%3e %3c!-- Dark backdrop --%3e %3crect class='excursion-backdrop' x='-34' width='228' height='128' fill='rgba(0%2c0%2c0%2c0.4)'/%3e %3c!-- Excursion sheet --%3e %3cg class='excursion-sheet'%3e %3c!-- Sheet shadow --%3e %3crect x='-34' y='47' width='228' height='140' rx='0' fill='rgba(0%2c0%2c0%2c0.3)' filter='blur(4)'/%3e %3c!-- Sheet background --%3e %3crect x='-34' y='42' width='228' height='140' rx='0' fill='%23b8d4e8'/%3e %3c!-- Excursion content --%3e %3cg transform='translate(35%2c 56)'%3e %3c!-- Heading --%3e %3crect x='0' y='0' width='60' height='4' rx='2' fill='rgba(42%2c90%2c122%2c0.3)'/%3e %3c!-- Text lines --%3e %3crect x='0' y='10' width='90' height='1' fill='rgba(42%2c90%2c122%2c0.3)'/%3e %3crect x='0' y='14' width='90' height='1' fill='rgba(42%2c90%2c122%2c0.3)'/%3e %3crect x='0' y='18' width='90' height='1' fill='rgba(42%2c90%2c122%2c0.3)'/%3e %3crect x='0' y='22' width='90' height='1' fill='rgba(42%2c90%2c122%2c0.3)'/%3e %3crect x='0' y='26' width='63' height='1' fill='rgba(42%2c90%2c122%2c0.3)'/%3e %3c!-- Image --%3e %3crect x='13' y='34' width='65' height='49' rx='2' fill='rgba(42%2c90%2c122%2c0.6)'/%3e %3c!-- More content below --%3e %3crect x='0' y='93' width='90' height='1' fill='rgba(42%2c90%2c122%2c0.3)'/%3e %3crect x='0' y='97' width='90' height='1' fill='rgba(42%2c90%2c122%2c0.3)'/%3e %3crect x='0' y='101' width='90' height='1' fill='rgba(42%2c90%2c122%2c0.3)'/%3e %3crect x='0' y='105' width='63' height='1' fill='rgba(42%2c90%2c122%2c0.3)'/%3e %3c/g%3e %3c/g%3e %3c!-- Close button (separate%2c stays at top) --%3e %3cg class='excursion-close' transform='translate(184%2c 32)'%3e %3c!-- X icon --%3e %3cline x1='-3' y1='-3' x2='3' y2='3' stroke='white' stroke-width='2' stroke-linecap='round'/%3e %3cline x1='3' y1='-3' x2='-3' y2='3' stroke='white' stroke-width='2' stroke-linecap='round'/%3e %3c/g%3e%3c/svg%3e";

var styles$h = {"box":"ExcursionBlankSlateView-module_box__3-V9M","pictogram":"ExcursionBlankSlateView-module_pictogram__2fJ0X"};

const ExcursionBlankSlateView = Marionette.ItemView.extend({
  className: styles$h.box,
  template: () => `
    <div class="${styles$h.pictogram}">
      <img src="${img$7}" alt="" />
    </div>
    <div>
      ${I18n.t('pageflow_scrolled.editor.storyline_item.excursion_blank_slate')}
    </div>
  `
});

var outlineStyles = {"indicatorIconColor":"var(--ui-primary-color-light)","errorIconColor":"var(--ui-error-color)","chapter":"outline-module_chapter__2J-r6","chapterLink":"outline-module_chapterLink__3oEhM icons-module_rightOpen__9vsOG icons-module_icon__16IVx","collapsed":"outline-module_collapsed__2L3iH","sectionWithTransition":"outline-module_sectionWithTransition__21DW-","transition":"outline-module_transition__2Re1s","sections":"outline-module_sections__2wjfN","button":"outline-module_button__1HdOY","indicator":"outline-module_indicator__2dw_X","creatingIndicator":"outline-module_creatingIndicator__3O7Rw outline-module_indicator__2dw_X icons-module_arrowsCcw__3_nrJ icons-module_icon__16IVx animations-module_blink__32C5j","destroyingIndicator":"outline-module_destroyingIndicator__2-mKh outline-module_indicator__2dw_X icons-module_trash__DH1EH icons-module_icon__16IVx animations-module_blink__32C5j","failedIndicator":"outline-module_failedIndicator__2QK1F outline-module_indicator__2dw_X icons-module_attention__1sssG icons-module_icon__16IVx","dragHandle":"outline-module_dragHandle__3ATeR icons-module_drag__p7HUE icons-module_icon__16IVx","storyline":"outline-module_storyline__2caVZ"};

const StorylineItemView = Marionette.Layout.extend({
  className: styles$e.root,
  template: () => `
    <div class="${styles$e.expandChapters} info_box info">
      <p>
        ${I18n.t('pageflow_scrolled.editor.storyline_item.reorder_chapters')}
      </p>

      <button class="${styles$e.expandChaptersButton}">
        ${I18n.t('pageflow_scrolled.editor.storyline_item.done')}
      </button>
    </div>
    <ul class="${styles$e.chapters}"></ul>

    <a class="${styles$e.addChapter}" href="">
    </a>
  `,
  ui: cssModulesUtils.ui(styles$e, 'chapters', 'addChapter'),
  events: {
    ...cssModulesUtils.events(styles$e, {
      'click addChapter': function () {
        this.model.addChapter();
      },
      'click expandChaptersButton': function () {
        this.options.viewModel.set('collapsed', false);
      }
    }),
    ...cssModulesUtils.events(outlineStyles, {
      'dragstart chapterLink': function (event) {
        if (!this.options.viewModel.get('collapsed')) {
          event.preventDefault();
          this.options.viewModel.set('collapsed', true);
        }
      }
    })
  },
  onRender() {
    this.ui.addChapter.text(I18n.t(this.model.isMain() ? 'pageflow_scrolled.editor.storyline_item.add_chapter' : 'pageflow_scrolled.editor.storyline_item.add_excursion'));
    this.sortableCollectionView = new SortableCollectionView({
      el: this.ui.chapters,
      collection: this.model.chapters,
      itemViewConstructor: ChapterItemView,
      itemViewOptions: {
        entry: this.options.entry
      },
      blankSlateViewConstructor: this.model.isMain() ? null : ExcursionBlankSlateView
    });
    this.subview(this.sortableCollectionView);
    this.sortableCollectionView.disableSorting();
    this.listenTo(this.options.viewModel, 'change:collapsed', (model, collapsed) => {
      this.$el.toggleClass(styles$e.collapsed, collapsed);
      if (collapsed) {
        this.sortableCollectionView.enableSorting();
      } else {
        this.sortableCollectionView.disableSorting();
      }
    });
  }
});

var styles$i = {"root":"EntryOutlineView-module_root__3NBUB undefined","tabs":"EntryOutlineView-module_tabs__3Z4Cl","toolbar":"EntryOutlineView-module_toolbar__1ZYdQ","dropDownButton":"EntryOutlineView-module_dropDownButton__3oCqi","hover":"EntryOutlineView-module_hover__3cVso"};

const EntryOutlineView = Marionette.Layout.extend({
  tagName: 'nav',
  className: styles$i.root,
  template: () => `
    <div class="${styles$i.tabs}"></div>
    <div class="${styles$i.toolbar}">
      <div class="${styles$i.dropDownButton}"></div>
    </div>
  `,
  ui: cssModulesUtils.ui(styles$i, 'tabs', 'dropDownButton'),
  onRender() {
    const viewModel = new Backbone.Model({
      collapsed: false
    });
    const dropDownMenuItems = new Backbone.Collection();
    this.reorderChaptersMenutItem = new MenuItem({}, {
      viewModel,
      selected: () => viewModel.set('collapsed', !viewModel.get('collapsed'))
    });
    dropDownMenuItems.add(this.reorderChaptersMenutItem);
    this.appendSubview(new DropDownButtonView({
      items: dropDownMenuItems,
      alignMenu: 'right',
      ellipsisIcon: true,
      borderless: true,
      openOnClick: true
    }), {
      to: this.ui.dropDownButton
    });
    this.appendSubview(new StorylinesTabsView({
      entry: this.options.entry,
      itemViewContstuctor: StorylineItemView,
      itemViewOptions: {
        entry: this.options.entry,
        viewModel
      }
    }), {
      to: this.ui.tabs
    });
  }
});
const MenuItem = Backbone.Model.extend({
  initialize(attributes, options) {
    this.options = options;
    this.listenTo(this.options.viewModel, 'change:collapsed', this.updateLabel);
    this.updateLabel();
  },
  selected() {
    this.options.selected();
  },
  updateLabel() {
    this.set('label', this.options.viewModel.get('collapsed') ? I18n.t('pageflow_scrolled.editor.entry_outline.finish_reorder_chapters') : I18n.t('pageflow_scrolled.editor.entry_outline.reorder_chapters'));
  }
});

var styles$j = {"box":"InsertContentElementDialogView-module_box__3sdFf","categories":"InsertContentElementDialogView-module_categories__1MuZN","categoryName":"InsertContentElementDialogView-module_categoryName__m5BMX","types":"InsertContentElementDialogView-module_types__1bK1J","item":"InsertContentElementDialogView-module_item__2kSvL","type":"InsertContentElementDialogView-module_type__27bal buttons-module_unstyledButton__3m76W","typePictogram":"InsertContentElementDialogView-module_typePictogram__1d_ak","typeName":"InsertContentElementDialogView-module_typeName__1j6nc","typeDescription":"InsertContentElementDialogView-module_typeDescription__3yhqS","close":"InsertContentElementDialogView-module_close__18_6F"};

const InsertContentElementDialogView = Marionette.ItemView.extend({
  template: () => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles$j.box}">
        <h1 class="${dialogViewStyles.header}">${I18n.t('pageflow_scrolled.editor.insert_content_element.header')}</h1>
        <ul class="${styles$j.categories}"></ul>

        <div class="${dialogViewStyles.footer}">
          <button class="${dialogViewStyles.close} ${styles$j.close}">
            ${I18n.t('pageflow_scrolled.editor.insert_content_element.cancel')}
          </button>
        </div>
      </div>
    </div>
  `,
  ui: cssModulesUtils.ui(styles$j, 'categories'),
  mixins: [dialogView],
  events: {
    'click li button': function () {
      this.close();
    }
  },
  onRender() {
    this.subview(new CollectionView$1({
      el: this.ui.categories,
      collection: new Backbone.Collection(this.options.editor.contentElementTypes.groupedByCategory()),
      itemViewConstructor: CategoryView,
      itemViewOptions: {
        entry: this.options.entry,
        insertOptions: this.options.insertOptions
      }
    }));
  }
});
const CategoryView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles$j.category,
  template: ({
    displayName
  }) => `
    <h2 class="${styles$j.categoryName}">${displayName}</h2>
    <ul class="${styles$j.types}">
    </ul>
  `,
  ui: cssModulesUtils.ui(styles$j, 'types'),
  onRender() {
    this.subview(new CollectionView$1({
      el: this.ui.types,
      collection: new Backbone.Collection(this.model.get('contentElementTypes')),
      itemViewConstructor: ItemView,
      itemViewOptions: {
        entry: this.options.entry,
        insertOptions: this.options.insertOptions
      }
    }));
  }
});
const ItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles$j.item,
  template: ({
    displayName,
    description,
    pictogram,
    disabled
  }) => `
    <button class="${styles$j.type}"${disabled ? ' disabled' : ''}>
      <img class="${styles$j.typePictogram}" src="${pictogram || img}" width="20" height="20" />
      <span class="${styles$j.typeName}">${displayName}</span>
      <span class="${styles$j.typeDescription}">${description}</span>
    </button>
  `,
  events: {
    'click button': function () {
      this.options.entry.insertContentElement({
        typeName: this.model.get('typeName')
      }, this.options.insertOptions);
    }
  },
  serializeData() {
    return {
      ...this.model.attributes,
      disabled: this.options.insertOptions.at === 'backdropOfSection' && !this.model.get('supportedPositions').includes('backdrop')
    };
  }
});
InsertContentElementDialogView.show = function (options) {
  const view = new InsertContentElementDialogView(options);
  app.dialogRegion.show(view.render());
};

var styles$k = {"box":"SelectLinkDestinationDialogView-module_box__1mIW3","urlContainer":"SelectLinkDestinationDialogView-module_urlContainer__2bty0","or":"SelectLinkDestinationDialogView-module_or__3U4Ky","openInNewTabContainer":"SelectLinkDestinationDialogView-module_openInNewTabContainer__2R6Ev","createButton":"SelectLinkDestinationDialogView-module_createButton__KxILH buttons-module_saveButton__1M-qM buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_check__3Lkw9 icons-module_icon__16IVx","outlineContainer":"SelectLinkDestinationDialogView-module_outlineContainer__1niKf","fileContainer":"SelectLinkDestinationDialogView-module_fileContainer__29VBM","selectFileButton":"SelectLinkDestinationDialogView-module_selectFileButton__1zxzi buttons-module_selectFileButton__khOoU buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_rightOpen__9vsOG icons-module_icon__16IVx"};

const SelectLinkDestinationDialogView = Marionette.ItemView.extend({
  template: () => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles$k.box}">
        <h1 class="${dialogViewStyles.header}">${I18n.t('pageflow_scrolled.editor.select_link_destination.header')}</h1>

        <form class="${styles$k.urlContainer} configuration_editor_tab">
          <div><button class="${styles$k.createButton}">
            ${I18n.t('pageflow_scrolled.editor.select_link_destination.create')}
          </button></div>
        </form>

        <div class="${styles$k.or}">
          ${I18n.t('pageflow_scrolled.editor.select_link_destination.or')}
        </div>

        <div class="${styles$k.fileContainer}">
          <div>
            <label><span class="name">
              ${I18n.t('pageflow_scrolled.editor.select_link_destination.select_file')}
            </span></label>
            <div>
              ${I18n.t('pageflow_scrolled.editor.select_link_destination.select_file_description')}
            </div>
          </div>
          <div>
            <button type="button" class="${styles$k.selectFileButton}">
              ${I18n.t('pageflow_scrolled.editor.select_link_destination.select_in_sidebar')}
            </button>
          </div>
        </div>

        <div class="${styles$k.or}">
          ${I18n.t('pageflow_scrolled.editor.select_link_destination.or')}
        </div>

        <label><span class="name">
          ${I18n.t('pageflow_scrolled.editor.select_link_destination.select_chapter_or_section')}
        </span></label>
        <div class="${styles$k.outlineContainer}"></div>

        <div class="${dialogViewStyles.footer}">
          <button type="submit" class="${dialogViewStyles.close} ${styles$k.close}">
            ${I18n.t('pageflow_scrolled.editor.select_link_destination.cancel')}
          </button>
        </div>
      </div>
    </div>
  `,
  ui: cssModulesUtils.ui(styles$k, 'urlContainer', 'outlineContainer'),
  mixins: [dialogView],
  events: cssModulesUtils.events(styles$k, {
    'submit urlContainer': function (event) {
      event.preventDefault();
      this.createExternalLink();
    },
    'click selectFileButton': function () {
      this.selectFile();
    }
  }),
  createExternalLink() {
    if (!this.externalLink.get('url')) {
      this.$el.find('input[type=text]').focus();
      return;
    }
    const link = {
      href: this.externalLink.get('url')
    };
    if (this.externalLink.get('openInNewTab')) {
      link.openInNewTab = true;
    }
    this.options.onSelect(link);
    this.close();
  },
  selectFile() {
    currentFileSelectionCallback = file => {
      this.options.onSelect({
        href: {
          file: {
            permaId: file.get('perma_id'),
            collectionName: utils.camelize(file.fileType().collectionName)
          }
        }
      });
    };
    editor$1.selectFile(null, 'linkDestination', {
      label: I18n.t('pageflow_scrolled.editor.select_link_destination.selection_label')
    });
    this.close();
  },
  onRender() {
    this.externalLink = new Backbone.Model();
    this.externalLink.modelName = 'externalLink';
    this.ui.urlContainer.prepend(this.subview(new CheckBoxInputView({
      model: this.externalLink,
      propertyName: 'openInNewTab',
      label: I18n.t('pageflow_scrolled.editor.select_link_destination.open_in_new_tab')
    })).el);
    this.ui.urlContainer.prepend(this.subview(new TextInputView({
      model: this.externalLink,
      propertyName: 'url',
      label: I18n.t('pageflow_scrolled.editor.select_link_destination.enter_url'),
      maxLength: 2000
    })).el);
    this.ui.outlineContainer.append(this.subview(new SelectableEntryOutlineView({
      entry: this.options.entry,
      onSelectChapter: chapter => {
        this.options.onSelect({
          href: {
            chapter: chapter.get(`permaId`)
          }
        });
        this.close();
      },
      onSelectSection: section => {
        this.options.onSelect({
          href: {
            section: section.get(`permaId`)
          }
        });
        this.close();
      }
    })).el);
  }
});
SelectLinkDestinationDialogView.show = function (options) {
  const view = new SelectLinkDestinationDialogView(options);
  app.dialogRegion.show(view.render());
};
let currentFileSelectionCallback;
const FileSelectionHandler$1 = function (options) {
  this.call = function (file) {
    currentFileSelectionCallback(file);
  };
  this.getReferer = function () {
    return '/';
  };
};
editor$1.registerFileSelectionHandler('linkDestination', FileSelectionHandler$1);

const PreviewMessageController = Object$1.extend({
  initialize({
    entry,
    iframeWindow,
    editor
  }) {
    this.entry = entry;
    this.iframeWindow = iframeWindow;
    this.editor = editor;
    if (entry.reviewSession) {
      this.reviewMessageHandler = ReviewMessageHandler.create({
        session: entry.reviewSession,
        targetWindow: iframeWindow
      });
    }
    this.listener = this.handleMessage.bind(this);
    window.addEventListener('message', this.listener);
  },
  dispose() {
    window.removeEventListener('message', this.listener);
    if (this.reviewMessageHandler) this.reviewMessageHandler.dispose();
  },
  handleMessage(message) {
    const postMessage = message => {
      this.iframeWindow.postMessage(message, window.location.origin);
    };
    if (window.location.href.indexOf(message.origin) === 0) {
      if (message.data.type === 'READY') {
        if (!this.ready) {
          this.ready = true;
          watchCollections(this.entry, {
            dispatch: action => {
              postMessage({
                type: 'ACTION',
                payload: action
              });
            }
          });
          this.listenTo(this.entry, 'scrollToSection', (section, options) => postMessage({
            type: 'SCROLL_TO_SECTION',
            payload: {
              id: section.id,
              ...options
            }
          }));
          this.listenTo(this.entry, 'scrollToContentElement', (contentElement, options) => postMessage({
            type: 'SCROLL_TO_CONTENT_ELEMENT',
            payload: {
              id: contentElement.id,
              ...options
            }
          }));
          this.listenTo(this.entry.contentElements, 'postCommand', (contentElementId, command) => postMessage({
            type: 'CONTENT_ELEMENT_EDITOR_COMMAND',
            payload: {
              contentElementId,
              command
            }
          }));
          this.listenTo(this.entry, 'selectSection', section => postMessage({
            type: 'SELECT',
            payload: {
              id: section.id,
              type: 'section'
            }
          }));
          this.listenTo(this.entry, 'selectSectionSettings', section => postMessage({
            type: 'SELECT',
            payload: {
              id: section.id,
              type: 'sectionSettings'
            }
          }));
          this.listenTo(this.entry, 'selectSectionTransition', section => postMessage({
            type: 'SELECT',
            payload: {
              id: section.id,
              type: 'sectionTransition'
            }
          }));
          this.listenTo(this.entry, 'selectSectionPaddings', section => postMessage({
            type: 'SELECT',
            payload: {
              id: section.id,
              type: 'sectionPaddings'
            }
          }));
          this.listenTo(this.entry, 'selectContentElement', (contentElement, options) => {
            postMessage({
              type: 'SELECT',
              payload: {
                id: contentElement.id,
                range: options === null || options === void 0 ? void 0 : options.range,
                navigate: options === null || options === void 0 ? void 0 : options.navigate,
                type: 'contentElement'
              }
            });
          });
          this.listenTo(this.entry, 'selectCommentThread', threadId => {
            postMessage({
              type: 'SELECT_COMMENT_THREAD',
              payload: {
                threadId
              }
            });
          });
          this.listenTo(this.entry, 'selectNewThread', payload => {
            postMessage({
              type: 'SELECT',
              payload: {
                type: 'newThread',
                ...payload
              }
            });
          });

          // SELECT_COMMENT_THREAD is dropped for threads the iframe does
          // not know yet.
          if (this.entry.reviewSession) {
            this.listenTo(this.entry.reviewSession, 'create:thread', thread => {
              const model = modelForSubject(this.entry, thread);
              if (!model) return;
              postMessage({
                type: 'SELECT',
                payload: {
                  id: model.id,
                  type: thread.subjectType === 'Section' ? 'sectionComments' : 'contentElementComments',
                  highlightedThreadId: thread.id
                }
              });
            });
          }
          this.listenTo(this.entry, 'selectWidget', widget => {
            postMessage({
              type: 'SELECT',
              payload: {
                id: widget.get('role'),
                type: 'widget'
              }
            });
          });
          this.listenTo(this.entry, 'resetSelection', contentElement => postMessage({
            type: 'SELECT',
            payload: null
          }));
          this.listenTo(this.entry.commentDisplayFilter, 'change:resolution change:alwaysShowComments', filter => postMessage({
            type: 'CHANGE_COMMENT_DISPLAY_FILTER',
            payload: commentDisplayFilterPayload(filter)
          }));
          this.listenTo(this.entry, 'change:emulation_mode', entry => postMessage({
            type: 'CHANGE_EMULATION_MODE',
            payload: this.entry.get('emulation_mode')
          }));
        }
        postMessage({
          type: 'ACK'
        });
        if (this.entry.reviewSession) {
          // A reloaded iframe starts out displaying unresolved threads
          // everywhere.
          postMessage({
            type: 'CHANGE_COMMENT_DISPLAY_FILTER',
            payload: commentDisplayFilterPayload(this.entry.commentDisplayFilter)
          });
          this.entry.reviewSession.fetch();
        }
      } else if (message.data.type === 'CHANGE_SECTION') {
        this.entry.set({
          currentSectionIndex: message.data.payload.sectionIndex,
          currentExcursionId: message.data.payload.excursionId
        });
      } else if (message.data.type === 'SELECTED') {
        const {
          type,
          id,
          subjectType,
          subjectId,
          position
        } = message.data.payload;
        this.preservedScrollTarget = null;
        this.entry.set({
          highlightedThreadId: type === 'contentElementComments' ? message.data.payload.highlightedThreadId : undefined,
          selectedCommentsSubject: selectedCommentsSubjectFor(this.entry, message.data.payload)
        });
        if (type === 'contentElementComments' || type === 'sectionComments') {
          if (!onCommentsView() && message.data.payload.source !== 'editor') {
            this.editor.navigate('/scrolled/comments?tab=selection', {
              trigger: true
            });
          }
        } else if (type === 'newThread') {
          const {
            range
          } = message.data.payload;
          const payload = encodeURIComponent(JSON.stringify({
            subjectRange: range
          }));
          this.editor.navigate(`/scrolled/comment_threads/new?subjectType=${subjectType}` + `&subjectId=${subjectId}&payload=${payload}`, {
            trigger: true
          });
        } else if (type === 'contentElement') {
          if (message.data.payload.navigate !== false) {
            const contentElement = this.entry.contentElements.get(id);
            this.editor.navigate(contentElement.getEditorPath(), {
              trigger: true
            });
          }
        } else if (type === 'sectionSettings') {
          this.editor.navigate(`/scrolled/sections/${id}`, {
            trigger: true
          });
        } else if (type === 'sectionPaddings') {
          this.preservedScrollTarget = {
            sectionId: id,
            align: position === 'bottom' ? 'nearEnd' : undefined
          };
          const query = position ? `?position=${position}` : '';
          this.editor.navigate(`/scrolled/sections/${id}/paddings${query}`, {
            trigger: true
          });
        } else if (type === 'sectionTransition') {
          this.editor.navigate(`/scrolled/sections/${id}/transition`, {
            trigger: true
          });
        } else if (type === 'widget') {
          this.editor.navigate(`/widgets/${id}`, {
            trigger: true
          });
        } else {
          this.editor.navigate('/', {
            trigger: true
          });
        }
      } else if (message.data.type === 'SELECT_LINK_DESTINATION') {
        SelectLinkDestinationDialogView.show({
          entry: this.entry,
          onSelect(result) {
            postMessage({
              type: 'LINK_DESTINATION_SELECTED',
              payload: result
            });
          }
        });
      } else if (message.data.type === 'INSERT_CONTENT_ELEMENT') {
        const {
          id,
          at,
          splitPoint
        } = message.data.payload;
        InsertContentElementDialogView.show({
          entry: this.entry,
          insertOptions: {
            at,
            id,
            splitPoint
          },
          editor: this.editor
        });
      } else if (message.data.type === 'MOVE_CONTENT_ELEMENT') {
        const {
          id,
          range,
          to
        } = message.data.payload;
        this.entry.moveContentElement({
          id,
          range
        }, to);
      } else if (message.data.type === 'UPDATE_CONTENT_ELEMENT') {
        const {
          id,
          configuration,
          commentThreadSubjectRanges
        } = message.data.payload;
        const contentElement = this.entry.contentElements.get(id);
        if (commentThreadSubjectRanges) {
          this.entry.updateContentElement(contentElement, configuration, {
            commentThreadSubjectRanges
          });
        } else {
          contentElement.configuration.set(configuration, {
            ignoreInWatchCollection: true
          });
        }
      } else if (message.data.type === 'UPDATE_WIDGET') {
        const {
          role,
          configuration
        } = message.data.payload;
        this.entry.widgets.findWhere({
          role
        }).configuration.set(configuration, {
          ignoreInWatchCollection: true
        });
      } else if (message.data.type === 'UPDATE_TRANSIENT_CONTENT_ELEMENT_STATE') {
        const {
          id,
          state
        } = message.data.payload;
        const contentElement = this.entry.contentElements.get(id);
        contentElement && contentElement.set('transientState', state);
      } else if (message.data.type === 'SAVED_SCROLL_POINT' && this.currentScrollPointCallback) {
        this.currentScrollPointCallback();
        this.currentScrollPointCallback = null;
        setTimeout(() => postMessage({
          type: 'RESTORE_SCROLL_POINT'
        }), 100);
      }
    }
  },
  preserveScrollPoint(callback) {
    if (this.preservedScrollTarget) {
      const {
        sectionId,
        align
      } = this.preservedScrollTarget;
      callback();
      this.iframeWindow.postMessage({
        type: 'SCROLL_TO_SECTION',
        payload: {
          id: sectionId,
          align,
          behavior: 'instant'
        }
      }, window.location.origin);
    } else {
      this.currentScrollPointCallback = callback;
      this.iframeWindow.postMessage({
        type: 'SAVE_SCROLL_POINT'
      }, window.location.origin);
    }
  }
});
function selectedCommentsSubjectFor(entry, payload) {
  const {
    type,
    id,
    subjectType,
    subjectId
  } = payload;
  if (type === 'contentElement' || type === 'contentElementComments') {
    return {
      subjectType: 'ContentElement',
      id
    };
  }
  if (type === 'sectionComments' || type === 'sectionSettings' || type === 'sectionPaddings' || type === 'sectionTransition') {
    return {
      subjectType: 'Section',
      id
    };
  }
  if (type === 'newThread') {
    var _modelForSubject;
    return {
      subjectType,
      id: (_modelForSubject = modelForSubject(entry, {
        subjectType,
        subjectId
      })) === null || _modelForSubject === void 0 ? void 0 : _modelForSubject.id
    };
  }
  return undefined;
}
function commentDisplayFilterPayload(filter) {
  return {
    resolution: filter.get('resolution'),
    alwaysShowComments: filter.get('alwaysShowComments')
  };
}
function modelForSubject(entry, {
  subjectType,
  subjectId
}) {
  const collection = subjectType === 'Section' ? entry.sections : entry.contentElements;
  return collection.findWhere({
    permaId: subjectId
  });
}
function onCommentsView() {
  const fragment = Backbone.history.fragment || '';
  return fragment === 'scrolled/comments' || fragment.startsWith('scrolled/comments?');
}

var styles$l = {"blankEntry":"BlankEntryView-module_blankEntry__2FcvR"};

const BlankEntryView = Marionette.ItemView.extend({
  template: () => `
    <div class="blank_entry">
      <h2>${t('pageflow_scrolled.editor.blank_entry.header')}</h2>
      <p>${t('pageflow_scrolled.editor.blank_entry.intro')}</p>
      <ol>
        <li>${t('pageflow_scrolled.editor.blank_entry.create_chapter')}</li>
        <li>${t('pageflow_scrolled.editor.blank_entry.create_section')}</li>
        <li>${t('pageflow_scrolled.editor.blank_entry.create_content_element')}</li>
      </ol>
      <p>${t('pageflow_scrolled.editor.blank_entry.outro')}</p>
    </div>
  `,
  className: styles$l.blankEntry,
  onRender() {
    this.listenTo(this.model.sections, 'add remove', this.update);
    this.update();
  },
  update() {
    this.$el.toggle(!this.model.sections.length);
  }
});

var styles$m = {"root":"EntryPreviewView-module_root__1Nb6e","iframe":"EntryPreviewView-module_iframe__1leJC","phoneEmulationMode":"EntryPreviewView-module_phoneEmulationMode__3YXy_"};

const EntryPreviewView = Marionette.ItemView.extend({
  template: () => `
     <iframe class="${styles$m.iframe}" />
  `,
  className: styles$m.root,
  ui: cssModulesUtils.ui(styles$m, 'iframe'),
  modelEvents: {
    'change:emulation_mode': 'updateEmulationMode'
  },
  onRender() {
    this.appendSubview(new BlankEntryView({
      model: this.model
    }));
  },
  onShow() {
    this.messageController = new PreviewMessageController({
      entry: this.model,
      editor: this.options.editor,
      iframeWindow: this.ui.iframe[0].contentWindow
    });
    inject(this.ui.iframe[0], unescape($('[data-template="iframe_seed"]').html()));
  },
  onClose() {
    this.messageController.dispose();
  },
  updateEmulationMode: function () {
    this.messageController.preserveScrollPoint(() => {
      if (this.model.previous('emulation_mode')) {
        this.$el.removeClass(styles$m[this.emulationModeClassName(this.model.previous('emulation_mode'))]);
      }
      if (this.model.get('emulation_mode')) {
        this.$el.addClass(styles$m[this.emulationModeClassName(this.model.get('emulation_mode'))]);
      }
    });
  },
  emulationModeClassName: function (mode) {
    return `${mode}EmulationMode`;
  }
});
function inject(iframe, html) {
  var doc = iframe.document || iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.writeln(html);
  doc.close();
}
function unescape(text) {
  return text.replace(/<\\\//g, '</');
}

const SideBarRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'scrolled/comments?tab=:tab': 'comments',
    'scrolled/comments': 'comments',
    'scrolled/comments/activity': 'commentActivity',
    'scrolled/chapters/:id': 'chapter',
    'scrolled/sections/:id/transition': 'sectionTransition',
    'scrolled/sections/:id/paddings?position=:position': 'sectionPaddings',
    'scrolled/sections/:id/paddings': 'sectionPaddings',
    'scrolled/sections/:id': 'section',
    'scrolled/content_elements/:id': 'contentElement',
    'scrolled/comment_threads/new?subjectType=:subjectType&subjectId=:subjectId&payload=:payload': 'newThread'
  }
});

const CopyPermalinkMenuItem$1 = Backbone.Model.extend({
  initialize(attributes, {
    entry,
    chapter
  }) {
    this.entry = entry;
    this.chapter = chapter;
    this.set('label', I18n.t('pageflow_scrolled.editor.chapter_menu_items.copy_permalink'));
  },
  selected() {
    navigator.clipboard.writeText(this.entry.getChapterPermalink(this.chapter));
  }
});
const ToggleExcursionMenuItem = Backbone.Model.extend({
  initialize(attributes, {
    chapter
  }) {
    this.chapter = chapter;
    this.listenTo(chapter, 'change:storylineId', this.update);
    this.update();
  },
  selected() {
    this.chapter.toggleExcursion();
  },
  update() {
    this.set('label', I18n.t(this.chapter.isExcursion() ? 'pageflow_scrolled.editor.chapter_menu_items.move_to_main' : 'pageflow_scrolled.editor.chapter_menu_items.move_to_excursions'));
  }
});
const DestroyChapterMenuItem = DestroyMenuItem.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.destroy_chapter_menu_item',
  initialize(attributes, options) {
    DestroyMenuItem.prototype.initialize.call(this, attributes, {
      destroyedModel: options.chapter
    });
  }
});

const EditChapterView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_chapter',
  getActionsMenuItems() {
    return [new ToggleExcursionMenuItem({}, {
      chapter: this.model
    }), new CopyPermalinkMenuItem$1({}, {
      entry: this.options.entry,
      chapter: this.model
    }), new DestroyChapterMenuItem({
      separated: true
    }, {
      chapter: this.model
    })];
  },
  configure: function (configurationEditor) {
    const chapter = this.model;
    configurationEditor.tab(chapter.isExcursion() ? 'excursion' : 'chapter', function () {
      this.input('title', TextInputView);
      if (this.model.parent.storyline.isMain()) {
        this.input('hideInNavigation', CheckBoxInputView);
        this.input('summary', TextAreaInputView, {
          disableLinks: true
        });
      } else {
        this.group('ChapterExcursionSettings', {
          ignoreUndefined: true
        });
      }
    });
  }
});

var styles$n = {"preview":"SectionVisualization-module_preview__xab4h","inverted":"SectionVisualization-module_inverted__12Yty","center":"SectionVisualization-module_center__3xIRf","centerRagged":"SectionVisualization-module_centerRagged__4q_Kq","padded":"SectionVisualization-module_padded__xifxP","content":"SectionVisualization-module_content__P66J0","right":"SectionVisualization-module_right__2w8Rv","line":"SectionVisualization-module_line__1qwTt","shortLine":"SectionVisualization-module_shortLine__1B0gx","gap":"SectionVisualization-module_gap__2RTVp","shadowOverlay":"SectionVisualization-module_shadowOverlay__3nZlQ","left":"SectionVisualization-module_left__Eui3S","light":"SectionVisualization-module_light__t3W4r","cards":"SectionVisualization-module_cards__1Og7D","cardBox":"SectionVisualization-module_cardBox__adU-e","dark":"SectionVisualization-module_dark__WwjCD","split":"SectionVisualization-module_split__27rH0","splitOverlay":"SectionVisualization-module_splitOverlay__qqqyR"};

function SectionVisualization({
  layout,
  appearance,
  invert,
  padded
}) {
  const isCards = appearance === 'cards';
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$n.preview, styles$n[layout], {
      [styles$n.inverted]: isCards ? !invert : invert,
      [styles$n.padded]: padded,
      [styles$n.split]: appearance === 'split',
      [styles$n.cards]: isCards
    })
  }, /*#__PURE__*/React.createElement(Overlay, {
    appearance: appearance,
    invert: invert,
    padded: padded
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$n.content
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$n.line
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$n.line
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$n.line
  }), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$n.line, styles$n.shortLine)
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$n.gap
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$n.line
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$n.line
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$n.line
  }), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$n.line, styles$n.shortLine)
  })));
}
function Overlay({
  appearance,
  invert,
  padded
}) {
  switch (appearance) {
    case 'shadow':
      return /*#__PURE__*/React.createElement("div", {
        className: classNames(styles$n.shadowOverlay, {
          [styles$n.light]: invert,
          [styles$n.padded]: padded
        })
      });
    case 'cards':
      return /*#__PURE__*/React.createElement("div", {
        className: classNames(styles$n.cardBox, {
          [styles$n.dark]: invert,
          [styles$n.padded]: padded
        })
      });
    case 'split':
      return /*#__PURE__*/React.createElement("div", {
        className: classNames(styles$n.splitOverlay, {
          [styles$n.light]: invert,
          [styles$n.padded]: padded
        })
      });
    default:
      return null;
  }
}

const AppearanceSelectInputView = ListboxInputView.extend({
  modelEvents() {
    return {
      ...ListboxInputView.prototype.modelEvents.call(this),
      'change:layout': 'renderDropdown',
      'change:invert': 'renderDropdown',
      'change:exposeMotifArea': 'renderDropdown'
    };
  },
  renderItem(item) {
    const layout = this.model.get('layout') || 'left';
    const isCenter = layout === 'center' || layout === 'centerRagged';
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionVisualization, {
      layout: layout,
      appearance: item.value,
      invert: this.model.get('invert'),
      padded: isCenter && this.model.get('exposeMotifArea')
    }), item.text);
  }
});

const LayoutSelectInputView = ListboxInputView.extend({
  modelEvents() {
    return {
      ...ListboxInputView.prototype.modelEvents.call(this),
      'change:appearance': 'renderDropdown',
      'change:invert': 'renderDropdown',
      'change:exposeMotifArea': 'renderDropdown'
    };
  },
  renderItem(item) {
    const appearance = this.model.get('appearance') || 'shadow';
    const isCenter = item.value === 'center' || item.value === 'centerRagged';
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionVisualization, {
      layout: item.value,
      appearance: appearance,
      invert: this.model.get('invert'),
      padded: isCenter && this.model.get('exposeMotifArea')
    }), item.text);
  }
});

var styles$o = {"view":"BackdropContentElementInputView-module_view__3XNut","navigate":"BackdropContentElementInputView-module_navigate__1SpxV","unset":"BackdropContentElementInputView-module_unset__3Cyz- icons-module_cancelCircled__1BcYk icons-module_icon__16IVx","present":"BackdropContentElementInputView-module_present__wnZro","add":"BackdropContentElementInputView-module_add__3SJFq icons-module_plusCircled__20FlJ icons-module_icon__16IVx","container":"BackdropContentElementInputView-module_container__2aJK1","typePictogram":"BackdropContentElementInputView-module_typePictogram__1V5Rm","typePictogramBg":"BackdropContentElementInputView-module_typePictogramBg__1S0Qh","name":"BackdropContentElementInputView-module_name__EVV6u"};

const BackdropContentElementInputView = Marionette.ItemView.extend({
  mixins: [inputView],
  className: styles$o.view,
  template: () => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    <div class="${styles$o.container}">
      <button class="${styles$o.navigate}">
        <span class="${styles$o.typePictogramBg}">
          <img class="${styles$o.typePictogram}" width="20" height="20" />
        </span>
        <span class="${styles$o.name}"></span>
      </button>
      <button class="${styles$o.unset}"
              title="${I18n.t('pageflow_scrolled.editor.backdrop_content_element_input.unset')}"></button>
      <button class="${styles$o.add}">
        ${I18n.t('pageflow_scrolled.editor.backdrop_content_element_input.add')}
      </button>
    </div>
  `,
  ui: cssModulesUtils.ui(styles$o, 'typePictogram', 'navigate', 'name'),
  events: cssModulesUtils.events(styles$o, {
    'click add': function () {
      InsertContentElementDialogView.show({
        entry: this.options.entry,
        editor: this.options.editor,
        insertOptions: {
          at: 'backdropOfSection',
          id: this.model.parent.id
        }
      });
      this.options.entry.trigger('scrollToSection', this.model.parent, {
        align: 'start'
      });
    },
    'click navigate': function () {
      this.options.editor.navigate(`/scrolled/content_elements/${this.contentElement.id}`, {
        trigger: true
      });
      this.options.entry.trigger('selectContentElement', this.contentElement);
      this.options.entry.trigger('scrollToSection', this.model.parent, {
        align: 'start'
      });
    },
    'click unset': function () {
      this.contentElement.configuration.set('position', 'inline', {
        keepBackdropType: true
      });
      this.update();
    }
  }),
  onRender() {
    this.update();
  },
  update() {
    this.contentElement = this.model.parent.getBackdropContentElement();
    this.$el.toggleClass(styles$o.present, !!this.contentElement);
    if (this.contentElement) {
      this.ui.name.text(this.contentElement.getType().displayName);
      this.ui.typePictogram.attr('src', this.contentElement.getType().pictogram);
    }
  }
});

// imgAreaSelect jQuery plugin
// version 0.9.10
//
// Copyright (c) 2008-2013 Michal Wojciechowski (odyniec.net)
//
// Dual licensed under the MIT (MIT-LICENSE.txt)
// and GPL (GPL-LICENSE.txt) licenses.
//
// http://odyniec.net/projects/imgareaselect/

(function ($) {
  //
  // Math functions will be used extensively, so it's convenient to make a few
  // shortcuts
  //
  var abs = Math.abs,
    max = Math.max,
    min = Math.min,
    round = Math.round;

  //
  // Create a new HTML div element
  //
  // @return A jQuery object representing the new element
  //
  function div() {
    return $('<div/>');
  }

  //
  // imgAreaSelect initialization
  //
  // @param img
  //            A HTML image element to attach the plugin to
  // @param options
  //            An options object
  //
  $.imgAreaSelect = function (img, options) {
    var /* jQuery object representing the image */
      $img = $(img),
      /* Has the image finished loading? */
      imgLoaded,
      /* Plugin elements */

      /* Container box */
      $box = div(),
      /* Selection area */
      $area = div(),
      /* Border (four divs) */
      $border = div().add(div()).add(div()).add(div()),
      /* Outer area (four divs) */
      $outer = div().add(div()).add(div()).add(div()),
      /* Handles (empty by default, initialized in setOptions()) */
      $handles = $([]),
      /*
       * Additional element to work around a cursor problem in Opera
       * (explained later)
       */
      $areaOpera,
      /* Image position (relative to viewport) */
      left,
      top,
      /* Image offset (as returned by .offset()) */
      imgOfs = {
        left: 0,
        top: 0
      },
      /* Image dimensions (as returned by .width() and .height()) */
      imgWidth,
      imgHeight,
      gridX,
      gridY,
      gridSteps = 20,
      /*
       * jQuery object representing the parent element that the plugin
       * elements are appended to
       */
      $parent,
      /* Parent element offset (as returned by .offset()) */
      parOfs = {
        left: 0,
        top: 0
      },
      /* Base z-index for plugin elements */
      zIndex = 0,
      /* Plugin elements position */
      position = 'absolute',
      /* X/Y coordinates of the starting point for move/resize operations */
      startX,
      startY,
      /* Horizontal and vertical scaling factors */
      scaleX,
      scaleY,
      /* Current resize mode ("nw", "se", etc.) */
      resize,
      /* Selection area constraints */
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      /* Aspect ratio to maintain (floating point number) */
      aspectRatio,
      /* Are the plugin elements currently displayed? */
      shown,
      /* Current selection (relative to parent element) */
      x1,
      y1,
      x2,
      y2,
      /* Current selection (relative to scaled image) */
      selection = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        width: 0,
        height: 0
      },
      /* Document element */
      docElem = document.documentElement,
      /* User agent */
      ua = navigator.userAgent,
      /* Various helper variables used throughout the code */
      $p,
      d,
      i,
      o,
      w,
      h,
      adjusted;

    /*
     * Translate selection coordinates (relative to scaled image) to viewport
     * coordinates (relative to parent element)
     */

    //
    // Translate selection X to viewport X
    //
    // @param x
    //            Selection X
    // @return Viewport X
    //
    function viewX(x) {
      return x + imgOfs.left - parOfs.left;
    }

    //
    // Translate selection Y to viewport Y
    //
    // @param y
    //            Selection Y
    // @return Viewport Y
    //
    function viewY(y) {
      return y + imgOfs.top - parOfs.top;
    }

    /*
     * Translate viewport coordinates to selection coordinates
     */

    //
    // Translate viewport X to selection X
    //
    // @param x
    //            Viewport X
    // @return Selection X
    //
    function selX(x) {
      return x - imgOfs.left + parOfs.left;
    }

    //
    // Translate viewport Y to selection Y
    //
    // @param y
    //            Viewport Y
    // @return Selection Y
    //
    function selY(y) {
      return y - imgOfs.top + parOfs.top;
    }

    /*
     * Translate event coordinates (relative to document) to viewport
     * coordinates
     */

    //
    // Get event X and translate it to viewport X
    //
    // @param event
    //            The event object
    // @return Viewport X
    //
    function evX(event) {
      return event.pageX - parOfs.left;
    }

    //
    // Get event Y and translate it to viewport Y
    //
    // @param event
    //            The event object
    // @return Viewport Y
    //
    function evY(event) {
      return event.pageY - parOfs.top;
    }

    //
    // Get the current selection
    //
    // @param noScale
    //            If set to <code>true</code>, scaling is not applied to the
    //            returned selection
    // @return Selection object
    //
    function getSelection(noScale) {
      var sx = noScale || scaleX,
        sy = noScale || scaleY;
      return {
        x1: round(selection.x1 * sx),
        y1: round(selection.y1 * sy),
        x2: round(selection.x2 * sx),
        y2: round(selection.y2 * sy),
        width: round(selection.x2 * sx) - round(selection.x1 * sx),
        height: round(selection.y2 * sy) - round(selection.y1 * sy)
      };
    }

    //
    // Set the current selection
    //
    // @param x1
    //            X coordinate of the upper left corner of the selection area
    // @param y1
    //            Y coordinate of the upper left corner of the selection area
    // @param x2
    //            X coordinate of the lower right corner of the selection area
    // @param y2
    //            Y coordinate of the lower right corner of the selection area
    // @param noScale
    //            If set to <code>true</code>, scaling is not applied to the
    //            new selection
    //
    function setSelection(x1, y1, x2, y2, noScale) {
      var sx = noScale || scaleX,
        sy = noScale || scaleY;
      selection = {
        x1: round(x1 / sx || 0),
        y1: round(y1 / sy || 0),
        x2: round(x2 / sx || 0),
        y2: round(y2 / sy || 0)
      };
      selection.width = selection.x2 - selection.x1;
      selection.height = selection.y2 - selection.y1;
    }

    //
    // Recalculate image and parent offsets
    //
    function adjust() {
      /*
       * Do not adjust if image has not yet loaded or if width is not a
       * positive number. The latter might happen when imgAreaSelect is put
       * on a parent element which is then hidden.
       */
      if (!imgLoaded || !$img.width()) return;

      /*
       * Get image offset. The .offset() method returns float values, so they
       * need to be rounded.
       */
      imgOfs = {
        left: round($img.offset().left),
        top: round($img.offset().top)
      };

      /* Get image dimensions */
      imgWidth = $img.innerWidth();
      imgHeight = $img.innerHeight();
      imgOfs.top += $img.outerHeight() - imgHeight >> 1;
      imgOfs.left += $img.outerWidth() - imgWidth >> 1;

      /* Set minimum and maximum selection area dimensions */
      minWidth = round(options.minWidth / scaleX) || 0;
      minHeight = round(options.minHeight / scaleY) || 0;
      maxWidth = round(min(options.maxWidth / scaleX || 1 << 24, imgWidth));
      maxHeight = round(min(options.maxHeight / scaleY || 1 << 24, imgHeight));
      if (imgWidth > imgHeight) {
        gridX = imgWidth / gridSteps;
        gridY = imgHeight < gridX ? imgHeight : gridX + imgHeight % gridX / Math.floor(imgHeight / gridX);
      } else {
        gridY = imgHeight / gridSteps;
        gridX = imgWidth < gridY ? imgWidth : gridY + imgWidth % gridY / Math.floor(imgWidth / gridY);
      }

      /*
       * Workaround for jQuery 1.3.2 incorrect offset calculation, originally
       * observed in Safari 3. Firefox 2 is also affected.
       */
      if ($().jquery == '1.3.2' && position == 'fixed' && !docElem['getBoundingClientRect']) {
        imgOfs.top += max(document.body.scrollTop, docElem.scrollTop);
        imgOfs.left += max(document.body.scrollLeft, docElem.scrollLeft);
      }

      /* Determine parent element offset */
      parOfs = /absolute|relative/.test($parent.css('position')) ? {
        left: round($parent.offset().left) - $parent.scrollLeft(),
        top: round($parent.offset().top) - $parent.scrollTop()
      } : position == 'fixed' ? {
        left: $(document).scrollLeft(),
        top: $(document).scrollTop()
      } : {
        left: 0,
        top: 0
      };
      left = viewX(0);
      top = viewY(0);

      /*
       * Check if selection area is within image boundaries, adjust if
       * necessary
       */
      if (selection.x2 > imgWidth || selection.y2 > imgHeight) doResize();
    }

    //
    // Update plugin elements
    //
    // @param resetKeyPress
    //            If set to <code>false</code>, this instance's keypress
    //            event handler is not activated
    //
    function update(resetKeyPress) {
      /* If plugin elements are hidden, do nothing */
      if (!shown) return;

      /*
       * Set the position and size of the container box and the selection area
       * inside it
       */
      $box.css({
        left: viewX(selection.x1),
        top: viewY(selection.y1)
      }).add($area).width(w = selection.width).height(h = selection.height);

      /*
       * Reset the position of selection area, borders, and handles (IE6/IE7
       * position them incorrectly if we don't do this)
       */
      $area.add($border).add($handles).css({
        left: 0,
        top: 0
      });

      /* Set border dimensions */
      $border.width(max(w - $border.outerWidth() + $border.innerWidth(), 0)).height(max(h - $border.outerHeight() + $border.innerHeight(), 0));

      /* Arrange the outer area elements */
      $($outer[0]).css({
        left: left,
        top: top,
        width: selection.x1,
        height: imgHeight
      });
      $($outer[1]).css({
        left: left + selection.x1,
        top: top,
        width: w,
        height: selection.y1
      });
      $($outer[2]).css({
        left: left + selection.x2,
        top: top,
        width: imgWidth - selection.x2,
        height: imgHeight
      });
      $($outer[3]).css({
        left: left + selection.x1,
        top: top + selection.y2,
        width: w,
        height: imgHeight - selection.y2
      });
      w -= $handles.outerWidth();
      h -= $handles.outerHeight();

      /* Arrange handles */
      switch ($handles.length) {
        case 8:
          $($handles[4]).css({
            left: w >> 1
          });
          $($handles[5]).css({
            left: w,
            top: h >> 1
          });
          $($handles[6]).css({
            left: w >> 1,
            top: h
          });
          $($handles[7]).css({
            top: h >> 1
          });
        case 4:
          $handles.slice(1, 3).css({
            left: w
          });
          $handles.slice(2, 4).css({
            top: h
          });
      }
      if (resetKeyPress !== false) {
        /*
         * Need to reset the document keypress event handler -- unbind the
         * current handler
         */
        if ($.imgAreaSelect.onKeyPress != docKeyPress) $(document).unbind($.imgAreaSelect.keyPress, $.imgAreaSelect.onKeyPress);
        if (options.keys)
          /*
           * Set the document keypress event handler to this instance's
           * docKeyPress() function
           */
          $(document)[$.imgAreaSelect.keyPress]($.imgAreaSelect.onKeyPress = docKeyPress);
      }

      /*
       * Internet Explorer displays 1px-wide dashed borders incorrectly by
       * filling the spaces between dashes with white. Toggling the margin
       * property between 0 and "auto" fixes this in IE6 and IE7 (IE8 is still
       * broken). This workaround is not perfect, as it requires setTimeout()
       * and thus causes the border to flicker a bit, but I haven't found a
       * better solution.
       *
       * Note: This only happens with CSS borders, set with the borderWidth,
       * borderOpacity, borderColor1, and borderColor2 options (which are now
       * deprecated). Borders created with GIF background images are fine.
       */
      if (msie && $border.outerWidth() - $border.innerWidth() == 2) {
        $border.css('margin', 0);
        setTimeout(function () {
          $border.css('margin', 'auto');
        }, 0);
      }
    }

    //
    // Do the complete update sequence: recalculate offsets, update the
    // elements, and set the correct values of x1, y1, x2, and y2.
    //
    // @param resetKeyPress
    //            If set to <code>false</code>, this instance's keypress
    //            event handler is not activated
    //
    function doUpdate(resetKeyPress) {
      adjust();
      update(resetKeyPress);
      x1 = viewX(selection.x1);
      y1 = viewY(selection.y1);
      x2 = viewX(selection.x2);
      y2 = viewY(selection.y2);
    }

    //
    // Hide or fade out an element (or multiple elements)
    //
    // @param $elem
    //            A jQuery object containing the element(s) to hide/fade out
    // @param fn
    //            Callback function to be called when fadeOut() completes
    //
    function hide($elem, fn) {
      options.fadeSpeed ? $elem.fadeOut(options.fadeSpeed, fn) : $elem.hide();
    }

    //
    // Selection area mousemove event handler
    //
    // @param event
    //            The event object
    //
    function areaMouseMove(event) {
      var x = selX(evX(event)) - selection.x1,
        y = selY(evY(event)) - selection.y1;
      if (!adjusted) {
        adjust();
        adjusted = true;
        $box.one('mouseout', function () {
          adjusted = false;
        });
      }

      /* Clear the resize mode */
      resize = '';
      if (options.resizable) {
        /*
         * Check if the mouse pointer is over the resize margin area and set
         * the resize mode accordingly
         */
        if (y <= options.resizeMargin) resize = 'n';else if (y >= selection.height - options.resizeMargin) resize = 's';
        if (x <= options.resizeMargin) resize += 'w';else if (x >= selection.width - options.resizeMargin) resize += 'e';
      }
      $box.css('cursor', resize ? resize + '-resize' : options.movable ? 'move' : '');
      if ($areaOpera) $areaOpera.toggle();
    }

    //
    // Document mouseup event handler
    //
    // @param event
    //            The event object
    //
    function docMouseUp(event) {
      /* Set back the default cursor */
      $('body').css('cursor', '');
      /*
       * If autoHide is enabled, or if the selection has zero width/height,
       * hide the selection and the outer area
       */
      if (options.autoHide || selection.width * selection.height == 0) hide($box.add($outer), function () {
        $(this).hide();
      });
      $(document).unbind('mousemove', selectingMouseMove);
      $box.mousemove(areaMouseMove);
      options.onSelectEnd(img, getSelection());
    }

    //
    // Selection area mousedown event handler
    //
    // @param event
    //            The event object
    // @return false
    //
    function areaMouseDown(event) {
      if (event.which != 1) return false;
      adjust();
      if (resize) {
        /* Resize mode is in effect */
        $('body').css('cursor', resize + '-resize');
        x1 = viewX(selection[/w/.test(resize) ? 'x2' : 'x1']);
        y1 = viewY(selection[/n/.test(resize) ? 'y2' : 'y1']);
        $(document).mousemove(selectingMouseMove).one('mouseup', docMouseUp);
        $box.unbind('mousemove', areaMouseMove);
      } else if (options.movable) {
        startX = left + selection.x1 - evX(event);
        startY = top + selection.y1 - evY(event);
        $box.unbind('mousemove', areaMouseMove);
        $(document).mousemove(movingMouseMove).one('mouseup', function () {
          options.onSelectEnd(img, getSelection());
          $(document).unbind('mousemove', movingMouseMove);
          $box.mousemove(areaMouseMove);
        });
      } else $img.mousedown(event);
      return false;
    }

    //
    // Adjust the x2/y2 coordinates to maintain aspect ratio (if defined)
    //
    // @param xFirst
    //            If set to <code>true</code>, calculate x2 first. Otherwise,
    //            calculate y2 first.
    //
    function fixAspectRatio(xFirst) {
      if (aspectRatio) if (xFirst) {
        x2 = max(left, min(left + imgWidth, x1 + abs(y2 - y1) * aspectRatio * (x2 > x1 || -1)));
        y2 = round(max(top, min(top + imgHeight, y1 + abs(x2 - x1) / aspectRatio * (y2 > y1 || -1))));
        x2 = round(x2);
      } else {
        y2 = max(top, min(top + imgHeight, y1 + abs(x2 - x1) / aspectRatio * (y2 > y1 || -1)));
        x2 = round(max(left, min(left + imgWidth, x1 + abs(y2 - y1) * aspectRatio * (x2 > x1 || -1))));
        y2 = round(y2);
      }
    }

    //
    // Resize the selection area respecting the minimum/maximum dimensions and
    // aspect ratio
    //
    function doResize() {
      /*
       * Make sure the top left corner of the selection area stays within
       * image boundaries (it might not if the image source was dynamically
       * changed).
       */
      x1 = min(x1, left + imgWidth);
      y1 = min(y1, top + imgHeight);
      if (abs(x2 - x1) < minWidth) {
        /* Selection width is smaller than minWidth */
        x2 = x1 - minWidth * (x2 < x1 || -1);
        if (x2 < left) x1 = left + minWidth;else if (x2 > left + imgWidth) x1 = left + imgWidth - minWidth;
      }
      if (abs(y2 - y1) < minHeight) {
        /* Selection height is smaller than minHeight */
        y2 = y1 - minHeight * (y2 < y1 || -1);
        if (y2 < top) y1 = top + minHeight;else if (y2 > top + imgHeight) y1 = top + imgHeight - minHeight;
      }
      x2 = max(left, min(x2, left + imgWidth));
      y2 = max(top, min(y2, top + imgHeight));
      fixAspectRatio(abs(x2 - x1) < abs(y2 - y1) * aspectRatio);
      if (abs(x2 - x1) > maxWidth) {
        /* Selection width is greater than maxWidth */
        x2 = x1 - maxWidth * (x2 < x1 || -1);
        fixAspectRatio();
      }
      if (abs(y2 - y1) > maxHeight) {
        /* Selection height is greater than maxHeight */
        y2 = y1 - maxHeight * (y2 < y1 || -1);
        fixAspectRatio(true);
      }
      snapToGrid();
      selection = {
        x1: selX(min(x1, x2)),
        x2: selX(max(x1, x2)),
        y1: selY(min(y1, y2)),
        y2: selY(max(y1, y2)),
        width: abs(x2 - x1),
        height: abs(y2 - y1)
      };
      update();
      options.onSelectChange(img, getSelection());
    }

    //
    // Mousemove event handler triggered when the user is selecting an area
    //
    // @param event
    //            The event object
    // @return false
    //
    function selectingMouseMove(event) {
      x2 = /w|e|^$/.test(resize) || aspectRatio ? evX(event) : viewX(selection.x2);
      y2 = /n|s|^$/.test(resize) || aspectRatio ? evY(event) : viewY(selection.y2);
      doResize();
      return false;
    }

    //
    // Move the selection area
    //
    // @param newX1
    //            New viewport X1
    // @param newY1
    //            New viewport Y1
    //
    function doMove(newX1, newY1) {
      x1 = newX1;
      y1 = newY1;
      snapToGrid();
      x2 = x1 + selection.width;
      y2 = y1 + selection.height;
      $.extend(selection, {
        x1: selX(x1),
        y1: selY(y1),
        x2: selX(x2),
        y2: selY(y2)
      });
      update();
      options.onSelectChange(img, getSelection());
    }
    function snapToGrid() {
      x1 = Math.round(x1 / gridX) * gridX;
      x2 = Math.round(x2 / gridX) * gridX;
      y1 = Math.round(y1 / gridY) * gridY;
      y2 = Math.round(y2 / gridY) * gridY;
    }

    //
    // Mousemove event handler triggered when the selection area is being moved
    //
    // @param event
    //            The event object
    // @return false
    //
    function movingMouseMove(event) {
      x1 = max(left, min(startX + evX(event), left + imgWidth - selection.width));
      y1 = max(top, min(startY + evY(event), top + imgHeight - selection.height));
      doMove(x1, y1);
      event.preventDefault();
      return false;
    }

    //
    // Start selection
    //
    function startSelection() {
      $(document).unbind('mousemove', startSelection);
      adjust();
      x2 = x1;
      y2 = y1;
      doResize();
      resize = '';
      if (!$outer.is(':visible')) /* Show the plugin elements */
        $box.add($outer).hide().fadeIn(options.fadeSpeed || 0);
      shown = true;
      $(document).unbind('mouseup', cancelSelection).mousemove(selectingMouseMove).one('mouseup', docMouseUp);
      $box.unbind('mousemove', areaMouseMove);
      options.onSelectStart(img, getSelection());
    }

    //
    // Cancel selection
    //
    function cancelSelection() {
      $(document).unbind('mousemove', startSelection).unbind('mouseup', cancelSelection);
      hide($box.add($outer));
      setSelection(selX(x1), selY(y1), selX(x1), selY(y1));

      /* If this is an API call, callback functions should not be triggered */
      if (!(this instanceof $.imgAreaSelect)) {
        options.onSelectChange(img, getSelection());
        options.onSelectEnd(img, getSelection());
      }
    }

    //
    // Image mousedown event handler
    //
    // @param event
    //            The event object
    // @return false
    //
    function imgMouseDown(event) {
      /* Ignore the event if animation is in progress */
      if (event.which != 1 || $outer.is(':animated')) return false;
      adjust();
      startX = x1 = evX(event);
      startY = y1 = evY(event);

      /* Selection will start when the mouse is moved */
      $(document).mousemove(startSelection).mouseup(cancelSelection);
      return false;
    }

    //
    // Window resize event handler
    //
    function windowResize() {
      doUpdate(false);
    }

    //
    // Image load event handler. This is the final part of the initialization
    // process.
    //
    function imgLoad() {
      imgLoaded = true;

      /* Set options */
      setOptions(options = $.extend({
        classPrefix: 'imgareaselect',
        movable: true,
        parent: 'body',
        resizable: true,
        resizeMargin: 10,
        onInit: function () {},
        onSelectStart: function () {},
        onSelectChange: function () {},
        onSelectEnd: function () {}
      }, options));
      $box.add($outer).css({
        visibility: ''
      });
      if (options.show) {
        shown = true;
        adjust();
        update();
        $box.add($outer).hide().fadeIn(options.fadeSpeed || 0);
      }

      /*
       * Call the onInit callback. The setTimeout() call is used to ensure
       * that the plugin has been fully initialized and the object instance is
       * available (so that it can be obtained in the callback).
       */
      setTimeout(function () {
        options.onInit(img, getSelection());
      }, 0);
    }

    //
    // Document keypress event handler
    //
    // @param event
    //            The event object
    // @return false
    //
    var docKeyPress = function (event) {
      var k = options.keys,
        d,
        t,
        key = event.keyCode;
      d = !isNaN(k.alt) && (event.altKey || event.originalEvent.altKey) ? k.alt : !isNaN(k.ctrl) && event.ctrlKey ? k.ctrl : !isNaN(k.shift) && event.shiftKey ? k.shift : !isNaN(k.arrows) ? k.arrows : 10;
      if (k.arrows == 'resize' || k.shift == 'resize' && event.shiftKey || k.ctrl == 'resize' && event.ctrlKey || k.alt == 'resize' && (event.altKey || event.originalEvent.altKey)) {
        /* Resize selection */

        switch (key) {
          case 37:
            /* Left */
            d = -d;
          case 39:
            /* Right */
            t = max(x1, x2);
            x1 = min(x1, x2);
            x2 = max(t + d, x1);
            fixAspectRatio();
            break;
          case 38:
            /* Up */
            d = -d;
          case 40:
            /* Down */
            t = max(y1, y2);
            y1 = min(y1, y2);
            y2 = max(t + d, y1);
            fixAspectRatio(true);
            break;
          default:
            return;
        }
        doResize();
      } else {
        /* Move selection */

        x1 = min(x1, x2);
        y1 = min(y1, y2);
        switch (key) {
          case 37:
            /* Left */
            doMove(max(x1 - d, left), y1);
            break;
          case 38:
            /* Up */
            doMove(x1, max(y1 - d, top));
            break;
          case 39:
            /* Right */
            doMove(x1 + min(d, imgWidth - selX(x2)), y1);
            break;
          case 40:
            /* Down */
            doMove(x1, y1 + min(d, imgHeight - selY(y2)));
            break;
          default:
            return;
        }
      }
      return false;
    };

    //
    // Apply style options to plugin element (or multiple elements)
    //
    // @param $elem
    //            A jQuery object representing the element(s) to style
    // @param props
    //            An object that maps option names to corresponding CSS
    //            properties
    //
    function styleOptions($elem, props) {
      for (var option in props) if (options[option] !== undefined) $elem.css(props[option], options[option]);
    }

    //
    // Set plugin options
    //
    // @param newOptions
    //            The new options object
    //
    function setOptions(newOptions) {
      if (newOptions.parent) ($parent = $(newOptions.parent)).append($box.add($outer));

      /* Merge the new options with the existing ones */
      $.extend(options, newOptions);
      adjust();
      if (newOptions.handles != null) {
        /* Recreate selection area handles */
        $handles.remove();
        $handles = $([]);
        i = newOptions.handles ? newOptions.handles == 'corners' ? 4 : 8 : 0;
        while (i--) $handles = $handles.add(div());

        /* Add a class to handles and set the CSS properties */
        $handles.addClass(options.classPrefix + '-handle').css({
          position: 'absolute',
          /*
           * The font-size property needs to be set to zero, otherwise
           * Internet Explorer makes the handles too large
           */
          fontSize: 0,
          zIndex: zIndex + 1 || 1
        });

        /*
         * If handle width/height has not been set with CSS rules, set the
         * default 5px
         */
        if (!parseInt($handles.css('width')) >= 0) $handles.width(5).height(5);

        /*
         * If the borderWidth option is in use, add a solid border to
         * handles
         */
        if (o = options.borderWidth) $handles.css({
          borderWidth: o,
          borderStyle: 'solid'
        });

        /* Apply other style options */
        styleOptions($handles, {
          borderColor1: 'border-color',
          borderColor2: 'background-color',
          borderOpacity: 'opacity'
        });
      }

      /* Calculate scale factors */
      scaleX = options.imageWidth / imgWidth || 1;
      scaleY = options.imageHeight / imgHeight || 1;

      /* Set selection */
      if (newOptions.x1 != null) {
        setSelection(newOptions.x1, newOptions.y1, newOptions.x2, newOptions.y2);
        newOptions.show = !newOptions.hide;
      }
      if (newOptions.keys) /* Enable keyboard support */
        options.keys = $.extend({
          shift: 1,
          ctrl: 'resize'
        }, newOptions.keys);

      /* Add classes to plugin elements */
      $outer.addClass(options.classPrefix + '-outer');
      $area.addClass(options.classPrefix + '-selection');
      for (i = 0; i++ < 4;) $($border[i - 1]).addClass(options.classPrefix + '-border' + i);

      /* Apply style options */
      styleOptions($area, {
        selectionColor: 'background-color',
        selectionOpacity: 'opacity'
      });
      styleOptions($border, {
        borderOpacity: 'opacity',
        borderWidth: 'border-width'
      });
      styleOptions($outer, {
        outerColor: 'background-color',
        outerOpacity: 'opacity'
      });
      if (o = options.borderColor1) $($border[0]).css({
        borderStyle: 'solid',
        borderColor: o
      });
      if (o = options.borderColor2) $($border[1]).css({
        borderStyle: 'dashed',
        borderColor: o
      });

      /* Append all the selection area elements to the container box */
      $box.append($area.add($border).add($areaOpera)).append($handles);
      if (msie) {
        if (o = ($outer.css('filter') || '').match(/opacity=(\d+)/)) $outer.css('opacity', o[1] / 100);
        if (o = ($border.css('filter') || '').match(/opacity=(\d+)/)) $border.css('opacity', o[1] / 100);
      }
      if (newOptions.hide) hide($box.add($outer));else if (newOptions.show && imgLoaded) {
        shown = true;
        $box.add($outer).fadeIn(options.fadeSpeed || 0);
        doUpdate();
      }

      /* Calculate the aspect ratio factor */
      aspectRatio = (d = (options.aspectRatio || '').split(/:/))[0] / d[1];
      $img.add($outer).unbind('mousedown', imgMouseDown);
      if (options.disable || options.enable === false) {
        /* Disable the plugin */
        $box.unbind('mousemove', areaMouseMove).unbind('mousedown', areaMouseDown);
        $(window).unbind('resize', windowResize);
      } else {
        if (options.enable || options.disable === false) {
          /* Enable the plugin */
          if (options.resizable || options.movable) $box.mousemove(areaMouseMove).mousedown(areaMouseDown);
          $(window).resize(windowResize);
        }
        if (!options.persistent) $img.add($outer).mousedown(imgMouseDown);
      }
      options.enable = options.disable = undefined;
    }

    //
    // Remove plugin completely
    //
    this.remove = function () {
      /*
       * Call setOptions with { disable: true } to unbind the event handlers
       */
      setOptions({
        disable: true
      });
      $box.add($outer).remove();
    };

    /*
     * Public API
     */

    //
    // Get current options
    //
    // @return An object containing the set of options currently in use
    //
    this.getOptions = function () {
      return options;
    };

    //
    // Set plugin options
    //
    // @param newOptions
    //            The new options object
    //
    this.setOptions = setOptions;

    //
    // Get the current selection
    //
    // @param noScale
    //            If set to <code>true</code>, scaling is not applied to the
    //            returned selection
    // @return Selection object
    //
    this.getSelection = getSelection;

    //
    // Set the current selection
    //
    // @param x1
    //            X coordinate of the upper left corner of the selection area
    // @param y1
    //            Y coordinate of the upper left corner of the selection area
    // @param x2
    //            X coordinate of the lower right corner of the selection area
    // @param y2
    //            Y coordinate of the lower right corner of the selection area
    // @param noScale
    //            If set to <code>true</code>, scaling is not applied to the
    //            new selection
    //
    this.setSelection = setSelection;

    //
    // Cancel selection
    //
    this.cancelSelection = cancelSelection;

    //
    // Update plugin elements
    //
    // @param resetKeyPress
    //            If set to <code>false</code>, this instance's keypress
    //            event handler is not activated
    //
    this.update = doUpdate;

    /* Do the dreaded browser detection */
    var msie = (/msie ([\w.]+)/i.exec(ua) || [])[1],
      opera = /opera/i.test(ua),
      safari = /webkit/i.test(ua) && !/chrome/i.test(ua);

    /*
     * Traverse the image's parent elements (up to <body>) and find the
     * highest z-index
     */
    $p = $img;
    while ($p.length) {
      zIndex = max(zIndex, !isNaN($p.css('z-index')) ? $p.css('z-index') : zIndex);
      /* Also check if any of the ancestor elements has fixed position */
      if ($p.css('position') == 'fixed') position = 'fixed';
      $p = $p.parent(':not(body)');
    }

    /*
     * If z-index is given as an option, it overrides the one found by the
     * above loop
     */
    zIndex = options.zIndex || zIndex;
    if (msie) $img.attr('unselectable', 'on');

    /*
     * In MSIE and WebKit, we need to use the keydown event instead of keypress
     */
    $.imgAreaSelect.keyPress = msie || safari ? 'keydown' : 'keypress';

    /*
     * There is a bug affecting the CSS cursor property in Opera (observed in
     * versions up to 10.00) that prevents the cursor from being updated unless
     * the mouse leaves and enters the element again. To trigger the mouseover
     * event, we're adding an additional div to $box and we're going to toggle
     * it when mouse moves inside the selection area.
     */
    if (opera) $areaOpera = div().css({
      width: '100%',
      height: '100%',
      position: 'absolute',
      zIndex: zIndex + 2 || 2
    });

    /*
     * We initially set visibility to "hidden" as a workaround for a weird
     * behaviour observed in Google Chrome 1.0.154.53 (on Windows XP). Normally
     * we would just set display to "none", but, for some reason, if we do so
     * then Chrome refuses to later display the element with .show() or
     * .fadeIn().
     */
    $box.add($outer).css({
      visibility: 'hidden',
      position: position,
      overflow: 'hidden',
      zIndex: zIndex || '0'
    });
    $box.css({
      zIndex: zIndex + 2 || 2
    });
    $area.add($border).css({
      position: 'absolute',
      fontSize: 0
    });

    /*
     * If the image has been fully loaded, or if it is not really an image (eg.
     * a div), call imgLoad() immediately; otherwise, bind it to be called once
     * on image load event.
     */
    img.complete || img.readyState == 'complete' || !$img.is('img') ? imgLoad() : $img.one('load', imgLoad);

    /*
     * MSIE 9.0 doesn't always fire the image load event -- resetting the src
     * attribute seems to trigger it. The check is for version 7 and above to
     * accommodate for MSIE 9 running in compatibility mode.
     */
    if (!imgLoaded && msie && msie >= 7) img.src = img.src;
  };

  //
  // Invoke imgAreaSelect on a jQuery object containing the image(s)
  //
  // @param options
  //            Options object
  // @return The jQuery object or a reference to imgAreaSelect instance (if the
  //         <code>instance</code> option was specified)
  //
  $.fn.imgAreaSelect = function (options) {
    options = options || {};
    this.each(function () {
      /* Is there already an imgAreaSelect instance bound to this element? */
      if ($(this).data('imgAreaSelect')) {
        /* Yes there is -- is it supposed to be removed? */
        if (options.remove) {
          /* Remove the plugin */
          $(this).data('imgAreaSelect').remove();
          $(this).removeData('imgAreaSelect');
        } else /* Reset options */
          $(this).data('imgAreaSelect').setOptions(options);
      } else if (!options.remove) {
        /* No exising instance -- create a new one */

        /*
         * If neither the "enable" nor the "disable" option is present, add
         * "enable" as the default
         */
        if (options.enable === undefined && options.disable === undefined) options.enable = true;
        $(this).data('imgAreaSelect', new $.imgAreaSelect(this, options));
      }
    });
    if (options.instance)
      /*
       * Return the imgAreaSelect instance bound to the first element in the
       * set
       */
      return $(this).data('imgAreaSelect');
    return this;
  };
})($);

var styles$p = {"linkColor":"var(--ui-primary-color)","helpIconColor":"var(--ui-primary-color-lighter)","box":"EditMotifAreaDialogView-module_box__1fwA5","wrapper":"EditMotifAreaDialogView-module_wrapper__2uBFA","helpLink":"EditMotifAreaDialogView-module_helpLink__1Dv5E buttons-module_unstyledButton__3m76W icons-module_helpCircled__D_oKU icons-module_icon__16IVx","thumbnail":"EditMotifAreaDialogView-module_thumbnail__dM9gN","image":"EditMotifAreaDialogView-module_image__2-Iaj","blankSlate":"EditMotifAreaDialogView-module_blankSlate__3lvPl","blank":"EditMotifAreaDialogView-module_blank__yAuNx","reset":"EditMotifAreaDialogView-module_reset__3YOxk buttons-module_unstyledButton__3m76W","dragging":"EditMotifAreaDialogView-module_dragging__1Cx0-","save":"EditMotifAreaDialogView-module_save__1Qaw1 buttons-module_saveButton__1M-qM buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_check__3Lkw9 icons-module_icon__16IVx"};

const EditMotifAreaDialogView = Marionette.ItemView.extend({
  template: () => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles$p.box}">
        <h1 class="${dialogViewStyles.header}">
          ${I18n.t('pageflow_scrolled.editor.edit_motif_area.header')}
        </h1>
        <p class="${dialogViewStyles.hint}">
          ${I18n.t('pageflow_scrolled.editor.edit_motif_area.hint')}
        </p>

        <div class="${styles$p.wrapper}">
          <div class="${styles$p.thumbnail}">
            <img class="${styles$p.image}" />
            <div class="${styles$p.blankSlate}">
              ${I18n.t('pageflow_scrolled.editor.edit_motif_area.blank_slate')}
            </div>
            <button class="${styles$p.reset}">
              ${I18n.t('pageflow_scrolled.editor.edit_motif_area.reset')}
            </button>
          </div>
        </div>

        <div class="${dialogViewStyles.footer}">
          <button class="${styles$p.helpLink}">
            ${I18n.t('pageflow_scrolled.editor.edit_motif_area.help_link')}
          </button>
          <button class="${styles$p.save}">
            ${I18n.t('pageflow_scrolled.editor.edit_motif_area.save')}
          </button>
          <button class="${dialogViewStyles.close}">
            ${I18n.t('pageflow_scrolled.editor.edit_motif_area.cancel')}
          </button>
        </div>
      </div>
    </div>
  `,
  mixins: [dialogView],
  ui: cssModulesUtils$1.ui(styles$p, 'image', 'thumbnail'),
  events: cssModulesUtils$1.events(styles$p, {
    'click helpLink': function () {
      app.trigger('toggle-help', 'pageflow_scrolled.help_entries.motif_area');
    },
    'click reset': function () {
      this.motifArea = null;
      this.updateAreaSelect();
      this.updateBlankSlate();
    },
    'click save': function () {
      this.save();
      this.close();
    }
  }),
  save() {
    const motifArea = this.getMotifAreaWithRoundedValues();
    this.model.set(this.getPropertyName(), motifArea);
    this.options.file.configuration.set('motifArea', motifArea);
    if (!motifArea) {
      this.options.file.configuration.set('ignoreMissingMotif', true);
    }
  },
  onRender() {
    this.ui.image.attr('src', this.options.file.getBackgroundPositioningImageUrl());
  },
  onShow() {
    this.motifArea = this.model.get(this.getPropertyName());
    this.updateAreaSelect();
    this.updateBlankSlate();
    this.resizeListener = () => this.updateAreaSelect();
    $(window).on('resize', this.resizeListener);
  },
  getPropertyName() {
    return this.options.propertyName === 'id' ? 'motifArea' : `${this.options.propertyName.replace(/Id$/, '')}MotifArea`;
  },
  getMotifAreaWithRoundedValues() {
    return this.motifArea && {
      left: Math.round(this.motifArea.left),
      top: Math.round(this.motifArea.top),
      width: Math.round(this.motifArea.width),
      height: Math.round(this.motifArea.height)
    };
  },
  updateAreaSelect() {
    var imageWidth = this.options.file.get('width');
    var imageHeight = this.options.file.get('height');
    this.ui.image.imgAreaSelect({
      parent: this.ui.thumbnail,
      handles: true,
      imageWidth,
      imageHeight,
      ...this.getSelection(imageWidth, imageHeight),
      onSelectStart: () => {
        this.$el.addClass(styles$p.dragging);
      },
      onSelectEnd: (img, selection) => {
        this.$el.removeClass(styles$p.dragging);
        const motifArea = {
          left: selection.x1 / imageWidth * 100.0,
          top: selection.y1 / imageHeight * 100.0,
          width: (selection.x2 - selection.x1) / imageWidth * 100.0,
          height: (selection.y2 - selection.y1) / imageHeight * 100.0
        };
        if (motifArea.width > 0 && motifArea.height > 0) {
          this.motifArea = motifArea;
        } else {
          this.ui.image.imgAreaSelect({
            ...this.getSelection(imageWidth, imageHeight)
          });
        }
        this.updateBlankSlate();
      }
    });
  },
  getSelection(imageWidth, imageHeight) {
    if (!this.motifArea) {
      return {
        hide: true
      };
    }
    const x1 = imageWidth * (this.motifArea.left / 100);
    const y1 = imageHeight * (this.motifArea.top / 100);
    const width = imageWidth * (this.motifArea.width / 100);
    const height = imageHeight * (this.motifArea.height / 100);
    return {
      x1,
      x2: x1 + width,
      y1,
      y2: y1 + height
    };
  },
  updateBlankSlate() {
    this.$el.toggleClass(styles$p.blank, !this.motifArea);
  },
  onBeforeClose() {
    $(window).off('resize', this.resizeListener);
    this.ui.image.imgAreaSelect({
      remove: true
    });
  }
});
EditMotifAreaDialogView.show = function (options) {
  app.dialogRegion.show(new EditMotifAreaDialogView(options));
};

var styles$q = {"infoText":"EditMotifAreaInputView-module_infoText__2oRPW","button":"EditMotifAreaInputView-module_button__1sxa3","icon":"EditMotifAreaInputView-module_icon__2uxBj","buttonText":"EditMotifAreaInputView-module_buttonText__3fSlP","checkIcon":"EditMotifAreaInputView-module_checkIcon__jaLbQ","ignoreButton":"EditMotifAreaInputView-module_ignoreButton__M4kDz","ignoreIcon":"EditMotifAreaInputView-module_ignoreIcon__3bTP3","highlight-box":"EditMotifAreaInputView-module_highlight-box__29cjj","highlight-boxBelow":"EditMotifAreaInputView-module_highlight-boxBelow__1sY_A EditMotifAreaInputView-module_highlight-box__29cjj","highlight-boxWithArrow":"EditMotifAreaInputView-module_highlight-boxWithArrow__2bL-2 EditMotifAreaInputView-module_highlight-box__29cjj","hidden":"EditMotifAreaInputView-module_hidden__102JD","warning":"EditMotifAreaInputView-module_warning__OMhWK"};

const EditMotifAreaInputView = Marionette.ItemView.extend({
  template: data => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    ${data.infoText ? `<div class="${styles$q.infoText}">${data.infoText}</div>` : ''}
    <button class="${data.showIgnoreOption ? buttonStyles.primaryIconButton : buttonStyles.secondaryIconButton} ${styles$q.button}">
      <svg class="${styles$q.icon}" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1 h4 M1 1 v4" />
        <path d="M19 1 h-4 M19 1 v4" />
        <path d="M1 19 h4 M1 19 v-4" />
        <path d="M19 19 h-4 M19 19 v-4" />
        <path class="${styles$q.checkIcon}" d="M5 10 L8.5 13.5 L15 7" />
      </svg>
      <span class="${styles$q.buttonText}"></span>
    </button>
    ${data.showIgnoreOption ? `
    <button class="${buttonStyles.secondaryIconButton} ${styles$q.ignoreButton}">
      <svg class="${styles$q.ignoreIcon}" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 5 L15 15 M15 5 L5 15" />
      </svg>
      <span>${data.ignoreButtonText}</span>
    </button>
    ` : ''}
  `,
  mixins: [inputView],
  initialize() {
    this.backdrop = this.model.getBackdrop();
    this.listenTo(this.backdrop, 'change:motifArea', this.update);
    this.listenTo(this.backdrop, 'change:ignoreMissingMotif', this.update);
    this.listenTo(this.backdrop, 'change:type', this.render);
  },
  serializeData() {
    const ignoreButtonTextKey = this.model.get('backdropType') === 'video' ? 'ignore_video' : 'ignore_image';
    return {
      infoText: this.options.infoText,
      showIgnoreOption: this.options.showIgnoreOption,
      ignoreButtonText: I18n.t(`pageflow_scrolled.editor.edit_motif_area_input.${ignoreButtonTextKey}`)
    };
  },
  ui: cssModulesUtils.ui(styles$q, 'button', 'buttonText', 'checkIcon', 'ignoreButton'),
  events: cssModulesUtils.events(styles$q, {
    'click button': function () {
      const portrait = this.options.portrait;
      EditMotifAreaDialogView.show({
        model: this.model,
        propertyName: this.backdrop.getFilePropertyName({
          portrait
        }),
        file: this.backdrop.getFile({
          portrait
        })
      });
    },
    'click ignoreButton': function () {
      const file = this.backdrop.getFile({
        portrait: this.options.portrait
      });
      if (file) {
        file.configuration.set('ignoreMissingMotif', true);
        this.updateVisibility();
      }
    }
  }),
  onRender() {
    this.$el.addClass(styles$q[`highlight-${this.options.highlight}`]);
    this.update();
    this.updateVisibility();
  },
  update() {
    if (this.isClosed) {
      return;
    }
    const status = this.backdrop.getMotifAreaStatus({
      portrait: this.options.portrait
    });
    const hasMotifArea = status === 'defined';
    const showWarning = this.options.required && (status === 'missing' || status === 'ignored');
    const key = hasMotifArea ? 'edit' : showWarning ? 'warn' : 'select';
    this.ui.buttonText.text(I18n.t(`pageflow_scrolled.editor.edit_motif_area_input.${key}`));
    this.ui.checkIcon.toggle(hasMotifArea);
    this.ui.button.toggleClass(styles$q.warning, !!showWarning);
    this.updateVisibility();
  },
  updateDisabled(disabled) {
    this.ui.button.prop('disabled', disabled || !this.backdrop.getFile({
      portrait: this.options.portrait
    }));
  },
  updateVisibility() {
    if (this.options.onlyShowWhenMissing) {
      this.$el.toggleClass(styles$q.hidden, this.backdrop.getMotifAreaStatus({
        portrait: this.options.portrait
      }) !== 'missing');
    }
  }
});

const EffectListInputView = function (options) {
  const types = Style.getEffectTypes({
    entry: options.entry
  });
  const filteredTypes = options.kinds ? Object.fromEntries(Object.entries(types).filter(([, type]) => options.kinds.includes(type.kind))) : types;
  return new StyleListInputView({
    ...options,
    hideLabel: true,
    types: filteredTypes,
    translationKeyPrefix: 'pageflow_scrolled.editor.effect_list_input'
  });
};

var styles$r = {"button":"SectionPaddingsInputView-module_button__TYIJ0","grid":"SectionPaddingsInputView-module_grid__1STvD","paddingTop":"SectionPaddingsInputView-module_paddingTop__3OkwL","paddingBottom":"SectionPaddingsInputView-module_paddingBottom__3hdi0","portraitPaddingTop":"SectionPaddingsInputView-module_portraitPaddingTop__1GR27","portraitPaddingBottom":"SectionPaddingsInputView-module_portraitPaddingBottom__2SvUl"};

const SectionPaddingsInputView = Marionette.Layout.extend({
  mixins: [inputView],
  initialize() {
    this.backdrop = this.model.getBackdrop();
    this.listenTo(this.backdrop, 'change:motifArea', this.render);
  },
  modelEvents: {
    'change:appearance': 'render'
  },
  template: data => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    <button class="${buttonStyles.secondaryIconButton} ${styles$r.button}">
      <div class="${styles$r.grid}">
        <img src="${img$3}" width="18" height="18" />
        <div class="${styles$r.paddingTop}"></div>
        <div class="${styles$r.portraitPaddingTop}"></div>
        <img src="${img$4}" width="18" height="18" />
        <div class="${styles$r.paddingBottom}"></div>
        <div class="${styles$r.portraitPaddingBottom}"></div>
      </div>
    </button>
  `,
  ui: cssModulesUtils.ui(styles$r, 'paddingTop', 'paddingBottom', 'portraitPaddingTop', 'portraitPaddingBottom'),
  events: cssModulesUtils.events(styles$r, {
    'click button': function () {
      this.options.entry.trigger('selectSectionPaddings', this.model.parent);
      this.options.entry.trigger('scrollToSection', this.model.parent, {
        ifNeeded: true
      });
      editor$1.navigate('/scrolled/sections/' + this.model.parent.get('id') + '/paddings', {
        trigger: true
      });
    }
  }),
  onRender() {
    const entry = this.options.entry;
    const scope = getAppearanceSectionScopeName(this.model.get('appearance'));
    const paddingTopScale = entry.getScale('sectionPaddingTop', {
      scope
    });
    const paddingBottomScale = entry.getScale('sectionPaddingBottom', {
      scope
    });
    this.ui.paddingTop.text(this.getPaddingTopText(paddingTopScale, 'paddingTop', {
      portrait: false
    }));
    this.ui.paddingBottom.text(getValueText(paddingBottomScale, this.model.get('paddingBottom')));
    this.ui.portraitPaddingTop.text(this.getPaddingTopText(paddingTopScale, 'portraitPaddingTop', {
      portrait: true
    }));
    this.ui.portraitPaddingBottom.text(getValueText(paddingBottomScale, this.model.get('portraitPaddingBottom')));
    const hasPortrait = this.model.get('customPortraitPaddings');
    this.ui.portraitPaddingTop.toggle(!!hasPortrait);
    this.ui.portraitPaddingBottom.toggle(!!hasPortrait);
  },
  getPaddingTopText(scale, property, {
    portrait
  }) {
    const text = getValueText(scale, this.model.get(property));
    if (this.model.get('exposeMotifArea') && this.backdrop.getMotifAreaStatus({
      portrait
    }) === 'defined') {
      const motifPrefix = I18n.t('pageflow_scrolled.editor.section_paddings_input.motif');
      return `${motifPrefix}/${text}`;
    }
    return text;
  }
});
function getValueText(scale, value) {
  const index = scale.values.indexOf(value);
  if (index >= 0) {
    return scale.texts[index];
  }
  const defaultIndex = scale.values.indexOf(scale.defaultValue);
  return scale.texts[defaultIndex];
}

const InlineFileRightsMenuItem = Backbone.Model.extend({
  defaults: {
    name: 'hideInlineFileRights',
    kind: 'checkBox'
  },
  initialize(attributes, {
    inputModel,
    propertyName,
    file
  }) {
    this.set('label', I18n.t('pageflow_scrolled.editor.inline_file_rights_menu_item.label'));
    const flagPropertyName = propertyName === 'id' ? 'inlineRightsHidden' : `${propertyName.replace('Id', '')}InlineRightsHidden`;
    const update = () => {
      this.set('hidden', !file.get('rights') || file.configuration.get('rights_display') !== 'inline');
      this.set('checked', !!inputModel.get(flagPropertyName));
    };
    this.listenTo(inputModel, `change:${flagPropertyName}`, update);
    this.listenTo(file, 'change:rights', update);
    this.listenTo(file.configuration, `change:rights_display`, update);
    update();
    this.selected = () => {
      inputModel.set(flagPropertyName, !inputModel.get(flagPropertyName));
    };
  }
});

const EditSectionView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_section',
  getActionsMenuItems() {
    return createSectionMenuItems({
      entry: this.options.entry,
      section: this.model
    });
  },
  configure: function (configurationEditor) {
    const entry = this.options.entry;
    const editor = this.options.editor;
    const backgroundColorSwatches = [...entry.getBackgroundColorPresets().map(swatch => ({
      ...swatch,
      group: 'presets'
    })), ...entry.getUsedSectionBackgroundColors().map(value => ({
      value,
      group: 'used'
    }))];
    const editMotifAreaMenuItem = {
      name: 'editMotifArea',
      label: I18n.t('pageflow_scrolled.editor.edit_motif_area_menu_item'),
      selected({
        inputModel,
        propertyName,
        file
      }) {
        EditMotifAreaDialogView.show({
          model: inputModel,
          propertyName,
          file
        });
      }
    };
    configurationEditor.tab('section', function () {
      this.view(InfoBoxView, {
        text: I18n.t('pageflow_scrolled.editor.edit_section.hidden_info'),
        icon: img$6,
        level: 'info',
        visibleBinding: 'hidden',
        visible: hidden => !!hidden
      });
      this.input('backdropType', SelectInputView, {
        values: features.isEnabled('backdrop_content_elements') ? ['image', 'video', 'color', 'contentElement'] : ['image', 'video', 'color']
      });
      this.input('fullHeight', CheckBoxInputView, {
        disabledBinding: 'backdropType',
        disabled: backdropType => backdropType === 'contentElement',
        displayCheckedIfDisabled: true
      });
      if (features.isEnabled('backdrop_size')) {
        this.input('backdropSize', SelectInputView, {
          visibleBinding: 'backdropType',
          visible: backdropType => backdropType === 'image' || backdropType === 'video',
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
        entry,
        visibleBinding: ['backdropType', 'backdropImage'],
        visible: ([backdropType]) => backdropType === 'image' && this.model.getReference('backdropImage', 'image_files') || backdropType === 'video' && this.model.getReference('backdropVideo', 'video_files')
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
        entry,
        visibleBinding: ['backdropType', 'backdropImageMobile'],
        visible: ([backdropType]) => backdropType === 'image' && this.model.getReference('backdropImageMobile', 'image_files') || backdropType === 'video' && this.model.getReference('backdropVideoMobile', 'video_files')
      });
      this.input('backdropColor', ColorInputView$1, {
        visibleBinding: 'backdropType',
        visibleBindingValue: 'color',
        swatches: backgroundColorSwatches
      });
      if (hasDecorationEffects(entry)) {
        this.input('backdropEffects', EffectListInputView, {
          entry,
          kinds: ['decoration'],
          visibleBinding: 'backdropType',
          visible: backdropType => backdropType === 'color'
        });
      }
      this.input('backdropContentElement', BackdropContentElementInputView, {
        editor,
        entry,
        visibleBinding: 'backdropType',
        visibleBindingValue: 'contentElement'
      });
      this.view(SeparatorView);
      this.input('layout', LayoutSelectInputView, {
        values: ['left', 'right', 'center', 'centerRagged']
      });
      this.input('sectionPaddings', SectionPaddingsInputView, {
        entry
      });
      if (entry.supportsSectionWidths()) {
        this.input('width', SelectInputView, {
          values: ['wide', 'narrow']
        });
      }
      this.input('appearance', AppearanceSelectInputView, {
        values: ['shadow', 'cards', 'split', 'transparent']
      });
      this.input('invert', CheckBoxInputView);
      this.input('shadowColor', ColorInputView$1, {
        visibleBinding: 'appearance',
        visible: appearance => !appearance || appearance === 'shadow',
        placeholder: I18n.t('pageflow_scrolled.editor.edit_section.attributes.shadowColor.auto'),
        placeholderColorBinding: 'invert',
        placeholderColor: invert => invert ? '#ffffff' : '#000000',
        placeholderColorDescription: I18n.t('pageflow_scrolled.editor.edit_section.attributes.shadowColor.auto_color'),
        swatches: backgroundColorSwatches
      });
      this.input('staticShadowOpacity', SliderInputView, {
        defaultValue: 70,
        visibleBinding: 'appearance',
        visible: appearance => !appearance || appearance === 'shadow'
      });
      this.input('dynamicShadowOpacity', SliderInputView, {
        defaultValue: 70,
        visibleBinding: ['backdropType', 'appearance'],
        visible: ([backdropType, appearance]) => {
          return backdropType !== 'color' && (!appearance || appearance === 'shadow');
        },
        disabledBinding: ['backdropType', 'exposeMotifArea', ...motifAreaDisabledBinding],
        disabled: ([backdropType, exposeMotifArea, ...motifAreaDisabledBindingValues]) => (!exposeMotifArea || motifAreaDisabled(motifAreaDisabledBindingValues)) && backdropType !== 'contentElement'
      });
      this.input('cardSurfaceColor', ColorInputView$1, {
        visibleBinding: 'appearance',
        visibleBindingValue: 'cards',
        alpha: true,
        placeholder: I18n.t('pageflow_scrolled.editor.edit_section.attributes.cardSurfaceColor.auto'),
        placeholderColorBinding: 'invert',
        placeholderColor: invert => invert ? '#101010' : '#ffffff',
        placeholderColorDescription: I18n.t('pageflow_scrolled.editor.edit_section.attributes.cardSurfaceColor.auto_color'),
        swatches: backgroundColorSwatches
      });
      this.input('splitOverlayColor', ColorInputView$1, {
        visibleBinding: 'appearance',
        visibleBindingValue: 'split',
        alpha: true,
        placeholder: I18n.t('pageflow_scrolled.editor.edit_section.attributes.splitOverlayColor.auto'),
        placeholderColorBinding: 'invert',
        placeholderColor: invert => invert ? '#ffffffb3' : '#000000b3',
        placeholderColorDescription: I18n.t('pageflow_scrolled.editor.edit_section.attributes.splitOverlayColor.auto_color'),
        swatches: backgroundColorSwatches
      });
      this.input('overlayBackdropBlur', SliderInputView, {
        visibleBinding: 'appearance',
        visible: appearance => appearance === 'split' || appearance === 'cards',
        disabledBinding: ['appearance', 'splitOverlayColor', 'cardSurfaceColor'],
        disabled: ([appearance, splitOverlayColor, cardSurfaceColor]) => appearance === 'split' ? splitOverlayColor && !utils.isTranslucentColor(splitOverlayColor) : !utils.isTranslucentColor(cardSurfaceColor),
        values: [0, 25, 50, 75, 100],
        defaultValue: 100,
        saveOnSlide: true
      });
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
const motifAreaDisabledBinding = ['backdropType', 'backdropImageMotifArea', 'backdropImageMobileMotifArea', 'backdropVideoMotifArea', 'backdropImage', 'backdropImageMobile', 'backdropVideo'];
function motifAreaDisabled([backdropType, backdropImageMotifArea, backdropImageMobileMotifArea, backdropVideoMotifArea, backdropImage, backdropImageMobile, backdropVideo]) {
  if (backdropType === 'video') {
    return !backdropVideo || !backdropVideoMotifArea;
  } else if (backdropType !== 'color') {
    return (!backdropImage || !backdropImageMotifArea) && (!backdropImageMobile || !backdropImageMobileMotifArea);
  }
  return true;
}
function hasDecorationEffects(entry) {
  return Object.values(Style.getEffectTypes({
    entry
  })).some(type => type.kind === 'decoration');
}

var styles$s = {"selectionColor":"var(--ui-selection-color)","disabled":"EditSectionTransitionEffectView-module_disabled__1ZRYF","active":"EditSectionTransitionEffectView-module_active__3F2NM","transitionVariant":"EditSectionTransitionEffectView-module_transitionVariant__2H3bL","transitionVariantLabel":"EditSectionTransitionEffectView-module_transitionVariantLabel__2MuLz","defaultTransition":"EditSectionTransitionEffectView-module_defaultTransition__AQMO9","container":"EditSectionTransitionEffectView-module_container__32mkr","input":"EditSectionTransitionEffectView-module_input__3i8nA","transition":"EditSectionTransitionEffectView-module_transition__1HHuP","transitionLabel":"EditSectionTransitionEffectView-module_transitionLabel__3eI8W","defaultTransitionIcon":"EditSectionTransitionEffectView-module_defaultTransitionIcon___8vCp icons-module_star__1AEW6 icons-module_icon__16IVx","markAsDefaultTransitionIcon":"EditSectionTransitionEffectView-module_markAsDefaultTransitionIcon__3awuj icons-module_starOutlined__1TAng icons-module_icon__16IVx","defaultTransitionIcons":"EditSectionTransitionEffectView-module_defaultTransitionIcons__gGQxe","upperSection":"EditSectionTransitionEffectView-module_upperSection__3p5PI","lowerSection":"EditSectionTransitionEffectView-module_lowerSection__2qKdg","upperBackground":"EditSectionTransitionEffectView-module_upperBackground__3bp0X","lowerBackground":"EditSectionTransitionEffectView-module_lowerBackground__1UCTP","fade":"EditSectionTransitionEffectView-module_fade__XCRHM","FadeA":"EditSectionTransitionEffectView-module_FadeA__3u-VS","FadeB":"EditSectionTransitionEffectView-module_FadeB__a1PxS","scroll":"EditSectionTransitionEffectView-module_scroll__2RfMf","scrollOver":"EditSectionTransitionEffectView-module_scrollOver__3cJJ7","reveal":"EditSectionTransitionEffectView-module_reveal__1_gtk","Translate":"EditSectionTransitionEffectView-module_Translate__CLYTi","beforeAfter":"EditSectionTransitionEffectView-module_beforeAfter__3oeDi","TranslateYPositive":"EditSectionTransitionEffectView-module_TranslateYPositive__10FZp","animation":"EditSectionTransitionEffectView-module_animation__3PSoZ"};

const EditSectionTransitionEffectView = Marionette.ItemView.extend({
  mixins: [inputView],
  template: () => `
    <label>
        <span class="name"></span>
        <span class="inline_help"></span>
    </label>
    <div class="transitions_container" />
    `,
  events: {
    'click input': 'save'
  },
  ui: {
    label: 'label',
    container: ".transitions_container"
  },
  onRender: function () {
    this.ui.label.attr('for', this.cid);
    this.appendItems();
    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },
  appendItems: function () {
    this.ui.container.append([this.transitionItem({
      value: 'fade'
    }, [this.transitionVariant({
      value: 'fadeBg'
    }), this.transitionVariant({
      value: 'fade'
    })]), this.transitionItem({
      value: 'scroll'
    }), this.transitionItem({
      value: 'scrollOver'
    }), this.transitionItem({
      value: 'reveal'
    }), this.transitionItem({
      value: 'beforeAfter'
    })].join(''));
  },
  save() {
    this.saveRadioInout('transition', this.model, this.options.propertyName);
    this.saveRadioInout('defaultTransition', this.options.defaultsModel, this.options.defaultPropertyName);
  },
  saveRadioInout(name, model, propertyName) {
    const checkedInput = this.ui.container.find(`input[name="${name}"]:checked`);
    model.set(propertyName, checkedInput.attr('value'));
  },
  load() {
    if (!this.isClosed) {
      this.loadRadioInput('defaultTransition', this.options.defaultsModel, this.options.defaultPropertyName);
      const input = this.loadRadioInput('transition', this.model, this.options.propertyName);
      this.$el.find(`.${styles$s.container}`).removeClass(styles$s.active);
      input.parents(`.${styles$s.container}`).addClass(styles$s.active);
      input.parents(`.${styles$s.container}`).find(`.${styles$s.transitionLabel}`).attr('for', input.attr('id'));
    }
  },
  loadRadioInput(name, model, propertyName) {
    const value = model.get(propertyName);
    let input = this.ui.container.find(`input[name="${name}"][value="${value}"]:enabled`);
    if (!input.length) {
      input = this.ui.container.find(`input[name="${name}"]:enabled`).first();
    }
    input.prop('checked', true);
    return input;
  },
  transitionItem({
    value
  }, variants = []) {
    return `
      <div class='${styles$s.container}
           ${this.options.optionDisabled(value) ? styles$s.disabled : ''}'>
        <label for='${value}' class="${styles$s.transitionLabel}">
          <div class='${styles$s.transition} ${styles$s[value]}'>
            ${this.transitionPreview()}
            <div class='${styles$s.input}'>
              ${variants.length ? '' : this.transitionInput({
      value
    })}
              ${this.transitionDisplayName(value)}
            </div>
          </div>
        </label>
        ${variants.length ? variants.join('') : this.defaultTransitionField({
      value
    })}
      </div>
    `;
  },
  transitionPreview() {
    return `
      <div class='${styles$s.animation}'>
        <div class='${styles$s.upperSection}'>
          <div class='${styles$s.upperBackground}'></div>
        </div>
        <div class='${styles$s.lowerSection}'>
          <div class='${styles$s.lowerBackground}'></div>
        </div>
      </div>
    `;
  },
  transitionVariant({
    value
  }) {
    return `
      <div class="${styles$s.transitionVariant}">
        <label for=${value} class="${styles$s.transitionVariantLabel}">
          ${this.transitionInput({
      value
    })}
          ${this.transitionVariantDisplayName(value)}
        </label>
        ${this.defaultTransitionField({
      value
    })}
      </div>
    `;
  },
  transitionInput({
    value
  }) {
    return `
      <input type='radio'
             name='transition'
             value='${value}'
             id='${value}'
             ${this.options.optionDisabled(value) ? 'disabled' : ''} />
    `;
  },
  defaultTransitionField({
    value
  }) {
    const markAsDefaultLabel = I18n.t(this.options.attributeTranslationKeyPrefixes + '.transition.mark_as_default_transition', {
      name: this.transitionDisplayName(value)
    });
    return `
      <label class='${styles$s.defaultTransition}'
             for='defaultTransition-${value}'>
        <input type='radio'
               id='defaultTransition-${value}'
               name='defaultTransition'
               value='${value}' aria-label="${markAsDefaultLabel}" />
        <div class='${styles$s.defaultTransitionIcons}'>
          <div class='${styles$s.defaultTransitionIcon}'
               title="${I18n.t(this.options.attributeTranslationKeyPrefixes + '.transition.default_transition', {
      name: this.transitionDisplayName(value)
    })}" />
          <div class='${styles$s.markAsDefaultTransitionIcon}'
               title="${markAsDefaultLabel}" />
    </div>
    </label>
    `;
  },
  transitionDisplayName(value) {
    return I18n.t(this.options.attributeTranslationKeyPrefixes + '.transition.values.' + value);
  },
  transitionVariantDisplayName(value) {
    return I18n.t(this.options.attributeTranslationKeyPrefixes + '.transition.variants.' + value);
  }
});

const EditSectionTransitionView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_section_transition',
  configure: function (configurationEditor) {
    const entry = this.options.entry;
    const sectionIndex = entry.sections.indexOf(this.model);
    const previousSection = entry.sections.at(sectionIndex - 1);
    const availableTransitions = getAvailableTransitionNames(normalizeSectionConfigurationData(this.model.configuration.attributes), normalizeSectionConfigurationData(previousSection.configuration.attributes));
    configurationEditor.tab('transition', function () {
      this.input('transition', EditSectionTransitionEffectView, {
        defaultsModel: entry.metadata.configuration,
        defaultPropertyName: 'defaultTransition',
        optionDisabled: value => !availableTransitions.includes(value)
      });
    });
  }
});

var styles$t = {"view":"EditSectionPaddingsView-module_view__2wlf8"};

const i18nPrefix = 'pageflow_scrolled.editor.edit_section_paddings';
const EditSectionPaddingsView = EditConfigurationView.extend({
  translationKeyPrefix: i18nPrefix,
  className: styles$t.view,
  goBackPath() {
    return `/scrolled/sections/` + this.model.get('id');
  },
  defaultTab() {
    if (this.options.entry.get('emulation_mode') === 'phone') {
      return 'portrait';
    }
  },
  configure: function (configurationEditor) {
    const entry = this.options.entry;
    const section = this.model;
    const configuration = section.configuration;
    const backdrop = configuration.getBackdrop();
    const scope = getAppearanceSectionScopeName(configuration.get('appearance'));
    const paddingTopScale = entry.getScale('sectionPaddingTop', {
      scope
    });
    const paddingBottomScale = entry.getScale('sectionPaddingBottom', {
      scope
    });
    const hasPortrait = !!backdrop.getFile({
      portrait: true
    });
    let transientStateModel = null;
    this.listenTo(backdrop, 'change:motifArea', () => {
      persistMotifBasedPadding();
      configurationEditor.refresh();
    });
    configurationEditor.tab('sectionPaddings', function () {
      if (hasPortrait && entry.has('emulation_mode')) {
        entry.unset('emulation_mode');
      }
      paddingInputs(this);
      remainingVerticalSpaceInputs(this);
    });
    if (hasPortrait) {
      configurationEditor.tab('portrait', function () {
        if (!entry.has('emulation_mode')) {
          entry.set('emulation_mode', 'phone');
        }
        this.listenTo(configuration, 'change:customPortraitPaddings', () => {
          configurationEditor.refresh();
        });
        this.input('samePortraitPaddings', CheckBoxInputView, {
          storeInverted: 'customPortraitPaddings'
        });
        const portraitOptions = configuration.get('customPortraitPaddings') ? {
          paddingTopProperty: 'portraitPaddingTop',
          paddingBottomProperty: 'portraitPaddingBottom'
        } : {
          disabled: true
        };
        paddingInputs(this, {
          portrait: true,
          ...portraitOptions
        });
      });
    }
    function paddingInputs(tab, {
      portrait,
      disabled,
      paddingTopProperty = 'paddingTop',
      paddingBottomProperty = 'paddingBottom'
    } = {}) {
      const backdropFile = backdrop.getFile({
        portrait
      });
      if (!backdropFile) {
        simpleTopPaddingInputs(tab, {
          portrait,
          disabled,
          paddingTopProperty
        });
      } else if (backdropHasAnyMotifArea('defined') || backdropHasAnyMotifArea('ignored')) {
        if (!backdropHasAnyMotifArea('defined')) {
          displayAsManualPadding();
        }
        toggleExposeMotifAreaInputs(tab, {
          portrait,
          disabled,
          paddingTopProperty
        });
      } else {
        tab.listenTo(backdrop, 'change:ignoreMissingMotif', () => {
          configurationEditor.refresh();
        });
        advertiseMotifAreaInputs(tab, {
          portrait,
          disabled,
          paddingTopProperty
        });
      }
      bottomPaddingInputs(tab, {
        portrait,
        disabled,
        paddingBottomProperty
      });
    }
    function remainingVerticalSpaceInputs(tab) {
      tab.view(SeparatorView$1);
      tab.input('remainingVerticalSpace', SelectInputView, {
        values: ['around', 'above', 'below'],
        defaultValue: 'around',
        disabledBinding: 'fullHeight',
        disabled: fullHeight => !fullHeight
      });
    }
    function simpleTopPaddingInputs(tab, {
      portrait,
      disabled,
      paddingTopProperty,
      infoText
    }) {
      tab.input('topPaddingVisualization', SectionPaddingVisualizationView, {
        variant: 'topPadding',
        portrait,
        disabled,
        infoText,
        hideLabel: !!infoText
      });
      tab.input(paddingTopProperty, SliderInputView, {
        hideLabel: true,
        icon: img$3,
        values: paddingTopScale.values,
        texts: paddingTopScale.texts,
        defaultValue: paddingTopScale.defaultValue,
        saveOnSlide: true,
        onInteractionStart: scrollToSectionStart,
        disabled
      });
    }
    function toggleExposeMotifAreaInputs(tab, {
      portrait,
      disabled,
      paddingTopProperty
    }) {
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
        texts: [I18n.t(`${i18nPrefix}.attributes.exposeMotifArea.values.true`), I18n.t(`${i18nPrefix}.attributes.exposeMotifArea.values.false`)],
        ...(transientStateModel && {
          model: transientStateModel
        }),
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
        visible: ([exposeMotifArea, layout]) => exposeMotifArea && layout !== 'center' && layout !== 'centerRagged',
        disabled
      });
      tab.input(paddingTopProperty, SliderInputView, {
        hideLabel: true,
        icon: img$3,
        values: paddingTopScale.values,
        texts: paddingTopScale.texts,
        defaultValue: paddingTopScale.defaultValue,
        saveOnSlide: true,
        visibleBinding: ['exposeMotifArea', 'layout'],
        visibleBindingModel: transientStateModel,
        visible: ([exposeMotifArea, layout]) => !exposeMotifArea || layout !== 'center' && layout !== 'centerRagged',
        onInteractionStart: scrollToSectionStart,
        disabled
      });
    }
    function advertiseMotifAreaInputs(tab, {
      portrait,
      disabled,
      paddingTopProperty
    }) {
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
        paddingTopProperty
      });
    }
    function bottomPaddingInputs(tab, {
      portrait,
      disabled,
      paddingBottomProperty
    }) {
      tab.view(SeparatorView$1);
      tab.input('bottomPaddingVisualization', SectionPaddingVisualizationView, {
        variant: 'bottomPadding',
        portrait,
        disabled
      });
      tab.input(paddingBottomProperty, SliderInputView, {
        hideLabel: true,
        icon: img$4,
        values: paddingBottomScale.values,
        texts: paddingBottomScale.texts,
        defaultValue: paddingBottomScale.defaultValue,
        saveOnSlide: true,
        onInteractionStart: scrollToSectionEnd,
        disabled
      });
    }
    function backdropHasAnyMotifArea(status) {
      return backdrop.getMotifAreaStatus({
        portrait: false
      }) === status || backdrop.getMotifAreaStatus({
        portrait: true
      }) === status;
    }
    function displayAsManualPadding() {
      if (!transientStateModel) {
        transientStateModel = new Backbone.Model({
          exposeMotifArea: false
        });
      }
    }
    function persistMotifBasedPadding() {
      var _transientStateModel;
      if ((_transientStateModel = transientStateModel) === null || _transientStateModel === void 0 ? void 0 : _transientStateModel.get('exposeMotifArea')) {
        configuration.set('exposeMotifArea', true);
        transientStateModel = null;
      }
    }
    function scrollToSectionStart() {
      entry.trigger('scrollToSection', section, {
        ifNeeded: true
      });
    }
    function scrollToSectionEnd() {
      entry.trigger('scrollToSection', section, {
        align: 'nearEnd',
        ifNeeded: true
      });
    }
  }
});

const DuplicateContentElementMenuItem = Backbone.Model.extend({
  initialize(attributes, options) {
    this.contentElement = options.contentElement;
    this.entry = options.entry;
    this.editor = options.editor;
    const contentElementType = this.editor.contentElementTypes.findByTypeName(this.contentElement.get('typeName'));
    this.set('label', I18n.t(contentElementType.handleDuplicate ? 'pageflow_scrolled.editor.duplicate_content_element_menu_item.selection_label' : 'pageflow_scrolled.editor.duplicate_content_element_menu_item.label'));
  },
  selected() {
    const contentElementType = this.editor.contentElementTypes.findByTypeName(this.contentElement.get('typeName'));
    if (contentElementType.handleDuplicate) {
      contentElementType.handleDuplicate(this.contentElement);
    } else {
      this.entry.duplicateContentElement(this.contentElement);
    }
  }
});
const DestroyContentElementMenuItem = DestroyMenuItem.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.destroy_content_element_menu_item',
  initialize(attributes, options) {
    this.contentElement = options.contentElement;
    this.entry = options.entry;
    this.editor = options.editor;
    DestroyMenuItem.prototype.initialize.call(this, attributes, options);
    const contentElementType = this.editor.contentElementTypes.findByTypeName(this.contentElement.get('typeName'));
    if (contentElementType.handleDestroy) {
      this.set('label', I18n.t('pageflow_scrolled.editor.destroy_content_element_menu_item.selection_label'));
    }
  },
  destroyModel() {
    const contentElementType = this.editor.contentElementTypes.findByTypeName(this.contentElement.get('typeName'));
    if (contentElementType.handleDestroy) {
      const result = contentElementType.handleDestroy(this.contentElement);
      if (result === false) {
        return false;
      }
    }
    this.entry.deleteContentElement(this.contentElement);
  }
});
const MoveContentElementMenuItem = Backbone.Model.extend({
  initialize(attributes, options) {
    this.contentElement = options.contentElement;
    this.entry = options.entry;
    this.editor = options.editor;
    const contentElementType = this.editor.contentElementTypes.findByTypeName(this.contentElement.get('typeName'));
    this.set('label', I18n.t(contentElementType.handleMove ? 'pageflow_scrolled.editor.content_element_menu_items.move_selection' : 'pageflow_scrolled.editor.content_element_menu_items.move'));
  },
  selected() {
    const contentElement = this.contentElement;
    const entry = this.entry;
    const contentElementType = this.editor.contentElementTypes.findByTypeName(contentElement.get('typeName'));
    SelectMoveDestinationDialogView.show({
      entry,
      mode: 'sectionPart',
      onSelect: ({
        section: targetSection,
        part
      }) => {
        const to = getTo(targetSection, part);
        if (!to) {
          return;
        }
        if (contentElementType.handleMove) {
          contentElementType.handleMove(contentElement, to);
        } else {
          entry.moveContentElement({
            id: contentElement.id
          }, to, {
            success() {
              entry.trigger('scrollToSection', targetSection, {
                align: part === 'beginning' ? 'nearStart' : 'nearEnd'
              });
            }
          });
        }
      }
    });
  }
});
function getTo(targetSection, part) {
  if (part === 'beginning') {
    const firstContentElement = targetSection.contentElements.first();
    return firstContentElement && {
      at: 'before',
      id: firstContentElement.id
    };
  } else {
    const lastContentElement = targetSection.contentElements.last();
    return lastContentElement && {
      at: 'after',
      id: lastContentElement.id
    };
  }
}

const EditContentElementView = EditConfigurationView.extend({
  translationKeyPrefix() {
    return `pageflow_scrolled.editor.content_elements.${this.model.get('typeName')}`;
  },
  containingCollection() {
    return this.options.entry.contentElements;
  },
  configure(configurationEditor) {
    this.options.editor.contentElementTypes.setupConfigurationEditor(this.model.get('typeName'), configurationEditor, {
      entry: this.options.entry,
      contentElement: this.model
    });
  },
  getActionsMenuItems() {
    return [new DuplicateContentElementMenuItem({}, {
      contentElement: this.model,
      entry: this.options.entry,
      editor: this.options.editor
    }), new MoveContentElementMenuItem({}, {
      contentElement: this.model,
      entry: this.options.entry,
      editor: this.options.editor
    }), new DestroyContentElementMenuItem({
      separated: true
    }, {
      contentElement: this.model,
      entry: this.options.entry,
      editor: this.options.editor
    })];
  }
});

var styles$u = {"container":"ReviewView-module_container__sCmdV"};

const ReviewView = Marionette.ItemView.extend({
  template: () => `<div class="${styles$u.container}"></div>`,
  props() {
    return {};
  },
  onShow() {
    const session = this.options.entry.reviewSession;
    this.reviewMessageHandler = ReviewMessageHandler.create({
      session,
      targetWindow: window
    });
    this.setDraft = draft => session.setDraft(draft);
    this.rerender();
  },
  onClose() {
    this.reviewMessageHandler.dispose();
    ReactDOM.unmountComponentAtNode(this._containerEl());
  },
  rerender() {
    const {
      entry
    } = this.options;
    ReactDOM.render( /*#__PURE__*/React.createElement(ReviewStateProvider, {
      initialState: entry.reviewSession.state,
      initialDrafts: entry.reviewSession.drafts,
      setDraft: this.setDraft
    }, /*#__PURE__*/React.createElement(EntryStateProvider, {
      seed: entry.scrolledSeed
    }, /*#__PURE__*/React.createElement(WatchEntryCollections, {
      entry: entry
    }), /*#__PURE__*/React.createElement(LocatedCommentThreadsProvider, null, /*#__PURE__*/React.createElement(ScrollHighlightedThreadIntoViewProvider, null, this.renderContent(this.props()))))), this._containerEl());
  },
  _containerEl() {
    return this.$el.find(`.${styles$u.container}`)[0];
  }
});
function WatchEntryCollections({
  entry
}) {
  const dispatch = useEntryStateDispatch();
  useEffect(() => watchCollections(entry, {
    dispatch
  }), [entry, dispatch]);
  return null;
}

var styles$v = {"list":"EntryCommentsView-module_list__vk2na","chapter":"EntryCommentsView-module_chapter__1bBx3","chapterHeading":"EntryCommentsView-module_chapterHeading__1PHXV","chapterNumber":"EntryCommentsView-module_chapterNumber__1l0EL","chapterTitle":"EntryCommentsView-module_chapterTitle__3r92T","group":"EntryCommentsView-module_group__3mnOy","separator":"EntryCommentsView-module_separator__1py-K","typeName":"EntryCommentsView-module_typeName__2xj5k","pictogram":"EntryCommentsView-module_pictogram__3DqbQ","rule":"EntryCommentsView-module_rule__2ybKR"};

const EntryCommentsView = ReviewView.extend({
  initialize() {
    const {
      entry
    } = this.options;
    this.listenTo(entry, 'change:highlightedThreadId', () => this.rerender());
    this.listenTo(entry, 'change:selectedCommentsSubject', this._onSelectedChange);
    this.listenTo(entry.commentDisplayFilter, 'change:resolution', () => this.rerender());
    this._observeSelectedElement();
  },
  props() {
    var _this$_selectedElemen;
    const {
      entry,
      editor
    } = this.options;
    return {
      selectedSubject: entry.get('selectedCommentsSubject') || null,
      // Undefined for elements without a slate cursor, an array
      // (possibly empty) where one reports overlapping threads.
      transientThreadIds: (_this$_selectedElemen = this._selectedElement) === null || _this$_selectedElemen === void 0 ? void 0 : _this$_selectedElemen.transientState.get('commentThreadIdsAtSelection'),
      highlightedThreadId: entry.get('highlightedThreadId'),
      resolution: entry.commentDisplayFilter.get('resolution'),
      onThreadClick: thread => entry.trigger('selectCommentThread', thread.id),
      editor
    };
  },
  renderContent(props) {
    return /*#__PURE__*/React.createElement(CommentsList, props);
  },
  _onSelectedChange() {
    this._observeSelectedElement();
    this.rerender();
  },
  _observeSelectedElement() {
    if (this._selectedElement) {
      this.stopListening(this._selectedElement.transientState);
    }
    const subject = this.options.entry.get('selectedCommentsSubject');
    this._selectedElement = (subject === null || subject === void 0 ? void 0 : subject.subjectType) === 'ContentElement' ? this.options.entry.contentElements.get(subject.id) : null;
    if (this._selectedElement) {
      this.listenTo(this._selectedElement.transientState, 'change:commentThreadIdsAtSelection', () => this.rerender());
    }
  }
});
function CommentsList({
  selectedSubject,
  transientThreadIds,
  highlightedThreadId,
  resolution,
  onThreadClick,
  editor
}) {
  const {
    chapters
  } = useLocatedCommentThreads();
  const isListed = thread => matchesResolution(thread, resolution) || thread.id === highlightedThreadId;
  return /*#__PURE__*/React.createElement("div", {
    className: styles$v.list
  }, chapters.map((chapter, index) => /*#__PURE__*/React.createElement(ChapterGroup, {
    key: `chapter-${chapter.permaId}`,
    chapter: chapter,
    number: chapter.isExcursion ? null : index + 1,
    isListed: isListed,
    selectedSubject: selectedSubject,
    transientThreadIds: transientThreadIds,
    highlightedThreadId: highlightedThreadId,
    resolution: resolution,
    onThreadClick: onThreadClick,
    editor: editor
  })));
}
function ChapterGroup({
  chapter,
  number,
  isListed,
  ...groupProps
}) {
  if (!chapter.sections.some(section => hasListedThreads(section, isListed))) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles$v.chapter
  }, /*#__PURE__*/React.createElement(ChapterHeading, {
    number: number,
    title: chapter.title
  }), chapter.sections.map(section => /*#__PURE__*/React.createElement(React.Fragment, {
    key: `section-${section.permaId}`
  }, section.threads.some(isListed) && /*#__PURE__*/React.createElement(SectionGroup, Object.assign({
    section: section,
    threads: section.threads.filter(isListed)
  }, groupProps)), section.contentElements.map(contentElement => contentElement.threads.some(isListed) && /*#__PURE__*/React.createElement(ContentElementGroup, Object.assign({
    key: `element-${contentElement.permaId}`,
    contentElement: contentElement,
    threads: contentElement.threads.filter(isListed)
  }, groupProps))))));
}
function hasListedThreads(section, isListed) {
  return section.threads.some(isListed) || section.contentElements.some(contentElement => contentElement.threads.some(isListed));
}
function ChapterHeading({
  number,
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$v.chapterHeading
  }, /*#__PURE__*/React.createElement("span", {
    className: styles$v.rule
  }), /*#__PURE__*/React.createElement("span", {
    className: styles$v.chapterNumber
  }, number != null ? `${I18n.t('pageflow_scrolled.editor.chapter_item.chapter')} ${number}` : I18n.t('pageflow_scrolled.editor.chapter_item.excursion')), /*#__PURE__*/React.createElement("span", {
    className: styles$v.chapterTitle
  }, title), /*#__PURE__*/React.createElement("span", {
    className: styles$v.rule
  }));
}
function ContentElementGroup({
  contentElement,
  threads,
  selectedSubject,
  transientThreadIds,
  highlightedThreadId,
  resolution,
  onThreadClick,
  editor
}) {
  const {
    permaId,
    type
  } = contentElement;
  const label = I18n.t(`pageflow_scrolled.editor.content_elements.${type}.name`);
  const pictogram = editor.contentElementTypes.findPictogram(type) || img;
  const isSelected = (selectedSubject === null || selectedSubject === void 0 ? void 0 : selectedSubject.subjectType) === 'ContentElement' && selectedSubject.id === contentElement.id;
  const groupHighlight = isSelected && transientThreadIds === undefined ? threads.map(t => t.id) : highlightedThreadId;
  return /*#__PURE__*/React.createElement("div", {
    className: styles$v.group
  }, /*#__PURE__*/React.createElement(Separator, {
    label: label,
    pictogram: pictogram
  }), /*#__PURE__*/React.createElement(ThreadList, {
    subjectType: "ContentElement",
    subjectId: permaId,
    resolution: resolution,
    highlightedThreadId: groupHighlight,
    onThreadClick: onThreadClick,
    restrictInteractionsToHighlighted: true,
    startCollapsed: true,
    markReadWhenHighlighted: true,
    showNewForm: false,
    hideNewTopicButton: true
  }));
}
function SectionGroup({
  section,
  threads,
  selectedSubject,
  highlightedThreadId,
  resolution,
  onThreadClick
}) {
  const {
    permaId
  } = section;
  const isSelected = (selectedSubject === null || selectedSubject === void 0 ? void 0 : selectedSubject.subjectType) === 'Section' && selectedSubject.id === section.id;
  const groupHighlight = isSelected ? threads.map(t => t.id) : highlightedThreadId;
  return /*#__PURE__*/React.createElement("div", {
    className: styles$v.group
  }, /*#__PURE__*/React.createElement(Separator, {
    label: I18n.t('pageflow_scrolled.editor.comments_view.section'),
    pictogram: img$1
  }), /*#__PURE__*/React.createElement(ThreadList, {
    subjectType: "Section",
    subjectId: permaId,
    resolution: resolution,
    highlightedThreadId: groupHighlight,
    onThreadClick: onThreadClick,
    restrictInteractionsToHighlighted: true,
    startCollapsed: true,
    markReadWhenHighlighted: true,
    showNewForm: false,
    hideNewTopicButton: true
  }));
}
function Separator({
  label,
  pictogram
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$v.separator
  }, /*#__PURE__*/React.createElement("span", {
    className: styles$v.rule
  }), /*#__PURE__*/React.createElement("span", {
    className: styles$v.typeName
  }, label), pictogram && /*#__PURE__*/React.createElement("span", {
    className: styles$v.pictogram,
    style: {
      maskImage: `url('${escapeCssUrl$1(pictogram)}')`
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: styles$v.rule
  }));
}
function escapeCssUrl$1(url) {
  return url.replace(/'/g, "\\'").replace(/\n/g, '');
}

var styles$w = {"root":"SelectionCommentsView-module_root__1qIX6"};

const SelectionCommentsView = ReviewView.extend({
  className: styles$w.root,
  initialize() {
    const {
      entry
    } = this.options;
    this.listenTo(entry, 'change:selectedCommentsSubject', this._onSelectedChange);
    this.listenTo(entry, 'change:highlightedThreadId', () => this.rerender());
    this.listenTo(entry.commentDisplayFilter, 'change:resolution', () => this.rerender());
    this._observeSubject();
  },
  props() {
    const {
      entry
    } = this.options;
    const subject = entry.get('selectedCommentsSubject');

    // A `change:highlightedThreadId` rerender can run before
    // `change:selectedCommentsSubject` has refreshed `this._model`.
    const model = this._resolveModel();
    if (!subject || !model) {
      return {};
    }
    const expandResolved = entry.commentDisplayFilter.showsResolved();
    if (subject.subjectType === 'ContentElement') {
      return {
        subjectType: 'ContentElement',
        subjectId: model.get('permaId'),
        threadIds: model.transientState.get('commentThreadIdsAtSelection'),
        highlightedThreadId: entry.get('highlightedThreadId'),
        expandResolved,
        onThreadClick: thread => entry.trigger('selectCommentThread', thread.id)
      };
    }
    return {
      subjectType: subject.subjectType,
      subjectId: model.get('permaId'),
      expandResolved
    };
  },
  renderContent({
    subjectType,
    subjectId,
    threadIds,
    highlightedThreadId,
    expandResolved,
    onThreadClick
  }) {
    if (!subjectType) return null;
    if (threadIds === undefined) {
      return /*#__PURE__*/React.createElement(ThreadList, {
        subjectType: subjectType,
        subjectId: subjectId,
        expandResolved: expandResolved,
        showNewForm: false,
        hideNewTopicButton: true
      });
    }
    return /*#__PURE__*/React.createElement(ThreadList, {
      subjectType: subjectType,
      subjectId: subjectId,
      filter: thread => threadIds.includes(thread.id),
      highlightedThreadId: highlightedThreadId,
      expandResolved: expandResolved,
      onThreadClick: onThreadClick,
      showNewForm: false,
      hideNewTopicButton: true
    });
  },
  _onSelectedChange() {
    this._observeSubject();
    this.rerender();
  },
  _observeSubject() {
    var _this$_model, _this$_model2;
    if ((_this$_model = this._model) === null || _this$_model === void 0 ? void 0 : _this$_model.transientState) {
      this.stopListening(this._model.transientState);
    }
    this._model = this._resolveModel();
    if ((_this$_model2 = this._model) === null || _this$_model2 === void 0 ? void 0 : _this$_model2.transientState) {
      this.listenTo(this._model.transientState, 'change:commentThreadIdsAtSelection', () => this.rerender());
    }
  },
  _resolveModel() {
    const {
      entry
    } = this.options;
    const subject = entry.get('selectedCommentsSubject');
    if (!subject) return null;
    return subject.subjectType === 'Section' ? entry.sections.get(subject.id) : entry.contentElements.get(subject.id);
  }
});

var img$8 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' width='16' height='16'%3e%3cpath d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' /%3e%3cpath d='M3 3v5h5' /%3e%3cpath d='M12 7v5l4 2' /%3e%3c/svg%3e";

var styles$x = {"root":"CommentsView-module_root__2hiro","newThreadButton":"CommentsView-module_newThreadButton__2aBRZ buttons-module_secondaryAddButton__DhBL6 buttons-module_secondaryIconButton__4LT0V secondary_icon_button icons-module_plus__2MfLG icons-module_icon__16IVx","controls":"CommentsView-module_controls__2fWBp","activityButton":"CommentsView-module_activityButton__1DWfm","activityIcon":"CommentsView-module_activityIcon__2M11b","indicator":"CommentsView-module_indicator__3acP4"};

const CommentsView = Marionette.ItemView.extend({
  className: styles$x.root,
  template: () => `
    <a class="back">${I18n.t('pageflow.editor.templates.back_button_decorator.outline')}</a>
    <button class="${styles$x.newThreadButton}">${I18n.t('pageflow_scrolled.editor.comments_view.new_thread')}</button>
    <div class="tabs"></div>
  `,
  ui: {
    tabs: '.tabs'
  },
  events: {
    'click a.back': 'goBack',
    ...cssModulesUtils.events(styles$x, {
      'click newThreadButton': 'startNewThread',
      'click activityButton': 'showActivity'
    })
  },
  initialize: function () {
    this.listenTo(this.options.entry, 'change:selectedCommentsSubject', this._updateNewThreadButton);
    this.listenTo(this.options.entry, 'change:hasUnreadComments', this._updateActivityButton);
  },
  onRender: function () {
    const {
      entry,
      defaultTab,
      editor: editorApi
    } = this.options;
    const tabsView = new TabsView$1({
      i18n: 'pageflow_scrolled.editor.comments_view.tabs',
      defaultTab: defaultTab || 'comments'
    });
    tabsView.tab('comments', () => new EntryCommentsView({
      entry,
      editor: editorApi
    }));
    tabsView.tab('selection', () => new SelectionCommentsView({
      entry,
      editor: editorApi
    }));
    this.appendSubview(tabsView, {
      to: this.ui.tabs
    });

    // The controls are not part of the tablist.
    this.$('.tabs_view-scroller').append(`
      <div class="${styles$x.controls}">${activityButton()}</div>
    `);
    this.appendSubview(new DropDownButtonView({
      title: I18n.t('pageflow_scrolled.editor.comments_view.display_options'),
      alignMenu: 'right',
      ellipsisIcon: true,
      borderless: true,
      openOnClick: true,
      items: displayOptions(entry.commentDisplayFilter)
    }), {
      to: this.$(cssModulesUtils.selector(styles$x, 'controls'))
    });
    this._updateNewThreadButton();
    this._updateActivityButton();
  },
  startNewThread: function () {
    const {
      entry
    } = this.options;
    const subject = entry.get('selectedCommentsSubject');
    if (!subject) return;
    if (subject.subjectType === 'Section') {
      const section = entry.sections.get(subject.id);
      entry.trigger('selectNewThread', {
        subjectId: section.get('permaId'),
        subjectType: 'Section'
      });
    } else {
      const contentElement = entry.contentElements.get(subject.id);
      entry.trigger('selectNewThread', {
        subjectId: contentElement.get('permaId'),
        subjectType: 'ContentElement',
        range: contentElement.transientState.get('newCommentThreadSubjectRange')
      });
    }
  },
  showActivity: function () {
    editor$1.navigate('/scrolled/comments/activity', {
      trigger: true
    });
  },
  goBack: function () {
    editor$1.navigate('/', {
      trigger: true
    });
  },
  _updateNewThreadButton: function () {
    const enabled = !!this.options.entry.get('selectedCommentsSubject');
    this.$(cssModulesUtils.selector(styles$x, 'newThreadButton')).prop('disabled', !enabled);
  },
  _updateActivityButton: function () {
    this.$(cssModulesUtils.selector(styles$x, 'activityButton')).toggleClass(styles$x.indicator, !!this.options.entry.get('hasUnreadComments'));
  }
});
function displayOptions(commentDisplayFilter) {
  const items = new ResolutionMenuItems([{
    name: 'unresolved'
  }, {
    name: 'all'
  }], {
    commentDisplayFilter
  });
  items.add(new AlwaysShowCommentsMenuItem({}, {
    commentDisplayFilter
  }));
  return items;
}
const ResolutionMenuItem = Backbone.Model.extend({
  initialize(attributes, options) {
    this.commentDisplayFilter = options.commentDisplayFilter;
    this.set('label', I18n.t('pageflow_scrolled.editor.comments_view.filter.' + this.get('name')));
    this.set('kind', 'radio');
    const updateChecked = () => {
      this.set('checked', this.commentDisplayFilter.get('resolution') === this.get('name'));
    };
    this.listenTo(this.commentDisplayFilter, 'change:resolution', updateChecked);
    updateChecked();
  },
  selected() {
    this.commentDisplayFilter.set('resolution', this.get('name'));
  }
});
const ResolutionMenuItems = Backbone.Collection.extend({
  model: ResolutionMenuItem
});
const AlwaysShowCommentsMenuItem = Backbone.Model.extend({
  initialize(attributes, options) {
    this.commentDisplayFilter = options.commentDisplayFilter;
    this.set('label', I18n.t('pageflow_scrolled.editor.comments_view.always_show_comments'));
    this.set('kind', 'checkBox');
    this.set('separated', true);
    const updateChecked = () => {
      this.set('checked', this.commentDisplayFilter.get('alwaysShowComments'));
    };
    this.listenTo(this.commentDisplayFilter, 'change:alwaysShowComments', updateChecked);
    updateChecked();
  },
  selected() {
    this.commentDisplayFilter.set('alwaysShowComments', !this.commentDisplayFilter.get('alwaysShowComments'));
  }
});
function activityButton() {
  const label = I18n.t('pageflow_scrolled.editor.comments_view.activity');
  return `
    <button class="${styles$x.activityButton}" title="${label}" aria-label="${label}">
      <span class="${styles$x.activityIcon}"
            style="mask-image: url('${escapeCssUrl$2(img$8)}')"></span>
    </button>
  `;
}
function escapeCssUrl$2(url) {
  return url.replace(/'/g, "\\'").replace(/\n/g, '');
}

var styles$y = {"root":"CommentActivityView-module_root__3Ztbd","list":"CommentActivityView-module_list__vaG2J"};

const CommentActivityView = Marionette.ItemView.extend({
  className: `comment_activity_view ${styles$y.root}`,
  template: () => `
    <a class="back">${I18n.t('pageflow_scrolled.editor.comment_activity_view.back')}</a>
    <div class="tabs"></div>
  `,
  ui: {
    tabs: '.tabs'
  },
  events: {
    'click a.back': 'goBack'
  },
  onRender: function () {
    const {
      entry
    } = this.options;
    const tabsView = new TabsView$1({
      i18n: 'pageflow_scrolled.editor.comment_activity_view.tabs'
    });
    tabsView.tab('activity', () => new ActivityListView({
      entry
    }));
    this.appendSubview(tabsView, {
      to: this.ui.tabs
    });
  },
  goBack: function () {
    editor$1.navigate('/scrolled/comments', {
      trigger: true
    });
  }
});
const ActivityListView = ReviewView.extend({
  className: styles$y.list,
  initialize() {
    this._trackHighlight();
    this.listenTo(this.options.entry, 'change:highlightedThreadId', () => {
      this._trackHighlight();
      this.rerender();
    });
  },
  props() {
    return {
      highlightedThreadId: this.selectedThreadId,
      onEntryClick: entry => this._selectThread(entry.threadId)
    };
  },
  renderContent(props) {
    return /*#__PURE__*/React.createElement(ActivityList, props);
  },
  _selectThread(threadId) {
    this.selectedThreadId = threadId;
    this.options.entry.trigger('selectCommentThread', threadId);
    this.rerender();
  },
  // The preview reports selected section threads without a highlighted id.
  _trackHighlight() {
    const highlightedThreadId = this.options.entry.get('highlightedThreadId');
    if (highlightedThreadId) {
      this.selectedThreadId = highlightedThreadId;
    }
  }
});

var styles$z = {"root":"NewThreadView-module_root__3wGg1","form":"NewThreadView-module_form__a5rdo"};

const NewThreadView = Marionette.ItemView.extend({
  className: `new_thread_view ${styles$z.root}`,
  template: () => `
    <a class="back">${I18n.t('pageflow_scrolled.editor.new_thread_view.back')}</a>
    <div class="tabs"></div>
  `,
  ui: {
    tabs: '.tabs'
  },
  events: {
    'click a.back': 'goBack'
  },
  onRender: function () {
    const {
      entry,
      subjectType,
      subjectId,
      subjectRange
    } = this.options;
    const tabsView = new TabsView$1({
      i18n: 'pageflow_scrolled.editor.new_thread_view.tabs'
    });
    tabsView.tab('newComment', () => new NewThreadFormView({
      entry,
      subjectType,
      subjectId,
      subjectRange
    }));
    this.appendSubview(tabsView, {
      to: this.ui.tabs
    });
  },
  goBack: function () {
    editor$1.navigate('/scrolled/comments?tab=selection', {
      trigger: true
    });
  }
});
const NewThreadFormView = ReviewView.extend({
  className: styles$z.form,
  renderContent() {
    const {
      subjectType,
      subjectId,
      subjectRange
    } = this.options;
    return /*#__PURE__*/React.createElement(NewThreadForm, {
      subjectType: subjectType,
      subjectId: subjectId,
      subjectRange: subjectRange
    });
  }
});

const SideBarController = Marionette.Controller.extend({
  initialize: function (options) {
    this.region = options.region;
    this.entry = options.entry;
  },
  chapter: function (id, tab) {
    this.region.show(new EditChapterView({
      entry: this.entry,
      model: this.entry.chapters.get(id),
      editor: editor$2
    }));
  },
  section: function (id, tab) {
    this.region.show(new EditSectionView({
      entry: this.entry,
      model: this.entry.sections.get(id),
      editor: editor$2
    }));
  },
  sectionTransition: function (id, tab) {
    this.region.show(new EditSectionTransitionView({
      entry: this.entry,
      model: this.entry.sections.get(id),
      editor: editor$2
    }));
  },
  sectionPaddings: function (id, position) {
    this.region.show(new EditSectionPaddingsView({
      entry: this.entry,
      model: this.entry.sections.get(id),
      editor: editor$2,
      position
    }));
  },
  comments: function (tab) {
    this.region.show(new CommentsView({
      entry: this.entry,
      editor: editor$2,
      defaultTab: tab
    }));
  },
  commentActivity: function () {
    this.region.show(new CommentActivityView({
      entry: this.entry,
      editor: editor$2
    }));
  },
  contentElement: function (id, tab) {
    this.region.show(new EditContentElementView({
      entry: this.entry,
      model: this.entry.contentElements.get(id),
      editor: editor$2
    }));
  },
  newThread: function (subjectType, subjectId, payload) {
    const {
      subjectRange
    } = JSON.parse(decodeURIComponent(payload));
    this.region.show(new NewThreadView({
      entry: this.entry,
      subjectType,
      subjectId: parseInt(subjectId, 10),
      subjectRange,
      editor: editor$2
    }));
  }
});

var styles$A = {"main":"BrowserNotSupportedView-module_main__TMVR7","container":"BrowserNotSupportedView-module_container__2FpC1","texts":"BrowserNotSupportedView-module_texts__3kcI1","icons":"BrowserNotSupportedView-module_icons__3i7mG","child":"BrowserNotSupportedView-module_child__1sr8s","chrome":"BrowserNotSupportedView-module_chrome__1hS6F icons-module_chrome__1XHpi","edge":"BrowserNotSupportedView-module_edge__1aaHV icons-module_edge__2KQ9q","firefox":"BrowserNotSupportedView-module_firefox__1fM8y icons-module_firefox__22UR1","safari":"BrowserNotSupportedView-module_safari__Y2ea8 icons-module_safari__3nzsc"};

const BrowserNotSupportedView = Marionette.ItemView.extend({
  template: () => `
     <div class="${styles$A.main}" />
  `,
  className: styles$A.main,
  ui: cssModulesUtils.ui(styles$A, 'main'),
  onShow() {
    this.appendOptions();
  },
  appendOptions() {
    var container = `<div class='${styles$A.container}'>
                        <div class='${styles$A.texts}'>
                          <h2>${I18n.t('pageflow_scrolled.editor.browser_not_supported.heading')}</h2>
                          <p>${I18n.t('pageflow_scrolled.editor.browser_not_supported.text')}</p>
                        </div>
                        <div class='${styles$A.icons}'>
                          <span class='${styles$A.chrome} ${styles$A.child}'></span>
                          <div class='${styles$A.firefox} ${styles$A.child}'></div>
                          <div class='${styles$A.safari} ${styles$A.child}'></div>
                          <div class='${styles$A.edge} ${styles$A.child}'></div>
                        </div>
                    </div>`;
    this.ui.main.append($(container));
  }
});

editor.registerEntryType('scrolled', {
  entryModel: ScrolledEntry,
  // Concise methods are not constructable, and the core editor calls
  // `new editor.entryType.previewView(...)`.
  previewView: function (options) {
    return new EntryPreviewView({
      ...options,
      editor
    });
  },
  outlineView: EntryOutlineView,
  editDefaultsView: EditDefaultsView,
  appearanceInputs(tabView) {
    tabView.input('darkWidgets', CheckBoxInputView);
  },
  supportsExtendedFileRights: true,
  supportsFileReferences: true,
  isBrowserSupported() {
    return browser.agent.matchesDesktopChrome({
      minVersion: 20
    }) || browser.agent.matchesDesktopFirefox({
      minVersion: 20
    }) || browser.agent.matchesDesktopSafari({
      minVersion: 3
    }) || browser.agent.matchesDesktopEdge({
      minVersion: 20
    });
  },
  browserNotSupportedView: BrowserNotSupportedView
});
editor.registerSideBarRouting({
  router: SideBarRouter,
  controller: SideBarController
});
editor.addInitializer(() => {
  if (features.isEnabled('commenting')) {
    editor.registerMainMenuItem({
      translationKey: 'pageflow_scrolled.editor.main_menu.comments',
      path: '/scrolled/comments',
      id: 'comments',
      indicatorAttribute: 'hasUnreadComments'
    });
  }
});
editor.registerFileSelectionHandler('contentElementConfiguration', ContentElementFileSelectionHandler);
editor.widgetTypes.registerRole('header', {
  isOptional: true
});
editor.widgetTypes.registerRole('scrollIndicator', {
  isOptional: true
});
editor.widgetTypes.register('defaultNavigation', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function () {
      const [values, texts] = this.options.entry.getPaletteColors({
        name: 'accentColors'
      });
      this.tab('defaultNavigation', function () {
        if (values.length) {
          this.input('accentColor', ColorSelectInputView, {
            includeBlank: true,
            blankTranslationKey: 'pageflow_scrolled.editor.' + 'common_content_element_attributes.' + 'palette_color.blank',
            values,
            texts
          });
        }
        this.input('hideToggleMuteButton', CheckBoxInputView);
        this.input('hideSharingButton', CheckBoxInputView);
        this.input('fixedOnDesktop', CheckBoxInputView);
        this.input('firstBackdropBelowNavigation', CheckBoxInputView, {
          disabledBinding: 'fixedOnDesktop',
          disabled: fixedOnDesktop => !fixedOnDesktop,
          displayUncheckedIfDisabled: true
        });
      });
    }
  })
});
editor.widgetTypes.register('textInlineFileRights', {
  configurationEditorTabViewGroups: {
    ContentElementInlineFileRightsSettings: function ({
      disableWhenNoFileRights = true
    }) {
      this.input('showTextInlineFileRightsBackdrop', CheckBoxInputView, {
        disabledBindingModel: this.model.parent.transientState,
        disabledBinding: 'hasFileRights',
        disabled: hasFileRights => disableWhenNoFileRights && !hasFileRights,
        displayUncheckedIfDisabled: true,
        attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.content_element_text_inline_file_rights_attributes']
      });
    }
  }
});
editor.widgetTypes.register('iconScrollIndicator', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function () {
      const firstSection = this.options.entry.sections.first();
      if (firstSection) {
        this.options.entry.trigger('scrollToSection', firstSection);
      }
      this.tab('iconScrollIndicator', function () {
        this.input('alignment', SelectInputView, {
          values: ['centerContent', 'centerViewport']
        });
        this.input('size', SelectInputView, {
          defaultValue: 'small',
          values: ['large', 'small']
        });
        this.input('animation', SelectInputView, {
          defaultValue: 'smallBounce',
          values: ['none', 'smallBounce', 'largeBounce']
        });
      });
    }
  })
});
editor.widgetTypes.register('excursionSheet', {
  configurationEditorTabViewGroups: {
    ChapterExcursionSettings: function () {
      this.view(SeparatorView);
      this.input('sheetWidth', SelectInputView, {
        values: ['full', 'inset']
      });
      this.input('returnButtonLabel', TextInputView);
    }
  }
});

var buttons_module = {"primaryIconButton":"buttons-module_primaryIconButton__KHPA9 primary_icon_button","secondaryIconButton":"buttons-module_secondaryIconButton__4LT0V secondary_icon_button","unstyledButton":"buttons-module_unstyledButton__3m76W","addButton":"buttons-module_addButton__2pN-g buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_plusCircled__20FlJ icons-module_icon__16IVx","secondaryAddButton":"buttons-module_secondaryAddButton__DhBL6 buttons-module_secondaryIconButton__4LT0V secondary_icon_button icons-module_plus__2MfLG icons-module_icon__16IVx","cancelButton":"buttons-module_cancelButton__1xJCN buttons-module_secondaryIconButton__4LT0V secondary_icon_button icons-module_cancel__1PjiX icons-module_icon__16IVx","targetButton":"buttons-module_targetButton__1utZh buttons-module_secondaryIconButton__4LT0V secondary_icon_button icons-module_target__1gQxR icons-module_icon__16IVx","saveButton":"buttons-module_saveButton__1M-qM buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_check__3Lkw9 icons-module_icon__16IVx","selectFileButton":"buttons-module_selectFileButton__khOoU buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_rightOpen__9vsOG icons-module_icon__16IVx"};

var styles$B = {"hint":"NoOptionsHintView-module_hint__1etP_"};

const NoOptionsHintView = Marionette.ItemView.extend({
  className: styles$B.hint,
  template: () => I18n.t('pageflow_scrolled.editor.no_options')
});

const ImageModifierListInputView = function (options) {
  return new StyleListInputView({
    ...options,
    hideLabel: true,
    types: Style.getImageModifierTypes({
      entry: options.entry
    }),
    translationKeyPrefix: 'pageflow_scrolled.editor.image_modifier_list_input'
  });
};

// Scrolls a miniature section along the view timeline of the content element,
// from before it enters the viewport until it has left again or until the
// offset given by scrollUntil, resting there for scrollRest before scrolling
// back. Children are rendered inside the rectangle representing the content
// element.
function ScrollingContentElementVisualization({
  position,
  layout,
  viewportCenter,
  scrollUntil,
  scrollDuration,
  scrollRest,
  onScroll,
  children
}) {
  const scrollerRef = useRef();
  useScrollAnimation(scrollerRef, {
    scrollTop: (scroller, animationProgress) => {
      const {
        from,
        to
      } = measureScrollTimeline({
        scroller,
        position,
        until: scrollUntil
      });
      return from + (to - from) * animationProgress;
    },
    duration: scrollDuration,
    rest: scrollRest,
    onScroll
  });
  return /*#__PURE__*/React.createElement(ContentElementVisualization, {
    ref: scrollerRef,
    position: position,
    layout: layout,
    narrowBlock: true,
    scrollRoom: true,
    viewportCenter: viewportCenter
  }, children);
}

var styles$C = {"playbackProgress":"PlaybackProgress-module_playbackProgress__2a8yw","bar":"PlaybackProgress-module_bar__1qeR1","percent":"PlaybackProgress-module_percent__cy1Gx"};

// Setting progress imperatively prevents rerendering the surrounding
// preview on every frame of the scroll animation.
const PlaybackProgress = forwardRef(function PlaybackProgress(props, ref) {
  const percentRef = useRef();
  const barRef = useRef();
  useImperativeHandle(ref, () => ({
    setProgress(progress) {
      percentRef.current.textContent = `${Math.round(progress * 100)}%`;
      barRef.current.style.width = `${progress * 100}%`;
    }
  }), []);
  return /*#__PURE__*/React.createElement("div", {
    className: styles$C.playbackProgress
  }, /*#__PURE__*/React.createElement("div", {
    ref: barRef,
    className: styles$C.bar
  }), /*#__PURE__*/React.createElement("span", {
    ref: percentRef,
    className: styles$C.percent
  }));
});

// Offsets of the element's top edge at which the lifecycle of a content
// element considers it visible respectively active.
const startOffsets = {
  onVisible: 1,
  onActivate: 0.5
};

// Stop scrolling just past the offset of the option that starts last, so both
// animations play out near a turning point of the scroll animation, where the
// element barely moves.
const scrollEndOffset = 0.4;

// Since the sweep covers less than a viewport height, the duration a whole
// view timeline takes would make it crawl.
const scrollDuration = 1500;

// Long enough to tell a filling bar apart from a step. The scroll animation
// rests just as long at its end, so the animation triggered at the viewport
// center has played before the element scrolls back out.
const playbackDuration = 1000;
const PlaybackStartSelectInputView = ListboxInputView.extend({
  // Options are rendered when the dropdown is opened, so passing
  // position and layout as functions ensures the illustration matches
  // what the element looks like by then.
  renderItem(item) {
    return /*#__PURE__*/React.createElement(Preview$2, {
      item: item,
      position: _.result(this.options, 'position'),
      layout: _.result(this.options, 'sectionLayout')
    });
  }
});
function Preview$2({
  item,
  position,
  layout
}) {
  const progressRef = useRef();
  const onScroll = usePlayback(progressRef, {
    position,
    startOffset: startOffsets[item.value]
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ScrollingContentElementVisualization, {
    position: position,
    layout: layout,
    viewportCenter: item.value === 'onActivate',
    scrollUntil: scrollEndOffset,
    scrollDuration: scrollDuration,
    scrollRest: playbackDuration,
    onScroll: onScroll
  }, /*#__PURE__*/React.createElement(PlaybackProgress, {
    ref: progressRef
  })), item.text);
}
function usePlayback(progressRef, {
  position,
  startOffset
}) {
  const startedAtRef = useRef();
  return scroller => {
    const elementTop = measureElementTop({
      scroller,
      position
    });

    // Start over once the element is back below the viewport, so the looping
    // illustration demonstrates the start of playback again.
    if (elementTop >= 1) {
      startedAtRef.current = null;
    } else if (!startedAtRef.current && elementTop <= startOffset) {
      startedAtRef.current = new Date().getTime();
    }
    progressRef.current.setProgress(playbackProgress(startedAtRef.current));
  };
}

// An animation that is played once runs at its own pace, so progress follows
// the time elapsed since playback started.
function playbackProgress(startedAt) {
  if (!startedAt) {
    return 0;
  }
  return Math.min((new Date().getTime() - startedAt) / playbackDuration, 1);
}

const ScrollRangeSelectInputView = ListboxInputView.extend({
  renderItem(item) {
    return /*#__PURE__*/React.createElement(Preview$3, {
      item: item,
      position: _.result(this.options, 'position'),
      layout: _.result(this.options, 'sectionLayout')
    });
  }
});
function Preview$3({
  item,
  position,
  layout
}) {
  const progressRef = useRef();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ScrollingContentElementVisualization, {
    position: position,
    layout: layout,
    viewportCenter: measuresViewportCenter(item.value, position),
    onScroll: scroller => progressRef.current.setProgress(measureViewTimelineProgress({
      scroller,
      position,
      range: item.value
    }))
  }, /*#__PURE__*/React.createElement(PlaybackProgress, {
    ref: progressRef
  })), item.text);
}
function measuresViewportCenter(range, position) {
  return range === 'center' || range === 'inFocus' && !pinsElement(position);
}

/*global pageflow*/
Object.assign(pageflow, globalInterop);

export { ColorSelectInputView, EditContentElementView, EditMotifAreaDialogView, ImageModifierListInputView, InlineFileRightsMenuItem, NoOptionsHintView, PlaybackStartSelectInputView, ScrollRangeSelectInputView, buttons_module as buttonStyles, defineEntryDefaultsInputsFromSeed, dialogView, dialogViewStyles, editor };
