import 'regenerator-runtime';
import { ae as ContentElementEditorCommandEmitterContext, b as usePostMessageListener, af as MotifAreaVisibilityProvider, ag as ForcePaddingContext, ah as ContentElementConfigurationUpdateContext, D as api, l as widths, ai as LayoutWithoutInlineEditing, ad as SectionThumbnail, aj as renderElement, ak as renderLeaf$1, H as useContentElementEditorCommandSubscription, a0 as Text$1, r as frontendStyles } from './EditableInlineText.module-b1f7e77b.js';
import 'pageflow/frontend';
import React, { useMemo, useState, useCallback, useContext, useRef, useEffect, createContext, memo } from 'react';
import { _ as _slicedToArray, p as useEntryStateDispatch, b as _defineProperty, e as _objectWithoutProperties, u as useI18n, D as updateContentElementConfiguration, o as useChapter, i as useFile, a as _objectSpread2, n as _toConsumableArray, F as _unsupportedIterableToArray } from './i18n-71c39823.js';
import classNames from 'classnames';
import { C as ContentElementEditorStateContext, a as useContentElementEditorState } from './useContentElementEditorState-245f1986.js';
import './createSuper-d0f30da3.js';
import BackboneEvents from 'backbone-events-standalone';
import 'use-context-selector';
import 'reselect';
import 'slugify';
import 'i18n-js';
import 'striptags';
import 'react-measure';
import { P as PhonePlatformContext } from './PhonePlatformContext-b28d991a.js';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Range, Editor, Transforms, Node, Element, Path, Text, createEditor } from 'slate';
import { useSlate, ReactEditor, withReact, Slate, Editable } from 'slate-react';
import debounce from 'debounce';

var Context = React.createContext({});
function EditorStateProvider(props) {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      selection = _useState2[0],
      setSelectionState = _useState2[1];

  var setSelection = useCallback(function (selection) {
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'SELECTED',
        payload: selection || {}
      }, window.location.origin);
    }

    setSelectionState(selection);
  }, []);
  var value = useMemo(function () {
    return {
      selection: selection,
      setSelection: setSelection
    };
  }, [setSelection, selection]);
  return /*#__PURE__*/React.createElement(Context.Provider, {
    value: value
  }, props.children);
}
function useEditorSelection(options) {
  var _useContext = useContext(Context),
      selection = _useContext.selection,
      setSelection = _useContext.setSelection;

  var resetSelection = useCallback(function () {
    setSelection(null);
  }, [setSelection]);
  var select = useCallback(function (selection) {
    setSelection(selection || options);
  }, [setSelection, options]);
  return useMemo(function () {
    return setSelection ? {
      range: selection === null || selection === void 0 ? void 0 : selection.range,
      isSelected: selection && options && selection.id === options.id && selection.type === options.type,
      select: select,
      resetSelection: resetSelection
    } : {};
  }, [options, selection, setSelection, select, resetSelection]);
}

function useContentElementEditorCommandEmitter() {
  return useMemo(function () {
    return Object.assign({}, BackboneEvents);
  }, []);
}
function ContentElementEditorCommandSubscriptionProvider(_ref) {
  var emitter = _ref.emitter,
      children = _ref.children;
  return /*#__PURE__*/React.createElement(ContentElementEditorCommandEmitterContext.Provider, {
    value: emitter
  }, children);
}

// the editor phone preview. Each ContentElementDecorator renders a
// `data-scrollpoint` attribute with a unique value on its wrapper
// div. Before toggling the phone preview mode, the `EntryPreviewView`
// sends a `SAVE_SCROLL_POINT` message. `getCurrentScrollPoint` looks
// through all DOM elements with `data-scrollpoint` attributes and
// stores the unique id of the element with the smallest non-negative
// y coordinate in the viewport (i.e. the first content element inside
// the viewport). `ScrollPointMessageHandler` responds with a
// `SAVED_SCROLL_POINT` message which makes `EntryPreviewView` toggle
// the preview mode. Once the preview has been resized,
// `EntryPreviewView` sends a `RESTORE_SCROLL_POINT`
// message. `restoreScrollPoint` looks up the new position of the
// element with the saved scroll point and scrolls it into view.
//
// When a content element is selected, we want to keep that element
// in the viewport instead. The `SelectionRect` therefore renders a
// `data-scrollpoint=selection` attribute. If an element with such an
// attribute is present, `getCurrentScrollPoint` prefers it over all
// other scroll points. Since text block elements render a selection
// rect around the current paragraph, scroll position is also
// preserved correctly inside long text blocks.

function ScrollPointMessageHandler() {
  var scrollPoint = useRef();
  var receiveMessage = useCallback(function (data) {
    if (data.type === 'SAVE_SCROLL_POINT') {
      scrollPoint.current = getCurrentScrollPoint();
      window.parent.postMessage({
        type: 'SAVED_SCROLL_POINT'
      }, window.location.origin);
    } else if (data.type === 'RESTORE_SCROLL_POINT') {
      if (scrollPoint.current) {
        restoreScrollPoint(scrollPoint.current);
      }
    }
  }, []);
  usePostMessageListener(receiveMessage);
  return null;
}

function getCurrentScrollPoint() {
  var scrollPointElement = getSelectionScrollPointElement() || getScrollPointElementWithMinimumTopPositionInViewport();
  return scrollPointElement === null || scrollPointElement === void 0 ? void 0 : scrollPointElement.getAttribute('data-scrollpoint');
}

function getSelectionScrollPointElement() {
  return document.querySelector('[data-scrollpoint=selection]');
}

function getScrollPointElementWithMinimumTopPositionInViewport() {
  var minTop = Infinity;
  var scrollPointElement;
  var scrollPoints = document.querySelectorAll('[data-scrollpoint]');

  for (var i = 0; i < scrollPoints.length; i++) {
    var rect = scrollPoints[i].getBoundingClientRect();

    if (rect.top > 0 && rect.top < minTop) {
      minTop = rect.top;
      scrollPointElement = scrollPoints[i];
    }
  }

  return scrollPointElement;
}

function restoreScrollPoint(name) {
  var element = document.querySelector("[data-scrollpoint=\"".concat(name, "\"]"));

  if (element) {
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 100,
      behavior: 'smooth'
    });
  }
}

function ContentDecorator(props) {
  var contentElementEditorCommandEmitter = useContentElementEditorCommandEmitter();
  return /*#__PURE__*/React.createElement(EditorStateProvider, null, /*#__PURE__*/React.createElement(MessageHandler, {
    contentElementEditorCommandEmitter: contentElementEditorCommandEmitter
  }), /*#__PURE__*/React.createElement(ScrollPointMessageHandler, null), /*#__PURE__*/React.createElement(ContentElementEditorCommandSubscriptionProvider, {
    emitter: contentElementEditorCommandEmitter
  }, /*#__PURE__*/React.createElement(DndProvider, {
    backend: HTML5Backend
  }, props.children)));
}

function MessageHandler(_ref) {
  var contentElementEditorCommandEmitter = _ref.contentElementEditorCommandEmitter;

  var _useEditorSelection = useEditorSelection(),
      select = _useEditorSelection.select;

  var dispatch = useEntryStateDispatch();
  var receiveMessage = useCallback(function (data) {
    if (data.type === 'ACTION') {
      dispatch(data.payload);
    } else if (data.type === 'SELECT') {
      select(data.payload);
    } else if (data.type === 'CONTENT_ELEMENT_EDITOR_COMMAND') {
      contentElementEditorCommandEmitter.trigger("command:".concat(data.payload.contentElementId), data.payload.command);
    }
  }, [dispatch, select, contentElementEditorCommandEmitter]);
  usePostMessageListener(receiveMessage);
  useEffect(function () {
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'READY'
      }, window.location.origin);
    }
  }, []);
  return null;
}

var styles = {"wrapper":"SectionDecorator-module_wrapper__3sTk3","selected":"SectionDecorator-module_selected__1gcmF","transitionSelected":"SectionDecorator-module_transitionSelected__Wklk6","controls":"SectionDecorator-module_controls__LVEJG","transitionToolbar-after":"SectionDecorator-module_transitionToolbar-after__2_DVO SectionDecorator-module_toolbar__2Va1D","toolbar":"SectionDecorator-module_toolbar__2Va1D","transitionToolbar-before":"SectionDecorator-module_transitionToolbar-before__KipOO SectionDecorator-module_toolbar__2Va1D"};

var styles$1 = {"wrapper":"ContentElementDecorator-module_wrapper__NQgFN"};

var styles$2 = {"Toolbar":"Toolbar-module_Toolbar__1INSj","button":"Toolbar-module_button__de5BW","activeButton":"Toolbar-module_activeButton__2sOLP","collapsible":"Toolbar-module_collapsible__3sivb"};

function Toolbar(_ref) {
  var buttons = _ref.buttons,
      onButtonClick = _ref.onButtonClick,
      iconSize = _ref.iconSize,
      collapsible = _ref.collapsible;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$2.Toolbar, _defineProperty({}, styles$2.collapsible, collapsible)),
    contentEditable: false
  }, buttons.map(function (button) {
    var Icon = button.icon;
    return /*#__PURE__*/React.createElement("button", {
      key: button.name,
      title: button.text,
      className: classNames(styles$2.button, _defineProperty({}, styles$2.activeButton, button.active)),
      onMouseDown: function onMouseDown(event) {
        event.preventDefault();
        event.stopPropagation();
        onButtonClick(button.name);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      width: iconSize,
      height: iconSize
    }));
  }));
}
Toolbar.defaultProps = {
  iconSize: 15
};

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}
var transitionIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "random",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-random"] || "fa-random") + " " + (styles["fa-w-16"] || "fa-w-16"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 01-8.773-3.812l-70.556-75.596 53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971l80 79.981zM12 176h84l52.781 56.551 53.333-57.143-70.556-75.596A11.999 11.999 0 00122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12zm372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 00-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176h32z"
  }));
});

