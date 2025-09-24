import I18n from 'i18n-js';
import { editor, InlineFileRightsMenuItem, ImageModifierListInputView, EditMotifAreaDialogView, buttonStyles, dialogViewStyles, dialogView } from 'pageflow-scrolled/editor';
import { contentElementWidths, utils, paletteColor } from 'pageflow-scrolled/frontend';
import { SelectInputView, SeparatorView, CheckBoxInputView, LabelOnlyView, ColorInputView, UrlInputView, TextInputView, SliderInputView, ConfigurationEditorView, cssModulesUtils, TabsView, inputView, NumberInputView } from 'pageflow/ui';
import { InfoBoxView, FileInputView, CheckBoxInputView as CheckBoxInputView$1, ColorInputView as ColorInputView$1, editor as editor$1, transientReferences, ListView, cssModulesUtils as cssModulesUtils$1, app, SelectInputView as SelectInputView$1, SeparatorView as SeparatorView$1, SliderInputView as SliderInputView$1, EnumTableCellView } from 'pageflow/editor';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import _ from 'underscore';
import React, { useReducer, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { DraggableCore } from 'react-draggable';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var img = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3c!--! Font Awesome Pro 6.1.1 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons%2c Inc. --%3e%3cpath fill='white' d='M448 448c0 17.69-14.33 32-32 32h-96c-17.67 0-32-14.31-32-32s14.33-32 32-32h16v-144h-224v144H128c17.67 0 32 14.31 32 32s-14.33 32-32 32H32c-17.67 0-32-14.31-32-32s14.33-32 32-32h16v-320H32c-17.67 0-32-14.31-32-32s14.33-32 32-32h96c17.67 0 32 14.31 32 32s-14.33 32-32 32H112v112h224v-112H320c-17.67 0-32-14.31-32-32s14.33-32 32-32h96c17.67 0 32 14.31 32 32s-14.33 32-32 32h-16v320H416C433.7 416 448 430.3 448 448z'/%3e%3c/svg%3e";

editor.contentElementTypes.register('heading', {
  pictogram: img,
  supportedPositions: ['inline'],
  supportedWidthRange: ['md', 'xl'],
  defaultConfig: {
    width: contentElementWidths.xl,
    marginTop: 'none'
  },
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry;
    this.listenTo(this.model, 'change:hyphens', this.refresh);
    var modelDelegator = entry.createLegacyTypographyVariantDelegator({
      model: this.model,
      paletteColorPropertyName: 'color'
    });
    this.tab('general', function () {
      this.group('ContentElementTypographyVariant', {
        entry: entry,
        model: modelDelegator,
        getPreviewConfiguration: function getPreviewConfiguration(configuration, typographyVariant) {
          return _objectSpread2(_objectSpread2({}, configuration), {}, {
            textSize: 'small',
            typographyVariant: typographyVariant
          });
        }
      });
      this.input('textSize', SelectInputView, {
        values: ['auto', 'large', 'medium', 'small']
      });
      this.group('PaletteColor', {
        entry: entry,
        model: modelDelegator,
        propertyName: 'color'
      });
      this.input('entranceAnimation', SelectInputView, {
        values: ['none', 'fadeInSlow', 'fadeIn', 'fadeInFast']
      });
      this.input('hyphens', SelectInputView, {
        values: ['auto', 'manual']
      });
      if (this.model.get('hyphens') === 'manual') {
        this.view(InfoBoxView, {
          text: I18n.t('pageflow_scrolled.editor.content_elements.heading.help_texts.shortcuts')
        });
      }
      this.view(SeparatorView);
      this.group('ContentElementPosition', {
        entry: entry
      });
    });
  }
});

var img$1 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e %3c!--! Font Awesome Pro 6.1.1 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons%2c Inc. --%3e %3cpath fill='white' d='M 256%2c416 H 32 c -17.67%2c0 -32%2c14.33 -32%2c32 0%2c17.67 14.33%2c32 32%2c32 h 224 c 17.7%2c0 32%2c-14.33 32%2c-32 0%2c-17.67 -14.3%2c-32 -32%2c-32 z m 0%2c-256 H 32 c -17.67%2c0 -32%2c14.3 -32%2c32 0%2c17.7 14.33%2c32 32%2c32 h 224 c 17.7%2c0 32%2c-14.3 32%2c-32 0%2c-17.7 -14.3%2c-32 -32%2c-32 z M 0%2c320 c 0%2c17.7 14.33%2c32 32%2c32 h 384 c 17.7%2c0 32%2c-14.3 32%2c-32 0%2c-17.7 -14.3%2c-32 -32%2c-32 H 32 C 14.33%2c288 0%2c302.3 0%2c320 Z M 416%2c32 H 32 C 14.33%2c32 0%2c46.3 0%2c64 0%2c81.7 14.33%2c96 32%2c96 h 384 c 17.7%2c0 32%2c-14.3 32%2c-32 0%2c-17.7 -14.3%2c-32 -32%2c-32 z' /%3e%3c/svg%3e";

editor.contentElementTypes.register('textBlock', {
  pictogram: img$1,
  supportedPositions: ['inline'],
  configurationEditor: function configurationEditor(_ref) {
    var _this = this;
    var entry = _ref.entry,
      contentElement = _ref.contentElement;
    var pendingRefresh;
    this.listenTo(contentElement.transientState, 'change:exampleNode', function () {
      // This is a terrible hack to prevent closing the minicolors
      // dropdown while adjusting colors. Calling refresh is needed
      // to update typography drop downs. Delay until color picker
      // is closed.
      if (document.activeElement && document.activeElement.tagName === 'INPUT' && document.activeElement.className === 'minicolors-input') {
        if (!pendingRefresh) {
          document.activeElement.addEventListener('blur', function () {
            pendingRefresh = false;
            _this.refresh();
          }, {
            once: true
          });
          pendingRefresh = true;
        }
        return;
      }
      _this.refresh();
    });
    this.tab('general', function () {
      var exampleNode = ensureTextContent(contentElement.transientState.get('exampleNode'));
      var modelDelegator = entry.createLegacyTypographyVariantDelegator({
        model: contentElement.transientState,
        paletteColorPropertyName: 'color'
      });
      var _getPreviewConfiguration = function getPreviewConfiguration(configuration, properties) {
        return exampleNode ? _objectSpread2(_objectSpread2({}, configuration), {}, {
          value: [_objectSpread2(_objectSpread2({}, exampleNode), {}, {
            // Ensure size in preview is not overridden by legacy variant
            variant: modelDelegator.get('typographyVariant')
          }, properties),
          // Ensure content spans whole preview viewport if
          // section uses "cards" appearance.
          {
            type: 'paragraph',
            children: [{
              text: ''
            }]
          }, {
            type: 'paragraph',
            children: [{
              text: ''
            }]
          }]
        }) : configuration;
      };
      this.group('ContentElementTypographyVariant', {
        entry: entry,
        model: modelDelegator,
        prefix: exampleNode ? utils.camelize(exampleNode.type) : 'none',
        getPreviewConfiguration: function getPreviewConfiguration(configuration, variant) {
          return _getPreviewConfiguration(configuration, {
            variant: variant
          });
        }
      });
      this.group('ContentElementTypographySize', {
        entry: entry,
        model: modelDelegator,
        prefix: exampleNode ? utils.camelize(exampleNode.type) : 'none',
        getPreviewConfiguration: function getPreviewConfiguration(configuration, size) {
          return _getPreviewConfiguration(configuration, {
            size: size
          });
        }
      });
      this.group('PaletteColor', {
        entry: entry,
        model: modelDelegator,
        propertyName: 'color'
      });
      this.input('textAlign', SelectInputView, {
        model: contentElement.transientState,
        values: ['ragged', 'justify']
      });
      this.view(SeparatorView);
      this.view(InfoBoxView, {
        text: I18n.t('pageflow_scrolled.editor.content_elements.textBlock.help_texts.shortcuts')
      });
    });
  },
  split: function split(configuration, insertIndex) {
    var value = getValue(configuration);
    return [_objectSpread2(_objectSpread2({}, configuration), {}, {
      value: value.slice(0, insertIndex)
    }), _objectSpread2(_objectSpread2({}, configuration), {}, {
      value: value.slice(insertIndex)
    })];
  },
  merge: function merge(configurationA, configurationB) {
    var value = getValue(configurationA).concat(getValue(configurationB));
    return _objectSpread2(_objectSpread2({}, configurationA), {}, {
      value: value
    });
  },
  getLength: function getLength(configuration) {
    return getValue(configuration).length;
  },
  handleDestroy: function handleDestroy(contentElement) {
    var transientState = contentElement.get('transientState') || {};
    if (!transientState.editableTextIsSingleBlock) {
      contentElement.postCommand({
        type: 'REMOVE'
      });
      return false;
    }
  }
});
function getValue(configuration) {
  // Value might still be empty if text block has not been edited
  return configuration.value || [{
    type: 'paragraph',
    children: [{
      text: ''
    }]
  }];
}
function ensureTextContent(node) {
  if (node && node.children.length === 1 && node.children[0].text === '') {
    return _objectSpread2(_objectSpread2({}, node), {}, {
      children: [{
        text: 'Lorem ipsum dolor sit amet'
      }]
    });
  } else {
    return node;
  }
}

var img$2 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3c!--! Font Awesome Pro 6.1.1 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons%2c Inc. --%3e%3cpath fill='white' d='M447.1 32h-384C28.64 32-.0091 60.65-.0091 96v320c0 35.35 28.65 64 63.1 64h384c35.35 0 64-28.65 64-64V96C511.1 60.65 483.3 32 447.1 32zM111.1 96c26.51 0 48 21.49 48 48S138.5 192 111.1 192s-48-21.49-48-48S85.48 96 111.1 96zM446.1 407.6C443.3 412.8 437.9 416 432 416H82.01c-6.021 0-11.53-3.379-14.26-8.75c-2.73-5.367-2.215-11.81 1.334-16.68l70-96C142.1 290.4 146.9 288 152 288s9.916 2.441 12.93 6.574l32.46 44.51l93.3-139.1C293.7 194.7 298.7 192 304 192s10.35 2.672 13.31 7.125l128 192C448.6 396 448.9 402.3 446.1 407.6z'/%3e%3c/svg%3e";

editor.contentElementTypes.register('inlineImage', {
  pictogram: img$2,
  category: 'media',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry,
      contentElement = _ref.contentElement;
    this.tab('general', function () {
      var _this = this;
      this.input('id', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: function positioning(imageModifiers) {
          return imageModifiers === null || imageModifiers === void 0 ? void 0 : imageModifiers.length;
        },
        positioningBinding: 'imageModifiers',
        positioningOptions: function positioningOptions() {
          var _this$model$get, _this$model$get$;
          var aspectRatio = entry.getAspectRatio((_this$model$get = _this.model.get('imageModifiers')) === null || _this$model$get === void 0 ? void 0 : (_this$model$get$ = _this$model$get[0]) === null || _this$model$get$ === void 0 ? void 0 : _this$model$get$.value);
          return {
            preview: aspectRatio && 1 / aspectRatio
          };
        },
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('imageModifiers', ImageModifierListInputView, {
        entry: entry,
        visibleBinding: 'id',
        visible: function visible() {
          return _this.model.getReference('id', 'image_files');
        }
      });
      this.input('portraitId', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: function positioning(imageModifiers) {
          return imageModifiers === null || imageModifiers === void 0 ? void 0 : imageModifiers.length;
        },
        positioningBinding: 'portraitImageModifiers',
        positioningOptions: function positioningOptions() {
          var _this$model$get2, _this$model$get2$;
          var aspectRatio = entry.getAspectRatio((_this$model$get2 = _this.model.get('portraitImageModifiers')) === null || _this$model$get2 === void 0 ? void 0 : (_this$model$get2$ = _this$model$get2[0]) === null || _this$model$get2$ === void 0 ? void 0 : _this$model$get2$.value);
          return {
            preview: aspectRatio && 1 / aspectRatio
          };
        }
      });
      this.input('portraitImageModifiers', ImageModifierListInputView, {
        entry: entry,
        visibleBinding: 'portraitId',
        visible: function visible() {
          return _this.model.getReference('portraitId', 'image_files');
        }
      });
      this.input('enableFullscreen', CheckBoxInputView, {
        disabledBinding: ['position', 'width'],
        disabled: function disabled() {
          return contentElement.getWidth() === contentElementWidths.full;
        },
        displayUncheckedIfDisabled: true
      });
      this.group('ContentElementPosition', {
        entry: entry
      });
      this.view(SeparatorView);
      this.group('ContentElementCaption', {
        entry: entry
      });
      this.group('ContentElementInlineFileRightsSettings');
    });
  }
});

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

var img$3 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3c!--! Font Awesome Pro 6.1.1 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons%2c Inc. --%3e%3cpath fill='white' d='M463.1 32h-416C21.49 32-.0001 53.49-.0001 80v352c0 26.51 21.49 48 47.1 48h416c26.51 0 48-21.49 48-48v-352C511.1 53.49 490.5 32 463.1 32zM111.1 408c0 4.418-3.582 8-8 8H55.1c-4.418 0-8-3.582-8-8v-48c0-4.418 3.582-8 8-8h47.1c4.418 0 8 3.582 8 8L111.1 408zM111.1 280c0 4.418-3.582 8-8 8H55.1c-4.418 0-8-3.582-8-8v-48c0-4.418 3.582-8 8-8h47.1c4.418 0 8 3.582 8 8V280zM111.1 152c0 4.418-3.582 8-8 8H55.1c-4.418 0-8-3.582-8-8v-48c0-4.418 3.582-8 8-8h47.1c4.418 0 8 3.582 8 8L111.1 152zM351.1 400c0 8.836-7.164 16-16 16H175.1c-8.836 0-16-7.164-16-16v-96c0-8.838 7.164-16 16-16h160c8.836 0 16 7.162 16 16V400zM351.1 208c0 8.836-7.164 16-16 16H175.1c-8.836 0-16-7.164-16-16v-96c0-8.838 7.164-16 16-16h160c8.836 0 16 7.162 16 16V208zM463.1 408c0 4.418-3.582 8-8 8h-47.1c-4.418 0-7.1-3.582-7.1-8l0-48c0-4.418 3.582-8 8-8h47.1c4.418 0 8 3.582 8 8V408zM463.1 280c0 4.418-3.582 8-8 8h-47.1c-4.418 0-8-3.582-8-8v-48c0-4.418 3.582-8 8-8h47.1c4.418 0 8 3.582 8 8V280zM463.1 152c0 4.418-3.582 8-8 8h-47.1c-4.418 0-8-3.582-8-8l0-48c0-4.418 3.582-8 7.1-8h47.1c4.418 0 8 3.582 8 8V152z'/%3e%3c/svg%3e";