function SectionDecorator(_ref) {
  var section = _ref.section,
      contentElements = _ref.contentElements,
      children = _ref.children;

  var _useI18n = useI18n({
    locale: 'ui'
  }),
      t = _useI18n.t;

  var _useEditorSelection = useEditorSelection({
    id: section.id,
    type: 'sectionSettings'
  }),
      isSelected = _useEditorSelection.isSelected,
      select = _useEditorSelection.select,
      resetSelection = _useEditorSelection.resetSelection;

  var transitionSelection = useEditorSelection({
    id: section.id,
    type: 'sectionTransition'
  });
  var nextTransitionSelection = useEditorSelection({
    id: section.nextSection && section.nextSection.id,
    type: 'sectionTransition'
  });
  var lastContentElement = contentElements[contentElements.length - 1];

  var _useEditorSelection2 = useEditorSelection({
    id: lastContentElement && lastContentElement.id,
    type: 'contentElement'
  }),
      isLastContentElementSelected = _useEditorSelection2.isSelected;

  function selectIfOutsideContentItem(event) {
    if (!event.target.closest(".".concat(styles$1.wrapper)) && !event.target.closest('#fullscreenRoot')) {
      isSelected ? resetSelection() : select();
    }
  }

  return /*#__PURE__*/React.createElement("div", {
    "aria-label": t('pageflow_scrolled.inline_editing.select_section'),
    className: className(isSelected, transitionSelection),
    onMouseDown: selectIfOutsideContentItem
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.controls
  }, renderEditTransitionButton({
    id: section.previousSection && section.id,
    selection: transitionSelection,
    position: 'before'
  }), renderEditTransitionButton({
    id: section.nextSection && section.nextSection.id,
    selection: nextTransitionSelection,
    position: 'after'
  })), /*#__PURE__*/React.createElement(MotifAreaVisibilityProvider, {
    visible: isSelected
  }, /*#__PURE__*/React.createElement(ForcePaddingContext.Provider, {
    value: isLastContentElementSelected || isSelected
  }, children)));
}

function className(isSectionSelected, transitionSelection) {
  var _classNames;

  return classNames(styles.wrapper, (_classNames = {}, _defineProperty(_classNames, styles.selected, isSectionSelected), _defineProperty(_classNames, styles.transitionSelected, transitionSelection.isSelected), _classNames));
}

function renderEditTransitionButton(_ref2) {
  var id = _ref2.id,
      position = _ref2.position,
      selection = _ref2.selection;

  if (!id) {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: styles["transitionToolbar-".concat(position)]
  }, /*#__PURE__*/React.createElement(EditTransitionButton, {
    id: id,
    selection: selection,
    position: position
  }));
}

function EditTransitionButton(_ref3) {
  var id = _ref3.id,
      position = _ref3.position,
      selection = _ref3.selection;

  var _useI18n2 = useI18n({
    locale: 'ui'
  }),
      t = _useI18n2.t;

  return /*#__PURE__*/React.createElement(EditSectionButton, {
    id: id,
    selection: selection,
    text: t("pageflow_scrolled.inline_editing.edit_section_transition_".concat(position)),
    icon: transitionIcon
  });
}

function EditSectionButton(_ref4) {
  var id = _ref4.id,
      selection = _ref4.selection,
      icon = _ref4.icon,
      text = _ref4.text;
  return /*#__PURE__*/React.createElement(Toolbar, {
    buttons: [{
      name: 'button',
      active: selection.isSelected,
      icon: icon,
      text: text
    }],
    iconSize: 20,
    onButtonClick: function onButtonClick() {
      return selection.select();
    }
  });
}

var styles$3 = {"selectionWidth":"1px","selectionPadding":"-6px","selectionPadding2":"-0.5em","main":"SelectionRect-module_main__3AOhG","draggable":"SelectionRect-module_draggable__3Qp53","full":"SelectionRect-module_full__3tsQF","selected":"SelectionRect-module_selected__1PhM6","toolbar":"SelectionRect-module_toolbar__3nPrd","insert":"SelectionRect-module_insert__w0Tl0","insertHovered":"SelectionRect-module_insertHovered__VTsDD","start":"SelectionRect-module_start__3_nAf","insert-before":"SelectionRect-module_insert-before__2Tyq5 SelectionRect-module_insert__w0Tl0","end":"SelectionRect-module_end__3qOoK","insert-after":"SelectionRect-module_insert-after__3FJ4R SelectionRect-module_insert__w0Tl0","insertButton":"SelectionRect-module_insertButton__1g-ZG","dragHandle":"SelectionRect-module_dragHandle__2vVhP"};

function _extends$1() {
  _extends$1 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$1.apply(this, arguments);
}
var PlusIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends$1({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M256 0C114.844 0 0 114.839 0 256s114.844 256 256 256 256-114.839 256-256S397.156 0 256 0zm133.594 272.699H272.699v116.895c0 9.225-7.48 16.699-16.699 16.699-9.219 0-16.699-7.475-16.699-16.699V272.699H122.406c-9.219 0-16.699-7.475-16.699-16.699 0-9.225 7.48-16.699 16.699-16.699h116.895V122.406c0-9.225 7.48-16.699 16.699-16.699 9.219 0 16.699 7.475 16.699 16.699v116.895h116.895c9.219 0 16.699 7.475 16.699 16.699.001 9.225-7.48 16.699-16.699 16.699z"
  }));
});

function _extends$2() {
  _extends$2 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$2.apply(this, arguments);
}
var MoveIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends$2({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "arrows-alt",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-arrows-alt"] || "fa-arrows-alt") + " " + (styles["fa-w-16"] || "fa-w-16"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M352.201 425.775l-79.196 79.196c-9.373 9.373-24.568 9.373-33.941 0l-79.196-79.196c-15.119-15.119-4.411-40.971 16.971-40.97h51.162L228 284H127.196v51.162c0 21.382-25.851 32.09-40.971 16.971L7.029 272.937c-9.373-9.373-9.373-24.569 0-33.941L86.225 159.8c15.119-15.119 40.971-4.411 40.971 16.971V228H228V127.196h-51.23c-21.382 0-32.09-25.851-16.971-40.971l79.196-79.196c9.373-9.373 24.568-9.373 33.941 0l79.196 79.196c15.119 15.119 4.411 40.971-16.971 40.971h-51.162V228h100.804v-51.162c0-21.382 25.851-32.09 40.97-16.971l79.196 79.196c9.373 9.373 9.373 24.569 0 33.941L425.773 352.2c-15.119 15.119-40.971 4.411-40.97-16.971V284H284v100.804h51.23c21.382 0 32.09 25.851 16.971 40.971z"
  }));
});

function SelectionRect(props) {
  var _classNames;

  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$3.main, (_classNames = {}, _defineProperty(_classNames, styles$3.full, props.full), _defineProperty(_classNames, styles$3.selected, props.selected), _defineProperty(_classNames, styles$3.draggable, props.drag), _defineProperty(_classNames, styles$3.start, props.selected && props.start), _defineProperty(_classNames, styles$3.end, props.selected && props.end), _classNames)),
    "aria-label": props.ariaLabel,
    "data-scrollpoint": props.scrollPoint ? 'selection' : undefined,
    onClick: props.onClick
  }, renderDragHandle(props), renderToolbar(props), /*#__PURE__*/React.createElement(InsertButton, Object.assign({}, props, {
    at: "before"
  })), props.children, /*#__PURE__*/React.createElement(InsertButton, Object.assign({}, props, {
    at: "after"
  })));
}

function InsertButton(props) {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      insertHovered = _useState2[0],
      setInsertHovered = _useState2[1];

  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$3["insert-".concat(props.at)], _defineProperty({}, styles$3.insertHovered, insertHovered)),
    contentEditable: false
  }, /*#__PURE__*/React.createElement("button", {
    className: styles$3.insertButton,
    title: props.insertButtonTitles && props.insertButtonTitles[props.at],
    onClick: function onClick() {
      return props.onInsertButtonClick(props.at);
    },
    onMouseEnter: function onMouseEnter() {
      return setInsertHovered(true);
    },
    onMouseLeave: function onMouseLeave() {
      return setInsertHovered(false);
    }
  }, /*#__PURE__*/React.createElement(PlusIcon, {
    width: 15,
    height: 15,
    fill: "currentColor"
  })));
}

function renderDragHandle(_ref) {
  var drag = _ref.drag,
      dragHandleTitle = _ref.dragHandleTitle;

  if (!drag) {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    ref: drag,
    className: styles$3.dragHandle,
    title: dragHandleTitle
  }, /*#__PURE__*/React.createElement(MoveIcon, null));
}

function renderToolbar(_ref2) {
  var toolbarButtons = _ref2.toolbarButtons,
      onToolbarButtonClick = _ref2.onToolbarButtonClick,
      start = _ref2.start;

  if (toolbarButtons && start) {
    return /*#__PURE__*/React.createElement("div", {
      className: styles$3.toolbar
    }, /*#__PURE__*/React.createElement(Toolbar, {
      buttons: toolbarButtons,
      collapsible: true,
      onButtonClick: onToolbarButtonClick
    }));
  }
}

SelectionRect.defaultProps = {
  start: true,
  end: true
};

var styles$4 = {"target":"DropTargets-module_target__Z2N2d","isOver":"DropTargets-module_isOver__3ksFy","before":"DropTargets-module_before__cAXo1 DropTargets-module_target__Z2N2d","after":"DropTargets-module_after__2Q8QU DropTargets-module_target__Z2N2d"};

function DropTargets(_ref) {
  var accept = _ref.accept,
      _canDrop = _ref.canDrop,
      onDrop = _ref.onDrop;

  var _useDrop = useDrop({
    accept: accept,
    canDrop: function canDrop(item) {
      return _canDrop({
        at: 'before',
        id: item.id
      });
    },
    collect: function collect(monitor) {
      return {
        canDropBefore: monitor.canDrop(),
        isBefore: monitor.isOver() && monitor.canDrop()
      };
    },
    drop: function drop(item) {
      return onDrop({
        at: 'before',
        id: item.id,
        range: item.range
      });
    }
  }),
      _useDrop2 = _slicedToArray(_useDrop, 2),
      _useDrop2$ = _useDrop2[0],
      canDropBefore = _useDrop2$.canDropBefore,
      isBefore = _useDrop2$.isBefore,
      dropBefore = _useDrop2[1];

  var _useDrop3 = useDrop({
    accept: accept,
    canDrop: function canDrop(item) {
      return _canDrop({
        at: 'after',
        id: item.id
      });
    },
    collect: function collect(monitor) {
      return {
        canDropAfter: monitor.canDrop(),
        isAfter: monitor.isOver() && monitor.canDrop()
      };
    },
    drop: function drop(item) {
      return onDrop({
        at: 'after',
        id: item.id,
        range: item.range
      });
    }
  }),
      _useDrop4 = _slicedToArray(_useDrop3, 2),
      _useDrop4$ = _useDrop4[0],
      canDropAfter = _useDrop4$.canDropAfter,
      isAfter = _useDrop4$.isAfter,
      dropAfter = _useDrop4[1];

  return /*#__PURE__*/React.createElement(React.Fragment, null, canDropBefore && /*#__PURE__*/React.createElement("div", {
    ref: dropBefore,
    "data-testid": "drop-before",
    className: classNames(styles$4.before, _defineProperty({}, styles$4.isOver, isBefore))
  }), canDropAfter && /*#__PURE__*/React.createElement("div", {
    ref: dropAfter,
    "data-testid": "drop-after",
    title: "bar",
    className: classNames(styles$4.after, _defineProperty({}, styles$4.isOver, isAfter))
  }));
}

function postInsertContentElementMessage(_ref) {
  var id = _ref.id,
      at = _ref.at,
      splitPoint = _ref.splitPoint;
  window.parent.postMessage({
    type: 'INSERT_CONTENT_ELEMENT',
    payload: {
      id: id,
      at: at,
      splitPoint: splitPoint
    }
  }, window.location.origin);
}
function postMoveContentElementMessage(_ref2) {
  var id = _ref2.id,
      range = _ref2.range,
      to = _ref2.to;
  window.parent.postMessage({
    type: 'MOVE_CONTENT_ELEMENT',
    payload: {
      id: id,
      range: range,
      to: to
    }
  }, window.location.origin);
}
function postUpdateContentElementMessage(_ref3) {
  var id = _ref3.id,
      configuration = _ref3.configuration;
  window.parent.postMessage({
    type: 'UPDATE_CONTENT_ELEMENT',
    payload: {
      id: id,
      configuration: configuration
    }
  }, window.location.origin);
}
function postUpdateTransientContentElementStateMessage(_ref4) {
  var id = _ref4.id,
      state = _ref4.state;
  window.parent.postMessage({
    type: 'UPDATE_TRANSIENT_CONTENT_ELEMENT_STATE',
    payload: {
      id: id,
      state: state
    }
  }, window.location.origin);
}
function postSelectLinkDestinationMessage() {
  window.parent.postMessage({
    type: 'SELECT_LINK_DESTINATION'
  }, window.location.origin);
}

function ContentElementConfigurationUpdateProvider(_ref) {
  var id = _ref.id,
      permaId = _ref.permaId,
      children = _ref.children;
  var dispatch = useEntryStateDispatch();
  var update = useCallback(function (configuration) {
    postUpdateContentElementMessage({
      id: id,
      configuration: configuration
    });
    updateContentElementConfiguration({
      dispatch: dispatch,
      permaId: permaId,
      configuration: configuration
    });
  }, [dispatch, permaId, id]);
  return /*#__PURE__*/React.createElement(ContentElementConfigurationUpdateContext.Provider, {
    value: update
  }, children);
}

function ContentElementEditorStateProvider(_ref) {
  var id = _ref.id,
      children = _ref.children;

  var _useEditorSelection = useEditorSelection({
    id: id,
    type: 'contentElement'
  }),
      isSelected = _useEditorSelection.isSelected,
      select = _useEditorSelection.select,
      range = _useEditorSelection.range;

  var previousTransientState = useRef({});
  var setTransientState = useCallback(function (state) {
    if (!shallowEqual(state, previousTransientState.current)) {
      postUpdateTransientContentElementStateMessage({
        id: id,
        state: state
      });
      previousTransientState.current = state;
    }
  }, [id]);
  var value = useMemo(function () {
    return {
      isEditable: true,
      select: select,
      isSelected: isSelected,
      range: range,
      setTransientState: setTransientState
    };
  }, [select, isSelected, range, setTransientState]);
  return /*#__PURE__*/React.createElement(ContentElementEditorStateContext.Provider, {
    value: value
  }, children);
}

function shallowEqual(obj1, obj2) {
  return Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every(function (key) {
    return Object.prototype.hasOwnProperty.call(obj2, key) && obj1[key] === obj2[key];
  });
}

function ContentElementDecorator(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$1.wrapper,
    "data-scrollpoint": props.id
  }, /*#__PURE__*/React.createElement(ContentElementEditorStateProvider, {
    id: props.id
  }, /*#__PURE__*/React.createElement(OptionalSelectionRect, props, /*#__PURE__*/React.createElement(ContentElementConfigurationUpdateProvider, {
    id: props.id,
    permaId: props.permaId
  }, props.children))));
}

function OptionalSelectionRect(props) {
  var _ref = api.contentElementTypes.getOptions(props.type) || {},
      customSelectionRect = _ref.customSelectionRect;

  if (customSelectionRect) {
    return props.children;
  } else {
    return /*#__PURE__*/React.createElement(DefaultSelectionRect, props, props.children);
  }
}

function DefaultSelectionRect(props) {
  var _useContentElementEdi = useContentElementEditorState(),
      isSelected = _useContentElementEdi.isSelected,
      select = _useContentElementEdi.select;

  var _useI18n = useI18n({
    locale: 'ui'
  }),
      t = _useI18n.t;

  var _useDrag = useDrag({
    item: {
      type: 'contentElement',
      id: props.id
    }
  }),
      _useDrag2 = _slicedToArray(_useDrag, 3),
      drag = _useDrag2[1],
      preview = _useDrag2[2];

  return /*#__PURE__*/React.createElement(SelectionRect, {
    selected: isSelected,
    scrollPoint: isSelected,
    drag: drag,
    dragHandleTitle: t('pageflow_scrolled.inline_editing.drag_content_element'),
    full: props.width === widths.full || props.customMargin,
    ariaLabel: t('pageflow_scrolled.inline_editing.select_content_element'),
    insertButtonTitles: t('pageflow_scrolled.inline_editing.insert_content_element'),
    onClick: function onClick() {
      return select();
    },
    onInsertButtonClick: function onInsertButtonClick(at) {
      return postInsertContentElementMessage({
        id: props.id,
        at: at
      });
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: preview
  }, props.children), /*#__PURE__*/React.createElement(DropTargets, {
    accept: "contentElement",
    canDrop: function canDrop(_ref2) {
      var id = _ref2.id;
      return id !== props.id;
    },
    onDrop: function onDrop(_ref3) {
      var id = _ref3.id,
          range = _ref3.range,
          at = _ref3.at;
      return postMoveContentElementMessage({
        id: id,
        range: range,
        to: {
          id: props.id,
          at: at
        }
      });
    }
  }));
}

var styles$5 = {"container":"ContentElementInsertButton-module_container__3dvUS","hovered":"ContentElementInsertButton-module_hovered__3Pggi","button":"ContentElementInsertButton-module_button__2-eE2"};

function ContentElementInsertButton(_ref) {
  var onClick = _ref.onClick;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      hovered = _useState2[0],
      setHovered = _useState2[1];

  var _useI18n = useI18n({
    locale: 'ui'
  }),
      t = _useI18n.t;

  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$5.container, _defineProperty({}, styles$5.hovered, hovered))
  }, /*#__PURE__*/React.createElement("button", {
    className: styles$5.button,
    title: t('pageflow_scrolled.inline_editing.add_content_element'),
    onClick: onClick,
    onMouseDown: function onMouseDown(event) {
      return event.stopPropagation();
    },
    onMouseEnter: function onMouseEnter() {
      return setHovered(true);
    },
    onMouseLeave: function onMouseLeave() {
      return setHovered(false);
    }
  }, /*#__PURE__*/React.createElement(PlusIcon, {
    width: 15,
    height: 15,
    fill: "currentColor"
  })));
}

function LayoutWithPlaceholder(props) {
  var _useEditorSelection = useEditorSelection({
    id: props.sectionId,
    type: 'section'
  }),
      isSelected = _useEditorSelection.isSelected;

  var _useEditorSelection2 = useEditorSelection({
    id: props.sectionId,
    type: 'sectionSettings'
  }),
      settingsSelected = _useEditorSelection2.isSelected;

  var placeholder = isSelected || settingsSelected ? /*#__PURE__*/React.createElement(ContentElementInsertButton, {
    onClick: function onClick() {
      return postInsertContentElementMessage({
        at: 'endOfSection',
        id: props.sectionId
      });
    }
  }) : null;
  return /*#__PURE__*/React.createElement(LayoutWithoutInlineEditing, Object.assign({}, props, {
    placeholder: placeholder
  }));
}

function useCachedValue(value) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      defaultValue = _ref.defaultValue,
      onReset = _ref.onReset,
      onDebouncedChange = _ref.onDebouncedChange,
      _ref$delay = _ref.delay,
      delay = _ref$delay === void 0 ? 2000 : _ref$delay;

  var _useState = useState(value || defaultValue),
      _useState2 = _slicedToArray(_useState, 2),
      cachedValue = _useState2[0],
      setCachedValue = _useState2[1];

  var previousValue = useRef(value);
  useEffect(function () {
    if (previousValue.current !== value && value !== cachedValue) {
      onReset && onReset(value);
      setCachedValue(value);
    }
  }, [onReset, value, cachedValue]);
  useEffect(function () {
    previousValue.current = value;
  });
  var debouncedHandler = useDebouncedCallback(onDebouncedChange, delay);
  var setValue = useCallback(function (value) {
    setCachedValue(function (previousValue) {
      if (previousValue !== value) {
        debouncedHandler(value);
      }

      return value;
    });
  }, [debouncedHandler]);
  return [cachedValue, setValue];
} // Debounce callback even if the callback function changes across renders.

function useDebouncedCallback(callback, delay) {
  var mostRecentCallback = useRef(null);
  var debouncedHandler = useRef(null);
  useEffect(function () {
    mostRecentCallback.current = callback;
  }, [callback]);
  useEffect(function () {
    debouncedHandler.current = debounce(function (value) {
      if (mostRecentCallback.current) {
        mostRecentCallback.current(value);
      }
    }, delay);
    return function () {
      debouncedHandler.current.flush();
    };
  }, [delay]);
  return useCallback(function () {
    return debouncedHandler.current.apply(debouncedHandler, arguments);
  }, []);
}

var styles$6 = {"placeholder":"TextPlaceholder-module_placeholder__sgVwx"};

function TextPlaceholder(_ref) {
  var text = _ref.text,
      visible = _ref.visible,
      className = _ref.className;

  if (!text || !visible) {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: styles$6.placeholder
  }, /*#__PURE__*/React.createElement("div", {
    className: className
  }, text));
}