var EditMotifAreaMenuItem = Backbone.Model.extend({
  defaults: {
    name: 'editMotifArea'
  },
  initialize: function initialize(attributes, _ref) {
    var _this = this;
    var inputModel = _ref.inputModel,
      propertyName = _ref.propertyName,
      file = _ref.file;
    this.set('label', I18n.t('pageflow_scrolled.editor.edit_motif_area_menu_item'));
    var update = function update() {
      _this.set('hidden', inputModel.get('position') !== 'backdrop');
    };
    this.listenTo(inputModel, "change:position", update);
    update();
    this.selected = function () {
      EditMotifAreaDialogView.show({
        model: inputModel,
        propertyName: propertyName,
        file: file
      });
    };
  }
});
editor.contentElementTypes.register('inlineVideo', {
  pictogram: img$3,
  category: 'media',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right', 'backdrop'],
  supportedWidthRange: ['xxs', 'full'],
  configurationEditor: function configurationEditor(_ref2) {
    var entry = _ref2.entry;
    migrateLegacyAutoplay(this.model);
    this.tab('general', function () {
      var _this2 = this;
      this.input('id', FileInputView, {
        collection: 'video_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        defaultTextTrackFilePropertyName: 'defaultTextTrackFileId',
        dropDownMenuItems: [EditMotifAreaMenuItem, InlineFileRightsMenuItem]
      });
      this.input('posterId', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('portraitId', FileInputView, {
        collection: 'video_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        defaultTextTrackFilePropertyName: 'defaultTextTrackFileId',
        dropDownMenuItems: [EditMotifAreaMenuItem, InlineFileRightsMenuItem]
      });
      this.input('portraitPosterId', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        visibleBinding: 'portraitId',
        visible: function visible() {
          return _this2.model.getReference('portraitId', 'video_files');
        },
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.view(SeparatorView);
      this.input('playbackMode', SelectInputView, {
        values: ['manual', 'autoplay', 'loop']
      });
      this.input('hideControlBar', CheckBoxInputView$1, {
        disabledBinding: 'playbackMode',
        disabled: function disabled(playbackMode) {
          return playbackMode === 'loop';
        },
        displayCheckedIfDisabled: true
      });
      this.input('unmuteLabel', LabelOnlyView);
      this.input('unmute', CheckBoxInputView$1, {
        storeInverted: 'keepMuted'
      });
      this.input('rewindOnUnmute', CheckBoxInputView$1, {
        disabledBinding: ['playbackMode', 'keepMuted'],
        disabled: function disabled(_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
            playbackMode = _ref4[0],
            keepMuted = _ref4[1];
          return playbackMode !== 'autoplay' || keepMuted;
        },
        displayUncheckedIfDisabled: true
      });
      this.view(SeparatorView);
      this.input('atmoDuringPlayback', SelectInputView, {
        values: ['play', 'mute', 'turnDown']
      });
      this.view(SeparatorView);
      this.group('ContentElementPosition', {
        entry: entry
      });
      this.view(SeparatorView);
      this.group('ContentElementCaption', {
        entry: entry
      });
      this.group('ContentElementInlineFileRightsSettings');
    });
  }
});
function migrateLegacyAutoplay(model) {
  if (!model.has('playbackMode') && model.get('autoplay')) {
    model.set('playbackMode', 'autoplay', {
      trigger: false
    });
  }
}

var img$4 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'%3e%3c!--! Font Awesome Pro 6.1.1 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons%2c Inc. --%3e%3cpath fill='white' d='M192 352c53.03 0 96-42.97 96-96v-160c0-53.03-42.97-96-96-96s-96 42.97-96 96v160C96 309 138.1 352 192 352zM344 192C330.7 192 320 202.7 320 215.1V256c0 73.33-61.97 132.4-136.3 127.7c-66.08-4.169-119.7-66.59-119.7-132.8L64 215.1C64 202.7 53.25 192 40 192S16 202.7 16 215.1v32.15c0 89.66 63.97 169.6 152 181.7V464H128c-18.19 0-32.84 15.18-31.96 33.57C96.43 505.8 103.8 512 112 512h160c8.222 0 15.57-6.216 15.96-14.43C288.8 479.2 274.2 464 256 464h-40v-33.77C301.7 418.5 368 344.9 368 256V215.1C368 202.7 357.3 192 344 192z'/%3e%3c/svg%3e";

editor.contentElementTypes.register('inlineAudio', {
  pictogram: img$4,
  category: 'media',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],
  defaultConfig: {
    playerControlVariant: 'waveformBars'
  },
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry;
    var themeOptions = entry.getTheme().get('options');
    this.tab('general', function () {
      var _themeOptions$propert, _themeOptions$propert2, _themeOptions$colors;
      this.input('id', FileInputView, {
        collection: 'audio_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        defaultTextTrackFilePropertyName: 'defaultTextTrackFileId',
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('posterId', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.view(SeparatorView);
      this.input('autoplay', CheckBoxInputView$1);
      this.input('atmoDuringPlayback', SelectInputView, {
        values: ['play', 'mute', 'turnDown']
      });
      this.view(SeparatorView);
      this.input('playerControlVariant', SelectInputView, {
        values: ['waveformBars', 'waveformLines', 'waveform', 'classic'],
        ensureValueDefined: true
      });
      this.input('waveformColor', ColorInputView, {
        visibleBinding: 'playerControlVariant',
        visible: function visible(variant) {
          return variant === null || variant === void 0 ? void 0 : variant.startsWith('waveform');
        },
        defaultValue: ((_themeOptions$propert = themeOptions.properties) === null || _themeOptions$propert === void 0 ? void 0 : (_themeOptions$propert2 = _themeOptions$propert.root) === null || _themeOptions$propert2 === void 0 ? void 0 : _themeOptions$propert2.accent_color) || ((_themeOptions$colors = themeOptions.colors) === null || _themeOptions$colors === void 0 ? void 0 : _themeOptions$colors.accent)
      });
      this.view(SeparatorView);
      this.group('ContentElementPosition', {
        entry: entry
      });
      this.view(SeparatorView);
      this.group('ContentElementCaption', {
        entry: entry
      });
      this.group('ContentElementInlineFileRightsSettings');
    });
  }
});

var img$5 = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg version='1.1' id='Youtube' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 20 20' enable-background='new 0 0 20 20' xml:space='preserve'%3e%3cpath fill='white' d='M10%2c2.3C0.172%2c2.3%2c0%2c3.174%2c0%2c10s0.172%2c7.7%2c10%2c7.7s10-0.874%2c10-7.7S19.828%2c2.3%2c10%2c2.3z M13.205%2c10.334 l-4.49%2c2.096C8.322%2c12.612%2c8%2c12.408%2c8%2c11.974V8.026C8%2c7.593%2c8.322%2c7.388%2c8.715%2c7.57l4.49%2c2.096 C13.598%2c9.85%2c13.598%2c10.15%2c13.205%2c10.334z'/%3e%3c/svg%3e";

editor.contentElementTypes.register('videoEmbed', {
  pictogram: img$5,
  category: 'media',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry;
    this.tab('general', function () {
      this.input('videoSource', UrlInputView, {
        supportedHosts: ['http://youtu.be', 'https://youtu.be', 'http://www.youtube.com', 'https://www.youtube.com', 'http://vimeo.com', 'https://vimeo.com', 'http://www.facebook.com', 'https://www.facebook.com'],
        displayPropertyName: 'displayVideoSource',
        required: true,
        permitHttps: true
      });
      this.input('posterId', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false
      });
      this.input('hideInfo', CheckBoxInputView);
      this.input('hideControls', CheckBoxInputView);
      this.input('aspectRatio', SelectInputView, {
        values: ['wide', 'narrow', 'square', 'portrait']
      });
      this.view(SeparatorView);
      this.input('atmoDuringPlayback', SelectInputView, {
        values: ['play', 'mute', 'turnDown']
      });
      this.view(SeparatorView);
      this.group('ContentElementPosition', {
        entry: entry
      });
      this.view(SeparatorView);
      this.group('ContentElementCaption', {
        entry: entry
      });
    });
  }
});

var img$6 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3c!--! Font Awesome Pro 6.1.1 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons%2c Inc. --%3e%3cpath fill='white' d='M412.6 181.9c-10.28-8.344-25.41-6.875-33.75 3.406c-8.406 10.25-6.906 25.37 3.375 33.78C393.5 228.4 400 241.8 400 256c0 14.19-6.5 27.62-17.81 36.87c-10.28 8.406-11.78 23.53-3.375 33.78c4.719 5.812 11.62 8.812 18.56 8.812c5.344 0 10.75-1.781 15.19-5.406C435.1 311.6 448 284.7 448 256S435.1 200.4 412.6 181.9zM301.2 34.84c-11.5-5.187-25.01-3.116-34.43 5.259L131.8 160H48c-26.51 0-48 21.49-48 47.1v95.1c0 26.51 21.49 47.1 48 47.1h83.84l134.9 119.9C272.7 477.2 280.3 480 288 480c4.438 0 8.959-.9313 13.16-2.837C312.7 472 320 460.6 320 448V64C320 51.41 312.7 39.1 301.2 34.84z'/%3e%3c/svg%3e";

editor.contentElementTypes.register('soundDisclaimer', {
  pictogram: img$6,
  category: 'media',
  supportedPositions: ['inline'],
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry;
    this.tab('general', function () {
      this.input('mutedText', TextInputView, {
        placeholder: I18n.t('pageflow_scrolled.public.sound_disclaimer.help_muted', {
          locale: entry.metadata.get('locale')
        })
      });
      this.input('unmutedText', TextInputView, {
        placeholder: I18n.t('pageflow_scrolled.public.sound_disclaimer.help_unmuted', {
          locale: entry.metadata.get('locale')
        })
      });
    });
  }
});

var DatawrapperAdView = Marionette.ItemView.extend({
  template: function template(data) {
    return "\n    <form action=\"https://app.datawrapper.de/create/chart\" method=\"GET\" target=\"_blank\">\n      <input type=\"hidden\" name=\"theme\" value=\"pageflow\" />\n      <input type=\"submit\" value=\"".concat(I18n.t('pageflow_scrolled.editor.content_elements.dataWrapperChart.attributes.create_chart.label'), "\" />\n    </form>\n  ");
  },
  className: 'datawrapper_ad'
});

var img$7 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3c!--! Font Awesome Pro 6.1.1 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons%2c Inc. --%3e%3cpath fill='white' d='M160 80C160 53.49 181.5 32 208 32H240C266.5 32 288 53.49 288 80V432C288 458.5 266.5 480 240 480H208C181.5 480 160 458.5 160 432V80zM0 272C0 245.5 21.49 224 48 224H80C106.5 224 128 245.5 128 272V432C128 458.5 106.5 480 80 480H48C21.49 480 0 458.5 0 432V272zM400 96C426.5 96 448 117.5 448 144V432C448 458.5 426.5 480 400 480H368C341.5 480 320 458.5 320 432V144C320 117.5 341.5 96 368 96H400z'/%3e%3c/svg%3e";

editor.contentElementTypes.register('dataWrapperChart', {
  category: 'data',
  pictogram: img$7,
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry;
    this.tab('general', function () {
      this.input('url', UrlInputView, {
        supportedHosts: ['cf.datawrapper.de', 'charts.datawrapper.de', 'datawrapper.dwcdn.de', 'datawrapper.dwcdn.net'],
        displayPropertyName: 'displayUrl',
        required: true,
        permitHttps: true
      });
      this.view(DatawrapperAdView);
      this.input('title', TextInputView, {
        placeholder: I18n.t('pageflow_scrolled.public.chart.default_title')
      });
      this.input('backgroundColor', ColorInputView, {
        defaultValue: '#323d4d'
      });
      this.group('ContentElementPosition', {
        entry: entry
      });
      this.view(SeparatorView);
      this.group('ContentElementCaption', {
        entry: entry
      });
    });
  }
});

var img$8 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e %3cpath fill='white' d='M 64%2c32 C 28.65%2c32 0%2c60.65 0%2c96 v 320 c 0%2c35.3 28.65%2c64 64%2c64 h 384 c 35.3%2c0 64%2c-28.7 64%2c-64 V 96 C 512%2c60.65 483.3%2c32 448%2c32 Z m 0%2c64 c 128%2c0 256%2c0 384%2c0 v 320 c -128%2c0 -256%2c0 -384%2c0 z m 182%2c28.52734 v 262.94532 h 22 V 124.52734 Z' /%3e %3cpath fill='white' d='m 186.81892%2c180.66143 c -12.25808%2c0.76551 -17.96668%2c13.50905 -26.61356%2c20.28687 -15.58075%2c16.39278 -33.16416%2c31.13354 -47.27512%2c48.79321 -4.0855%2c9.29219 2.78939%2c18.77866 10.09922%2c24.02983 19.1732%2c18.53891 37.00376%2c38.59231 57.19375%2c56.00728 11.59502%2c6.28738 27.33763%2c-7.35964 21.67579%2c-19.66992 -4.34142%2c-10.06283 -14.81383%2c-15.2758 -21.33624%2c-23.70538 -10.16266%2c-10.16266 -20.32532%2c-20.32532 -30.48798%2c-30.48798 16.9997%2c-17.81564 35.98195%2c-34.02522 51.5957%2c-53.07617 4.60995%2c-9.90721 -3.84461%2c-22.82682 -14.85156%2c-22.17774 z' /%3e %3cpath fill='white' d='m 325.18108%2c331.33857 c 12.25808%2c-0.76551 17.96668%2c-13.50905 26.61356%2c-20.28687 15.58075%2c-16.39278 33.16416%2c-31.13354 47.27512%2c-48.79321 4.0855%2c-9.29219 -2.78939%2c-18.77866 -10.09922%2c-24.02983 -19.1732%2c-18.53892 -37.00376%2c-38.59232 -57.19375%2c-56.00729 -11.59502%2c-6.28738 -27.33763%2c7.35964 -21.67579%2c19.66992 4.34142%2c10.06283 14.81383%2c15.2758 21.33624%2c23.70538 10.16266%2c10.16267 20.32532%2c20.32533 30.48798%2c30.48799 -16.9997%2c17.81564 -35.98195%2c34.02522 -51.5957%2c53.07617 -4.60995%2c9.90721 3.84461%2c22.82682 14.85156%2c22.17774 z' /%3e%3c/svg%3e";

editor.contentElementTypes.register('inlineBeforeAfter', {
  pictogram: img$8,
  category: 'interactive',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right', 'backdrop'],
  supportedWidthRange: ['xxs', 'full'],
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry;
    this.tab('general', function () {
      this.input('before_id', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('before_label', TextInputView);
      this.input('after_id', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('after_label', TextInputView);
      this.input('initial_slider_position', SliderInputView);
      this.input('slider_color', ColorInputView$1);
      this.group('ContentElementPosition', {
        entry: entry
      });
      this.view(SeparatorView);
      this.group('ContentElementCaption', {
        entry: entry
      });
      this.group('ContentElementInlineFileRightsSettings');
    });
  },
  defaultConfig: {
    initial_slider_position: 50
  }
});

var SidebarRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'scrolled/external_links/:id/:link_id': 'link'
  }
});

var SidebarEditLinkView = Marionette.Layout.extend({
  template: function template(data) {
    return "\n    <a class=\"back\">".concat(I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.back'), "</a>\n    <a class=\"destroy\">").concat(I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.destroy'), "</a>\n\n    <div class='form_container'></div>\n  ");
  },
  className: 'edit_external_link',
  regions: {
    formContainer: '.form_container'
  },
  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroyLink'
  },
  initialize: function initialize(options) {},
  onRender: function onRender() {
    var configurationEditor = new ConfigurationEditorView({
      model: this.model,
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.content_elements.externalLinkList.attributes'],
      tabTranslationKeyPrefix: 'pageflow_scrolled.editor.content_elements.externalLinkList.tabs'
    });
    var self = this;
    var thumbnailAspectRatio = this.options.contentElement.configuration.get('thumbnailAspectRatio');
    var previewAspectRatio = this.options.entry.getAspectRatio(thumbnailAspectRatio);
    var thumbnailFit = this.options.contentElement.configuration.get('thumbnailFit');
    configurationEditor.tab('edit_link', function () {
      this.input('thumbnail', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElement.externalLinks.link',
        fileSelectionHandlerOptions: {
          contentElementId: self.options.contentElement.get('id')
        },
        positioning: previewAspectRatio && thumbnailFit !== 'contain',
        positioningOptions: {
          preview: previewAspectRatio && 1 / previewAspectRatio
        },
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('thumbnailBackgroundColor', ColorInputView);
      this.view(SeparatorView);
      this.view(InfoBoxView, {
        text: I18n.t('pageflow_scrolled.editor.content_elements.textBlock.help_texts.shortcuts')
      });
    });
    this.formContainer.show(configurationEditor);
  },
  goBack: function goBack() {
    this.options.contentElement.postCommand({
      type: 'SET_SELECTED_ITEM',
      index: -1
    });
    editor$1.navigate("/scrolled/content_elements/".concat(this.options.contentElement.get('id')), {
      trigger: true
    });
  },
  destroyLink: function destroyLink() {
    if (window.confirm(I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.confirm_delete_item'))) {
      this.options.collection.remove(this.model);
      this.goBack();
    }
  }
});

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

var ExternalLinkModel = Backbone.Model.extend({
  modelName: 'ExternalLink',
  i18nKey: 'external_link',
  mixins: [transientReferences],
  thumbnailUrl: function thumbnailUrl() {
    var _this$thumbnail;
    return ((_this$thumbnail = this.thumbnail()) === null || _this$thumbnail === void 0 ? void 0 : _this$thumbnail.get('thumbnail_url')) || '';
  },
  thumbnail: function thumbnail() {
    return this.collection.entry.getFileCollection('image_files').getByPermaId(this.get('thumbnail'));
  },
  title: function title() {
    var configuration = this.collection.contentElement.configuration;
    if (configuration.get('textPosition') === 'none') {
      var _this$thumbnail2;
      return (_this$thumbnail2 = this.thumbnail()) === null || _this$thumbnail2 === void 0 ? void 0 : _this$thumbnail2.configuration.get('alt');
    } else {
      var _itemTexts$this$id, _itemTexts$this$id2, _itemTexts$this$id2$t, _itemTexts$this$id2$t2, _itemTexts$this$id2$t3;
      var itemTexts = configuration.get('itemTexts');
      return (itemTexts === null || itemTexts === void 0 ? void 0 : (_itemTexts$this$id = itemTexts[this.id]) === null || _itemTexts$this$id === void 0 ? void 0 : _itemTexts$this$id.title) ? itemTexts === null || itemTexts === void 0 ? void 0 : (_itemTexts$this$id2 = itemTexts[this.id]) === null || _itemTexts$this$id2 === void 0 ? void 0 : (_itemTexts$this$id2$t = _itemTexts$this$id2.title[0]) === null || _itemTexts$this$id2$t === void 0 ? void 0 : (_itemTexts$this$id2$t2 = _itemTexts$this$id2$t.children) === null || _itemTexts$this$id2$t2 === void 0 ? void 0 : (_itemTexts$this$id2$t3 = _itemTexts$this$id2$t2[0]) === null || _itemTexts$this$id2$t3 === void 0 ? void 0 : _itemTexts$this$id2$t3.text : this.get('title');
    }
  },
  getFilePosition: function getFilePosition(attribute, coord) {
    var cropPosition = this.get('thumbnailCropPosition');
    return cropPosition ? cropPosition[coord] : 50;
  },
  setFilePosition: function setFilePosition(attribute, coord, value) {
    this.set('thumbnailCropPosition', _objectSpread2(_objectSpread2({}, this.get('thumbnailCropPosition')), {}, _defineProperty({}, coord, value)));
  },
  setFilePositions: function setFilePositions(attribute, x, y) {
    this.set('thumbnailCropPosition', {
      x: x,
      y: y
    });
  },
  highlight: function highlight() {
    this.collection.contentElement.postCommand({
      type: 'HIGHLIGHT_ITEM',
      index: this.collection.indexOf(this)
    });
  },
  resetHighlight: function resetHighlight() {
    this.collection.contentElement.postCommand({
      type: 'RESET_ITEM_HIGHLIGHT'
    });
  }
});

var ExternalLinkCollection = Backbone.Collection.extend({
  model: ExternalLinkModel,
  comparator: 'position',
  initialize: function initialize(models, options) {
    var _this = this;
    this.entry = options.entry;
    this.contentElement = options.contentElement;
    this.listenTo(this, 'add sort change', this.updateConfiguration);
    this.listenTo(this, 'remove', function () {
      return _this.updateConfiguration({
        prune: true
      });
    });
  },
  modelId: function modelId(attrs) {
    return attrs.id;
  },
  updateConfiguration: function updateConfiguration(_ref) {
    var prune = _ref.prune;
    var updatedAttributes = {
      links: this.toJSON()
    };
    if (prune) {
      updatedAttributes = _objectSpread2(_objectSpread2(_objectSpread2({}, updatedAttributes), this.getPrunedProperty('itemTexts')), this.getPrunedProperty('itemLinks'));
    }
    this.contentElement.configuration.set(updatedAttributes);
  },
  getPrunedProperty: function getPrunedProperty(propertyName) {
    return _defineProperty({}, propertyName, _.pick.apply(_, [this.contentElement.configuration.get(propertyName) || {}].concat(_toConsumableArray(this.pluck('id')))));
  },
  addNewLink: function addNewLink() {
    var id = this.length ? Math.max.apply(Math, _toConsumableArray(this.pluck('id'))) + 1 : 1;
    this.add({
      id: id
    });
    return this.get(id);
  },
  saveOrder: function saveOrder() {}
});
ExternalLinkCollection.forContentElement = function (contentElement, entry) {
  return new ExternalLinkCollection(contentElement.configuration.get('links') || [], {
    entry: entry,
    contentElement: contentElement
  });
};

var SidebarController = Marionette.Controller.extend({
  initialize: function initialize(options) {
    this.entry = options.entry;
    this.region = options.region;
  },
  link: function link(id, linkId) {
    var contentElement = this.entry.contentElements.get(id);
    var linksCollection = ExternalLinkCollection.forContentElement(contentElement, this.entry);
    this.region.show(new SidebarEditLinkView({
      model: linksCollection.get(linkId),
      collection: linksCollection,
      entry: this.entry,
      contentElement: contentElement
    }));
  }
});

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".SidebarListView-module_linksContainer__HvWq- {\n}\n";
var styles = {"linksContainer":"SidebarListView-module_linksContainer__HvWq-"};
styleInject(css);

var SidebarListView = Marionette.Layout.extend({
  template: function template(data) {
    return "\n    <label>".concat(I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.items'), "</label>\n    <div class='").concat(styles.linksContainer, "'></div>\n    <button class=\"").concat(buttonStyles.addButton, "\">\n      ").concat(I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.add'), "\n    </button>\n  ");
  },
  regions: cssModulesUtils.ui(styles, 'linksContainer'),
  events: cssModulesUtils.events(buttonStyles, {
    'click addButton': 'addElement'
  }),
  onRender: function onRender() {
    this.listenTo(this.options.contentElement.configuration, 'change:textPosition', this.renderListView);
    this.renderListView();
  },
  renderListView: function renderListView() {
    this.linksContainer.show(new ListView({
      collection: this.collection,
      sortable: true,
      highlight: true,
      onEdit: _.bind(this.onEdit, this),
      onRemove: _.bind(this.onRemove, this)
    }));
  },
  addElement: function addElement() {
    this.collection.addNewLink();
  },
  onEdit: function onEdit(linkModel) {
    this.options.contentElement.postCommand({
      type: 'SET_SELECTED_ITEM',
      index: this.collection.indexOf(linkModel)
    });
    editor.navigate("/scrolled/external_links/".concat(this.options.contentElement.id, "/").concat(linkModel.id), {
      trigger: true
    });
  },
  onRemove: function onRemove(linkModel) {
    if (window.confirm(I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.confirm_delete_item'))) {
      this.collection.remove(linkModel);
    }
  }
});

var linkWidths = {
  xs: -2,
  sm: -1,
  md: 0,
  lg: 1,
  xl: 2,
  xxl: 3
};
function maxLinkWidth(_ref) {
  var layout = _ref.layout,
    textPosition = _ref.textPosition,
    width = _ref.width;
  if (layout === 'center' || layout === 'centerRagged') {
    if (textPosition === 'right') {
      return _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, contentElementWidths.md, linkWidths.md), contentElementWidths.lg, linkWidths.lg), contentElementWidths.xl, linkWidths.xl), contentElementWidths.full, linkWidths.xl)[width];
    } else {
      return _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, contentElementWidths.md, linkWidths.lg), contentElementWidths.lg, linkWidths.xl), contentElementWidths.xl, linkWidths.xxl), contentElementWidths.full, linkWidths.xxl)[width];
    }
  } else {
    if (textPosition === 'right') {
      return _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, contentElementWidths.md, linkWidths.sm), contentElementWidths.lg, linkWidths.md), contentElementWidths.xl, linkWidths.xl), contentElementWidths.full, linkWidths.xl)[width];
    } else {
      return _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, contentElementWidths.md, linkWidths.lg), contentElementWidths.lg, linkWidths.lg), contentElementWidths.xl, linkWidths.xxl), contentElementWidths.full, linkWidths.xxl)[width];
    }
  }
}

var img$9 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3c!--! Font Awesome Pro 6.1.1 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons%2c Inc. --%3e%3cpath fill='white' d='M384 32H64C28.65 32 0 60.66 0 96v320c0 35.34 28.65 64 64 64h320c35.35 0 64-28.66 64-64V96C448 60.66 419.3 32 384 32zM344 312c0 17.69-14.31 32-32 32s-32-14.31-32-32V245.3l-121.4 121.4C152.4 372.9 144.2 376 136 376s-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L234.8 200H168c-17.69 0-32-14.31-32-32s14.31-32 32-32h144c17.69 0 32 14.31 32 32V312z'/%3e%3c/svg%3e";

//register sidebar router to handle multiple sidebar views of this content element
//router defines the URL hash path mapping and controller provides functions for the paths
editor.registerSideBarRouting({
  router: SidebarRouter,
  controller: SidebarController
});

// register external link list content element configuration editor for sidebar
editor.contentElementTypes.register('externalLinkList', {
  pictogram: img$9,
  category: 'tilesAndLinks',
  supportedPositions: ['inline', 'standAlone'],
  supportedWidthRange: ['m', 'full'],
  defaultConfig: {
    thumbnailAspectRatio: 'square'
  },
  editorPath: function editorPath(contentElement) {
    var selectedItemId = contentElement.transientState.get('selectedItemId');
    if (selectedItemId) {
      return "/scrolled/external_links/".concat(contentElement.id, "/").concat(selectedItemId);
    }
  },
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry,
      contentElement = _ref.contentElement;
    this.tab('general', function () {
      var layout = contentElement.section.configuration.get('layout');
      this.view(SidebarListView, {
        contentElement: this.model.parent,
        collection: ExternalLinkCollection.forContentElement(this.model.parent, entry)
      });
      this.input('textPosition', SelectInputView, {
        values: ['below', 'right', 'overlay', 'none']
      });
      this.group('ContentElementVariant', {
        entry: entry
      });
      this.input('overlayOpacity', SliderInputView, {
        defaultValue: 70,
        visibleBinding: 'textPosition',
        visibleBindingValue: 'overlay'
      });
      this.view(SeparatorView);
      this.group('ContentElementPosition', {
        entry: entry
      });
      this.view(SeparatorView);
      this.input('enableScroller', SelectInputView, {
        values: ['never', 'always']
      });
      this.input('linkWidth', SliderInputView, {
        displayText: function displayText(value) {
          return ['XS', 'S', 'M', 'L', 'XL', 'XXL'][value + 2];
        },
        saveOnSlide: true,
        minValue: -2,
        maxValueBinding: ['width', 'textPosition'],
        maxValue: function maxValue(_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
            width = _ref3[0],
            textPosition = _ref3[1];
          return maxLinkWidth({
            width: width,
            layout: layout,
            textPosition: textPosition
          });
        },
        defaultValue: -1
      });
      this.input('linkAlignment', SelectInputView, {
        values: ['spaceEvenly', 'left', 'right', 'center'],
        visibleBinding: ['textPosition', 'enableScroller'],
        visible: function visible(_ref4) {
          var _ref5 = _slicedToArray(_ref4, 2),
            textPosition = _ref5[0],
            enableScroller = _ref5[1];
          return textPosition !== 'right' && enableScroller !== 'always';
        }
      });
      this.input('linkAlignment', SelectInputView, {
        values: ['left'],
        disabled: true,
        visibleBinding: ['textPosition', 'enableScroller'],
        visible: function visible(_ref6) {
          var _ref7 = _slicedToArray(_ref6, 2),
            textPosition = _ref7[0],
            enableScroller = _ref7[1];
          return textPosition !== 'right' && enableScroller === 'always';
        }
      });
      this.input('thumbnailSize', SelectInputView, {
        values: ['small', 'medium', 'large'],
        visibleBinding: 'textPosition',
        visibleBindingValue: 'right'
      });
      var _entry$getAspectRatio = entry.getAspectRatios({
          includeOriginal: true
        }),
        _entry$getAspectRatio2 = _slicedToArray(_entry$getAspectRatio, 2),
        aspectRatios = _entry$getAspectRatio2[0],
        aspectRatiosTexts = _entry$getAspectRatio2[1];
      this.input('thumbnailAspectRatio', SelectInputView, {
        values: aspectRatios,
        texts: aspectRatiosTexts
      });
      this.input('thumbnailFit', SelectInputView, {
        values: ['cover', 'contain']
      });
      this.input('textSize', SelectInputView, {
        values: ['small', 'medium', 'large']
      });
      this.input('textAlign', SelectInputView, {
        values: ['left', 'right', 'center']
      });
      this.input('displayButtons', CheckBoxInputView);
      this.group('ContentElementInlineFileRightsSettings');
    });
  }
});

// register file handler for thumbnail of external link
editor.registerFileSelectionHandler('contentElement.externalLinks.link', function (options) {
  var contentElement = options.entry.contentElements.get(options.contentElementId);
  var links = ExternalLinkCollection.forContentElement(contentElement, options.entry);
  this.call = function (file) {
    var link = links.get(options.id);
    link.setReference('thumbnail', file);
  };
  this.getReferer = function () {
    return '/scrolled/external_links/' + contentElement.id + '/' + options.id;
  };
});