function withCustomInsertBreak(editor) {
  var insertBreak = editor.insertBreak;

  editor.insertBreak = function () {
    var selection = editor.selection;

    if (selection && Range.isCollapsed(selection)) {
      var match = Editor.above(editor, {
        match: function match(n) {
          return Editor.isBlock(editor, n);
        }
      });

      if (match) {
        var _match = _slicedToArray(match, 2),
            block = _match[0],
            path = _match[1];

        if (Editor.isEnd(editor, selection.anchor, path) && block.type === 'heading') {
          Transforms.insertNodes(editor, {
            type: 'paragraph',
            children: [{
              text: ''
            }]
          });
          return;
        }
      }
    }

    insertBreak();
  };

  return editor;
}

var styles$7 = {"container":"index-module_container__3dD9z","shy":"index-module_shy__KgWjc","selected":"index-module_selected__mE58y","hoveringToolbarContainer":"index-module_hoveringToolbarContainer__3xVEz","hoveringToolbar":"index-module_hoveringToolbar__31Xpd","selection":"index-module_selection__3dUiD","linkTooltip":"index-module_linkTooltip__36m1K","linkTooltip-below":"index-module_linkTooltip-below__1wvl7","linkTooltip-above":"index-module_linkTooltip-above__P3YfD","linkTooltipThumbnail":"index-module_linkTooltipThumbnail__2v-cf","linkTooltipThumbnailClickMask":"index-module_linkTooltipThumbnailClickMask__2Z3ff","linkTooltipNewTab":"index-module_linkTooltipNewTab__4tnLF","linkTooltipChapterNumber":"index-module_linkTooltipChapterNumber__2CsQA"};

function _extends$3() {
  _extends$3 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$3.apply(this, arguments);
}
var ExternalLinkIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends$3({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "external-link-alt",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-external-link-alt"] || "fa-external-link-alt") + " " + (styles["fa-w-16"] || "fa-w-16"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M432 320h-32a16 16 0 00-16 16v112H64V128h144a16 16 0 0016-16V80a16 16 0 00-16-16H48a48 48 0 00-48 48v352a48 48 0 0048 48h352a48 48 0 0048-48V336a16 16 0 00-16-16zM488 0H360c-21.37 0-32.05 25.91-17 41l35.73 35.73L135 320.37a24 24 0 000 34L157.67 377a24 24 0 0034 0l243.61-243.68L471 169c15 15 41 4.5 41-17V24a24 24 0 00-24-24z"
  }));
});

var UpdateContext = createContext();
function LinkTooltipProvider(_ref) {
  var editor = _ref.editor,
      disabled = _ref.disabled,
      position = _ref.position,
      children = _ref.children;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var outerRef = useRef();
  var update = useMemo(function () {
    var timeout;
    return {
      activate: function activate(href, openInNewTab, linkRef) {
        clearTimeout(timeout);
        timeout = null;
        var outerRect = outerRef.current.getBoundingClientRect();
        var linkRect = linkRef.current.getBoundingClientRect();
        setState({
          href: href,
          openInNewTab: openInNewTab,
          top: position === 'below' ? linkRect.bottom - outerRect.top + 10 : 'auto',
          bottom: position === 'above' ? outerRect.bottom - linkRect.top + 10 : 'auto',
          left: linkRect.left - outerRect.left
        });
      },
      keep: function keep() {
        clearTimeout(timeout);
        timeout = null;
      },
      deactivate: function deactivate() {
        if (!timeout) {
          timeout = setTimeout(function () {
            timeout = null;
            setState(null);
          }, 200);
        }
      }
    };
  }, [position]);
  return /*#__PURE__*/React.createElement(UpdateContext.Provider, {
    value: update
  }, /*#__PURE__*/React.createElement("div", {
    ref: outerRef
  }, /*#__PURE__*/React.createElement(LinkTooltip, {
    editor: editor,
    state: state,
    disabled: disabled,
    position: position
  }), children));
}
function LinkPreview(_ref2) {
  var href = _ref2.href,
      openInNewTab = _ref2.openInNewTab,
      children = _ref2.children;

  var _useContext = useContext(UpdateContext),
      activate = _useContext.activate,
      deactivate = _useContext.deactivate;

  var ref = useRef();
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    onMouseEnter: function onMouseEnter() {
      return activate(href, openInNewTab, ref);
    },
    onMouseLeave: deactivate,
    onMouseDown: deactivate
  }, children);
}
function LinkTooltip(_ref3) {
  var editor = _ref3.editor,
      disabled = _ref3.disabled,
      position = _ref3.position,
      state = _ref3.state;

  var _useContext2 = useContext(UpdateContext),
      keep = _useContext2.keep,
      deactivate = _useContext2.deactivate;

  if (disabled || !state || editor.selection && !Range.isCollapsed(editor.selection)) {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$7.linkTooltip, styles$7["linkTooltip-".concat(position)], styles$7.hoveringToolbar),
    onMouseEnter: keep,
    onMouseLeave: deactivate,
    style: {
      top: state.top,
      bottom: state.bottom,
      left: state.left,
      opacity: 1
    }
  }, /*#__PURE__*/React.createElement(LinkDestination, {
    href: state.href,
    openInNewTab: state.openInNewTab
  }));
}

function LinkDestination(_ref4) {
  var href = _ref4.href,
      openInNewTab = _ref4.openInNewTab;

  if (href === null || href === void 0 ? void 0 : href.chapter) {
    return /*#__PURE__*/React.createElement(ChapterLinkDestination, {
      permaId: href.chapter
    });
  } else if (href === null || href === void 0 ? void 0 : href.section) {
    return /*#__PURE__*/React.createElement(SectionLinkDestination, {
      permaId: href.section
    });
  } else if (href === null || href === void 0 ? void 0 : href.file) {
    return /*#__PURE__*/React.createElement(FileLinkDestination, {
      fileOptions: href.file
    });
  } else {
    return /*#__PURE__*/React.createElement(ExternalLinkDestination, {
      href: href,
      openInNewTab: openInNewTab
    });
  }
}

function ChapterLinkDestination(_ref5) {
  var permaId = _ref5.permaId;
  var chapter = useChapter({
    permaId: permaId
  });

  var _useI18n = useI18n({
    locale: 'ui'
  }),
      t = _useI18n.t;

  if (!chapter) {
    return /*#__PURE__*/React.createElement("span", null, t('pageflow_scrolled.inline_editing.link_tooltip.deleted_chapter'));
  }

  return /*#__PURE__*/React.createElement("a", {
    href: "#".concat(chapter.chapterSlug),
    title: t('pageflow_scrolled.inline_editing.link_tooltip.visit_chapter')
  }, /*#__PURE__*/React.createElement("span", {
    className: styles$7.linkTooltipChapterNumber
  }, t('pageflow_scrolled.inline_editing.link_tooltip.chapter_number', {
    number: chapter.index + 1
  })), " ", chapter.title);
}

function SectionLinkDestination(_ref6) {
  var permaId = _ref6.permaId;

  var _useI18n2 = useI18n({
    locale: 'ui'
  }),
      t = _useI18n2.t;

  return /*#__PURE__*/React.createElement("div", {
    className: styles$7.linkTooltipThumbnail
  }, /*#__PURE__*/React.createElement(SectionThumbnail, {
    sectionPermaId: permaId
  }), /*#__PURE__*/React.createElement("a", {
    href: "#section-".concat(permaId),
    className: styles$7.linkTooltipThumbnailClickMask,
    title: t('pageflow_scrolled.inline_editing.link_tooltip.visit_section')
  }));
}

function ExternalLinkDestination(_ref7) {
  var href = _ref7.href,
      openInNewTab = _ref7.openInNewTab;

  var _useI18n3 = useI18n({
    locale: 'ui'
  }),
      t = _useI18n3.t;

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
    href: href,
    target: "_blank",
    rel: "noopener noreferrer"
  }, href, /*#__PURE__*/React.createElement(ExternalLinkIcon, {
    width: 10,
    height: 10
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$7.linkTooltipNewTab
  }, openInNewTab ? t('pageflow_scrolled.inline_editing.link_tooltip.opens_in_new_tab') : t('pageflow_scrolled.inline_editing.link_tooltip.opens_in_same_tab')));
}

function FileLinkDestination(_ref8) {
  var fileOptions = _ref8.fileOptions;
  var file = useFile(fileOptions);

  var _useI18n4 = useI18n({
    locale: 'ui'
  }),
      t = _useI18n4.t;

  if (!file) {
    return /*#__PURE__*/React.createElement("span", null, t('pageflow_scrolled.inline_editing.link_tooltip.deleted_file'));
  }

  return /*#__PURE__*/React.createElement("a", {
    href: file.urls.original,
    target: "_blank",
    rel: "noopener noreferrer"
  }, file.urls.original.split('/').pop(), /*#__PURE__*/React.createElement(ExternalLinkIcon, {
    width: 10,
    height: 10
  }));
}

function withLinks(editor) {
  var isInline = editor.isInline;

  editor.isInline = function (element) {
    return element.type === 'link' ? true : isInline(element);
  };

  return editor;
}
function renderElementWithLinkPreview(options) {
  if (options.element.type === 'link') {
    return /*#__PURE__*/React.createElement(LinkPreview, {
      href: options.element.href,
      openInNewTab: options.element.openInNewTab
    }, renderElement(options));
  } else {
    return renderElement(options);
  }
}

// element is currently being dragged over the element. `react-dnd`
// causes "Update on unmounted component warning" when dropping an
// element removes a drop target [1]. As a workaround, couple
// rendering of drop targets to asynchronously updated state. That way
// the drop target is only removed after element has been dropped.
//
// [1] https://github.com/react-dnd/react-dnd/issues/1573

function useDropTargetsActive() {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      dropTargetsActive = _useState2[0],
      setDropTargetsActive = _useState2[1];

  var _useDrop = useDrop({
    accept: 'contentElement',
    collect: function collect(monitor) {
      return {
        canDrop: monitor.canDrop() && monitor.isOver()
      };
    }
  }),
      _useDrop2 = _slicedToArray(_useDrop, 2),
      canDrop = _useDrop2[0].canDrop,
      drop = _useDrop2[1];

  useEffect(function () {
    if (canDrop) {
      setDropTargetsActive(true);
    } else {
      var timeout = setTimeout(function () {
        setDropTargetsActive(false);
      }, 10);
      return function () {
        clearTimeout(timeout);
      };
    }
  }, [canDrop]);
  return [dropTargetsActive, drop];
}

var abortPreviousCall;
function useSelectLinkDestination() {
  return function () {
    return new Promise(function (resolve, reject) {
      if (abortPreviousCall) {
        abortPreviousCall();
      }

      abortPreviousCall = function abortPreviousCall() {
        window.removeEventListener('message', receive);
        reject();
      };

      postSelectLinkDestinationMessage();
      window.addEventListener('message', receive);

      function receive(message) {
        if (window.location.href.indexOf(message.origin) === 0) {
          if (message.data.type === 'LINK_DESTINATION_SELECTED') {
            abortPreviousCall = null;
            window.removeEventListener('message', receive);
            resolve(message.data.payload);
          }
        }
      }
    });
  };
}

function _extends$4() {
  _extends$4 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$4.apply(this, arguments);
}
var BoldIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends$4({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "bold",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-bold"] || "fa-bold") + " " + (styles["fa-w-12"] || "fa-w-12"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 384 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M333.49 238a122 122 0 0027-65.21C367.87 96.49 308 32 233.42 32H34a16 16 0 00-16 16v48a16 16 0 0016 16h31.87v288H34a16 16 0 00-16 16v48a16 16 0 0016 16h209.32c70.8 0 134.14-51.75 141-122.4 4.74-48.45-16.39-92.06-50.83-119.6zM145.66 112h87.76a48 48 0 010 96h-87.76zm87.76 288h-87.76V288h87.76a56 56 0 010 112z"
  }));
});

function _extends$5() {
  _extends$5 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$5.apply(this, arguments);
}
var UnderlineIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends$5({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "underline",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-underline"] || "fa-underline") + " " + (styles["fa-w-14"] || "fa-w-14"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 448 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M32 64h32v160c0 88.22 71.78 160 160 160s160-71.78 160-160V64h32a16 16 0 0016-16V16a16 16 0 00-16-16H272a16 16 0 00-16 16v32a16 16 0 0016 16h32v160a80 80 0 01-160 0V64h32a16 16 0 0016-16V16a16 16 0 00-16-16H32a16 16 0 00-16 16v32a16 16 0 0016 16zm400 384H16a16 16 0 00-16 16v32a16 16 0 0016 16h416a16 16 0 0016-16v-32a16 16 0 00-16-16z"
  }));
});

function _extends$6() {
  _extends$6 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$6.apply(this, arguments);
}
var ItalicIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends$6({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "italic",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-italic"] || "fa-italic") + " " + (styles["fa-w-10"] || "fa-w-10"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 320 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M320 48v32a16 16 0 01-16 16h-62.76l-80 320H208a16 16 0 0116 16v32a16 16 0 01-16 16H16a16 16 0 01-16-16v-32a16 16 0 0116-16h62.76l80-320H112a16 16 0 01-16-16V48a16 16 0 0116-16h192a16 16 0 0116 16z"
  }));
});

function _extends$7() {
  _extends$7 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$7.apply(this, arguments);
}
var StrikethroughIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends$7({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "strikethrough",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-strikethrough"] || "fa-strikethrough") + " " + (styles["fa-w-16"] || "fa-w-16"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M496 224H293.9l-87.17-26.83A43.55 43.55 0 01219.55 112h66.79A49.89 49.89 0 01331 139.58a16 16 0 0021.46 7.15l42.94-21.47a16 16 0 007.16-21.46l-.53-1A128 128 0 00287.51 32h-68a123.68 123.68 0 00-123 135.64c2 20.89 10.1 39.83 21.78 56.36H16a16 16 0 00-16 16v32a16 16 0 0016 16h480a16 16 0 0016-16v-32a16 16 0 00-16-16zm-180.24 96A43 43 0 01336 356.45 43.59 43.59 0 01292.45 400h-66.79A49.89 49.89 0 01181 372.42a16 16 0 00-21.46-7.15l-42.94 21.47a16 16 0 00-7.16 21.46l.53 1A128 128 0 00224.49 480h68a123.68 123.68 0 00123-135.64 114.25 114.25 0 00-5.34-24.36z"
  }));
});

function _extends$8() {
  _extends$8 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$8.apply(this, arguments);
}
var LinkIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends$8({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "link",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-link"] || "fa-link") + " " + (styles["fa-w-16"] || "fa-w-16"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 01-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0120.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0020.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 00-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"
  }));
});

function HoveringToolbar(_ref) {
  var position = _ref.position;
  var ref = useRef();
  var outerRef = useRef();
  var editor = useSlate();

  var _useI18n = useI18n({
    locale: 'ui'
  }),
      t = _useI18n.t;

  var selectLinkDestination = useSelectLinkDestination();
  useEffect(function () {
    var el = ref.current;
    var selection = editor.selection;

    if (!el || !outerRef.current) {
      return;
    }

    if (!selection || !ReactEditor.isFocused(editor) || Range.isCollapsed(selection) || Editor.string(editor, selection) === '') {
      el.removeAttribute('style');
      return;
    }

    var domRange = ReactEditor.toDOMRange(editor, editor.selection);
    var rect = domRange.getBoundingClientRect();
    var outerRect = outerRef.current.getBoundingClientRect();
    el.style.opacity = 1;
    el.style.left = "".concat(rect.left - outerRect.left, "px");

    if (position === 'above') {
      el.style.top = 'auto';
      el.style.bottom = "".concat(outerRect.bottom - rect.top + 5, "px");
    } else {
      el.style.bottom = 'auto';
      el.style.top = "".concat(rect.bottom - outerRect.top + 5, "px");
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: outerRef,
    className: styles$7.hoveringToolbarContainer
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: styles$7.hoveringToolbar
  }, renderToolbar$1(editor, t, selectLinkDestination)));
}

function renderToolbar$1(editor, t, selectLinkDestination) {
  var buttons = [{
    name: 'bold',
    text: t('pageflow_scrolled.inline_editing.formats.bold'),
    icon: BoldIcon
  }, {
    name: 'italic',
    text: t('pageflow_scrolled.inline_editing.formats.italic'),
    icon: ItalicIcon
  }, {
    name: 'underline',
    text: t('pageflow_scrolled.inline_editing.formats.underline'),
    icon: UnderlineIcon
  }, {
    name: 'strikethrough',
    text: t('pageflow_scrolled.inline_editing.formats.strikethrough'),
    icon: StrikethroughIcon
  }, {
    name: 'link',
    text: isButtonActive(editor, 'link') ? t('pageflow_scrolled.inline_editing.remove_link') : t('pageflow_scrolled.inline_editing.insert_link'),
    icon: LinkIcon
  }].map(function (button) {
    return _objectSpread2(_objectSpread2({}, button), {}, {
      active: isButtonActive(editor, button.name)
    });
  });
  return /*#__PURE__*/React.createElement(Toolbar, {
    buttons: buttons,
    onButtonClick: function onButtonClick(name) {
      return handleButtonClick(editor, name, selectLinkDestination);
    }
  });
}

function handleButtonClick(editor, format, selectLinkDestination) {
  if (format === 'link') {
    if (isLinkActive(editor)) {
      unwrapLink(editor);
    } else {
      selectLinkDestination().then(function (_ref2) {
        var href = _ref2.href,
            openInNewTab = _ref2.openInNewTab;
        wrapLink(editor, href, openInNewTab);
      }, function () {});
    }
  } else {
    toggleMark(editor, format);
  }
}

function isButtonActive(editor, format) {
  if (format === 'link') {
    return isLinkActive(editor);
  } else {
    return isMarkActive(editor, format);
  }
}

function unwrapLink(editor) {
  Transforms.unwrapNodes(editor, {
    match: function match(n) {
      return n.type === 'link';
    }
  });
}

function wrapLink(editor, href, openInNewTab) {
  var link = {
    type: 'link',
    href: href,
    openInNewTab: openInNewTab,
    children: []
  };
  Transforms.wrapNodes(editor, link, {
    split: true
  });
  Transforms.collapse(editor, {
    edge: 'end'
  });
}

function isLinkActive(editor) {
  var _Editor$nodes = Editor.nodes(editor, {
    match: function match(n) {
      return n.type === 'link';
    }
  }),
      _Editor$nodes2 = _slicedToArray(_Editor$nodes, 1),
      link = _Editor$nodes2[0];

  return !!link;
}

function toggleMark(editor, format) {
  var isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

function isMarkActive(editor, format) {
  var marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

function getUniformSelectedNode(editor, propertyName) {
  var currentNodeEntries = _toConsumableArray(Editor.nodes(editor, {
    match: function match(n) {
      return !!n.type;
    },
    mode: 'highest'
  }));

  var values = _toConsumableArray(new Set(currentNodeEntries.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        node = _ref2[0],
        path = _ref2[1];

    return node[propertyName];
  })));

  return values.length === 1 ? currentNodeEntries[0][0] : null;
}

function _createForOfIteratorHelper(o) {
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
      var i = 0;

      var F = function F() {};

      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var it,
      normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function s() {
      it = o[Symbol.iterator]();
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function isBlockActive(editor, format) {
  var _Editor$nodes = Editor.nodes(editor, {
    match: function match(n) {
      return n.type === format;
    }
  }),
      _Editor$nodes2 = _slicedToArray(_Editor$nodes, 1),
      match = _Editor$nodes2[0];

  return !!match;
}
var listTypes = ['numbered-list', 'bulleted-list'];
function toggleBlock(editor, format) {
  var isActive = isBlockActive(editor, format);
  var isList = listTypes.includes(format);
  Transforms.unwrapNodes(editor, {
    match: function match(n) {
      return listTypes.includes(n.type);
    },
    split: true
  });
  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format
  });

  if (!isActive && isList) {
    var block = _objectSpread2({
      type: format,
      children: []
    }, preserveColorAndTypograpyhVariant(editor));

    Transforms.wrapNodes(editor, block);
  }
}
function applyTypograpyhVariant(editor, variant) {
  applyProperties(editor, {
    variant: variant
  });
}
function applyColor(editor, color) {
  applyProperties(editor, {
    color: color
  });
}

function applyProperties(editor, properties) {
  Transforms.setNodes(editor, properties, {
    mode: 'highest'
  });
  applyPropertiesToListItems(editor, properties);
}