var SET_MODE = 'SET_MODE';
var DRAG = 'DRAG';
var CLICK_HANDLE = 'CLICK_HANDLE';
var DRAG_HANDLE = 'DRAG_HANDLE';
var DRAG_HANDLE_STOP = 'DRAG_HANDLE_STOP';
var DOUBLE_CLICK_HANDLE = 'DOUBLE_CLICK_HANDLE';
var MOUSE_MOVE = 'MOUSE_MOVE';
var DRAG_POTENTIAL_POINT = 'DRAG_POTENTIAL_POINT';
var DRAG_POTENTIAL_POINT_STOP = 'DRAG_POTENTIAL_POINT_STOP';
var CLICK_INDICATOR = 'CLICK_INDICATOR';
var DRAG_INDICATOR = 'DRAG_INDICATOR';
var CENTER_INDICATOR = 'CENTER_INDICATOR';
var UPDATE_SELECTION_POSITION = 'UPDATE_SELECTION_POSITION';
var BLUR_SELECTION_POSITION = 'BLUR_SELECTION_POSITION';
function reducer(state, action) {
  var _state$selection, _state$selection2, _state$selection3;
  switch (action.type) {
    case SET_MODE:
      if (action.value === state.mode) {
        return state;
      } else if (action.value === 'rect') {
        return _objectSpread2(_objectSpread2({}, state), {}, {
          mode: 'rect',
          previousPolygonPoints: state.points,
          points: getBoundingBox(state.points),
          selection: null
        });
      } else {
        return _objectSpread2(_objectSpread2({}, state), {}, {
          mode: 'polygon',
          points: state.previousPolygonPoints || state.points,
          selection: null
        });
      }
    case DRAG:
      var _action$delta = _slicedToArray(action.delta, 2),
        deltaX = _action$delta[0],
        deltaY = _action$delta[1];
      state.points.forEach(function (point) {
        if (point[0] + deltaX > 100) {
          deltaX = 100 - point[0];
        }
        if (point[0] + deltaX < 0) {
          deltaX = -point[0];
        }
        if (point[1] + deltaY > 100) {
          deltaY = 100 - point[1];
        }
        if (point[1] + deltaY < 0) {
          deltaY = -point[1];
        }
      });
      return _objectSpread2(_objectSpread2({}, state), {}, {
        points: state.points.map(function (point) {
          return [point[0] + deltaX, point[1] + deltaY];
        }),
        indicatorPosition: [state.indicatorPosition[0] + deltaX, state.indicatorPosition[1] + deltaY]
      });
    case CLICK_HANDLE:
      if (state.mode === 'polygon') {
        return _objectSpread2(_objectSpread2({}, state), {}, {
          selection: {
            type: 'handle',
            index: action.index,
            position: round(state.points[action.index])
          }
        });
      } else {
        return _objectSpread2(_objectSpread2({}, state), {}, {
          selection: rectHandleSelection(action.index, state.points)
        });
      }
    case DRAG_HANDLE:
      state = updatePoints(state, action.index, action.cursor);
      return _objectSpread2(_objectSpread2({}, state), {}, {
        indicatorPosition: ensureInPolygon(state.points, state.indicatorPosition)
      });
    case DRAG_HANDLE_STOP:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        startPoints: null
      });
    case DOUBLE_CLICK_HANDLE:
      if (state.mode !== 'polygon' || state.points.length <= 3) {
        return state;
      }
      var points = [].concat(_toConsumableArray(state.points.slice(0, action.index)), _toConsumableArray(state.points.slice(action.index + 1)));
      return _objectSpread2(_objectSpread2({}, state), {}, {
        points: points,
        potentialPoint: null,
        indicatorPosition: ensureInPolygon(points, state.indicatorPosition),
        selection: null
      });
    case MOUSE_MOVE:
      if (state.mode !== 'polygon' || state.draggingPotentialPoint) {
        return state;
      }
      var _closestPointOnPolygo = closestPointOnPolygon(state.points, action.cursor),
        _closestPointOnPolygo2 = _slicedToArray(_closestPointOnPolygo, 2),
        index = _closestPointOnPolygo2[0],
        potentialPoint = _closestPointOnPolygo2[1];
      return _objectSpread2(_objectSpread2({}, state), {}, {
        potentialPointInsertIndex: index,
        potentialPoint: potentialPoint
      });
    case DRAG_POTENTIAL_POINT:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        draggingPotentialPoint: true,
        potentialPoint: action.cursor,
        selection: {
          type: 'potentialPoint',
          position: round(action.cursor)
        }
      });
    case DRAG_POTENTIAL_POINT_STOP:
      var newPoints = withPotentialPoint(state);
      return _objectSpread2(_objectSpread2({}, state), {}, {
        points: newPoints,
        draggingPotentialPoint: false,
        potentialPoint: null,
        selection: {
          type: 'handle',
          index: state.potentialPointInsertIndex,
          position: round(newPoints[state.potentialPointInsertIndex])
        }
      });
    case CLICK_INDICATOR:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        selection: {
          type: 'indicator',
          position: round(state.indicatorPosition)
        }
      });
    case DRAG_INDICATOR:
      var indicatorPosition = ensureInPolygon(state.points, action.cursor);
      return _objectSpread2(_objectSpread2({}, state), {}, {
        indicatorPosition: indicatorPosition,
        selection: {
          type: 'indicator',
          position: round(indicatorPosition)
        }
      });
    case CENTER_INDICATOR:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        indicatorPosition: polygonCentroid(state.points)
      });
    case UPDATE_SELECTION_POSITION:
      if (((_state$selection = state.selection) === null || _state$selection === void 0 ? void 0 : _state$selection.type) === 'indicator') {
        return _objectSpread2(_objectSpread2({}, state), {}, {
          indicatorPosition: ensureInPolygon(state.points, action.position),
          selection: _objectSpread2(_objectSpread2({}, state.selection), {}, {
            position: action.position
          })
        });
      } else if (((_state$selection2 = state.selection) === null || _state$selection2 === void 0 ? void 0 : _state$selection2.type) === 'handle') {
        return updatePoints(state, state.selection.index, ensureInBounds(action.position), action.position);
      } else {
        return state;
      }
    case BLUR_SELECTION_POSITION:
      if (((_state$selection3 = state.selection) === null || _state$selection3 === void 0 ? void 0 : _state$selection3.type) === 'indicator') {
        return _objectSpread2(_objectSpread2({}, state), {}, {
          selection: _objectSpread2(_objectSpread2({}, state.selection), {}, {
            position: state.indicatorPosition
          })
        });
      } else if (state.selection) {
        return _objectSpread2(_objectSpread2({}, state), {}, {
          startPoints: null,
          selection: _objectSpread2(_objectSpread2({}, state.selection), {}, {
            position: handles(state)[state.selection.index].point
          }),
          indicatorPosition: ensureInPolygon(state.points, state.indicatorPosition)
        });
      } else {
        return state;
      }
    default:
      throw new Error("Unknown action ".concat(action.type, "."));
  }
}
function drawnOutlinePoints(state) {
  if (state.draggingPotentialPoint) {
    return withPotentialPoint(state);
  } else {
    return state.points;
  }
}
var rectCursors = ['nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize'];
function handles(state) {
  if (state.mode === 'rect') {
    return state.points.flatMap(function (point, index) {
      return [point, midpoint(point, state.points[(index + 1) % state.points.length])];
    }).map(function (point, index) {
      return {
        point: point,
        axis: index % 4 === 1 ? 'y' : index % 4 === 3 ? 'x' : null,
        cursor: rectCursors[index % 4],
        deletable: false
      };
    });
  } else {
    return state.points.map(function (point) {
      return {
        point: point,
        circle: true,
        cursor: 'move',
        deletable: state.points.length > 3
      };
    });
  }
}
function updatePoints(state, index, position, selectionPosition) {
  if (state.mode === 'polygon') {
    return _objectSpread2(_objectSpread2({}, state), {}, {
      points: [].concat(_toConsumableArray(state.points.slice(0, index)), [position], _toConsumableArray(state.points.slice(index + 1))),
      selection: {
        type: 'handle',
        index: index,
        position: selectionPosition || round(position)
      }
    });
  } else {
    var startPoints = state.startPoints || (rectHandleAxis(index) === 'both' ? [state.points[(index / 2 + 2) % 4]] : [state.points[(index + 3) / 2 % 4], state.points[(index + 5) / 2 % 4]]);
    position = constrainToAxis(index, position, state.points);
    var points = getBoundingBox([position].concat(_toConsumableArray(startPoints)));
    return _objectSpread2(_objectSpread2({}, state), {}, {
      startPoints: startPoints,
      previousPolygonPoints: null,
      points: points,
      selection: rectHandleSelection(mapIndexOfRectHandleCrossingOver(index, position, startPoints), points, selectionPosition)
    });
  }
}
function rectHandleSelection(index, points, selectionPosition) {
  return {
    type: 'handle',
    index: index,
    axis: rectHandleAxis(index),
    position: selectionPosition || round(index % 2 === 0 ? points[index / 2] : midpoint(points[(index - 1) / 2], points[(index + 1) / 2 % 4]))
  };
}
function constrainToAxis(index, cursor, points) {
  var axis = rectHandleAxis(index);
  if (axis === 'x') {
    return [cursor[0], points[(index - 1) / 2][1]];
  } else if (axis === 'y') {
    return [points[(index - 1) / 2][0], cursor[1]];
  } else {
    return cursor;
  }
}
function rectHandleAxis(index) {
  return index % 2 === 0 ? 'both' : (index - 1) / 2 % 2 === 0 ? 'y' : 'x';
}
function mapIndexOfRectHandleCrossingOver(index, position, startPoints) {
  if (index >= 0 && index <= 3 && position[1] > startPoints[0][1] || index >= 4 && index <= 6 && position[1] < startPoints[0][1]) {
    index = 6 - index;
  }
  if ((index === 0 || index >= 6) && position[0] > startPoints[0][0] || index >= 2 && index <= 4 && position[0] < startPoints[0][0]) {
    index = (10 - index) % 8;
  }
  return index;
}
function withPotentialPoint(state) {
  return [].concat(_toConsumableArray(state.points.slice(0, state.potentialPointInsertIndex)), [state.potentialPoint], _toConsumableArray(state.points.slice(state.potentialPointInsertIndex)));
}
function midpoint(p1, p2) {
  return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
}
function getBoundingBox(polygon) {
  if (polygon.length === 0) {
    return null;
  }
  var minX = polygon[0][0];
  var minY = polygon[0][1];
  var maxX = polygon[0][0];
  var maxY = polygon[0][1];
  for (var i = 1; i < polygon.length; i++) {
    var _polygon$i = _slicedToArray(polygon[i], 2),
      x = _polygon$i[0],
      y = _polygon$i[1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return [[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY]];
}
function ensureInBounds(point) {
  return point.map(function (coord) {
    return Math.min(100, Math.max(0, coord));
  });
}
function ensureInPolygon(polygon, point) {
  return isPointInPolygon(polygon, point) ? point : closestPointOnPolygon(polygon, point)[1];
}
function isPointInPolygon(polygon, point) {
  var x = point[0],
    y = point[1];
  var inside = false;
  for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    var xi = polygon[i][0],
      yi = polygon[i][1];
    var xj = polygon[j][0],
      yj = polygon[j][1];
    var intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function closestPointOnPolygon(polygon, c) {
  function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
  }
  function closestPoint(A, B, C) {
    var AB = [B[0] - A[0], B[1] - A[1]];
    var AC = [C[0] - A[0], C[1] - A[1]];
    var abLength = AB[0] * AB[0] + AB[1] * AB[1]; // Dot product of AB with itself

    if (abLength === 0) return A; // A and B are the same points

    var proj = (AC[0] * AB[0] + AC[1] * AB[1]) / abLength; // Projection ratio of AC on AB

    if (proj < 0) return A; // Closer to A
    else if (proj > 1) return B; // Closer to B
    else return [A[0] + proj * AB[0], A[1] + proj * AB[1]]; // Point on the segment
  }
  var closest = null;
  var minDistance = Infinity;
  for (var i = 0; i < polygon.length; i++) {
    var A = polygon[i];
    var B = polygon[(i + 1) % polygon.length];
    var point = closestPoint(A, B, c);
    var dist = distance(c, point);
    if (dist < minDistance) {
      minDistance = dist;
      closest = [i + 1, point];
    }
  }
  return closest;
}
function polygonCentroid(points) {
  var centroidX = 0;
  var centroidY = 0;
  var signedArea = 0;
  var x0 = 0;
  var y0 = 0;
  var x1 = 0;
  var y1 = 0;
  var a = 0;
  for (var i = 0; i < points.length - 1; i++) {
    x0 = points[i][0];
    y0 = points[i][1];
    x1 = points[i + 1][0];
    y1 = points[i + 1][1];
    a = x0 * y1 - x1 * y0;
    signedArea += a;
    centroidX += (x0 + x1) * a;
    centroidY += (y0 + y1) * a;
  }
  x0 = points[points.length - 1][0];
  y0 = points[points.length - 1][1];
  x1 = points[0][0];
  y1 = points[0][1];
  a = x0 * y1 - x1 * y0;
  signedArea += a;
  centroidX += (x0 + x1) * a;
  centroidY += (y0 + y1) * a;
  signedArea *= 0.5;
  centroidX /= 6 * signedArea;
  centroidY /= 6 * signedArea;
  return [centroidX, centroidY];
}
function round(point) {
  return point.map(function (coord) {
    return Math.round(coord * 10) / 10;
  });
}

var css$1 = ".DraggableEditorView-module_wrapper__J8JLO {\n  position: relative;\n  display: inline-block;\n  overflow: hidden;\n\n  background-image:\n    linear-gradient(45deg, var(--ui-on-surface-color-lighter) 25%, transparent 25%),\n    linear-gradient(135deg, var(--ui-on-surface-color-lighter) 25%, transparent 25%),\n    linear-gradient(45deg, transparent 75%, var(--ui-on-surface-color-lighter) 75%),\n    linear-gradient(135deg, transparent 75%, var(--ui-on-surface-color-lighter) 75%);\n  background-size: 16px 16px;\n  background-position:0 0, 8px 0, 8px -8px, 0px 8px;\n}\n\n.DraggableEditorView-module_buttons__1Xob0 {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin: 10px 0;\n  gap: 15px;\n}\n\n.DraggableEditorView-module_buttons__1Xob0 button {\n  white-space: nowrap;\n}\n\n.DraggableEditorView-module_coordinates__3dVEt,\n.DraggableEditorView-module_coordinates__3dVEt label {\n  display: flex;\n  align-items: center;\n  margin: 0;\n}\n\n.DraggableEditorView-module_coordinates__3dVEt {\n  flex-wrap: wrap;\n  justify-content: flex-end;\n}\n\n.DraggableEditorView-module_coordinates__3dVEt {\n  gap: 10px;\n}\n\n.DraggableEditorView-module_coordinates__3dVEt label {\n  gap: 5px;\n}\n\n.DraggableEditorView-module_coordinates__3dVEt input[disabled] {\n  background-color: var(--ui-on-surface-color-lightest);\n}\n\n.DraggableEditorView-module_modeButtons__4wZBu {\n  flex: 1;\n  white-space: nowrap;\n}\n\n.DraggableEditorView-module_modeButtons__4wZBu button:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n.DraggableEditorView-module_modeButtons__4wZBu button:last-child {\n  margin-left: -1px;\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.DraggableEditorView-module_modeButtons__4wZBu button[aria-pressed=true] {\n  background-color: var(--ui-selection-color-light);\n}\n\n.DraggableEditorView-module_buttons__1Xob0 img {\n  vertical-align: middle;\n  margin-right: 6px;\n}\n\n.DraggableEditorView-module_placeholderImage__JyyId {\n  aspect-ratio: 16 / 9;\n  background-color: #000;\n}\n\n.DraggableEditorView-module_image__1Ockp {\n  display: block;\n  height: calc(100vh - 250px);\n  max-height: 600px;\n  min-height: 200px;\n}\n\n.DraggableEditorView-module_portraitImage__2lYIE {\n  max-height: 1200px;\n}\n\n.DraggableEditorView-module_overlay__3QLpM {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n\n.DraggableEditorView-module_overlay__3QLpM svg {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n\n.DraggableEditorView-module_overlay__3QLpM polygon {\n  vector-effect: non-scaling-stroke;\n  stroke-width: 1px;\n  stroke-linejoin: round;\n  stroke: #fff;\n  fill: transparent;\n  opacity: 0.9;\n  cursor: move;\n}\n\n.DraggableEditorView-module_handle__9LHSy {\n  position: absolute;\n  width: 10px;\n  height: 10px;\n  background-color: #fff;\n  transform: translate(-50%, -50%);\n  border: solid 1px var(--ui-primary-color);\n  border-radius: 2px;\n  opacity: 0.9;\n  z-index: 2;\n}\n\n.DraggableEditorView-module_handle__9LHSy::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 30px;\n  height: 30px;\n  margin: -10px 0 0 -10px;\n  border-radius: 100%;\n  z-index: 1;\n}\n\n.DraggableEditorView-module_circle__35Pba {\n  border-radius: 100%;\n  cursor: move;\n}\n\n.DraggableEditorView-module_potential__vxrma {\n  opacity: 0;\n  z-index: 1;\n  cursor: default;\n}\n\n.DraggableEditorView-module_handle__9LHSy:hover {\n  opacity: 1;\n}\n\n.DraggableEditorView-module_indicator__23yQO {\n  --size: 15px;\n  position: absolute;\n  left: var(--center-x);\n  top: var(--center-y);\n  margin: calc(var(--size) / -2) 0 0 calc(var(--size) / -2);\n  border-radius: 50%;\n  width: var(--size);\n  height: var(--size);\n  background-color: var(--color, #fff);\n  transition: transform 0.2s ease;\n  cursor: move;\n  z-index: 3;\n}\n\n.DraggableEditorView-module_indicator__23yQO:hover {\n  transform: scale(1.2);\n}\n\n.DraggableEditorView-module_indicator__23yQO::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: var(--size);\n  height: var(--size);\n  border-radius: 50%;\n  background-color: #fff;\n  animation: DraggableEditorView-module_blink__1SdQI 1s infinite;\n  opacity: 0.3;\n  z-index: -1;\n}\n\n.DraggableEditorView-module_selected__2bQtv {\n  box-shadow: 0 0 0 3px var(--ui-selection-color),\n              0 0 0 4px var(--ui-primary-color-light);\n}\n\n@keyframes DraggableEditorView-module_blink__1SdQI {\n  0% {\n    transform: scale(1.7);\n  }\n\n  50% {\n    transform: scale(2);\n  }\n\n  100% {\n    transform: scale(1.7);\n  }\n}\n";
var styles$1 = {"wrapper":"DraggableEditorView-module_wrapper__J8JLO","buttons":"DraggableEditorView-module_buttons__1Xob0","coordinates":"DraggableEditorView-module_coordinates__3dVEt","modeButtons":"DraggableEditorView-module_modeButtons__4wZBu","placeholderImage":"DraggableEditorView-module_placeholderImage__JyyId","image":"DraggableEditorView-module_image__1Ockp","portraitImage":"DraggableEditorView-module_portraitImage__2lYIE","overlay":"DraggableEditorView-module_overlay__3QLpM","handle":"DraggableEditorView-module_handle__9LHSy","circle":"DraggableEditorView-module_circle__35Pba","potential":"DraggableEditorView-module_potential__vxrma","indicator":"DraggableEditorView-module_indicator__23yQO","blink":"DraggableEditorView-module_blink__1SdQI","selected":"DraggableEditorView-module_selected__2bQtv"};
styleInject(css$1);

var img$a = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='UTF-8' standalone='no'%3f%3e%3csvg xmlns='http://www.w3.org/2000/svg' id='svg4' version='1.1' viewBox='0 0 448 512'%3e %3cpath d='M 61.345703 63.888672 C 44.725703 63.888672 31.345703 77.268672 31.345703 93.888672 L 31.345703 417.57031 C 31.345703 434.19031 44.725703 447.57031 61.345703 447.57031 L 385.02734 447.57031 C 401.64734 447.57031 415.02734 434.19031 415.02734 417.57031 L 415.02734 93.888672 C 415.02734 77.268672 401.64734 63.888672 385.02734 63.888672 L 61.345703 63.888672 z M 106 127.80078 L 341.13867 127.80078 C 346.67867 127.80078 351.13867 132.26078 351.13867 137.80078 L 351.13867 372.93945 C 351.13867 378.47945 346.67867 382.93945 341.13867 382.93945 L 106 382.93945 C 100.46 382.93945 96 378.47945 96 372.93945 L 96 137.80078 C 96 132.26078 100.46 127.80078 106 127.80078 z ' fill='hsla(197%2c 26%25%2c 23%25%2c 0.8)' /%3e%3c/svg%3e";

var img$b = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3c!--!Font Awesome Free 6.5.2 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons%2c Inc.--%3e%3cpath d='M96 151.4V360.6c9.7 5.6 17.8 13.7 23.4 23.4H328.6c0-.1 .1-.2 .1-.3l-4.5-7.9-32-56 0 0c-1.4 .1-2.8 .1-4.2 .1c-35.3 0-64-28.7-64-64s28.7-64 64-64c1.4 0 2.8 0 4.2 .1l0 0 32-56 4.5-7.9-.1-.3H119.4c-5.6 9.7-13.7 17.8-23.4 23.4zM384.3 352c35.2 .2 63.7 28.7 63.7 64c0 35.3-28.7 64-64 64c-23.7 0-44.4-12.9-55.4-32H119.4c-11.1 19.1-31.7 32-55.4 32c-35.3 0-64-28.7-64-64c0-23.7 12.9-44.4 32-55.4V151.4C12.9 140.4 0 119.7 0 96C0 60.7 28.7 32 64 32c23.7 0 44.4 12.9 55.4 32H328.6c11.1-19.1 31.7-32 55.4-32c35.3 0 64 28.7 64 64c0 35.3-28.5 63.8-63.7 64l-4.5 7.9-32 56-2.3 4c4.2 8.5 6.5 18 6.5 28.1s-2.3 19.6-6.5 28.1l2.3 4 32 56 4.5 7.9z' fill='hsla(197%2c 26%25%2c 23%25%2c 0.8)' /%3e%3c/svg%3e";

var img$c = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='UTF-8' standalone='no'%3f%3e%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' version='1.1'%3e %3cpath d='m 243%2c25.5 c -3%2c3.6 -6%2c8.5 -6%2c14 V 129 l -8%2c-7 c -7%2c-8 -20%2c-8 -28%2c0 -7%2c7 -7%2c19 0%2c26 l 42%2c42 v 0 c 2%2c2 4%2c3 6%2c4 3%2c1 5%2c1 8%2c2 v 0 c 5%2c-1 10%2c-2 14%2c-6 l 41%2c-42 c 7%2c-7 7%2c-19 0%2c-26 -8%2c-8 -20%2c-8 -28%2c0 l -8%2c7 V 38.9 C 276%2c28.5 268%2c20 257%2c20 c -6%2c0 -11%2c2.4 -14%2c5.5 z' style='stroke-width:0.608' /%3e %3cpath d='m 486%2c243 c -4%2c-3 -8%2c-6 -14%2c-6 h -89 l 7%2c-8 c 8%2c-7 8%2c-21 0%2c-29 -7%2c-7 -19%2c-7 -26%2c0 l -42%2c43 v 0 c -2%2c2 -3%2c4 -4%2c6 -1%2c3 -1%2c5 -2%2c8 v 0 c 1%2c5 2%2c10 6%2c14 l 42%2c41 c 7%2c7 19%2c7 26%2c0 8%2c-8 8%2c-20 0%2c-28 l -7%2c-8 h 90 c 10%2c0 19%2c-8 19%2c-19 0%2c-6 -3%2c-11 -6%2c-14 z' style='stroke-width:0.608' /%3e %3cpath d='m 269%2c486 c 3%2c-4 6%2c-8 6%2c-14 v -89 l 8%2c7 c 7%2c8 21%2c8 29%2c0 7%2c-7 7%2c-19 0%2c-26 l -43%2c-42 v 0 c -2%2c-2 -4%2c-3 -6%2c-4 -3%2c-1 -5%2c-1 -8%2c-2 v 0 c -5%2c1 -10%2c2 -14%2c6 l -41%2c42 c -7%2c7 -7%2c19 0%2c26 8%2c8 20%2c8 28%2c0 l 8%2c-7 v 90 c 0%2c10 8%2c19 19%2c19 6%2c0 11%2c-3 14%2c-6 z' style='stroke-width:0.608' /%3e %3cpath d='m 26%2c269 c 4%2c3 8%2c6 14%2c6 h 89 l -7%2c8 c -8%2c7 -8%2c21 0%2c29 7%2c7 19%2c7 26%2c0 l 42%2c-43 v 0 c 2%2c-2 3%2c-4 4%2c-6 1%2c-3 1%2c-5 2%2c-8 v 0 c -1%2c-5 -2%2c-10 -6%2c-14 l -42%2c-41 c -7%2c-7 -19%2c-7 -26%2c0 -8%2c8 -8%2c20 0%2c28 l 7%2c8 H 39 c -10%2c0 -19%2c8 -19%2c19 0%2c6 3%2c11 6%2c14 z' style='stroke-width:0.608' /%3e%3c/svg%3e";

var i18nPrefix = 'pageflow_scrolled.editor.content_elements.hotspots.edit_area_dialog';
var DraggableEditorView = Marionette.View.extend({
  render: function render() {
    var _this$options$file,
      _this = this;
    ReactDOM.render( /*#__PURE__*/React.createElement(DraggableEditor, {
      imageSrc: (_this$options$file = this.options.file) === null || _this$options$file === void 0 ? void 0 : _this$options$file.getBackgroundPositioningImageUrl(),
      portrait: this.options.file && this.options.file.get('width') < this.options.file.get('height'),
      indicatorColor: paletteColor(this.model.get(this.getPropertyName('color')) || this.model.get('color')),
      initialMode: this.model.get(this.getPropertyName('mode')),
      initialPoints: this.model.get(this.getPropertyName('outline')),
      initialIndicatorPosition: this.model.get(this.getPropertyName('indicatorPosition')),
      onModeChange: function onModeChange(mode) {
        return _this.mode = mode;
      },
      onPointsChange: function onPointsChange(points) {
        return _this.points = points;
      },
      onIndicatorPositionChange: function onIndicatorPositionChange(indicatorPosition) {
        return _this.indicatorPosition = indicatorPosition;
      }
    }), this.el);
    return this;
  },
  save: function save() {
    if (this.mode) {
      this.model.set(this.getPropertyName('mode'), this.mode);
    }
    if (this.points) {
      this.model.set(this.getPropertyName('outline'), this.points);
    }
    if (this.indicatorPosition) {
      this.model.set(this.getPropertyName('indicatorPosition'), this.indicatorPosition);
    }
  },
  getPropertyName: function getPropertyName(suffix) {
    return this.options.portrait ? "portrait".concat(utils.capitalize(suffix)) : suffix;
  }
});
function DraggableEditor(_ref) {
  var _state$selection2, _state$selection3;
  var imageSrc = _ref.imageSrc,
    portrait = _ref.portrait,
    indicatorColor = _ref.indicatorColor,
    initialMode = _ref.initialMode,
    initialPoints = _ref.initialPoints,
    initialIndicatorPosition = _ref.initialIndicatorPosition,
    onModeChange = _ref.onModeChange,
    onPointsChange = _ref.onPointsChange,
    onIndicatorPositionChange = _ref.onIndicatorPositionChange;
  var _useReducer = useReducer(reducer, {
      mode: initialMode || 'rect',
      points: initialPoints || [[40, 40], [60, 40], [60, 60], [40, 60]],
      indicatorPosition: initialIndicatorPosition || [50, 50]
    }),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    state = _useReducer2[0],
    dispatch = _useReducer2[1];
  var mode = state.mode,
    points = state.points,
    potentialPoint = state.potentialPoint,
    indicatorPosition = state.indicatorPosition,
    selection = state.selection;
  useEffect(function () {
    onModeChange(mode);
  }, [onModeChange, mode]);
  useEffect(function () {
    onPointsChange(points);
  }, [onPointsChange, points]);
  useEffect(function () {
    onIndicatorPositionChange(indicatorPosition);
  }, [onIndicatorPositionChange, indicatorPosition]);
  var ref = useRef();
  function clientToPercent(event) {
    var rect = ref.current.getBoundingClientRect();
    return [Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100)), Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100))];
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: styles$1.buttons
  }, /*#__PURE__*/React.createElement(ModeButtons, {
    mode: mode,
    dispatch: dispatch
  }), /*#__PURE__*/React.createElement(Coordinates, {
    selection: selection,
    onChange: function onChange(position) {
      return dispatch({
        type: UPDATE_SELECTION_POSITION,
        position: position
      });
    },
    onBlur: function onBlur() {
      return dispatch({
        type: BLUR_SELECTION_POSITION
      });
    }
  }), /*#__PURE__*/React.createElement(CenterIndicatorButton, {
    onClick: function onClick() {
      return dispatch({
        type: CENTER_INDICATOR
      });
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$1.wrapper
  }, imageSrc ? /*#__PURE__*/React.createElement("img", {
    className: classNames(styles$1.image, _defineProperty({}, styles$1.portraitImage, portrait)),
    src: imageSrc,
    alt: I18n.t("".concat(i18nPrefix, ".hotspots_image"))
  }) : /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.image, styles$1.placeholderImage)
  }), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: styles$1.overlay,
    onMouseMove: function onMouseMove(event) {
      return dispatch({
        type: MOUSE_MOVE,
        cursor: clientToPercent(event)
      });
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement(DraggableCore, {
    onDrag: function onDrag(event, dragEvent) {
      var rect = ref.current.getBoundingClientRect();
      dispatch({
        type: DRAG,
        delta: [dragEvent.deltaX / rect.width * 100, dragEvent.deltaY / rect.height * 100]
      });
    }
  }, /*#__PURE__*/React.createElement("polygon", {
    points: drawnOutlinePoints(state).map(function (coords) {
      return coords.map(function (coord) {
        return coord;
      }).join(',');
    }).join(' ')
  }))), handles(state).map(function (handle, index) {
    var _state$selection;
    return /*#__PURE__*/React.createElement(Handle, {
      key: index,
      point: handle.point,
      selected: ((_state$selection = state.selection) === null || _state$selection === void 0 ? void 0 : _state$selection.index) === index,
      axis: handle.axis,
      cursor: handle.cursor,
      circle: handle.circle,
      title: handle.deletable ? I18n.t("".concat(i18nPrefix, ".double_click_to_delete")) : null,
      onClick: function onClick(event) {
        return dispatch({
          type: CLICK_HANDLE,
          index: index
        });
      },
      onDoubleClick: function onDoubleClick(event) {
        return dispatch({
          type: DOUBLE_CLICK_HANDLE,
          index: index
        });
      },
      onDrag: function onDrag(event) {
        return dispatch({
          type: DRAG_HANDLE,
          index: index,
          cursor: clientToPercent(event)
        });
      },
      onDragStop: function onDragStop(event) {
        return dispatch({
          type: DRAG_HANDLE_STOP
        });
      }
    });
  }), potentialPoint && /*#__PURE__*/React.createElement(Handle, {
    point: potentialPoint,
    circle: true,
    potential: true,
    selected: ((_state$selection2 = state.selection) === null || _state$selection2 === void 0 ? void 0 : _state$selection2.type) === 'potentialPoint',
    onDrag: function onDrag(event) {
      return dispatch({
        type: DRAG_POTENTIAL_POINT,
        cursor: clientToPercent(event)
      });
    },
    onDragStop: function onDragStop(event) {
      return dispatch({
        type: DRAG_POTENTIAL_POINT_STOP
      });
    }
  }), /*#__PURE__*/React.createElement(Indicator, {
    position: indicatorPosition,
    selected: ((_state$selection3 = state.selection) === null || _state$selection3 === void 0 ? void 0 : _state$selection3.type) === 'indicator',
    color: indicatorColor,
    onClick: function onClick(event) {
      return dispatch({
        type: CLICK_INDICATOR
      });
    },
    onDrag: function onDrag(event) {
      return dispatch({
        type: DRAG_INDICATOR,
        cursor: clientToPercent(event)
      });
    }
  }))));
}
var modeIcons = {
  rect: img$a,
  polygon: img$b
};
function ModeButtons(_ref2) {
  var mode = _ref2.mode,
    dispatch = _ref2.dispatch;
  return /*#__PURE__*/React.createElement("div", {
    className: styles$1.modeButtons
  }, ['rect', 'polygon'].map(function (availableMode) {
    return /*#__PURE__*/React.createElement("button", {
      key: availableMode,
      type: "button",
      className: buttonStyles.secondaryIconButton,
      "aria-pressed": mode === availableMode,
      onClick: function onClick() {
        return dispatch({
          type: SET_MODE,
          value: availableMode
        });
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: modeIcons[availableMode],
      alt: "",
      width: "20",
      height: "20"
    }), I18n.t(availableMode, {
      scope: "".concat(i18nPrefix, ".modes")
    }));
  }));
}
function Handle(_ref3) {
  var point = _ref3.point,
    selected = _ref3.selected,
    circle = _ref3.circle,
    potential = _ref3.potential,
    title = _ref3.title,
    cursor = _ref3.cursor,
    onDrag = _ref3.onDrag,
    onDragStop = _ref3.onDragStop,
    onClick = _ref3.onClick,
    onDoubleClick = _ref3.onDoubleClick;
  return /*#__PURE__*/React.createElement(DraggableCore, {
    onDrag: onDrag,
    onStop: onDragStop
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.handle, _defineProperty(_defineProperty(_defineProperty({}, styles$1.circle, circle), styles$1.selected, selected), styles$1.potential, potential)),
    tabIndex: "0",
    onClick: onClick,
    onDoubleClick: onDoubleClick,
    title: title,
    style: {
      left: "".concat(point[0], "%"),
      top: "".concat(point[1], "%"),
      cursor: cursor
    }
  }));
}
function Indicator(_ref4) {
  var position = _ref4.position,
    selected = _ref4.selected,
    color = _ref4.color,
    onClick = _ref4.onClick,
    onDrag = _ref4.onDrag;
  return /*#__PURE__*/React.createElement(DraggableCore, {
    onDrag: onDrag
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.indicator, _defineProperty({}, styles$1.selected, selected)),
    onClick: onClick,
    style: {
      left: "".concat(position[0], "%"),
      top: "".concat(position[1], "%"),
      '--color': color
    },
    title: I18n.t("".concat(i18nPrefix, ".indicator_title"))
  }));
}
function CenterIndicatorButton(_ref5) {
  var onClick = _ref5.onClick;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: buttonStyles.secondaryIconButton,
    onClick: onClick
  }, /*#__PURE__*/React.createElement("img", {
    src: img$c,
    alt: "",
    width: "20",
    height: "20"
  }), I18n.t("".concat(i18nPrefix, ".centerIndicator")));
}
function Coordinates(_ref6) {
  var selection = _ref6.selection,
    _onChange = _ref6.onChange,
    onBlur = _ref6.onBlur;
  if (!selection) {
    return null;
  }
  var position = selection.position;
  return /*#__PURE__*/React.createElement("div", {
    className: styles$1.coordinates
  }, /*#__PURE__*/React.createElement(CoordinateInput, {
    label: "X",
    disabled: selection.axis === 'y',
    value: position[0],
    onChange: function onChange(event) {
      return _onChange([parseFloat(event.target.value || 0), position[1]]);
    },
    onBlur: onBlur
  }), /*#__PURE__*/React.createElement(CoordinateInput, {
    label: "Y",
    disabled: selection.axis === 'x',
    value: position[1],
    onChange: function onChange(event) {
      return _onChange([position[0], parseFloat(event.target.value || 0)]);
    },
    onBlur: onBlur
  }));
}
function CoordinateInput(_ref7) {
  var disabled = _ref7.disabled,
    label = _ref7.label,
    value = _ref7.value,
    onChange = _ref7.onChange,
    onBlur = _ref7.onBlur;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames({
      'input-disabled': disabled
    })
  }, /*#__PURE__*/React.createElement("label", null, label, ":", /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    max: "100",
    disabled: disabled,
    value: value,
    onClick: function onClick(event) {
      return event.target.focus();
    },
    onChange: onChange,
    onBlur: onBlur
  }), "%"));
}

var css$2 = ".EditAreaDialogView-module_box__1IOYj {\n  width: -moz-min-content;\n  width: min-content;\n  min-height: 310px;\n  min-width: 400px;\n}\n\n.EditAreaDialogView-module_wrapper__F28hP {}\n\n.EditAreaDialogView-module_save__1o3Qg {}\n";
var styles$2 = {"box":"EditAreaDialogView-module_box__1IOYj","wrapper":"EditAreaDialogView-module_wrapper__F28hP","save":"EditAreaDialogView-module_save__1o3Qg"};
styleInject(css$2);

var i18nPrefix$1 = 'pageflow_scrolled.editor.content_elements.hotspots.edit_area_dialog';
var EditAreaDialogView = Marionette.ItemView.extend({
  template: function template() {
    return "\n    <div class=\"".concat(dialogViewStyles.backdrop, "\">\n      <div class=\"editor ").concat(dialogViewStyles.box, " ").concat(styles$2.box, "\">\n        <h1 class=\"").concat(dialogViewStyles.header, "\">\n          ").concat(I18n.t("".concat(i18nPrefix$1, ".header")), "\n        </h1>\n\n        <div class=\"").concat(styles$2.wrapper, "\">\n        </div>\n\n        <div class=\"").concat(dialogViewStyles.footer, "\">\n          <button class=\"").concat(styles$2.save, " ").concat(buttonStyles.saveButton, "\">\n            ").concat(I18n.t("".concat(i18nPrefix$1, ".save")), "\n          </button>\n          <button class=\"").concat(dialogViewStyles.close, "\">\n            ").concat(I18n.t("".concat(i18nPrefix$1, ".cancel")), "\n          </button>\n        </div>\n     </div>\n  </div>\n            ");
  },
  mixins: [dialogView],
  ui: cssModulesUtils$1.ui(styles$2, 'wrapper'),
  events: cssModulesUtils$1.events(styles$2, {
    'click save': function clickSave() {
      this.save();
      this.close();
      if (this.options.onSave) {
        this.options.onSave();
      }
    }
  }),
  onRender: function onRender() {
    var _this = this;
    if (this.options.portraitFile) {
      var tabsView = new TabsView({
        translationKeyPrefixes: ["".concat(i18nPrefix$1, ".tabs")],
        defaultTab: this.options.defaultTab
      });
      this.editorViews = [new DraggableEditorView({
        model: this.model,
        file: this.options.file
      }), new DraggableEditorView({
        model: this.model,
        file: this.options.portraitFile,
        portrait: true
      })];
      tabsView.tab('default', function () {
        return _this.editorViews[0];
      });
      tabsView.tab('portrait', function () {
        return _this.editorViews[1];
      });
      this.appendSubview(tabsView.render(), {
        to: this.ui.wrapper
      });
    } else {
      this.editorViews = [new DraggableEditorView({
        model: this.model,
        file: this.options.file
      })];
      this.appendSubview(this.editorViews[0].render(), {
        to: this.ui.wrapper
      });
    }
  },
  save: function save() {
    this.editorViews.forEach(function (view) {
      return view.save();
    });
  }
});
EditAreaDialogView.show = function (options) {
  app.dialogRegion.show(new EditAreaDialogView(options));
};