function applyPropertiesToListItems(editor, properties) {
  var lists = Editor.nodes(editor, {
    match: function match(n) {
      return listTypes.includes(n.type);
    }
  });

  var _iterator = _createForOfIteratorHelper(lists),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
          listPath = _step$value[1];

      var items = Editor.nodes(editor, {
        at: listPath,
        match: function match(n) {
          return n.type === 'list-item';
        }
      });

      var _iterator2 = _createForOfIteratorHelper(items),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              itemPath = _step2$value[1];

          Transforms.setNodes(editor, properties, {
            at: itemPath
          });
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function preserveColorAndTypograpyhVariant(editor) {
  var nodeEntry = Editor.above(editor, {
    at: Range.start(editor.selection),
    match: function match(n) {
      return !!n.type;
    }
  });
  var result = {};

  if (nodeEntry && nodeEntry[0].variant) {
    result.variant = nodeEntry[0].variant;
  }

  if (nodeEntry && nodeEntry[0].color) {
    result.color = nodeEntry[0].color;
  }

  return result;
}

function withBlockNormalization(_ref, editor) {
  var onlyParagraphs = _ref.onlyParagraphs;

  if (!onlyParagraphs) {
    return editor;
  }

  var normalizeNode = editor.normalizeNode;

  editor.normalizeNode = function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        node = _ref3[0],
        path = _ref3[1];

    if (path.length === 0) {
      var _iterator3 = _createForOfIteratorHelper(Node.children(editor, path)),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _step3$value = _slicedToArray(_step3.value, 2),
              child = _step3$value[0],
              childPath = _step3$value[1];

          if (Element.isElement(child) && child.type !== 'paragraph') {
            Transforms.unwrapNodes(editor, {
              match: function match(n) {
                return listTypes.includes(n.type);
              },
              split: true,
              at: childPath
            });
            Transforms.setNodes(editor, {
              type: 'paragraph'
            }, {
              at: childPath
            });
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
}

function _extends$9() {
  _extends$9 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$9.apply(this, arguments);
}
var TextIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends$9({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "align-justify",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-align-justify"] || "fa-align-justify") + " " + (styles["fa-w-14"] || "fa-w-14"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 448 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M432 416H16a16 16 0 00-16 16v32a16 16 0 0016 16h416a16 16 0 0016-16v-32a16 16 0 00-16-16zm0-128H16a16 16 0 00-16 16v32a16 16 0 0016 16h416a16 16 0 0016-16v-32a16 16 0 00-16-16zm0-128H16a16 16 0 00-16 16v32a16 16 0 0016 16h416a16 16 0 0016-16v-32a16 16 0 00-16-16zm0-128H16A16 16 0 000 48v32a16 16 0 0016 16h416a16 16 0 0016-16V48a16 16 0 00-16-16z"
  }));
});

function _extends$a() {
  _extends$a = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$a.apply(this, arguments);
}
var HeadingIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends$a({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "heading",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-heading"] || "fa-heading") + " " + (styles["fa-w-16"] || "fa-w-16"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M448 96v320h32a16 16 0 0116 16v32a16 16 0 01-16 16H320a16 16 0 01-16-16v-32a16 16 0 0116-16h32V288H160v128h32a16 16 0 0116 16v32a16 16 0 01-16 16H32a16 16 0 01-16-16v-32a16 16 0 0116-16h32V96H32a16 16 0 01-16-16V48a16 16 0 0116-16h160a16 16 0 0116 16v32a16 16 0 01-16 16h-32v128h192V96h-32a16 16 0 01-16-16V48a16 16 0 0116-16h160a16 16 0 0116 16v32a16 16 0 01-16 16z"
  }));
});

function _extends$b() {
  _extends$b = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$b.apply(this, arguments);
}
var OlIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends$b({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "list-ol",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-list-ol"] || "fa-list-ol") + " " + (styles["fa-w-16"] || "fa-w-16"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M61.77 401l17.5-20.15a19.92 19.92 0 005.07-14.19v-3.31C84.34 356 80.5 352 73 352H16a8 8 0 00-8 8v16a8 8 0 008 8h22.83a157.41 157.41 0 00-11 12.31l-5.61 7c-4 5.07-5.25 10.13-2.8 14.88l1.05 1.93c3 5.76 6.29 7.88 12.25 7.88h4.73c10.33 0 15.94 2.44 15.94 9.09 0 4.72-4.2 8.22-14.36 8.22a41.54 41.54 0 01-15.47-3.12c-6.49-3.88-11.74-3.5-15.6 3.12l-5.59 9.31c-3.72 6.13-3.19 11.72 2.63 15.94 7.71 4.69 20.38 9.44 37 9.44 34.16 0 48.5-22.75 48.5-44.12-.03-14.38-9.12-29.76-28.73-34.88zM496 224H176a16 16 0 00-16 16v32a16 16 0 0016 16h320a16 16 0 0016-16v-32a16 16 0 00-16-16zm0-160H176a16 16 0 00-16 16v32a16 16 0 0016 16h320a16 16 0 0016-16V80a16 16 0 00-16-16zm0 320H176a16 16 0 00-16 16v32a16 16 0 0016 16h320a16 16 0 0016-16v-32a16 16 0 00-16-16zM16 160h64a8 8 0 008-8v-16a8 8 0 00-8-8H64V40a8 8 0 00-8-8H32a8 8 0 00-7.14 4.42l-8 16A8 8 0 0024 64h8v64H16a8 8 0 00-8 8v16a8 8 0 008 8zm-3.91 160H80a8 8 0 008-8v-16a8 8 0 00-8-8H41.32c3.29-10.29 48.34-18.68 48.34-56.44 0-29.06-25-39.56-44.47-39.56-21.36 0-33.8 10-40.46 18.75-4.37 5.59-3 10.84 2.8 15.37l8.58 6.88c5.61 4.56 11 2.47 16.12-2.44a13.44 13.44 0 019.46-3.84c3.33 0 9.28 1.56 9.28 8.75C51 248.19 0 257.31 0 304.59v4C0 316 5.08 320 12.09 320z"
  }));
});

function _extends$c() {
  _extends$c = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$c.apply(this, arguments);
}
var UlIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends$c({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "list-ul",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-list-ul"] || "fa-list-ul") + " " + (styles["fa-w-16"] || "fa-w-16"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M48 48a48 48 0 1048 48 48 48 0 00-48-48zm0 160a48 48 0 1048 48 48 48 0 00-48-48zm0 160a48 48 0 1048 48 48 48 0 00-48-48zm448 16H176a16 16 0 00-16 16v32a16 16 0 0016 16h320a16 16 0 0016-16v-32a16 16 0 00-16-16zm0-320H176a16 16 0 00-16 16v32a16 16 0 0016 16h320a16 16 0 0016-16V80a16 16 0 00-16-16zm0 160H176a16 16 0 00-16 16v32a16 16 0 0016 16h320a16 16 0 0016-16v-32a16 16 0 00-16-16z"
  }));
});

function _extends$d() {
  _extends$d = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$d.apply(this, arguments);
}
var QuoteIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends$d({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "quote-right",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-quote-right"] || "fa-quote-right") + " " + (styles["fa-w-16"] || "fa-w-16"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M464 32H336c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48zm-288 0H48C21.5 32 0 53.5 0 80v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48z"
  }));
});

function Selection(props) {
  var editor = useSlate();

  var _useI18n = useI18n({
    locale: 'ui'
  }),
      t = _useI18n.t;

  var ref = useRef();
  var outerRef = useRef();
  var innerRef = useRef();
  var boundsRef = useRef();
  var lastRangeRef = useRef();

  var _useContentElementEdi = useContentElementEditorState(),
      setTransientState = _useContentElementEdi.setTransientState,
      select = _useContentElementEdi.select,
      isContentElementSelected = _useContentElementEdi.isSelected,
      range = _useContentElementEdi.range;

  useEffect(function () {
    var _getUniformSelectedNo, _getUniformSelectedNo2;

    var selection = editor.selection;

    if (!ref.current) {
      return;
    }

    if (isContentElementSelected && range && lastRangeRef.current !== range) {
      lastRangeRef.current = range;

      if (range[1] === range[0] + 1) {
        Transforms.select(editor, Editor.point(editor, [range[0]], {
          edge: 'start'
        }));
      } else {
        Transforms.select(editor, {
          anchor: Editor.point(editor, [range[0]], {
            edge: 'start'
          }),
          focus: Editor.point(editor, [range[1] - 1], {
            edge: 'end'
          })
        });
      }

      ReactEditor.focus(editor);
    }

    if (!selection) {
      if (boundsRef.current) {
        hideRect(ref.current);
        boundsRef.current = null;
      }

      return;
    }

    if (!isContentElementSelected && boundsRef.current) {
      hideRect(ref.current);
      boundsRef.current = null;
      window.getSelection().removeAllRanges();
      return;
    }

    if (!isContentElementSelected && !boundsRef.current) {
      select();
    }

    var _computeBounds = computeBounds(editor),
        _computeBounds2 = _slicedToArray(_computeBounds, 2),
        start = _computeBounds2[0],
        end = _computeBounds2[1];

    setTransientState({
      editableTextIsSingleBlock: editor.children.length <= 1,
      exampleNode: getUniformSelectedNode(editor, 'type'),
      typographyVariant: (_getUniformSelectedNo = getUniformSelectedNode(editor, 'variant')) === null || _getUniformSelectedNo === void 0 ? void 0 : _getUniformSelectedNo.variant,
      color: (_getUniformSelectedNo2 = getUniformSelectedNode(editor, 'color')) === null || _getUniformSelectedNo2 === void 0 ? void 0 : _getUniformSelectedNo2.color
    });
    boundsRef.current = {
      start: start,
      end: end
    };
    updateRect(editor, start, end, outerRef.current, ref.current, innerRef.current);
  });

  var _useDrag = useDrag({
    item: {
      type: 'contentElement',
      id: props.contentElementId
    },
    begin: function begin() {
      return {
        type: 'contentElement',
        id: props.contentElementId,
        range: [boundsRef.current.start, boundsRef.current.end + 1]
      };
    }
  }),
      _useDrag2 = _slicedToArray(_useDrag, 2),
      drag = _useDrag2[1];

  return /*#__PURE__*/React.createElement("div", {
    ref: outerRef
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: styles$7.selection
  }, /*#__PURE__*/React.createElement(SelectionRect, {
    selected: true,
    drag: drag,
    scrollPoint: isContentElementSelected,
    insertButtonTitles: t('pageflow_scrolled.inline_editing.insert_content_element'),
    onInsertButtonClick: function onInsertButtonClick(at) {
      if (at === 'before' && boundsRef.current.start === 0 || at === 'after' && !Node.has(editor, [boundsRef.current.end + 1])) {
        postInsertContentElementMessage({
          id: props.contentElementId,
          at: at
        });
      } else {
        postInsertContentElementMessage({
          id: props.contentElementId,
          at: 'split',
          splitPoint: at === 'before' ? boundsRef.current.start : boundsRef.current.end + 1
        });
      }
    },
    toolbarButtons: toolbarButtons(t).map(function (button) {
      return _objectSpread2(_objectSpread2({}, button), {}, {
        active: isBlockActive(editor, button.name)
      });
    }),
    onToolbarButtonClick: function onToolbarButtonClick(name) {
      return toggleBlock(editor, name);
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: innerRef
  }))));
}