var Area = Backbone.Model.extend({
  mixins: [transientReferences],
  thumbnailFile: function thumbnailFile() {
    var _this$imageFile;
    return (_this$imageFile = this.imageFile()) === null || _this$imageFile === void 0 ? void 0 : _this$imageFile.thumbnailFile();
  },
  title: function title() {
    var _tooltipTexts$this$id, _tooltipTexts$this$id2, _tooltipTexts$this$id3, _tooltipTexts$this$id4, _tooltipTexts$this$id5;
    var tooltipTexts = this.collection.contentElement.configuration.get('tooltipTexts');
    return tooltipTexts === null || tooltipTexts === void 0 ? void 0 : (_tooltipTexts$this$id = tooltipTexts[this.id]) === null || _tooltipTexts$this$id === void 0 ? void 0 : (_tooltipTexts$this$id2 = _tooltipTexts$this$id.title) === null || _tooltipTexts$this$id2 === void 0 ? void 0 : (_tooltipTexts$this$id3 = _tooltipTexts$this$id2[0]) === null || _tooltipTexts$this$id3 === void 0 ? void 0 : (_tooltipTexts$this$id4 = _tooltipTexts$this$id3.children) === null || _tooltipTexts$this$id4 === void 0 ? void 0 : (_tooltipTexts$this$id5 = _tooltipTexts$this$id4[0]) === null || _tooltipTexts$this$id5 === void 0 ? void 0 : _tooltipTexts$this$id5.text;
  },
  imageFile: function imageFile() {
    return this.collection.entry.imageFiles.getByPermaId(this.get('activeImage'));
  },
  highlight: function highlight() {
    this.collection.contentElement.postCommand({
      type: 'HIGHLIGHT_AREA',
      index: this.collection.indexOf(this)
    });
  },
  resetHighlight: function resetHighlight() {
    this.collection.contentElement.postCommand({
      type: 'RESET_AREA_HIGHLIGHT'
    });
  }
});

var css$3 = ".AreasListView-module_listContainer__1vyoU {}\n";
var styles$3 = {"listContainer":"AreasListView-module_listContainer__1vyoU"};
styleInject(css$3);

var AreasListView = Marionette.Layout.extend({
  template: function template(data) {
    return "\n    <div class='".concat(styles$3.listContainer, "'></div>\n    <button class=\"").concat(buttonStyles.addButton, "\">\n      ").concat(I18n.t('pageflow_scrolled.editor.content_elements.hotspots.areas.add'), "\n    </button>\n  ");
  },
  regions: cssModulesUtils.ui(styles$3, 'listContainer'),
  events: cssModulesUtils.events(buttonStyles, {
    'click addButton': function clickAddButton() {
      var _this = this;
      var model = new Area();
      EditAreaDialogView.show({
        model: model,
        file: this.model.getImageFile('image'),
        portraitFile: this.model.getImageFile('portraitImage'),
        onSave: function onSave() {
          return _this.collection.addWithId(model);
        }
      });
    }
  }),
  onRender: function onRender() {
    var _this2 = this;
    this.listContainer.show(new ListView({
      label: I18n.t('pageflow_scrolled.editor.content_elements.hotspots.areas.label'),
      collection: this.collection,
      sortable: true,
      highlight: true,
      onEdit: function onEdit(model) {
        _this2.options.contentElement.postCommand({
          type: 'SET_ACTIVE_AREA',
          index: _this2.collection.indexOf(model)
        });
        editor.navigate("/scrolled/hotspots/".concat(_this2.options.contentElement.id, "/").concat(model.id), {
          trigger: true
        });
      },
      onRemove: function onRemove(model) {
        if (window.confirm(I18n.t('pageflow_scrolled.editor.content_elements.hotspots.areas.confirm_delete'))) {
          _this2.collection.remove(model);
        }
      }
    }));
  }
});

var AreasCollection = Backbone.Collection.extend({
  model: Area,
  comparator: 'position',
  initialize: function initialize(models, options) {
    var _this = this;
    this.entry = options.entry;
    this.contentElement = options.contentElement;
    this.listenTo(this, 'add change sort', this.updateConfiguration);
    this.listenTo(this, 'remove', function () {
      return _this.updateConfiguration({
        pruneTooltips: true
      });
    });
  },
  updateConfiguration: function updateConfiguration(_ref) {
    var pruneTooltips = _ref.pruneTooltips;
    var updatedAttributes = {
      areas: this.toJSON()
    };
    if (pruneTooltips) {
      updatedAttributes = _objectSpread2(_objectSpread2(_objectSpread2({}, updatedAttributes), this.getPrunedProperty('tooltipTexts')), this.getPrunedProperty('tooltipLinks'));
    }
    this.contentElement.configuration.set(updatedAttributes);
  },
  getPrunedProperty: function getPrunedProperty(propertyName) {
    return _defineProperty({}, propertyName, _.pick.apply(_, [this.contentElement.configuration.get(propertyName) || {}].concat(_toConsumableArray(this.pluck('id')))));
  },
  addWithId: function addWithId(model) {
    model.set('id', this.length ? Math.max.apply(Math, _toConsumableArray(this.pluck('id'))) + 1 : 1);
    this.add(model);
  },
  saveOrder: function saveOrder() {}
});
AreasCollection.forContentElement = function (contentElement, entry) {
  return new AreasCollection(contentElement.configuration.get('areas') || [], {
    entry: entry,
    contentElement: contentElement
  });
};

var SidebarRouter$1 = Marionette.AppRouter.extend({
  appRoutes: {
    'scrolled/hotspots/:id/:area_id': 'area',
    'scrolled/hotspots/:id/:area_id/:tab': 'area'
  }
});

var css$4 = ".AreaInputView-module_button__3LSo- {\n  width: 100%;\n}\n";
var styles$4 = {"button":"AreaInputView-module_button__3LSo-"};
styleInject(css$4);

var AreaInputView = Marionette.Layout.extend({
  template: function template(data) {
    return "\n    <label>\n      <span class=\"name\"></span>\n      <span class=\"inline_help\"></span>\n    </label>\n    <button class=\"".concat(buttonStyles.targetButton, " ").concat(styles$4.button, "\">\n      ").concat(I18n.t('pageflow_scrolled.editor.content_elements.hotspots.area_input.edit'), "\n    </button>\n  ");
  },
  mixins: [inputView],
  events: cssModulesUtils.events(buttonStyles, {
    'click targetButton': function clickTargetButton() {
      EditAreaDialogView.show({
        model: this.model,
        file: this.options.file,
        portraitFile: this.options.portraitFile,
        defaultTab: this.options.defaultTab
      });
    }
  })
});

var css$5 = ".SidebarEditAreaView-module_view__2AVKF .tabs_view-headers li:nth-child(2) {\n  margin-left: 5px;\n}\n\n.SidebarEditAreaView-module_view__2AVKF .tabs_view-headers li:nth-child(2)::before {\n  content: \"\\203A\";\n  margin-left: -15px;\n  margin-right: 10px;\n  font-weight: normal;\n}\n";
var styles$5 = {"view":"SidebarEditAreaView-module_view__2AVKF"};
styleInject(css$5);

var SidebarEditAreaView = Marionette.Layout.extend({
  template: function template(data) {
    return "\n    <a class=\"back\">".concat(I18n.t('pageflow_scrolled.editor.content_elements.hotspots.edit_area.back'), "</a>\n    <a class=\"destroy\">").concat(I18n.t('pageflow_scrolled.editor.content_elements.hotspots.edit_area.destroy'), "</a>\n\n    <div class='form_container'></div>\n  ");
  },
  className: styles$5.view,
  regions: {
    formContainer: '.form_container'
  },
  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroyLink'
  },
  onRender: function onRender() {
    var _this = this;
    var options = this.options;
    var configurationEditor = new ConfigurationEditorView({
      model: this.model,
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.content_elements.hotspots.edit_area.attributes'],
      tabTranslationKeyPrefix: 'pageflow_scrolled.editor.content_elements.hotspots.edit_area.tabs',
      tab: options.tab || (options.entry.get('emulation_mode') === 'phone' ? 'portrait' : 'area')
    });
    var file = options.contentElement.configuration.getImageFile('image');
    var portraitFile = options.contentElement.configuration.getImageFile('portraitImage');
    var panZoomEnabled = options.contentElement.configuration.get('enablePanZoom') !== 'never';
    var preserveActiveArea = function preserveActiveArea() {
      return setTimeout(function () {
        return options.contentElement.postCommand({
          type: 'SET_ACTIVE_AREA',
          index: options.collection.indexOf(_this.model)
        });
      }, 200);
    };
    if (file && portraitFile) {
      this.previousEmulationMode = options.entry.get('emulation_mode') || 'desktop';
    }
    configurationEditor.tab('area', function () {
      if (file && portraitFile && options.entry.has('emulation_mode')) {
        options.entry.unset('emulation_mode');
        preserveActiveArea();
      }
      this.input('area', AreaInputView, {
        file: file,
        portraitFile: portraitFile
      });
      this.input('activeImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'hotspotsArea',
        fileSelectionHandlerOptions: {
          contentElementId: options.contentElement.get('id'),
          tab: 'area'
        },
        positioning: false
      });
      if (panZoomEnabled) {
        this.input('zoom', SliderInputView);
      }
      this.group('PaletteColor', {
        propertyName: 'color',
        entry: options.entry
      });
      this.input('tooltipReference', SelectInputView, {
        values: ['indicator', 'area']
      });
      this.input('tooltipPosition', SelectInputView, {
        values: ['below', 'above']
      });
      this.input('tooltipMaxWidth', SelectInputView, {
        defaultValue: 'medium',
        values: ['wide', 'medium', 'narrow', 'veryNarrow']
      });
      this.view(SeparatorView);
      this.input('tooltipImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'hotspotsArea',
        fileSelectionHandlerOptions: {
          contentElementId: options.contentElement.get('id'),
          tab: 'area'
        },
        positioning: false
      });
      this.input('tooltipTextAlign', SelectInputView, {
        values: ['left', 'right', 'center']
      });
    });
    if (portraitFile) {
      configurationEditor.tab('portrait', function () {
        if (file && portraitFile && !options.entry.has('emulation_mode')) {
          options.entry.set('emulation_mode', 'phone');
          preserveActiveArea();
        }
        this.input('portraitArea', AreaInputView, {
          file: file,
          portraitFile: portraitFile,
          defaultTab: 'portrait'
        });
        this.input('portraitActiveImage', FileInputView, {
          collection: 'image_files',
          fileSelectionHandler: 'hotspotsArea',
          fileSelectionHandlerOptions: {
            contentElementId: options.contentElement.get('id'),
            tab: 'portrait'
          },
          positioning: false
        });
        if (panZoomEnabled) {
          this.input('portraitZoom', SliderInputView);
        }
        this.group('PaletteColor', {
          propertyName: 'portraitColor',
          entry: options.entry
        });
        this.input('portraitTooltipReference', SelectInputView, {
          values: ['indicator', 'area']
        });
        this.input('portraitTooltipPosition', SelectInputView, {
          values: ['below', 'above']
        });
        this.input('portraitTooltipMaxWidth', SelectInputView, {
          defaultValue: 'medium',
          values: ['wide', 'medium', 'narrow', 'veryNarrow']
        });
      });
    }
    this.formContainer.show(configurationEditor);
  },
  goBack: function goBack() {
    editor$1.navigate("/scrolled/content_elements/".concat(this.options.contentElement.get('id')), {
      trigger: true
    });
  },
  destroyLink: function destroyLink() {
    if (window.confirm(I18n.t('pageflow_scrolled.editor.content_elements.hotspots.edit_area.confirm_delete_link'))) {
      this.options.collection.remove(this.model);
      this.goBack();
    }
  }
});

var SidebarController$1 = Marionette.Controller.extend({
  initialize: function initialize(options) {
    this.entry = options.entry;
    this.region = options.region;
  },
  area: function area(id, areaId, tab) {
    var contentElement = this.entry.contentElements.get(id);
    var areasCollection = AreasCollection.forContentElement(contentElement, this.entry);
    this.region.show(new SidebarEditAreaView({
      model: areasCollection.get(areaId),
      collection: areasCollection,
      entry: this.entry,
      contentElement: contentElement,
      tab: tab
    }));
  }
});

var img$d = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='UTF-8'%3f%3e%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' version='1.1'%3e %3cpath d='M 63.099609 32 C 28.639609 32 -0.009765625 60.65 -0.009765625 96 L -0.009765625 416 C -0.009765625 451.35 28.641797 480 63.091797 480 L 447.0918 480 C 482.4418 480 511.0918 451.35 511.0918 416 L 511.0918 96 C 511.1009 60.65 483.29961 32 447.09961 32 L 63.099609 32 z M 147.62305 91.271484 C 194.82656 91.271484 233.12305 127.19517 233.12305 171.47461 C 233.12305 207.98427 181.0205 272.98443 158.17578 299.80273 C 152.69839 306.19401 142.54575 306.19401 137.06836 299.80273 C 114.22363 272.98443 62.121094 207.98427 62.121094 171.47461 C 62.121094 127.19517 100.41953 91.271484 147.62305 91.271484 z M 147.62305 133.9043 A 38.686943 36.290436 0 0 0 108.93555 170.19336 A 38.686943 36.290436 0 0 0 147.62305 206.48438 A 38.686943 36.290436 0 0 0 186.30859 170.19336 A 38.686943 36.290436 0 0 0 147.62305 133.9043 z M 364.37695 207.4043 C 411.58047 207.4043 449.87891 243.32993 449.87891 287.60938 C 449.87891 324.11903 397.77637 389.11725 374.93164 415.93555 C 369.45425 422.32683 359.30162 422.32683 353.82422 415.93555 C 330.9795 389.11725 278.87695 324.11903 278.87695 287.60938 C 278.87695 243.32992 317.17343 207.4043 364.37695 207.4043 z M 364.37695 250.03711 A 38.686943 36.290436 0 0 0 325.69141 286.32617 A 38.686943 36.290436 0 0 0 364.37695 322.61719 A 38.686943 36.290436 0 0 0 403.06445 286.32617 A 38.686943 36.290436 0 0 0 364.37695 250.03711 z ' style='fill:white' /%3e%3c/svg%3e";

editor.registerSideBarRouting({
  router: SidebarRouter$1,
  controller: SidebarController$1
});
editor.contentElementTypes.register('hotspots', {
  pictogram: img$d,
  category: 'interactive',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right', 'backdrop'],
  supportedWidthRange: ['xxs', 'full'],
  editorPath: function editorPath(contentElement) {
    var activeAreaId = contentElement.transientState.get('activeAreaId');
    if (activeAreaId) {
      return "/scrolled/hotspots/".concat(contentElement.id, "/").concat(activeAreaId);
    }
  },
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry,
      contentElement = _ref.contentElement;
    this.tab('general', function () {
      this.input('image', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('portraitImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false
      });
      this.view(AreasListView, {
        configuration: this.model,
        contentElement: contentElement,
        collection: AreasCollection.forContentElement(contentElement, entry)
      });
      this.input('invertTooltips', CheckBoxInputView$1);
      this.input('enablePanZoom', SelectInputView$1, {
        values: ['never', 'phonePlatform', 'always']
      });
      this.view(SeparatorView$1);
      this.input('enableFullscreen', CheckBoxInputView$1, {
        disabledBinding: ['position', 'width'],
        disabled: function disabled() {
          return contentElement.getWidth() === contentElementWidths.full || contentElement.getPosition() === 'backdrop';
        },
        displayUncheckedIfDisabled: true
      });
      this.group('ContentElementPosition', {
        entry: entry
      });
      this.view(SeparatorView$1);
      this.group('ContentElementCaption', {
        entry: entry
      });
      this.group('ContentElementInlineFileRightsSettings');
    });
  }
});
editor.registerFileSelectionHandler('hotspotsArea', function (options) {
  var contentElement = options.entry.contentElements.get(options.contentElementId);
  var areas = AreasCollection.forContentElement(contentElement, options.entry);
  this.call = function (file) {
    areas.get(options.id).setReference(options.attributeName, file);
  };
  this.getReferer = function () {
    return '/scrolled/hotspots/' + contentElement.id + '/' + options.id + '/' + options.tab;
  };
});

var img$e = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'%3e%3c!--! Font Awesome Pro 6.1.1 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons%2c Inc. --%3e%3cpath fill='white' d='M578.2 66.06C409.8 116.6 230.2 116.6 61.8 66.06C31 56.82 0 79.88 0 112v319.9c0 32.15 30.1 55.21 61.79 45.97c168.4-50.53 347.1-50.53 516.4-.002C608.1 487.2 640 464.1 640 431.1V112C640 79.88 609 56.82 578.2 66.06zM128 224C110.3 224 96 209.7 96 192s14.33-32 32-32c17.68 0 32 14.33 32 32S145.7 224 128 224zM474.3 388.6C423.4 380.3 371.8 376 320 376c-50.45 0-100.7 4.043-150.3 11.93c-14.14 2.246-24.11-13.19-15.78-24.84l49.18-68.56C206.1 290.4 210.9 288 216 288s9.916 2.441 12.93 6.574l32.46 44.51l93.3-139.1C357.7 194.7 362.7 192 368 192s10.35 2.672 13.31 7.125l109.1 165.1C498.1 375.9 488.1 390.8 474.3 388.6z'/%3e%3c/svg%3e";

var aspectRatios = ['wide', 'narrow', 'square', 'portrait'];
editor.contentElementTypes.register('vrImage', {
  pictogram: img$e,
  category: 'interactive',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right', 'backdrop'],
  supportedWidthRange: ['xxs', 'full'],
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry;
    this.tab('general', function () {
      this.input('image', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        filter: 'with_projection',
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('initialYaw', SliderInputView$1, {
        unit: '°',
        minValue: -180,
        maxValue: 180
      });
      this.input('initialPitch', SliderInputView$1, {
        unit: '°',
        minValue: -60,
        maxValue: 60
      });
      this.input('aspectRatio', SelectInputView$1, {
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' + 'content_elements.vrImage.' + 'attributes.aspectRatio.blank',
        values: aspectRatios
      });
      this.input('portraitAspectRatio', SelectInputView$1, {
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' + 'content_elements.vrImage.' + 'attributes.portraitAspectRatio.blank',
        values: aspectRatios
      });
      this.view(SeparatorView$1);
      this.group('ContentElementPosition', {
        entry: entry
      });
      this.view(SeparatorView$1);
      this.group('ContentElementCaption', {
        entry: entry
      });
      this.group('ContentElementInlineFileRightsSettings');
    });
  }
});
editor.fileTypes.modify('image_files', {
  configurationEditorInputs: function configurationEditorInputs(model) {
    var values = ['equirectangular_mono', 'equirectangular_stereo'];
    return [{
      name: 'projection',
      inputView: SelectInputView$1,
      inputViewOptions: {
        includeBlank: true,
        values: values
      }
    }];
  },
  confirmUploadTableColumns: [{
    name: 'projection',
    cellView: EnumTableCellView
  }],
  filters: [{
    name: 'with_projection',
    matches: function matches(file) {
      return !!file.configuration.get('projection');
    }
  }]
});

var img$f = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'%3e%3c!--! Font Awesome Pro 6.1.1 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons%2c Inc. --%3e%3cpath fill='white' d='M414.8 40.79L286.8 488.8C281.9 505.8 264.2 515.6 247.2 510.8C230.2 505.9 220.4 488.2 225.2 471.2L353.2 23.21C358.1 6.216 375.8-3.624 392.8 1.232C409.8 6.087 419.6 23.8 414.8 40.79H414.8zM518.6 121.4L630.6 233.4C643.1 245.9 643.1 266.1 630.6 278.6L518.6 390.6C506.1 403.1 485.9 403.1 473.4 390.6C460.9 378.1 460.9 357.9 473.4 345.4L562.7 256L473.4 166.6C460.9 154.1 460.9 133.9 473.4 121.4C485.9 108.9 506.1 108.9 518.6 121.4V121.4zM166.6 166.6L77.25 256L166.6 345.4C179.1 357.9 179.1 378.1 166.6 390.6C154.1 403.1 133.9 403.1 121.4 390.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4L121.4 121.4C133.9 108.9 154.1 108.9 166.6 121.4C179.1 133.9 179.1 154.1 166.6 166.6V166.6z'/%3e%3c/svg%3e";

var aspectRatios$1 = ['wide', 'narrow', 'square', 'portrait'];
editor.contentElementTypes.register('iframeEmbed', {
  pictogram: img$f,
  category: 'interactive',
  featureName: 'iframe_embed_content_element',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry;
    this.tab('general', function () {
      this.input('source', TextInputView);
      this.input('requireConsent', CheckBoxInputView);
      this.view(InfoBoxView, {
        level: 'error',
        text: I18n.t('pageflow_scrolled.editor.content_elements.iframeEmbed.help_texts.missingConsentVendor'),
        visibleBinding: ['source', 'requireConsent'],
        visible: function visible(_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
            source = _ref3[0],
            requireConsent = _ref3[1];
          return source && requireConsent && !entry.consentVendors.fromUrl(source);
        }
      });
      this.input('title', TextInputView);
      this.input('aspectRatio', SelectInputView, {
        values: aspectRatios$1,
        disabledBinding: 'autoResize'
      });
      this.input('portraitAspectRatio', SelectInputView, {
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' + 'content_elements.iframeEmbed.' + 'attributes.portraitAspectRatio.blank',
        values: aspectRatios$1,
        disabledBinding: 'autoResize'
      });
      this.input('autoResize', CheckBoxInputView);
      this.view(InfoBoxView, {
        level: 'info',
        text: I18n.t('pageflow_scrolled.editor.content_elements.iframeEmbed.help_texts.autoResize'),
        visibleBinding: 'autoResize'
      });
      this.input('scale', SelectInputView, {
        values: ['p100', 'p75', 'p50', 'p33']
      });
      this.group('ContentElementPosition', {
        entry: entry
      });
      this.view(SeparatorView);
      this.group('ContentElementCaption', {
        entry: entry
      });
    });
  }
});

var css$6 = ".ItemsListView-module_listContainer__2XDCy {\n}\n";
var styles$6 = {"listContainer":"ItemsListView-module_listContainer__2XDCy"};
styleInject(css$6);

var ItemsListView = Marionette.Layout.extend({
  template: function template(data) {
    return "\n    <div class='".concat(styles$6.listContainer, "'></div>\n    <button class=\"").concat(buttonStyles.addButton, "\">\n      ").concat(I18n.t('pageflow_scrolled.editor.content_elements.imageGallery.items.add'), "\n    </button>\n  ");
  },
  regions: cssModulesUtils.ui(styles$6, 'listContainer'),
  events: cssModulesUtils.events(buttonStyles, {
    'click addButton': function clickAddButton() {
      this.collection.selectImage();
    }
  }),
  onRender: function onRender() {
    var _this = this;
    this.listContainer.show(new ListView({
      label: I18n.t('pageflow_scrolled.editor.content_elements.imageGallery.items.label'),
      collection: this.collection,
      sortable: true,
      onEdit: function onEdit(model) {
        editor.navigate("/scrolled/imageGalleries/".concat(_this.options.contentElement.id, "/").concat(model.id), {
          trigger: true
        });
      },
      onRemove: function onRemove(model) {
        return _this.collection.remove(model);
      }
    }));
  }
});

var Item = Backbone.Model.extend({
  mixins: [transientReferences],
  thumbnailFile: function thumbnailFile() {
    var _this$imageFile;
    return (_this$imageFile = this.imageFile()) === null || _this$imageFile === void 0 ? void 0 : _this$imageFile.thumbnailFile();
  },
  title: function title() {
    var _this$imageFile2;
    return (_this$imageFile2 = this.imageFile()) === null || _this$imageFile2 === void 0 ? void 0 : _this$imageFile2.title();
  },
  imageFile: function imageFile() {
    return this.collection.entry.imageFiles.getByPermaId(this.get('image'));
  }
});

var ItemsCollection = Backbone.Collection.extend({
  model: Item,
  comparator: 'position',
  initialize: function initialize(models, options) {
    this.entry = options.entry;
    this.contentElement = options.contentElement;
    this.listenTo(this, 'add change remove sort', this.updateConfiguration);
    this.listenTo(this, 'remove', this.pruneCaptions);
  },
  updateConfiguration: function updateConfiguration() {
    this.contentElement.configuration.set('items', this.toJSON());
  },
  pruneCaptions: function pruneCaptions() {
    this.contentElement.configuration.set('captions', _.pick.apply(_, [this.contentElement.configuration.get('captions') || {}].concat(_toConsumableArray(this.pluck('id')))));
  },
  selectImage: function selectImage() {
    editor$1.selectFile('image_files', 'newImageGalleryItem', {
      id: this.contentElement.id
    });
  },
  addWithId: function addWithId(imageFile) {
    this.add({
      id: this.length ? Math.max.apply(Math, _toConsumableArray(this.pluck('id'))) + 1 : 1,
      image: imageFile.get('perma_id')
    });
  },
  saveOrder: function saveOrder() {}
});
ItemsCollection.forContentElement = function (contentElement, entry) {
  return new ItemsCollection(contentElement.configuration.get('items') || [], {
    entry: entry,
    contentElement: contentElement
  });
};
var FileSelectionHandler = function FileSelectionHandler(options) {
  var contentElement = options.entry.contentElements.get(options.id);
  this.call = function (file) {
    ItemsCollection.forContentElement(contentElement).addWithId(file);
  };
  this.getReferer = function () {
    return '/scrolled/content_elements/' + contentElement.id;
  };
};
editor$1.registerFileSelectionHandler('newImageGalleryItem', FileSelectionHandler);

var SidebarRouter$2 = Marionette.AppRouter.extend({
  appRoutes: {
    'scrolled/imageGalleries/:id/:item_id': 'item'
  }
});

var SidebarEditItemView = Marionette.Layout.extend({
  template: function template(data) {
    return "\n    <a class=\"back\">".concat(I18n.t('pageflow_scrolled.editor.content_elements.imageGallery.edit_item.back'), "</a>\n    <a class=\"destroy\">").concat(I18n.t('pageflow_scrolled.editor.content_elements.imageGallery.edit_item.destroy'), "</a>\n\n    <div class='form_container'></div>\n  ");
  },
  regions: {
    formContainer: '.form_container'
  },
  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroyLink'
  },
  onRender: function onRender() {
    var options = this.options;
    var configurationEditor = new ConfigurationEditorView({
      model: this.model,
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.content_elements.imageGallery.edit_item.attributes'],
      tabTranslationKeyPrefix: 'pageflow_scrolled.editor.content_elements.imageGallery.edit_item.tabs'
    });
    configurationEditor.tab('item', function () {
      this.input('image', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'imageGalleryItem',
        fileSelectionHandlerOptions: {
          contentElementId: options.contentElement.get('id')
        },
        positioning: false
      });
      this.input('portraitImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'imageGalleryItem',
        fileSelectionHandlerOptions: {
          contentElementId: options.contentElement.get('id')
        },
        positioning: false
      });
    });
    this.formContainer.show(configurationEditor);
  },
  goBack: function goBack() {
    editor$1.navigate("/scrolled/content_elements/".concat(this.options.contentElement.get('id')), {
      trigger: true
    });
  },
  destroyLink: function destroyLink() {
    if (window.confirm(I18n.t('pageflow_scrolled.editor.content_elements.imageGallery.edit_item.confirm_delete_link'))) {
      this.options.collection.remove(this.model);
      this.goBack();
    }
  }
});