function computeBounds(editor) {
  var startPoint = Range.start(editor.selection);
  var endPoint = Range.end(editor.selection);
  var startPath = startPoint.path.slice(0, 1);
  var endPath = endPoint.path.slice(0, 1);

  if (!Path.equals(startPath, endPath) && endPoint.offset === 0) {
    endPath = Path.previous(endPath);
  }

  return [startPath[0], endPath[0]];
}

function hideRect(el) {
  el.removeAttribute('style');
}

function updateRect(editor, startIndex, endIndex, outer, el, inner) {
  var _getDOMNodes = getDOMNodes(editor, startIndex, endIndex),
      _getDOMNodes2 = _slicedToArray(_getDOMNodes, 2),
      startDOMNode = _getDOMNodes2[0],
      endDOMNode = _getDOMNodes2[1];

  if (startDOMNode && endDOMNode) {
    var startRect = startDOMNode.getBoundingClientRect();
    var endRect = endDOMNode.getBoundingClientRect();
    var outerRect = outer.getBoundingClientRect();
    el.style.display = 'block';
    el.style.top = "".concat(startRect.top - outerRect.top, "px");
    inner.style.height = "".concat(endRect.bottom - startRect.top, "px");
  }
}

function getDOMNodes(editor, startIndex, endIndex) {
  var startNode = Node.get(editor, [startIndex]);
  var endNode = Node.get(editor, [endIndex]);

  try {
    var startDOMNode = ReactEditor.toDOMNode(editor, startNode);
    var endDOMNode = ReactEditor.toDOMNode(editor, endNode);
    return [startDOMNode, endDOMNode];
  } catch (e) {
    return [];
  }
}

function toolbarButtons(t) {
  return [{
    name: 'paragraph',
    text: t('pageflow_scrolled.inline_editing.formats.paragraph'),
    icon: TextIcon
  }, {
    name: 'heading',
    text: t('pageflow_scrolled.inline_editing.formats.heading'),
    icon: HeadingIcon
  }, {
    name: 'numbered-list',
    text: t('pageflow_scrolled.inline_editing.formats.ordered_list'),
    icon: OlIcon
  }, {
    name: 'bulleted-list',
    text: t('pageflow_scrolled.inline_editing.formats.bulleted_list'),
    icon: UlIcon
  }, {
    name: 'block-quote',
    text: t('pageflow_scrolled.inline_editing.formats.block_quote'),
    icon: QuoteIcon
  }];
}

var styles$8 = {"container":"DropTargets-module_container__3vudG","dropTarget":"DropTargets-module_dropTarget__3mmox","dropIndicator":"DropTargets-module_dropIndicator__2zu4d","isOver":"DropTargets-module_isOver__2usWn"};

function DropTargets$1(_ref) {
  var contentElementId = _ref.contentElementId;
  var editor = useSlate();

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      targets = _useState2[0],
      setTargets = _useState2[1];

  var containerRef = useRef();
  useEffect(function () {
    if (!targets) {
      setTargets(measureHeights(editor, containerRef.current));
    }
  }, [targets, editor]);
  return /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    className: styles$8.container
  }, renderDropTargets(targets || [], contentElementId));
}

function renderDropTargets(targets, contentElementId) {
  function handleDrop(item, index) {
    if (index === 0) {
      postMoveContentElementMessage({
        id: item.id,
        range: item.range,
        to: {
          at: 'before',
          id: contentElementId
        }
      });
    } else if (index === targets.length - 1) {
      postMoveContentElementMessage({
        id: item.id,
        range: item.range,
        to: {
          at: 'after',
          id: contentElementId
        }
      });
    } else {
      postMoveContentElementMessage({
        id: item.id,
        range: item.range,
        to: {
          at: 'split',
          id: contentElementId,
          splitPoint: index
        }
      });
    }
  }

  return targets.map(function (target, index) {
    return /*#__PURE__*/React.createElement(DropTarget, Object.assign({}, target, {
      key: index,
      onDrop: function onDrop(item) {
        return handleDrop(item, index);
      }
    }));
  });
}

function DropTarget(_ref2) {
  var display = _ref2.display,
      top = _ref2.top,
      height = _ref2.height,
      indicatorTop = _ref2.indicatorTop,
      onDrop = _ref2.onDrop;

  var _useDrop = useDrop({
    accept: 'contentElement',
    collect: function collect(monitor) {
      return {
        isOver: monitor.isOver()
      };
    },
    drop: function drop(item) {
      return onDrop(item);
    }
  }),
      _useDrop2 = _slicedToArray(_useDrop, 2),
      isOver = _useDrop2[0].isOver,
      drop = _useDrop2[1];

  return /*#__PURE__*/React.createElement("div", {
    ref: drop,
    className: classNames(styles$8.dropTarget, _defineProperty({}, styles$8.isOver, isOver)),
    style: {
      display: display,
      top: top,
      height: height
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$8.dropIndicator,
    style: {
      top: indicatorTop
    }
  }));
}

function measureHeights(editor, container) {
  var containerRect = container.getBoundingClientRect();
  var lastTargetDimensions = {
    top: 0,
    height: 0
  };
  var lastRectBottom = 0;
  var targetDimensions = editor.children.map(function (child, index) {
    var node = Node.get(editor, [index]);
    var domNode = ReactEditor.toDOMNode(editor, node);
    var rect = domNode.getBoundingClientRect();
    var top = lastTargetDimensions.top + lastTargetDimensions.height;
    var bottom = rect.top + rect.height / 2 - containerRect.top;
    var targetDimensions = {
      top: top,
      height: bottom - top,
      display: editor.selection && Range.includes(editor.selection, [index]) ? 'none' : undefined,
      indicatorTop: index > 0 ? lastRectBottom + (rect.top - lastRectBottom) / 2 - containerRect.top - top : 0
    };
    lastRectBottom = rect.bottom;
    lastTargetDimensions = targetDimensions;
    return targetDimensions;
  });
  return [].concat(_toConsumableArray(targetDimensions), [{
    top: lastTargetDimensions.top + lastTargetDimensions.height,
    height: containerRect.height - (lastTargetDimensions.top + lastTargetDimensions.height),
    indicatorTop: containerRect.height - (lastTargetDimensions.top + lastTargetDimensions.height)
  }]);
}

var shy = "\xAD";
function decorateCharacter(_ref, character, attributes, _ref2) {
  var _ref3 = _slicedToArray(_ref, 2),
      node = _ref3[0],
      path = _ref3[1];

  var length = _ref2.length;

  if (Text.isText(node)) {
    var parts = node.text.split(character);
    parts.pop();
    var i = 0;
    return parts.map(function (part) {
      i += part.length + 1;
      return _objectSpread2({
        anchor: {
          path: path,
          offset: i - 1
        },
        focus: {
          path: path,
          offset: i - 1 + length
        }
      }, attributes);
    });
  }

  return [];
}
function deleteCharacter(editor, node, path, regExp) {
  var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var match = regExp.exec(node.text);

  if (match) {
    Transforms["delete"](editor, {
      at: {
        path: path,
        offset: match.index + offset
      },
      distance: 1,
      unit: 'character'
    });
    return true;
  }

  return false;
}