var SidebarController$2 = Marionette.Controller.extend({
  initialize: function initialize(options) {
    this.entry = options.entry;
    this.region = options.region;
  },
  item: function item(id, itemId) {
    var contentElement = this.entry.contentElements.get(id);
    var itemsCollection = ItemsCollection.forContentElement(contentElement, this.entry);
    this.region.show(new SidebarEditItemView({
      model: itemsCollection.get(itemId),
      collection: itemsCollection,
      entry: this.entry,
      contentElement: contentElement
    }));
  }
});

var img$g = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3e%3c!--! Font Awesome Pro 6.4.0 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons%2c Inc. --%3e%3cpath fill='white' d='M160 32c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160zM396 138.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320H328 280 200c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6 56-84C360.5 132 368 128 376 128s15.5 4 20 10.7zM192 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120z'/%3e%3c/svg%3e";

editor.registerSideBarRouting({
  router: SidebarRouter$2,
  controller: SidebarController$2
});
editor.contentElementTypes.register('imageGallery', {
  pictogram: img$g,
  category: 'media',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry,
      contentElement = _ref.contentElement;
    this.tab('general', function () {
      this.view(ItemsListView, {
        contentElement: contentElement,
        collection: ItemsCollection.forContentElement(this.model.parent, entry)
      });
      this.input('displayPeeks', CheckBoxInputView$1, {
        storeInverted: 'hidePeeks'
      });
      this.input('displayPaginationIndicator', CheckBoxInputView$1);
      this.input('enableFullscreenOnDesktop', CheckBoxInputView$1, {
        disabledBinding: ['position', 'width'],
        disabled: function disabled() {
          return contentElement.getWidth() === contentElementWidths.full;
        },
        displayUncheckedIfDisabled: true
      });
      this.group('ContentElementPosition', {
        entry: entry
      });
      this.view(SeparatorView$1);
      this.group('ContentElementCaption', {
        entry: entry,
        disableWhenNoCaption: false
      });
      this.group('ContentElementInlineFileRightsSettings', {
        entry: entry,
        disableWhenNoFileRights: false
      });
    });
  },
  defaultConfig: {
    displayPaginationIndicator: true
  }
});
editor.registerFileSelectionHandler('imageGalleryItem', function (options) {
  var contentElement = options.entry.contentElements.get(options.contentElementId);
  var items = ItemsCollection.forContentElement(contentElement, options.entry);
  this.call = function (file) {
    items.get(options.id).setReference(options.attributeName, file);
  };
  this.getReferer = function () {
    return '/scrolled/imageGalleries/' + contentElement.id + '/' + options.id;
  };
});

var img$h = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e %3cpath fill='white' d='M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z'/%3e%3c/svg%3e";

editor.contentElementTypes.register('twitterEmbed', {
  pictogram: img$h,
  category: 'media',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry;
    this.tab('general', function () {
      this.input('url', UrlInputView, {
        supportedHosts: ['http://twitter.com', 'https://twitter.com', 'http://x.com', 'https://x.com'],
        displayPropertyName: 'displayTweetId',
        required: true,
        permitHttps: true
      });
      this.group('ContentElementPosition', {
        entry: entry
      });
      this.input('hideConversation', CheckBoxInputView);
      this.input('hideMedia', CheckBoxInputView);
    });
  },
  defaultConfig: {
    caption: 'Add caption here'
  }
});

var img$i = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3c!--!Font Awesome Free 6.5.2 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons%2c Inc.--%3e%3cpath fill='white' d='M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z'/%3e%3c/svg%3e";

editor.contentElementTypes.register('tikTokEmbed', {
  pictogram: img$i,
  category: 'media',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['md', 'full'],
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry;
    this.tab('general', function () {
      this.input('url', UrlInputView, {
        supportedHosts: ['https://www.tiktok.com'],
        displayPropertyName: 'displayUrl',
        required: true,
        permitHttps: true
      });
      this.group('ContentElementPosition', {
        entry: entry
      });
    });
  },
  defaultConfig: {}
});

var img$j = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='UTF-8' standalone='no'%3f%3e%3csvg xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' version='1.1'%3e %3cpath style='fill:white%3bstroke-width:1.0715934' d='M 154.45629%2c72.962988 C 141.76916%2c73.980674 134.17753%2c85.77696 126.39089%2c94.31369 115.08265%2c105.89861 104.03984%2c117.73757 92.93941%2c129.52047 75.031239%2c111.21828 59.122369%2c90.77981 39.104383%2c74.658023 24.482281%2c67.834512 6.4140221%2c83.81238 10.775786%2c99.1746 c 2.708951%2c12.98866 15.286417%2c19.97415 22.964661%2c29.74046 17.657732%2c17.41285 32.403074%2c38.12856 52.621136%2c52.73529 10.829773%2c3.83939 22.062597%2c-3.51996 28.134937%2c-12.18527 19.44195%2c-22.50249 42.21653%2c-42.18327 59.90279%2c-66.14032 5.6424%2c-13.25737 -5.31055%2c-30.615753 -19.94302%2c-30.361772 z' /%3e %3cpath style='fill:white' d='M 256%2c428 H 31.999999 C 14.329999%2c428 -9.5000001e-7%2c442.33 -9.5000001e-7%2c460 -9.5000001e-7%2c477.67 14.329999%2c492 31.999999%2c492 H 256 c 17.7%2c0 32%2c-14.33 32%2c-32 0%2c-17.67 -14.3%2c-32 -32%2c-32 z M -9.5000001e-7%2c332 C -9.5000001e-7%2c349.7 14.329999%2c364 31.999999%2c364 H 416 c 17.7%2c0 32%2c-14.3 32%2c-32 0%2c-17.7 -14.3%2c-32 -32%2c-32 H 31.999999 C 14.329999%2c300 -9.5000001e-7%2c314.3 -9.5000001e-7%2c332 Z' /%3e %3cpath style='fill:white%3bstroke:white%3bstroke-width:0' d='m 356.05605%2c1.671899 c -22.75276%2c2.300391 -47.49513%2c-4.661754 -68.50543%2c6.450454 -16.00534%2c8.484395 -29.74636%2c27.036262 -24.98608%2c45.803882 5.50667%2c15.699356 29.05588%2c21.427535 39.82967%2c7.900392 4.46727%2c-4.523763 5.45002%2c-13.464333 13.29935%2c-12.285569 15.47565%2c-0.207336 30.89377%2c0.32159 46.37678%2c-0.223975 7.3323%2c-0.346315 15.23462%2c5.874856 12.62272%2c13.740223 -2.68086%2c9.147994 -13.45058%2c10.823444 -20.24491%2c15.836144 -11.40111%2c6.6584 -24.83231%2c11.40873 -32.94777%2c22.30075 -5.41404%2c11.18313 -4.76974%2c25.17905 -0.0141%2c36.40876 8.15241%2c13.79679 31.57231%2c15.50575 40.17388%2c0.85347 4.19853%2c-4.46787 1.87713%2c-12.57946 8.75385%2c-14.22118 18.79687%2c-10.20424 40.72904%2c-20.78924 48.43263%2c-42.36648 C 431.32621%2c52.120851 413.71956%2c13.332394 382.01823%2c4.732093 373.62266%2c2.216616 364.78493%2c1.519639 356.05609%2c1.671899 Z M 341.22896%2c172.48634 c -21.90876%2c-0.63629 -38.00737%2c26.58485 -26.67177%2c45.4856 9.43025%2c18.07827 37.60246%2c22.17393 50.69123%2c5.8469 12.093%2c-13.5735 9.43272%2c-37.5803 -6.86539%2c-46.64791 -5.10378%2c-3.1728 -11.1363%2c-4.88155 -17.15407%2c-4.68459 z' /%3e%3c/svg%3e";

editor.contentElementTypes.register('question', {
  pictogram: img$j,
  supportedPositions: ['inline'],
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry,
      contentElement = _ref.contentElement;
    this.tab('general', function () {
      var modelDelegator = entry.createLegacyTypographyVariantDelegator({
        model: this.model,
        paletteColorPropertyName: 'color'
      });
      this.group('ContentElementTypographyVariant', {
        entry: entry,
        model: modelDelegator,
        getPreviewConfiguration: function getPreviewConfiguration(configuration, typographyVariant) {
          return _objectSpread2(_objectSpread2({}, configuration), {}, {
            expandByDefault: true,
            typographyVariant: typographyVariant
          });
        }
      });
      this.group('ContentElementTypographySize', {
        entry: entry,
        model: modelDelegator,
        getPreviewConfiguration: function getPreviewConfiguration(configuration, typographySize) {
          return _objectSpread2(_objectSpread2({}, configuration), {}, {
            expandByDefault: true,
            // Ensure size in preview is not overridden by legacy variant
            typographyVariant: modelDelegator.get('typographyVariant'),
            typographySize: typographySize
          });
        }
      });
      this.group('PaletteColor', {
        entry: entry,
        propertyName: 'color'
      });
      this.group('PaletteColor', {
        entry: entry,
        propertyName: 'answerColor'
      });
      this.input('expandByDefault', CheckBoxInputView);
    });
  }
});

var img$k = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='white' d='M181.3 32.4c17.4 2.9 29.2 19.4 26.3 36.8L197.8 128h95.1l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3s29.2 19.4 26.3 36.8L357.8 128H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H347.1L325.8 320H384c17.7 0 32 14.3 32 32s-14.3 32-32 32H315.1l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.8-58.7H155.1l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8L90.2 384H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l21.3-128H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3zM187.1 192L165.8 320h95.1l21.3-128H187.1z'/%3e%3c/svg%3e";

editor.contentElementTypes.register('counter', {
  category: 'data',
  pictogram: img$k,
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],
  defaultConfig: {
    targetValue: 100,
    countingSpeed: 'medium',
    textSize: 'medium'
  },
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry;
    var locale = entry.metadata.get('locale');
    this.tab('general', function () {
      this.input('targetValue', NumberInputView, {
        locale: locale
      });
      this.input('decimalPlaces', SelectInputView, {
        values: [0, 1, 2, 3],
        texts: [0, 1, 2, 3].map(function (i) {
          return 0 .toLocaleString(locale, {
            minimumFractionDigits: i
          });
        })
      });
      this.input('thousandsSeparators', CheckBoxInputView, {
        storeInverted: 'hideThousandsSeparators'
      });
      this.input('unit', TextInputView);
      this.input('unitPlacement', SelectInputView, {
        values: ['trailing', 'leading']
      });
      this.view(SeparatorView);
      this.input('entranceAnimation', SelectInputView, {
        values: ['none', 'fadeIn', 'fadeInFromBelow', 'fadeInFromAbove', 'fadeInScaleUp', 'fadeInScaleDown']
      });
      this.input('countingSpeed', SelectInputView, {
        values: ['none', 'slow', 'medium', 'fast']
      });
      this.input('startValue', NumberInputView, {
        locale: locale,
        visibleBinding: 'countingSpeed',
        visible: function visible(countingSpeed) {
          return countingSpeed !== 'none';
        }
      });
      this.view(SeparatorView);
      this.input('textSize', SelectInputView, {
        values: ['large', 'medium', 'small', 'verySmall']
      });
      this.group('ContentElementTypographyVariant', {
        entry: entry,
        getPreviewConfiguration: function getPreviewConfiguration(configuration, typographyVariant) {
          return _objectSpread2(_objectSpread2({}, configuration), {}, {
            typographyVariant: typographyVariant,
            entranceAnimation: 'none',
            countingSpeed: 'none',
            textSize: 'small',
            position: 'inline'
          });
        }
      });
      this.group('PaletteColor', {
        propertyName: 'numberColor',
        entry: entry
      });
      this.group('ContentElementPosition', {
        entry: entry
      });
    });
  }
});

var img$l = "data:image/svg+xml,%3csvg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='quote-right' class='svg-inline--fa fa-quote-right fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='-50 -50 612 612'%3e%3cpath fill='white' d='M464 32H336c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48zm-288 0H48C21.5 32 0 53.5 0 80v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48z'%3e%3c/path%3e%3c/svg%3e";

editor.contentElementTypes.register('quote', {
  pictogram: img$l,
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xs', 'xl'],
  defaultConfig: {
    textSize: 'medium'
  },
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry;
    this.tab('general', function () {
      this.group('ContentElementVariant', {
        entry: entry
      });
      this.input('textSize', SelectInputView, {
        values: ['large', 'medium', 'small', 'verySmall']
      });
      this.group('ContentElementPosition', {
        entry: entry
      });
      this.group('PaletteColor', {
        propertyName: 'color',
        entry: entry
      });
      this.view(SeparatorView);
      this.view(InfoBoxView, {
        text: I18n.t('pageflow_scrolled.editor.content_elements.textBlock.help_texts.shortcuts')
      });
    });
  }
});

var img$m = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3c!--!Font Awesome Free 6.7.1 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons%2c Inc.--%3e%3cpath fill='white' d='M 446%2c37.9 C 341%2c38.2 236%2c37.8 132%2c38 106%2c38.4 80.7%2c37.3 55.3%2c38.5 26.6%2c42.6 3.13%2c70.8 6.21%2c100 5.84%2c203 5.94%2c305 6.15%2c408 c -0.18%2c12 0.3%2c26 7.25%2c36 11.2%2c20 34.2%2c33 57%2c30 128.6%2c0 256.6%2c0 384.6%2c0 30%2c-4 55%2c-34 51%2c-64 0%2c-107 0%2c-215 0%2c-322.2 C 501%2c59.7 475%2c36.7 446%2c37.9 Z M 60%2c90 c 24.7%2c0 49%2c0 74%2c0 0%2c25 0%2c51 0%2c76 -25%2c0 -50.7%2c0 -76%2c0 0%2c-25 0%2c-51 0%2c-76 h 1 z m 128%2c0 c 89%2c0 177%2c0 266%2c0 0%2c25 0%2c51 0%2c76 -89%2c0 -179%2c0 -268%2c0 0%2c-25 0%2c-51 0%2c-76 h 1 z M 60%2c218 c 24.7%2c0 49%2c0 74%2c0 0%2c25 0%2c51 0%2c76 -25%2c0 -50.7%2c0 -76%2c0 0%2c-25 0%2c-51 0%2c-76 h 1 z m 128%2c0 c 89%2c0 177%2c0 266%2c0 0%2c25 0%2c51 0%2c76 -89%2c0 -179%2c0 -268%2c0 0%2c-25 0%2c-51 0%2c-76 h 1 z M 60%2c346 c 24.7%2c0 49%2c0 74%2c0 0%2c25 0%2c51 0%2c76 -25%2c0 -50.7%2c0 -76%2c0 0%2c-25 0%2c-51 0%2c-76 h 1 z m 128%2c0 c 89%2c0 177%2c0 266%2c0 0%2c25 0%2c51 0%2c76 -89%2c0 -179%2c0 -268%2c0 0%2c-25 0%2c-51 0%2c-76 h 1 z' /%3e%3c/svg%3e";

editor.contentElementTypes.register('infoTable', {
  pictogram: img$m,
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['s', 'xl'],
  configurationEditor: function configurationEditor(_ref) {
    var entry = _ref.entry,
      contentElement = _ref.contentElement;
    this.tab('general', function () {
      this.input('labelColumnAlign', SelectInputView, {
        values: ['auto', 'left', 'center', 'right']
      });
      this.input('valueColumnAlign', SelectInputView, {
        values: ['auto', 'left', 'center', 'right']
      });
      this.input('singleColumnInPhoneLayout', CheckBoxInputView);
      this.input('singleColumnAlign', SelectInputView, {
        values: ['auto', 'left', 'center', 'right'],
        visibleBinding: 'singleColumnInPhoneLayout'
      });
      this.view(SeparatorView);
      this.group('PaletteColor', {
        propertyName: 'labelColor',
        entry: entry
      });
      this.group('PaletteColor', {
        propertyName: 'valueColor',
        entry: entry
      });
      this.view(SeparatorView);
      this.group('ContentElementPosition', {
        entry: entry
      });
      this.view(SeparatorView);
      this.view(InfoBoxView, {
        text: I18n.t('pageflow_scrolled.editor.content_elements.infoTable.help_texts.shortcuts')
      });
    });
  }
});