function useLineBreakHandler(editor) {
  return useCallback(function (event) {
    if (event.key !== 'Enter') {
      return;
    }

    if (event.altKey === true) {
      editor.insertText(shy);
      event.preventDefault();
    } else if (event.shiftKey === true) {
      editor.insertText('\n');
      event.preventDefault();
    }
  }, [editor]);
}
function decorateLineBreaks(nodeEntry) {
  return decorateCharacter(nodeEntry, shy, {
    shy: true
  }, {
    length: 1
  });
}
function renderLeafWithLineBreakDecoration(_ref) {
  var leaf = _ref.leaf,
      children = _ref.children,
      attributes = _ref.attributes;

  if (leaf.shy) {
    children = /*#__PURE__*/React.createElement("span", {
      className: styles$7.shy
    }, children);
  }

  return renderLeaf$1({
    leaf: leaf,
    children: children,
    attributes: attributes
  });
}
function withLineBreakNormalization(editor) {
  var normalizeNode = editor.normalizeNode;

  editor.normalizeNode = function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        node = _ref3[0],
        path = _ref3[1];

    if (node.text) {
      if (deleteCharacter(editor, node, path, new RegExp("".concat(shy, "\\s"))) || deleteCharacter(editor, node, path, new RegExp("^".concat(shy))) || deleteCharacter(editor, node, path, new RegExp("\\s".concat(shy)), 1) || deleteCharacter(editor, node, path, new RegExp("".concat(shy).concat(shy)))) {
        return;
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
}

var EditableText = React.memo(function EditableText(_ref) {
  var value = _ref.value,
      contentElementId = _ref.contentElementId,
      placeholder = _ref.placeholder,
      onChange = _ref.onChange,
      selectionRect = _ref.selectionRect,
      className = _ref.className,
      placeholderClassName = _ref.placeholderClassName,
      _ref$scaleCategory = _ref.scaleCategory,
      scaleCategory = _ref$scaleCategory === void 0 ? 'body' : _ref$scaleCategory,
      autoFocus = _ref.autoFocus,
      _ref$floatingControls = _ref.floatingControlsPosition,
      floatingControlsPosition = _ref$floatingControls === void 0 ? 'below' : _ref$floatingControls;
  var editor = useMemo(function () {
    return withLinks(withCustomInsertBreak(withBlockNormalization({
      onlyParagraphs: !selectionRect
    }, withLineBreakNormalization(withReact(createEditor())))));
  }, [selectionRect]);
  var handleLineBreaks = useLineBreakHandler(editor);
  useEffect(function () {
    if (autoFocus) {
      ReactEditor.focus(editor);
    }
  }, [autoFocus, editor]);

  var _useCachedValue = useCachedValue(value, {
    defaultValue: [{
      type: 'paragraph',
      children: [{
        text: ''
      }]
    }],
    onDebouncedChange: onChange,
    onReset: function onReset(nextValue) {
      return resetSelectionIfOutsideNextValue(editor, nextValue);
    }
  }),
      _useCachedValue2 = _slicedToArray(_useCachedValue, 2),
      cachedValue = _useCachedValue2[0],
      setCachedValue = _useCachedValue2[1];

  var _useContentElementEdi = useContentElementEditorState(),
      isSelected = _useContentElementEdi.isSelected;

  useContentElementEditorCommandSubscription(function (command) {
    if (command.type === 'REMOVE') {
      Transforms.removeNodes(editor, {
        mode: 'highest'
      });
    } else if (command.type === 'TRANSIENT_STATE_UPDATE') {
      if ('typographyVariant' in command.payload) {
        applyTypograpyhVariant(editor, command.payload.typographyVariant);
      }

      if ('color' in command.payload) {
        applyColor(editor, command.payload.color);
      }
    }
  });

  var _useDropTargetsActive = useDropTargetsActive(),
      _useDropTargetsActive2 = _slicedToArray(_useDropTargetsActive, 2),
      dropTargetsActive = _useDropTargetsActive2[0],
      ref = _useDropTargetsActive2[1];

  return /*#__PURE__*/React.createElement(Text$1, {
    scaleCategory: scaleCategory
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$7.container, _defineProperty({}, styles$7.selected, isSelected)),
    ref: ref
  }, /*#__PURE__*/React.createElement(Slate, {
    editor: editor,
    value: cachedValue,
    onChange: setCachedValue
  }, /*#__PURE__*/React.createElement(LinkTooltipProvider, {
    editor: editor,
    position: floatingControlsPosition
  }, selectionRect && /*#__PURE__*/React.createElement(Selection, {
    contentElementId: contentElementId
  }), dropTargetsActive && /*#__PURE__*/React.createElement(DropTargets$1, {
    contentElementId: contentElementId
  }), /*#__PURE__*/React.createElement(HoveringToolbar, {
    position: floatingControlsPosition
  }), /*#__PURE__*/React.createElement(Editable, {
    className: className,
    decorate: decorateLineBreaks,
    onKeyDown: handleLineBreaks,
    renderElement: renderElementWithLinkPreview,
    renderLeaf: renderLeafWithLineBreakDecoration
  }))), /*#__PURE__*/React.createElement(TextPlaceholder, {
    text: placeholder,
    className: placeholderClassName,
    visible: isBlank(cachedValue)
  })));
});

function isBlank(value) {
  var _value$, _value$2, _value$2$children$;

  return value.length <= 1 && ((_value$ = value[0]) === null || _value$ === void 0 ? void 0 : _value$.children.length) <= 1 && value[0].type === 'paragraph' && !((_value$2 = value[0]) === null || _value$2 === void 0 ? void 0 : (_value$2$children$ = _value$2.children[0]) === null || _value$2$children$ === void 0 ? void 0 : _value$2$children$.text);
}

function resetSelectionIfOutsideNextValue(editor, nextValue) {
  var nextEditor = {
    children: nextValue
  };

  if (editor.selection && (!hasTextAtPoint(nextEditor, editor.selection.anchor) || !hasTextAtPoint(nextEditor, editor.selection.focus))) {
    Transforms.deselect(editor);
  }
}

function hasTextAtPoint(editor, point) {
  if (!Node.has(editor, point.path)) {
    return false;
  }

  var node = Node.get(editor, point.path);
  return Text.isText(node) && point.offset <= node.text.length;
}

function useLineBreakHandler$1(editor) {
  return useCallback(function (event) {
    if (event.key !== 'Enter') {
      return true;
    } // Soft hyphens used to be inserted with Shift + Enter.
    // Since Shift + Enter is now used for soft breaks in text blocks,
    // we switched to Alt + Enter. Since all line breaks in
    // EdtiableInlineText are soft, we also keep the old short cut


    if (event.shiftKey === true || event.altKey === true) {
      editor.insertText(shy);
    } else {
      editor.insertText('\n');
    }

    return false;
  }, [editor]);
}
function decorateLineBreaks$1(nodeEntry) {
  return [].concat(_toConsumableArray(decorateCharacter(nodeEntry, shy, {
    shy: true
  }, {
    length: 1
  })), _toConsumableArray(decorateCharacter(nodeEntry, "\n", {
    newLine: true
  }, {
    length: 0
  })));
}
function withLineBreakNormalization$1(editor) {
  var normalizeNode = editor.normalizeNode;

  editor.normalizeNode = function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        node = _ref2[0],
        path = _ref2[1];

    if (path.length === 0 && editor.children.length > 1) {
      Transforms.mergeNodes(editor);
      return;
    } else if (node.text) {
      if (deleteCharacter(editor, node, path, /\n\n/) || deleteCharacter(editor, node, path, new RegExp("^\n")) || deleteCharacter(editor, node, path, new RegExp("".concat(shy, "\\s"))) || deleteCharacter(editor, node, path, new RegExp("^".concat(shy))) || deleteCharacter(editor, node, path, new RegExp("\\s".concat(shy)), 1) || deleteCharacter(editor, node, path, new RegExp("".concat(shy).concat(shy)))) {
        return;
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
}

var styles$9 = {"shy":"index-module_shy__1E2-J","newLine":"index-module_newLine__1QnIs","selected":"index-module_selected__1U9ro","manualHyphens":"index-module_manualHyphens__16b2t"};

var EditableInlineText = memo(function EditableInlineText(_ref) {
  var _cachedValue$, _cachedValue$$childre;

  var value = _ref.value,
      _ref$defaultValue = _ref.defaultValue,
      defaultValue = _ref$defaultValue === void 0 ? '' : _ref$defaultValue,
      hyphens = _ref.hyphens,
      placeholder = _ref.placeholder,
      onChange = _ref.onChange;
  var editor = useMemo(function () {
    return withLineBreakNormalization$1(withReact(createEditor()));
  }, []);
  var handleLineBreaks = useLineBreakHandler$1(editor);

  var _useCachedValue = useCachedValue(value, {
    defaultValue: [{
      type: 'heading',
      children: [{
        text: defaultValue
      }]
    }],
    onDebouncedChange: onChange
  }),
      _useCachedValue2 = _slicedToArray(_useCachedValue, 2),
      cachedValue = _useCachedValue2[0],
      setCachedValue = _useCachedValue2[1];

  var _useContentElementEdi = useContentElementEditorState(),
      isSelected = _useContentElementEdi.isSelected;

  return /*#__PURE__*/React.createElement("div", {
    className: classNames(frontendStyles.root, frontendStyles["hyphens-".concat(hyphens)], _defineProperty({}, styles$9.manualHyphens, hyphens === 'manual'), _defineProperty({}, styles$9.selected, isSelected)),
    spellCheck: "false"
  }, /*#__PURE__*/React.createElement(Slate, {
    editor: editor,
    value: cachedValue,
    onChange: setCachedValue
  }, /*#__PURE__*/React.createElement(Editable, {
    decorate: decorateLineBreaks$1,
    onKeyDown: handleLineBreaks,
    renderLeaf: renderLeaf
  })), /*#__PURE__*/React.createElement(TextPlaceholder, {
    text: placeholder,
    visible: !((_cachedValue$ = cachedValue[0]) === null || _cachedValue$ === void 0 ? void 0 : (_cachedValue$$childre = _cachedValue$.children[0]) === null || _cachedValue$$childre === void 0 ? void 0 : _cachedValue$$childre.text)
  }));
});

function renderLeaf(_ref2) {
  var attributes = _ref2.attributes,
      children = _ref2.children,
      leaf = _ref2.leaf;

  if (leaf.shy) {
    children = /*#__PURE__*/React.createElement("span", {
      className: styles$9.shy
    }, children);
  }

  if (leaf.newLine) {
    children = /*#__PURE__*/React.createElement("span", {
      className: styles$9.newLine
    }, children);
  }

  return /*#__PURE__*/React.createElement("span", attributes, children);
}

var styles$a = {"button":"ActionButton-module_button__8gy6J","position-outside":"ActionButton-module_position-outside__1E_lp","position-outsideIndented":"ActionButton-module_position-outsideIndented__3vf-7","position-inside":"ActionButton-module_position-inside__28_gp"};

function _extends$e() {
  _extends$e = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$e.apply(this, arguments);
}
var pencil = (function (_ref) {
  var _ref$styles = _ref.styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return /*#__PURE__*/React.createElement("svg", _extends$e({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1-33.9-33.9-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2l199.2-199.2 22.6-22.7zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9l-78.2 23 23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7l-14.4 14.5-22.6 22.6-11.4 11.3 33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5l-39.3-39.4c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
  }));
});

var icons = {
  pencil: pencil
};
function ActionButton(_ref) {
  var icon = _ref.icon,
      text = _ref.text,
      position = _ref.position,
      onClick = _ref.onClick;
  var Icon = icons[icon];
  return /*#__PURE__*/React.createElement("button", {
    className: classNames(styles$a.button, styles$a["position-".concat(position)]),
    onClick: onClick
  }, /*#__PURE__*/React.createElement(Icon, {
    width: 15,
    height: 15
  }), text);
}

function PhonePlatformProvider(_ref) {
  var children = _ref.children;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      phoneEmulationMode = _useState2[0],
      setPhoneEmulationMode = _useState2[1];

  useEffect(function () {
    window.addEventListener('message', receive);

    function receive(event) {
      if (event.data.type === 'CHANGE_EMULATION_MODE') {
        if (event.data['payload'] === 'phone') {
          setPhoneEmulationMode(true);
        } else {
          setPhoneEmulationMode(false);
        }
      }
    }

    return function () {
      return window.removeEventListener('message', receive);
    };
  });
  return /*#__PURE__*/React.createElement(PhonePlatformContext.Provider, {
    value: phoneEmulationMode
  }, children);
}

export { ActionButton, ContentDecorator, ContentElementDecorator, EditableInlineText, EditableText, LayoutWithPlaceholder, PhonePlatformProvider, SectionDecorator };
