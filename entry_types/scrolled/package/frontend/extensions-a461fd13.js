import { features } from 'pageflow/frontend';
import React, { useMemo, useState, useCallback, useContext, useEffect, useRef, forwardRef, createContext, memo } from 'react';
import classNames from 'classnames';
import { P as scrollToElement, g as useContentElementAttributes, n as useStorylineActivity, w as widths, d as api, o as useFloatingPortalRoot, u as useScrollToTarget, Q as LayoutWithoutInlineEditing, f as useDarkBackground, R as renderElement, N as renderLeaf$1, T as Text$1 } from './FloatingPortalRootProvider-20c600de.js';
import './useDelayedBoolean-a387d85b.js';
import { v as ContentElementEditorCommandEmitterContext, a as usePostMessageListener, a4 as MotifAreaVisibilityProvider, a5 as ForcePaddingContext, a6 as ContentElementConfigurationUpdateContext, a7 as WidgetConfigurationUpdateContext, N as getAppearanceSectionScopeName, a3 as SectionThumbnail, t as useContentElementEditorCommandSubscription, l as frontendStyles, a8 as createRenderElement, a9 as usePhoneLayout, aa as tableStyles, s as styles$j } from './Placeholder.module-d22a9335.js';
import BackboneEvents from 'backbone-events-standalone';
import { useEntryStateDispatch, useTheme, updateContentElementConfiguration, updateWidgetConfiguration, useChapter, useMainStoryline, useDownloadableFile } from 'pageflow-scrolled/entryState';
import 'i18n-js';
import { u as useI18n } from './i18n-493cd2a6.js';
import 'striptags';
import 'react-measure';
import { P as PhonePlatformContext } from './PhonePlatformContext-035a99fa.js';
import { u as useContentElementEditorState, C as ContentElementEditorStateContext } from './useContentElementEditorState-a084912e.js';
import './ThemeIcon-ab834849.js';
import { ReviewStateProvider, LocatedCommentThreadsProvider, CommentDisplayFilterProvider, useCommentThreads, useCommentDisplayFilter, useLocatedCommentThreadsForSubject, ThreadsBadge, useAnchoredFloating, useUnreadActivityCount, Badge, alignToContainerEdge, useRangeAnchors, useCommentHighlights, decorateCommentHighlights, RangeAnchor, commentHighlightStyles } from 'pageflow-scrolled/review';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useFloating, hide, shift, autoUpdate, FloatingPortal, offset, arrow, inline, FloatingArrow } from '@floating-ui/react';
import { Range, Transforms, Editor, Node as Node$1, Element as Element$1, Path, Text, createEditor } from 'slate';
import { ReactEditor, useSlate, withReact, Slate, Editable } from 'slate-react';
import { withHistory } from 'slate-history';
import debounce from 'debounce';

const Context = React.createContext({});
function EditorStateProvider(props) {
  const [selection, setSelectionState] = useState(null);
  const setSelection = useCallback(selection => {
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'SELECTED',
        payload: selection || {}
      }, window.location.origin);
    }
    setSelectionState(selection);
  }, []);
  const value = useMemo(() => ({
    selection,
    setSelection
  }), [setSelection, selection]);
  return /*#__PURE__*/React.createElement(Context.Provider, {
    value: value
  }, props.children);
}
function useEditorSelection(options) {
  const {
    selection,
    setSelection
  } = useContext(Context);
  const resetSelection = useCallback(() => {
    setSelection(null);
  }, [setSelection]);
  const select = useCallback(selection => {
    setSelection(selection || options);
  }, [setSelection, options]);
  return useMemo(() => {
    if (!setSelection) return {};
    const isSelected = !!(selection && options && selection.id === options.id && selection.type === options.type && selection.subjectType === options.subjectType && selection.subjectId === options.subjectId);
    return {
      range: selection === null || selection === void 0 ? void 0 : selection.range,
      isSelected,
      selection: isSelected ? selection : null,
      select,
      resetSelection
    };
  }, [options, selection, setSelection, select, resetSelection]);
}

function useContentElementEditorCommandEmitter() {
  return useMemo(() => Object.assign({}, BackboneEvents), []);
}
function ContentElementEditorCommandSubscriptionProvider({
  emitter,
  children
}) {
  return /*#__PURE__*/React.createElement(ContentElementEditorCommandEmitterContext.Provider, {
    value: emitter
  }, children);
}

function EntryDecorator({
  commentingInitialState,
  children
}) {
  const contentElementEditorCommandEmitter = useContentElementEditorCommandEmitter();
  return /*#__PURE__*/React.createElement(EditorStateProvider, null, /*#__PURE__*/React.createElement(ReviewStateProvider, {
    initialState: commentingInitialState
  }, /*#__PURE__*/React.createElement(MessageHandler, {
    contentElementEditorCommandEmitter: contentElementEditorCommandEmitter
  }), /*#__PURE__*/React.createElement(LocatedCommentThreadsProvider, null, /*#__PURE__*/React.createElement(CommentDisplayFilterFromEditor, null, /*#__PURE__*/React.createElement(ContentElementEditorCommandSubscriptionProvider, {
    emitter: contentElementEditorCommandEmitter
  }, children)))));
}

// The reviewer picks which resolutions to see in the editor's sidebar
// menu, so the preview only follows what the editor tells it.
function CommentDisplayFilterFromEditor({
  children
}) {
  const [filter, setFilter] = useState({
    resolution: 'unresolved',
    alwaysShowComments: true
  });
  usePostMessageListener(useCallback(data => {
    if (data.type === 'CHANGE_COMMENT_DISPLAY_FILTER') {
      setFilter(data.payload);
    }
  }, []));
  return /*#__PURE__*/React.createElement(CommentDisplayFilterProvider, {
    resolution: filter.resolution,
    alwaysShowComments: filter.alwaysShowComments
  }, children);
}
function MessageHandler({
  contentElementEditorCommandEmitter
}) {
  const {
    select
  } = useEditorSelection();
  const dispatch = useEntryStateDispatch();
  const receiveMessage = useCallback(data => {
    if (data.type === 'ACTION') {
      dispatch(data.payload);
    } else if (data.type === 'SELECT') {
      select(data.payload);
    } else if (data.type === 'CONTENT_ELEMENT_EDITOR_COMMAND') {
      contentElementEditorCommandEmitter.trigger(`command:${data.payload.contentElementId}`, data.payload.command);
    }
  }, [dispatch, select, contentElementEditorCommandEmitter]);
  usePostMessageListener(receiveMessage);
  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'READY'
      }, window.location.origin);
    }
  }, []);
  return null;
}

// Scroll points are used to preserve scroll position when toggling
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
  const scrollPoint = useRef();
  const receiveMessage = useCallback(data => {
    if (data.type === 'SAVE_SCROLL_POINT') {
      scrollPoint.current = getCurrentScrollPoint();
      window.parent.postMessage({
        type: 'SAVED_SCROLL_POINT'
      }, window.location.origin);
    } else if (data.type === 'RESTORE_SCROLL_POINT') {
      if (scrollPoint.current) {
        restoreScrollPoint(scrollPoint.current);
      }
    } else if (data.type === 'SCROLL_TO_CONTENT_ELEMENT') {
      scrollToContentElement(data.payload);
    }
  }, []);
  usePostMessageListener(receiveMessage);
  return null;
}
function scrollToContentElement({
  id,
  ...options
}) {
  const element = document.querySelector(`[data-scrollpoint="${id}"]`);
  if (element) {
    scrollToElement(element, options);
  }
}
function getCurrentScrollPoint() {
  let scrollPointElement = getSelectionScrollPointElement() || getScrollPointElementWithMinimumTopPositionInViewport();
  return scrollPointElement === null || scrollPointElement === void 0 ? void 0 : scrollPointElement.getAttribute('data-scrollpoint');
}
function getSelectionScrollPointElement() {
  return document.querySelector('[data-scrollpoint=selection]');
}
function getScrollPointElementWithMinimumTopPositionInViewport() {
  let minTop = Infinity;
  let scrollPointElement;
  const scrollPoints = document.querySelectorAll('[data-scrollpoint]');
  for (let i = 0; i < scrollPoints.length; i++) {
    const rect = scrollPoints[i].getBoundingClientRect();
    if (rect.top > 0 && rect.top < minTop) {
      minTop = rect.top;
      scrollPointElement = scrollPoints[i];
    }
  }
  return scrollPointElement;
}
function restoreScrollPoint(name) {
  let element = document.querySelector(`[data-scrollpoint="${name}"]`);
  if (element) {
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 100,
      behavior: 'smooth'
    });
  }
}

function ContentDecorator(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ScrollPointMessageHandler, null), /*#__PURE__*/React.createElement(DndProvider, {
    backend: HTML5Backend
  }, props.children));
}

var styles = {"wrapper":"SectionDecorator-module_wrapper__3sTk3","highlighted":"SectionDecorator-module_highlighted__18FyB","lineAbove":"SectionDecorator-module_lineAbove__BZqEr","lineBelow":"SectionDecorator-module_lineBelow__1RbG-","selected":"SectionDecorator-module_selected__1gcmF","transitionSelected":"SectionDecorator-module_transitionSelected__Wklk6","controls":"SectionDecorator-module_controls__LVEJG","transitionToolbar-after":"SectionDecorator-module_transitionToolbar-after__2_DVO SectionDecorator-module_toolbar__2Va1D","toolbar":"SectionDecorator-module_toolbar__2Va1D","commentBadge":"SectionDecorator-module_commentBadge__dSkqW","sticky":"SectionDecorator-module_sticky__3ALcJ","clipBadgeCorner":"SectionDecorator-module_clipBadgeCorner__3n3iG","commenting":"SectionDecorator-module_commenting__2IONO","transitionToolbar-before":"SectionDecorator-module_transitionToolbar-before__KipOO SectionDecorator-module_toolbar__2Va1D"};

var styles$1 = {"wrapper":"BackdropDecorator-module_wrapper__X-h1o","visible":"BackdropDecorator-module_visible__3VqiR","inner":"BackdropDecorator-module_inner__14JfF"};

var styles$2 = {"wrapper":"ContentElementDecorator-module_wrapper__NQgFN"};

var styles$3 = {"wrapper":"WidgetSelectionRect-module_wrapper__1ktq9","selected":"WidgetSelectionRect-module_selected__2nm_L"};

var styles$4 = {"indicator":"PaddingIndicator-module_indicator__1XR6g","selected":"PaddingIndicator-module_selected__2nryl","indicator-top":"PaddingIndicator-module_indicator-top__3CQ9Y PaddingIndicator-module_indicator__1XR6g","indicator-bottom":"PaddingIndicator-module_indicator-bottom__31WQe PaddingIndicator-module_indicator__1XR6g","none":"PaddingIndicator-module_none__3QJ9B","motif":"PaddingIndicator-module_motif__1s4Z2","tooltip":"PaddingIndicator-module_tooltip__3lItX"};

var styles$5 = {"Toolbar":"Toolbar-module_Toolbar__1INSj","button":"Toolbar-module_button__de5BW","activeButton":"Toolbar-module_activeButton__2sOLP","collapsible":"Toolbar-module_collapsible__3sivb"};

function Toolbar({
  buttons,
  onButtonClick,
  iconSize,
  collapsible
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$5.Toolbar, {
      [styles$5.collapsible]: collapsible
    }),
    contentEditable: false
  }, buttons.map(button => {
    const Icon = button.icon;
    return /*#__PURE__*/React.createElement("button", {
      key: button.name,
      title: button.text,
      className: classNames(styles$5.button, {
        [styles$5.activeButton]: button.active
      }),
      onMouseDown: event => {
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

// Bundles an element's two comment-related editor selections - the
// highlighted comment thread and the pending new thread - which are
// mutually exclusive since the editor has a single selection at a time.
// Returns the active state plus actions to select the comments, a
// specific thread or a new thread. `type` is the comments selection type
// ('contentElementComments' or 'sectionComments'); `subjectType` and
// `subjectId` identify the new-thread subject.
function useCommentSelection({
  type,
  id,
  subjectType,
  subjectId
}) {
  const {
    isSelected: commentsSelected,
    selection: commentsSelection,
    select: selectComments
  } = useEditorSelection(useMemo(() => ({
    type,
    id
  }), [type, id]));
  const {
    isSelected: newThreadActive,
    range: newThreadRange,
    select: selectNewThreadSelection
  } = useEditorSelection(useMemo(() => ({
    type: 'newThread',
    subjectType,
    subjectId
  }), [subjectType, subjectId]));
  const selectThread = useCallback((threadId, options) => selectComments({
    type,
    id,
    highlightedThreadId: threadId,
    ...options
  }), [selectComments, type, id]);
  const selectNewThread = useCallback(range => range ? selectNewThreadSelection({
    type: 'newThread',
    subjectType,
    subjectId,
    range
  }) : selectNewThreadSelection(), [selectNewThreadSelection, subjectType, subjectId]);
  return {
    selected: commentsSelected ? 'comments' : newThreadActive ? 'newThread' : null,
    highlightedThreadId: commentsSelection === null || commentsSelection === void 0 ? void 0 : commentsSelection.highlightedThreadId,
    newThreadRange: newThreadActive ? newThreadRange : undefined,
    selectComments,
    selectThread,
    selectNewThread
  };
}
function useContentElementCommentSelection() {
  const {
    contentElementId,
    contentElementPermaId
  } = useContentElementAttributes();
  return useCommentSelection({
    type: 'contentElementComments',
    id: contentElementId,
    subjectType: 'ContentElement',
    subjectId: contentElementPermaId
  });
}

// Handles the SELECT_COMMENT_THREAD message the editor posts when a
// thread is clicked in the comments sidebar. Fetches the subject's
// threads itself - including resolved ones, so a resolved thread can be
// revealed when clicked - ignores threads of other subjects, scrolls
// the relevant element into view and calls `selectThread` to make the
// matching editor selection. `beforeSelect` runs right before that, for
// callers that need to prepare for it (e.g. move the editor cursor into
// the thread's block). Shared by the content element and section
// decorators and the EditableText editor so the handling lives in one
// place instead of inside each badge. The selection names the editor as
// its source, which tells the editor it is looking at its own request
// coming back rather than at the reviewer picking a subject in the
// preview.
function useSelectCommentThreadHandler({
  subjectType,
  subjectId,
  getScrollTarget,
  beforeSelect,
  selectThread
}) {
  const threads = useCommentThreads({
    subjectType,
    subjectId
  });
  usePostMessageListener(useCallback(data => {
    if (data.type !== 'SELECT_COMMENT_THREAD') return;
    const {
      threadId
    } = data.payload;
    if (!threads.some(thread => thread.id === threadId)) return;
    const scrollTarget = getScrollTarget && getScrollTarget(threadId);
    if (scrollTarget) {
      scrollTarget.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
    if (beforeSelect) beforeSelect(threadId);
    selectThread(threadId, {
      source: 'editor'
    });
  }, [threads, getScrollTarget, beforeSelect, selectThread]));
}

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
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
var transitionIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "random",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-random"] || "fa-random") + " " + (styles["fa-w-16"] || "fa-w-16"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 01-8.773-3.812l-70.556-75.596 53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971l80 79.981zM12 176h84l52.781 56.551 53.333-57.143-70.556-75.596A11.999 11.999 0 00122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12zm372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 00-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176h32z"
})));

function SectionDecorator({
  backdrop,
  section,
  contentElements,
  transitions,
  children
}) {
  var _backdrop$contentElem;
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const commentingEnabled = features.isEnabled('commenting');
  const {
    isSelected: isSectionSelected,
    select,
    resetSelection
  } = useEditorSelection({
    id: section.id,
    type: 'sectionSettings'
  });
  const {
    isSelected: isPaddingSelected
  } = useEditorSelection({
    id: section.id,
    type: 'sectionPaddings'
  });
  const {
    selected: commentSelectionState,
    selectComments,
    selectThread,
    selectNewThread
  } = useCommentSelection({
    type: 'sectionComments',
    id: section.id,
    subjectType: 'Section',
    subjectId: section.permaId
  });

  // Viewing a section's comments or composing a new thread on it.
  const commentsSelected = commentSelectionState !== null;

  // The section reads as selected while its comments are open, so the
  // section and the sidebar comment panel stay visually in sync.
  const isSelected = isSectionSelected || isPaddingSelected || commentsSelected;
  const {
    resolution,
    alwaysShowComments
  } = useCommentDisplayFilter();
  const threads = useLocatedCommentThreadsForSubject({
    subjectType: 'Section',
    subjectId: section.permaId,
    resolution
  });
  const hasThreads = threads.length > 0;
  const wrapperRef = useRef();
  useSelectCommentThreadHandler({
    subjectType: 'Section',
    subjectId: section.permaId,
    getScrollTarget: useCallback(() => wrapperRef.current, []),
    selectThread
  });
  const clipBadgeCorner = commentingEnabled && (isSectionSelected || isPaddingSelected) && !hasThreads;
  const {
    isSelected: isBackdropElementSelected
  } = useEditorSelection({
    id: (_backdrop$contentElem = backdrop.contentElement) === null || _backdrop$contentElem === void 0 ? void 0 : _backdrop$contentElem.id,
    type: 'contentElement'
  });
  const {
    isSelected: isHighlighted
  } = useEditorSelection({
    id: section.id,
    type: 'section'
  });
  const transitionSelection = useEditorSelection({
    id: section.id,
    type: 'sectionTransition'
  });
  const nextTransitionSelection = useEditorSelection({
    id: section.nextSection && section.nextSection.id,
    type: 'sectionTransition'
  });
  const lastContentElement = contentElements[contentElements.length - 1];
  const {
    isSelected: isLastContentElementSelected
  } = useEditorSelection({
    id: lastContentElement && lastContentElement.id,
    type: 'contentElement'
  });
  function selectIfOutsideContentItem(event) {
    if (!event.target.closest(`.${styles$2.wrapper}`) && !event.target.closest(`.${styles$1.wrapper}`) && !event.target.closest(`.${styles$3.wrapper}`) && !event.target.closest(`.${styles$4.indicator}`) && !event.target.closest(`.${styles.commentBadge}`) && !event.target.closest('#fullscreenRoot') && !event.target.closest('[data-floating-ui-portal]')) {
      isSectionSelected ? resetSelection() : select();
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: wrapperRef,
    "aria-label": t('pageflow_scrolled.inline_editing.select_section'),
    "aria-selected": isSelected,
    className: className(isSelected, transitionSelection, isHighlighted, isBackdropElementSelected, transitions, clipBadgeCorner, commentingEnabled),
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
    value: isLastContentElementSelected || isSectionSelected || isHighlighted || commentsSelected
  }, children)), commentingEnabled && /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.commentBadge, {
      [styles.sticky]: hasThreads || commentsSelected
    })
  }, /*#__PURE__*/React.createElement(ThreadsBadge, {
    subjectType: "Section",
    subjectId: section.permaId,
    resolution: resolution,
    mode: commentsSelected ? 'active' : isSelected ? 'icon' : alwaysShowComments ? 'dot' : 'none',
    onClick: () => hasThreads ? selectComments() : selectNewThread()
  })));
}
function className(isSelected, transitionSelection, isHighlighted, isBackdropElementSelected, transitions, clipBadgeCorner, commenting) {
  return classNames(styles.wrapper, {
    [styles.selected]: isSelected,
    [styles.highlighted]: isHighlighted,
    [styles.lineAbove]: isBackdropElementSelected && transitions[0].startsWith('fade'),
    [styles.lineBelow]: isBackdropElementSelected && transitions[1].startsWith('fade'),
    [styles.transitionSelected]: transitionSelection.isSelected,
    [styles.clipBadgeCorner]: clipBadgeCorner,
    [styles.commenting]: commenting
  });
}
function renderEditTransitionButton({
  id,
  position,
  selection
}) {
  if (!id) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles[`transitionToolbar-${position}`]
  }, /*#__PURE__*/React.createElement(EditTransitionButton, {
    id: id,
    selection: selection,
    position: position
  }));
}
function EditTransitionButton({
  id,
  position,
  selection
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  return /*#__PURE__*/React.createElement(EditSectionButton, {
    id: id,
    selection: selection,
    text: t(`pageflow_scrolled.inline_editing.edit_section_transition_${position}`),
    icon: transitionIcon
  });
}
function EditSectionButton({
  id,
  selection,
  icon,
  text
}) {
  return /*#__PURE__*/React.createElement(Toolbar, {
    buttons: [{
      name: 'button',
      active: selection.isSelected,
      icon,
      text
    }],
    iconSize: 20,
    onButtonClick: () => selection.select()
  });
}

var styles$6 = {"selectionWidth":"1px","selectionPadding":"-0.5em","main":"SelectionRect-module_main__3AOhG","draggable":"SelectionRect-module_draggable__3Qp53","tug":"SelectionRect-module_tug__DmW1G","openSides":"SelectionRect-module_openSides__bf5fO","inset":"SelectionRect-module_inset__3den3","selected":"SelectionRect-module_selected__1PhM6","toolbar":"SelectionRect-module_toolbar__3nPrd","insert":"SelectionRect-module_insert__w0Tl0","insertHovered":"SelectionRect-module_insertHovered__VTsDD","start":"SelectionRect-module_start__3_nAf","insert-before":"SelectionRect-module_insert-before__2Tyq5 SelectionRect-module_insert__w0Tl0","end":"SelectionRect-module_end__3qOoK","insert-after":"SelectionRect-module_insert-after__3FJ4R SelectionRect-module_insert__w0Tl0","hasCommentBadge":"SelectionRect-module_hasCommentBadge__RuLsP","insertButton":"SelectionRect-module_insertButton__1g-ZG","dragHandle":"SelectionRect-module_dragHandle__2vVhP","commentBadge":"SelectionRect-module_commentBadge__3e0x_","commentBadgeInset":"SelectionRect-module_commentBadgeInset__3YISH"};

function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function (target) {
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
var PlusIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$1({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M256 0C114.844 0 0 114.839 0 256s114.844 256 256 256 256-114.839 256-256S397.156 0 256 0zm133.594 272.699H272.699v116.895c0 9.225-7.48 16.699-16.699 16.699-9.219 0-16.699-7.475-16.699-16.699V272.699H122.406c-9.219 0-16.699-7.475-16.699-16.699 0-9.225 7.48-16.699 16.699-16.699h116.895V122.406c0-9.225 7.48-16.699 16.699-16.699 9.219 0 16.699 7.475 16.699 16.699v116.895h116.895c9.219 0 16.699 7.475 16.699 16.699.001 9.225-7.48 16.699-16.699 16.699z"
})));

function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function (target) {
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
var MoveIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$2({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "arrows-alt",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-arrows-alt"] || "fa-arrows-alt") + " " + (styles["fa-w-16"] || "fa-w-16"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M352.201 425.775l-79.196 79.196c-9.373 9.373-24.568 9.373-33.941 0l-79.196-79.196c-15.119-15.119-4.411-40.971 16.971-40.97h51.162L228 284H127.196v51.162c0 21.382-25.851 32.09-40.971 16.971L7.029 272.937c-9.373-9.373-9.373-24.569 0-33.941L86.225 159.8c15.119-15.119 40.971-4.411 40.971 16.971V228H228V127.196h-51.23c-21.382 0-32.09-25.851-16.971-40.971l79.196-79.196c9.373-9.373 24.568-9.373 33.941 0l79.196 79.196c15.119 15.119 4.411 40.971-16.971 40.971h-51.162V228h100.804v-51.162c0-21.382 25.851-32.09 40.97-16.971l79.196 79.196c9.373 9.373 9.373 24.569 0 33.941L425.773 352.2c-15.119 15.119-40.971 4.411-40.97-16.971V284H284v100.804h51.23c21.382 0 32.09 25.851 16.971 40.971z"
})));

const SelectionRect = forwardRef(function SelectionRect(props, ref) {
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: classNames(styles$6.main, {
      [styles$6.openSides]: props.full && !props.inset,
      [styles$6.tug]: props.full || props.customMargin,
      [styles$6.inset]: props.inset,
      [styles$6.selected]: props.selected,
      [styles$6.draggable]: props.drag,
      [styles$6.hasCommentBadge]: props.commentBadge && !props.commentBadgeInset,
      [styles$6.start]: props.selected && props.start,
      [styles$6.end]: props.selected && props.end
    }),
    "aria-label": props.ariaLabel,
    "aria-selected": props.selected,
    "data-scrollpoint": props.scrollPoint ? 'selection' : undefined,
    onClick: props.onClick
  }, renderDragHandle(props), renderCommentBadge(props), renderToolbar(props), /*#__PURE__*/React.createElement(InsertButton, Object.assign({}, props, {
    at: "before"
  })), props.children, /*#__PURE__*/React.createElement(InsertButton, Object.assign({}, props, {
    at: "after"
  })));
});
function InsertButton(props) {
  const [insertHovered, setInsertHovered] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$6[`insert-${props.at}`], {
      [styles$6.insertHovered]: insertHovered
    }),
    contentEditable: false
  }, /*#__PURE__*/React.createElement("button", {
    className: styles$6.insertButton,
    title: props.insertButtonTitles && props.insertButtonTitles[props.at],
    onMouseDown: event => event.preventDefault(),
    onClick: () => props.onInsertButtonClick(props.at),
    onMouseEnter: () => setInsertHovered(true),
    onMouseLeave: () => setInsertHovered(false)
  }, /*#__PURE__*/React.createElement(PlusIcon, {
    width: 15,
    height: 15,
    fill: "currentColor"
  })));
}
function renderDragHandle({
  drag,
  dragHandleTitle
}) {
  if (!drag) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: drag,
    className: styles$6.dragHandle,
    title: dragHandleTitle
  }, /*#__PURE__*/React.createElement(MoveIcon, null));
}
function renderCommentBadge({
  commentBadge,
  commentBadgeInset
}) {
  if (!commentBadge) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$6.commentBadge, {
      [styles$6.commentBadgeInset]: commentBadgeInset
    }),
    onClick: e => e.stopPropagation()
  }, commentBadge);
}
function renderToolbar({
  toolbarButtons,
  onToolbarButtonClick,
  start
}) {
  if (toolbarButtons && start) {
    return /*#__PURE__*/React.createElement("div", {
      className: styles$6.toolbar
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

var styles$7 = {"target":"DropTargets-module_target__Z2N2d","isOver":"DropTargets-module_isOver__3ksFy","before":"DropTargets-module_before__cAXo1 DropTargets-module_target__Z2N2d","after":"DropTargets-module_after__2Q8QU DropTargets-module_target__Z2N2d"};

function DropTargets({
  accept,
  canDrop,
  onDrop
}) {
  const [{
    canDropBefore,
    isBefore
  }, dropBefore] = useDrop({
    accept,
    canDrop: item => canDrop({
      at: 'before',
      id: item.id
    }),
    collect: monitor => ({
      canDropBefore: monitor.canDrop(),
      isBefore: monitor.isOver() && monitor.canDrop()
    }),
    drop: item => onDrop({
      at: 'before',
      id: item.id,
      range: item.range
    })
  });
  const [{
    canDropAfter,
    isAfter
  }, dropAfter] = useDrop({
    accept,
    canDrop: item => canDrop({
      at: 'after',
      id: item.id
    }),
    collect: monitor => ({
      canDropAfter: monitor.canDrop(),
      isAfter: monitor.isOver() && monitor.canDrop()
    }),
    drop: item => onDrop({
      at: 'after',
      id: item.id,
      range: item.range
    })
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, canDropBefore && /*#__PURE__*/React.createElement("div", {
    ref: dropBefore,
    "data-testid": "drop-before",
    className: classNames(styles$7.before, {
      [styles$7.isOver]: isBefore
    })
  }), canDropAfter && /*#__PURE__*/React.createElement("div", {
    ref: dropAfter,
    "data-testid": "drop-after",
    title: "bar",
    className: classNames(styles$7.after, {
      [styles$7.isOver]: isAfter
    })
  }));
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

var styles$8 = {"indicator":"MarginIndicator-module_indicator__eise1","indicator-top":"MarginIndicator-module_indicator-top__2igv4 MarginIndicator-module_indicator__eise1","indicator-bottom":"MarginIndicator-module_indicator-bottom__2-qSB MarginIndicator-module_indicator__eise1","tooltip":"MarginIndicator-module_tooltip__1cC4b","inset":"MarginIndicator-module_inset__xg51Q"};

function MarginIndicator({
  marginValue,
  position,
  tooltipInset
}) {
  var _theme$options, _theme$translations;
  const {
    isSelected
  } = useContentElementEditorState();
  const theme = useTheme();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const scale = Scale({
    scaleName: 'contentElementMargin',
    themeProperties: ((_theme$options = theme.options) === null || _theme$options === void 0 ? void 0 : _theme$options.properties) || {},
    scaleTranslations: ((_theme$translations = theme.translations) === null || _theme$translations === void 0 ? void 0 : _theme$translations.scales) || {},
    defaultValuePropertyName: 'contentElementMarginStyleDefault'
  });
  const index = scale.values.indexOf(marginValue);
  if (!isSelected || !marginValue || index < 0) {
    return null;
  }
  const label = t(`pageflow_scrolled.inline_editing.content_element_margin_${position}`);
  return /*#__PURE__*/React.createElement("div", {
    "aria-label": label,
    className: styles$8[`indicator-${position}`],
    style: {
      '--indicator-height': `var(--theme-content-element-margin-${marginValue})`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$8.tooltip, {
      [styles$8.inset]: tooltipInset
    }),
    title: label
  }, scale.texts[index]));
}

function postInsertContentElementMessage({
  id,
  at,
  splitPoint
}) {
  window.parent.postMessage({
    type: 'INSERT_CONTENT_ELEMENT',
    payload: {
      id,
      at,
      splitPoint
    }
  }, window.location.origin);
}
function postMoveContentElementMessage({
  id,
  range,
  to
}) {
  window.parent.postMessage({
    type: 'MOVE_CONTENT_ELEMENT',
    payload: {
      id,
      range,
      to
    }
  }, window.location.origin);
}
function postUpdateContentElementMessage({
  id,
  configuration,
  commentThreadSubjectRanges
}) {
  window.parent.postMessage({
    type: 'UPDATE_CONTENT_ELEMENT',
    payload: {
      id,
      configuration,
      commentThreadSubjectRanges
    }
  }, window.location.origin);
}
function postUpdateWidgetMessage({
  role,
  configuration
}) {
  window.parent.postMessage({
    type: 'UPDATE_WIDGET',
    payload: {
      role,
      configuration
    }
  }, window.location.origin);
}
function postUpdateTransientContentElementStateMessage({
  id,
  state
}) {
  window.parent.postMessage({
    type: 'UPDATE_TRANSIENT_CONTENT_ELEMENT_STATE',
    payload: {
      id,
      state
    }
  }, window.location.origin);
}
function postSelectLinkDestinationMessage() {
  window.parent.postMessage({
    type: 'SELECT_LINK_DESTINATION'
  }, window.location.origin);
}

function ContentElementConfigurationUpdateProvider({
  id,
  permaId,
  children
}) {
  const dispatch = useEntryStateDispatch();
  const update = useCallback((configuration, {
    commentThreadSubjectRanges
  } = {}) => {
    postUpdateContentElementMessage({
      id,
      configuration,
      commentThreadSubjectRanges
    });
    updateContentElementConfiguration({
      dispatch,
      permaId,
      configuration
    });
  }, [dispatch, permaId, id]);
  return /*#__PURE__*/React.createElement(ContentElementConfigurationUpdateContext.Provider, {
    value: update
  }, children);
}

function ContentElementEditorStateProvider({
  id,
  permaId,
  children
}) {
  const {
    isSelected,
    select,
    range
  } = useEditorSelection(useMemo(() => ({
    id,
    type: 'contentElement'
  }), [id]));
  const {
    isSelected: commentsSelected,
    select: selectComments
  } = useEditorSelection(useMemo(() => ({
    id,
    type: 'contentElementComments'
  }), [id]));
  const {
    isSelected: newThreadSelected,
    select: selectNewThread
  } = useEditorSelection(useMemo(() => ({
    type: 'newThread',
    subjectType: 'ContentElement',
    subjectId: permaId
  }), [permaId]));
  const storylineMode = useStorylineActivity();
  const inForeground = storylineMode === 'active';
  const type = inForeground ? isSelected ? 'contentElement' : commentsSelected ? 'contentElementComments' : newThreadSelected ? 'newThread' : null : null;
  const previousTransientState = useRef({});
  const setTransientState = useCallback(state => {
    if (!shallowEqual(state, previousTransientState.current)) {
      postUpdateTransientContentElementStateMessage({
        id,
        state
      });
      previousTransientState.current = state;
    }
  }, [id]);
  const value = useMemo(() => ({
    isEditable: true,
    select,
    selectComments,
    selectNewThread,
    isSelected: !!type,
    type,
    range,
    setTransientState
  }), [select, selectComments, selectNewThread, type, range, setTransientState]);
  return /*#__PURE__*/React.createElement(ContentElementEditorStateContext.Provider, {
    value: value
  }, children);
}
function shallowEqual(obj1, obj2) {
  return Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every(key => Object.prototype.hasOwnProperty.call(obj2, key) && obj1[key] === obj2[key]);
}

function ContentElementDecorator(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$2.wrapper,
    "data-scrollpoint": props.id
  }, /*#__PURE__*/React.createElement(ContentElementEditorStateProvider, {
    id: props.id,
    permaId: props.permaId
  }, /*#__PURE__*/React.createElement(OptionalSelectionRect, props, /*#__PURE__*/React.createElement(ContentElementConfigurationUpdateProvider, {
    id: props.id,
    permaId: props.permaId
  }, renderMarginIndicators(props), props.children))));
}
function OptionalSelectionRect(props) {
  const {
    customSelectionRect
  } = api.contentElementTypes.getOptions(props.type) || {};
  if (customSelectionRect) {
    return props.children;
  } else {
    return /*#__PURE__*/React.createElement(DefaultSelectionRect, props, props.children);
  }
}
function DefaultSelectionRect(props) {
  const {
    isSelected,
    type,
    select,
    selectComments,
    selectNewThread
  } = useContentElementEditorState();
  const commentsSelected = type === 'contentElementComments' || type === 'newThread';
  const {
    resolution,
    alwaysShowComments
  } = useCommentDisplayFilter();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const selectionRectRef = useRef();
  useSelectCommentThreadHandler({
    subjectType: 'ContentElement',
    subjectId: props.permaId,
    getScrollTarget: useCallback(() => selectionRectRef.current, []),
    selectThread: useCallback((threadId, options) => selectComments({
      type: 'contentElementComments',
      id: props.id,
      highlightedThreadId: threadId,
      ...options
    }), [selectComments, props.id])
  });
  const [, drag, preview] = useDrag({
    item: {
      type: 'contentElement',
      id: props.id
    }
  });
  return /*#__PURE__*/React.createElement(SelectionRect, {
    ref: selectionRectRef,
    selected: isSelected,
    scrollPoint: isSelected,
    drag: drag,
    dragHandleTitle: t('pageflow_scrolled.inline_editing.drag_content_element'),
    full: props.width === widths.full,
    customMargin: props.customMargin,
    inset: props.position === 'backdrop',
    commentBadge: features.isEnabled('commenting') && /*#__PURE__*/React.createElement(ThreadsBadge, {
      subjectType: "ContentElement",
      subjectId: props.permaId,
      resolution: resolution,
      mode: commentsSelected ? 'active' : isSelected ? 'icon' : alwaysShowComments ? 'dot' : 'none',
      onClick: threads => threads.length === 0 ? selectNewThread() : selectComments()
    }),
    commentBadgeInset: !isSelected,
    ariaLabel: t('pageflow_scrolled.inline_editing.select_content_element'),
    insertButtonTitles: t('pageflow_scrolled.inline_editing.insert_content_element'),
    onClick: () => select(),
    onInsertButtonClick: at => postInsertContentElementMessage({
      id: props.id,
      at
    })
  }, /*#__PURE__*/React.createElement("div", {
    ref: preview
  }, props.children), /*#__PURE__*/React.createElement(DropTargets, {
    accept: "contentElement",
    canDrop: ({
      id
    }) => id !== props.id,
    onDrop: ({
      id,
      range,
      at
    }) => postMoveContentElementMessage({
      id,
      range,
      to: {
        id: props.id,
        at
      }
    })
  }));
}
function renderMarginIndicators(props) {
  var _props$itemProps, _props$itemProps2;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MarginIndicator, {
    marginValue: (_props$itemProps = props.itemProps) === null || _props$itemProps === void 0 ? void 0 : _props$itemProps.marginTop,
    position: "top",
    tooltipInset: props.width === widths.full || props.customMargin
  }), /*#__PURE__*/React.createElement(MarginIndicator, {
    marginValue: (_props$itemProps2 = props.itemProps) === null || _props$itemProps2 === void 0 ? void 0 : _props$itemProps2.marginBottom,
    position: "bottom",
    tooltipInset: props.width === widths.full || props.customMargin
  }));
}

const WidgetEditorStateContext = createContext({});
function useWidgetEditorState() {
  return useContext(WidgetEditorStateContext);
}
function SelectableWidgetDecorator({
  role,
  props,
  children
}) {
  const {
    isSelected,
    select
  } = useEditorSelection(useMemo(() => ({
    id: role,
    type: 'widget'
  }), [role]));
  const value = useMemo(() => ({
    isSelected,
    select
  }), [isSelected, select]);
  return /*#__PURE__*/React.createElement(WidgetEditorStateContext.Provider, {
    value: value
  }, children);
}

function WidgetConfigurationUpdateProvider({
  role,
  children
}) {
  const dispatch = useEntryStateDispatch();
  const update = useCallback(configuration => {
    postUpdateWidgetMessage({
      role,
      configuration
    });
    updateWidgetConfiguration({
      dispatch,
      role,
      configuration
    });
  }, [dispatch, role]);
  return /*#__PURE__*/React.createElement(WidgetConfigurationUpdateContext.Provider, {
    value: update
  }, children);
}

function WidgetDecorator(props) {
  return /*#__PURE__*/React.createElement(WidgetConfigurationUpdateProvider, {
    role: props.role
  }, props.children);
}

var styles$9 = {"reference":"ActionButtons-module_reference__27uyP","buttons":"ActionButtons-module_buttons__1Hz2Z","button":"ActionButtons-module_button__1wzIk","iconOnly":"ActionButtons-module_iconOnly__1VEGK","floating":"ActionButtons-module_floating__18Epj","escaped":"ActionButtons-module_escaped__2M1PU","size-lg":"ActionButtons-module_size-lg__2b0Dw","position-outside":"ActionButtons-module_position-outside__1rpXW","position-outsideLeft":"ActionButtons-module_position-outsideLeft__3bo3f","position-outsideIndented":"ActionButtons-module_position-outsideIndented__2LZds","position-inside":"ActionButtons-module_position-inside__IDFN8","position-center":"ActionButtons-module_position-center__1ff85","position-topRight":"ActionButtons-module_position-topRight__3HrcE"};

function _extends$3() {
  _extends$3 = Object.assign ? Object.assign.bind() : function (target) {
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
var background = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$3({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 448 512"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M64 32C28.7 32 0 60.7 0 96v200c0 35.3 28.7 64 64 64h208c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M363.494 144v48H384c8.8 0 16 7.2 16 16v200c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16v-21.16h-48V408c0 35.3 28.7 64 64 64h208c35.3 0 64-28.7 64-64V208c0-35.3-28.7-64-64-64z"
})));

function _extends$4() {
  _extends$4 = Object.assign ? Object.assign.bind() : function (target) {
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
var foreground = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$4({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 448 512"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M363.494 148v168.365c0 41.077-33.397 74.475-74.474 74.475H112V412c0 35.3 28.7 64 64 64h208c35.3 0 64-28.7 64-64V212c0-35.3-28.7-64-64-64z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M272 84c8.8 0 16 7.2 16 16v200c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V100c0-8.8 7.2-16 16-16zM64 36C28.7 36 0 64.7 0 100v200c0 35.3 28.7 64 64 64h208c35.3 0 64-28.7 64-64V100c0-35.3-28.7-64-64-64z"
})));

function _extends$5() {
  _extends$5 = Object.assign ? Object.assign.bind() : function (target) {
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
var pencil = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$5({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1-33.9-33.9-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2l199.2-199.2 22.6-22.7zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9l-78.2 23 23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7l-14.4 14.5-22.6 22.6-11.4 11.3 33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5l-39.3-39.4c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
})));

function _extends$6() {
  _extends$6 = Object.assign ? Object.assign.bind() : function (target) {
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
var LinkIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$6({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "link",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-link"] || "fa-link") + " " + (styles["fa-w-16"] || "fa-w-16"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 01-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0120.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0020.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 00-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"
})));

function _extends$7() {
  _extends$7 = Object.assign ? Object.assign.bind() : function (target) {
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
var unlink = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$7({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512",
  "aria-hidden": "true"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M360 0c-39-.001-78 14.8-107 44.4L185 112l-1 1 57 56s1 0 1-1l67-67c28-28.2 74-28.1 102 1 28 28 27 73-1 101l-13 14c-4 4-6 10-4 16 6 17 9 35 10 53 1 14 18 20 27 11l38-38c59-59 59-155 0-214.6C438 14.8 399 .001 360 0zm-63 165c-4 0-8 2-11 5l-22 21v1l107 107c2-41-13-82-44-114a152 152 0 00-21-17c-3-2-6-3-9-3zM93.3 211c-4.1 0-8.4 1-11.7 4l-37.1 38c-59.3 59-59.3 155 0 215C104 527 200 527 259 468l68-68v-1l-56-56s-1 0-1 1l-67 67c-28 28-74 28-102-1-28.2-28-27.4-73 1-101l13-14c4-4 6-10 4-16-6-17-10-35-10-53 0-9-8-15-15.7-15zm47.7 2c-2 41 13 82 44 114a152 152 0 0021 17c6 4 15 4 20-2l22-21v-1L141 213z"
}), /*#__PURE__*/React.createElement("path", {
  stroke: "#000",
  strokeWidth: "68.787",
  strokeLinecap: "round",
  d: "M64 64l384 384"
})));

const icons = {
  background,
  foreground,
  link: LinkIcon,
  pencil,
  unlink
};
function ActionButtons({
  buttons,
  position,
  portal,
  floatingStrategy,
  size = 'md'
}) {
  var _middlewareData$hide;
  const iconSize = size === 'md' ? 15 : 20;
  const {
    refs,
    floatingStyles,
    middlewareData
  } = useFloating({
    strategy: floatingStrategy,
    placement: position === 'center' ? 'bottom' : position === 'inside' ? 'top-end' : position === 'outsideLeft' ? 'bottom-start' : position === 'topRight' ? 'top-end' : 'bottom-end',
    middleware: portal && [hide({
      strategy: 'escaped'
    }), shift({
      elementContext: 'reference'
    })],
    whileElementsMounted: autoUpdate
  });
  return /*#__PURE__*/React.createElement("span", {
    className: classNames(styles$9.reference, styles$9[`position-${position}`]),
    ref: refs.setReference
  }, /*#__PURE__*/React.createElement(Portal, {
    enabled: !!portal,
    aboveNavigationWidgets: portal === 'aboveNavigationWidgets'
  }, /*#__PURE__*/React.createElement("div", {
    ref: refs.setFloating,
    className: classNames(styles$9.floating, {
      [styles$9.escaped]: (_middlewareData$hide = middlewareData.hide) === null || _middlewareData$hide === void 0 ? void 0 : _middlewareData$hide.escaped
    }),
    style: floatingStyles
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$9.buttons
  }, buttons.map(({
    icon,
    text,
    onClick,
    iconOnly
  }, index) => {
    const Icon = icons[icon];
    return /*#__PURE__*/React.createElement("button", {
      key: index,
      className: classNames(styles$9.button, styles$9[`size-${size}`], {
        [styles$9.iconOnly]: iconOnly
      }),
      onClick: onClick,
      title: iconOnly ? text : undefined,
      "aria-label": iconOnly ? text : undefined
    }, /*#__PURE__*/React.createElement(Icon, {
      width: iconSize,
      height: iconSize
    }), !iconOnly && text);
  })))));
}
function Portal({
  enabled,
  aboveNavigationWidgets,
  children
}) {
  const floatingPortalRoot = useFloatingPortalRoot();
  if (enabled) {
    return /*#__PURE__*/React.createElement(FloatingPortal, {
      id: aboveNavigationWidgets ? 'floating-ui-above-navigation-widgets' : undefined,
      root: floatingPortalRoot
    }, children);
  } else {
    return children;
  }
}

function ActionButton({
  icon,
  text,
  onClick,
  iconOnly,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(ActionButtons, Object.assign({}, rest, {
    buttons: [{
      icon,
      text,
      onClick,
      iconOnly
    }]
  }));
}

function BackdropDecorator({
  backdrop,
  motifAreaState,
  children
}) {
  var _backdrop$contentElem, _backdrop$contentElem2;
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    isSelected: isSectionSelected,
    select: selectSection
  } = useEditorSelection({
    id: (_backdrop$contentElem = backdrop.contentElement) === null || _backdrop$contentElem === void 0 ? void 0 : _backdrop$contentElem.sectionId,
    type: 'sectionSettings'
  });
  const {
    isSelected: isBackdropElementSelected,
    select: selectBackdropElement
  } = useEditorSelection({
    id: (_backdrop$contentElem2 = backdrop.contentElement) === null || _backdrop$contentElem2 === void 0 ? void 0 : _backdrop$contentElem2.id,
    type: 'contentElement'
  });
  const scrollToTarget = useScrollToTarget();
  let text, icon, handleClick;
  if (isBackdropElementSelected) {
    text = t('pageflow_scrolled.inline_editing.back_to_section');
    icon = 'foreground';
    handleClick = () => selectSection();
  } else if (backdrop.contentElement) {
    text = t('pageflow_scrolled.inline_editing.select_backdrop_content_element');
    icon = 'background';
    handleClick = () => {
      scrollToTarget({
        id: backdrop.contentElement.sectionId,
        align: 'start'
      });
      selectBackdropElement();
    };
  } else {
    return children;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.wrapper, {
      [styles$1.visible]: isBackdropElementSelected || isSectionSelected
    }),
    style: {
      height: motifAreaState.paddingTop
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$1.inner
  }, /*#__PURE__*/React.createElement(ActionButton, {
    size: "lg",
    position: "center",
    icon: icon,
    text: text,
    onClick: handleClick
  }))), children);
}

function BackgroundContentElementDecorator({
  contentElement,
  children
}) {
  const {
    isSelected
  } = useEditorSelection({
    id: contentElement === null || contentElement === void 0 ? void 0 : contentElement.id,
    type: 'contentElement'
  });
  const {
    isSelected: isSectionSelected
  } = useEditorSelection({
    id: contentElement === null || contentElement === void 0 ? void 0 : contentElement.sectionId,
    type: 'sectionSettings'
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: isSelected || isSectionSelected ? 'auto' : 'none'
    }
  }, children);
}

function _extends$8() {
  _extends$8 = Object.assign ? Object.assign.bind() : function (target) {
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
var paddingTopIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$8({
  xmlns: "http://www.w3.org/2000/svg",
  width: "18",
  height: "18",
  viewBox: "0 3 24 27",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: (styles["lucide"] || "lucide") + " " + (styles["lucide-unfold-vertical-icon"] || "lucide-unfold-vertical-icon") + " " + (styles["lucide-unfold-vertical"] || "lucide-unfold-vertical")
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M12 22v-6m-8-4H2m8 0H8m8 0h-2m8 0h-2m-5 7l-3 3-3-3"
})));

function _extends$9() {
  _extends$9 = Object.assign ? Object.assign.bind() : function (target) {
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
var paddingBottomIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$9({
  xmlns: "http://www.w3.org/2000/svg",
  width: "18",
  height: "18",
  viewBox: "0 -3 24 21",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: (styles["lucide"] || "lucide") + " " + (styles["lucide-unfold-vertical-icon"] || "lucide-unfold-vertical-icon") + " " + (styles["lucide-unfold-vertical"] || "lucide-unfold-vertical")
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M12 8V2M4 12H2m8 0H8m8 0h-2m8 0h-2m-5-7l-3-3-3 3"
})));

const paddingIcons = {
  top: paddingTopIcon,
  bottom: paddingBottomIcon
};
const scaleNames = {
  top: 'sectionPaddingTop',
  bottom: 'sectionPaddingBottom'
};
const scaleDefaultPropertyNames = {
  sectionPaddingTop: 'sectionDefaultPaddingTop',
  sectionPaddingBottom: 'sectionDefaultPaddingBottom'
};
function PaddingIndicator({
  section,
  motifAreaState,
  paddingValue,
  position,
  suppressed
}) {
  const Icon = paddingIcons[position];
  const theme = useTheme();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    isSelected: isSectionSelected
  } = useEditorSelection({
    id: section.id,
    type: 'sectionSettings'
  });
  const {
    isSelected: isPaddingSelected,
    select
  } = useEditorSelection({
    id: section.id,
    type: 'sectionPaddings',
    position
  });
  const motifPadding = (motifAreaState === null || motifAreaState === void 0 ? void 0 : motifAreaState.paddingTop) > 0;
  if (isSectionSelected || isPaddingSelected) {
    return /*#__PURE__*/React.createElement("div", {
      "aria-label": t(`pageflow_scrolled.inline_editing.edit_section_padding_${position}`),
      className: classNames(styles$4[`indicator-${position}`], {
        [styles$4.selected]: isPaddingSelected,
        [styles$4.motif]: motifPadding,
        [styles$4.none]: !motifPadding && (paddingValue === 'none' || suppressed)
      }),
      onClick: () => select()
    }, /*#__PURE__*/React.createElement("div", {
      className: styles$4.tooltip
    }, /*#__PURE__*/React.createElement(Icon, null), getPaddingText()));
  } else {
    return null;
  }
  function getPaddingText() {
    var _theme$options, _theme$translations;
    if (motifPadding) {
      return t('pageflow_scrolled.inline_editing.expose_motif_area');
    }
    if (suppressed) {
      const key = position === 'top' ? 'pageflow_scrolled.inline_editing.padding_suppressed_before_full_width' : 'pageflow_scrolled.inline_editing.padding_suppressed_after_full_width';
      return t(key);
    }
    const scaleName = scaleNames[position];
    const scope = getAppearanceSectionScopeName(section.appearance);
    const scale = Scale({
      scaleName,
      themeProperties: ((_theme$options = theme.options) === null || _theme$options === void 0 ? void 0 : _theme$options.properties) || {},
      scaleTranslations: ((_theme$translations = theme.translations) === null || _theme$translations === void 0 ? void 0 : _theme$translations.scales) || {},
      defaultValuePropertyName: scaleDefaultPropertyNames[scaleName],
      scope
    });
    const value = paddingValue || scale.defaultValue;
    const index = scale.values.indexOf(value);
    return scale.texts[index];
  }
}

function ForegroundDecorator({
  section,
  motifAreaState,
  sectionPadding,
  suppressedPaddings,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PaddingIndicator, {
    section: section,
    motifAreaState: motifAreaState,
    paddingValue: sectionPadding === null || sectionPadding === void 0 ? void 0 : sectionPadding.paddingTop,
    suppressed: suppressedPaddings === null || suppressedPaddings === void 0 ? void 0 : suppressedPaddings.top,
    position: "top"
  }), children, /*#__PURE__*/React.createElement(PaddingIndicator, {
    section: section,
    paddingValue: sectionPadding === null || sectionPadding === void 0 ? void 0 : sectionPadding.paddingBottom,
    suppressed: suppressedPaddings === null || suppressedPaddings === void 0 ? void 0 : suppressedPaddings.bottom,
    position: "bottom"
  }));
}

var styles$a = {"container":"ContentElementInsertButton-module_container__3dvUS","hovered":"ContentElementInsertButton-module_hovered__3Pggi","button":"ContentElementInsertButton-module_button__2-eE2"};

function ContentElementInsertButton({
  onClick
}) {
  const [hovered, setHovered] = useState();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$a.container, {
      [styles$a.hovered]: hovered
    })
  }, /*#__PURE__*/React.createElement("button", {
    className: styles$a.button,
    title: t('pageflow_scrolled.inline_editing.add_content_element'),
    onClick: onClick,
    onMouseDown: event => event.stopPropagation(),
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false)
  }, /*#__PURE__*/React.createElement(PlusIcon, {
    width: 15,
    height: 15,
    fill: "currentColor"
  })));
}

function LayoutWithPlaceholder(props) {
  const {
    isSelected
  } = useEditorSelection({
    id: props.sectionId,
    type: 'section'
  });
  const {
    isSelected: settingsSelected
  } = useEditorSelection({
    id: props.sectionId,
    type: 'sectionSettings'
  });
  const placeholder = isSelected || settingsSelected ? /*#__PURE__*/React.createElement(ContentElementInsertButton, {
    onClick: () => postInsertContentElementMessage({
      at: 'endOfSection',
      id: props.sectionId
    })
  }) : null;
  return /*#__PURE__*/React.createElement(LayoutWithoutInlineEditing, Object.assign({}, props, {
    placeholder: placeholder
  }));
}

const originalToSlateRange = ReactEditor.toSlateRange;
ReactEditor.toSlateRange = function (editor, domRange) {
  try {
    return originalToSlateRange.apply(this, arguments);
  } catch (e) {
    if (e.message.startsWith('Cannot resolve a Slate point from DOM point') && domRange === window.getSelection() && editor.selection) {
      console.warn('Ignored "Cannot resolve a Slate point from DOM point" - selection outside editor');
      return editor.selection;
    }
    throw e;
  }
};

function useCachedValue(value, {
  defaultValue,
  onReset,
  onDebouncedChange,
  delay = 2000
} = {}) {
  const [cachedValue, setCachedValue] = useState(value || defaultValue);
  const previousValue = useRef(value);
  useEffect(() => {
    if (previousValue.current !== value && value !== cachedValue) {
      onReset && onReset(value);
      setCachedValue(value);
    }
  }, [onReset, value, cachedValue]);
  useEffect(() => {
    previousValue.current = value;
  });
  const debouncedHandler = useDebouncedCallback(onDebouncedChange, delay);
  const setValue = useCallback(value => {
    setCachedValue(previousValue => {
      if (previousValue !== value) {
        debouncedHandler(value);
      }
      return value;
    });
  }, [debouncedHandler]);
  return [cachedValue, setValue];
}

// Debounce callback even if the callback function changes across renders.
function useDebouncedCallback(callback, delay) {
  const mostRecentCallback = useRef(null);
  const debouncedHandler = useRef(null);
  useEffect(() => {
    mostRecentCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    debouncedHandler.current = debounce(value => {
      if (mostRecentCallback.current) {
        mostRecentCallback.current(value);
      }
    }, delay);
    return () => {
      debouncedHandler.current.flush();
    };
  }, [delay]);
  return useCallback((...args) => debouncedHandler.current(...args), []);
}

var styles$b = {"placeholder":"TextPlaceholder-module_placeholder__sgVwx"};

function TextPlaceholder({
  text,
  visible,
  className
}) {
  if (!text || !visible) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles$b.placeholder
  }, /*#__PURE__*/React.createElement("div", {
    className: className
  }, text));
}

function rangeOverlapsSelection(range, selection) {
  if (!range || !selection) return false;
  const selStart = Range.start(selection);
  const selEnd = Range.end(selection);
  const selStartBlock = selStart.path[0];
  let selEndBlock = selEnd.path[0];
  if (selEndBlock !== selStartBlock && selEnd.offset === 0) {
    selEndBlock -= 1;
  }
  const startBlock = Range.start(range).path[0];
  return selStartBlock <= startBlock && startBlock <= selEndBlock;
}

// The cursor that comment marks are measured against, so that the badge
// column and the highlight overlay agree on which of them the reviewer
// has selected.
//
// Treats `editor.selection` as a live cursor only while the editor is
// focused. After the user clicks away, slate-react's throttled
// `selectionchange` listener can sync a clamped DOM cursor back into
// `editor.selection`, which would otherwise pass as a selection without
// there being one.
//
// Falls back to the start point of the highlighted thread's range, so
// that its block keeps counting as selected once focus has drifted away
// from the slate editor — following a comment from the sidebar leaves it
// outside. Just the start point, not the full range, to stay consistent
// with rangeOverlapsSelection, which anchors to range starts.
function useOverlapSelection(highlightedRange) {
  const editor = useSlate();
  const editorSelection = ReactEditor.isFocused(editor) ? editor.selection : null;
  const fallbackPoint = highlightedRange && Range.start(highlightedRange);
  return editorSelection || fallbackPoint && {
    anchor: fallbackPoint,
    focus: fallbackPoint
  };
}

var styles$c = {"darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","box":"BadgeColumn-module_box___7PO_","onDark":"BadgeColumn-module_onDark__3xkyl","onLight":"BadgeColumn-module_onLight__1xTpi"};

const noThreads = [];
function BadgeColumn({
  highlights,
  highlightedRange,
  anchors
}) {
  const editor = useSlate();

  // The same for every badge, so resolved once here rather than per badge.
  const overlapSelection = useOverlapSelection(highlightedRange);
  return highlights.map(highlight => /*#__PURE__*/React.createElement(PositionedBadge, {
    key: highlight.key,
    editor: editor,
    highlight: highlight,
    overlapSelection: overlapSelection,
    anchors: anchors
  }));
}
function PositionedBadge({
  editor,
  highlight,
  overlapSelection,
  anchors
}) {
  var _highlight$thread2;
  const {
    selected,
    highlightedThreadId,
    selectComments,
    selectThread
  } = useContentElementCommentSelection();
  const {
    alwaysShowComments
  } = useCommentDisplayFilter();
  const {
    refs,
    floatingStyles,
    hasAnchor
  } = useAnchoredFloating(highlight.key, anchors, {
    placement: 'left-start'
  });
  const threads = useMemo(() => highlight.thread ? [highlight.thread] : noThreads, [highlight.thread]);
  const unreadCount = useUnreadActivityCount(threads);
  const handleClick = useCallback(() => {
    var _highlight$thread;
    if (highlight.key === 'selection') {
      selectComments();
      return;
    }

    // Don't try to also clear the DOM selection here: calling
    // removeAllRanges fires a selectionchange that slate-react's
    // listener picks up and uses to overwrite editor.selection back
    // to null — undoing this Transforms.select and dropping the
    // selection rect. The visible text selection therefore lingers
    // on screen until the user's next interaction with the editor;
    // slate's internal state (which downstream consumers depend on)
    // stays correct.
    Transforms.select(editor, Range.start(highlight.range));
    selectThread((_highlight$thread = highlight.thread) === null || _highlight$thread === void 0 ? void 0 : _highlight$thread.id);
  }, [editor, highlight, selectComments, selectThread]);
  if (!hasAnchor) return null;
  const isHighlightedThread = !!highlight.thread && highlightedThreadId === highlight.thread.id;
  const isActive = isHighlightedThread || highlight.key === 'selection' && selected === 'newThread';
  const mode = isActive ? 'active' : rangeOverlapsSelection(highlight.range, overlapSelection) ? undefined : alwaysShowComments ? 'dot' : 'none';
  return /*#__PURE__*/React.createElement("div", {
    ref: refs.setFloating,
    className: styles$c.box,
    style: floatingStyles
  }, /*#__PURE__*/React.createElement(Badge, {
    counter: 1,
    mode: mode,
    resolved: !!((_highlight$thread2 = highlight.thread) === null || _highlight$thread2 === void 0 ? void 0 : _highlight$thread2.resolvedAt),
    unreadCount: unreadCount,
    onClick: handleClick
  }));
}

function useEffectiveSelection(editor, onChange) {
  const isDragging = useEditorDragging(editor);
  useEffect(() => {
    const {
      selection
    } = editor;
    if (isDragging || !selection || !ReactEditor.isFocused(editor) || Range.isCollapsed(selection) || Editor.string(editor, selection) === '') {
      onChange(null);
      return;
    }
    onChange(selection);
  }, [editor, editor.selection, isDragging, onChange]);
}
function useEditorDragging(editor) {
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    const editorEl = ReactEditor.toDOMNode(editor, editor);
    function handleMouseDown() {
      setIsDragging(true);
      function handleMouseUp() {
        // Selection sometimes only resets after mouseup has fired
        // when clicking inside an existing selection.
        setTimeout(() => setIsDragging(false), 10);
      }
      document.addEventListener('mouseup', handleMouseUp, {
        once: true
      });
    }
    editorEl.addEventListener('mousedown', handleMouseDown);
    return () => editorEl.removeEventListener('mousedown', handleMouseDown);
  }, [editor]);
  return isDragging;
}

function useStartNewThread(editor) {
  const {
    inlineComments
  } = useContentElementAttributes();
  const commentingEnabled = features.isEnabled('commenting') && inlineComments;
  const {
    selectNewThread
  } = useContentElementCommentSelection();
  if (!commentingEnabled) return null;
  return () => selectNewThread(editor.selection);
}

function PendingSelectionBadge({
  containerRef
}) {
  const editor = useSlate();
  const [isVisible, setIsVisible] = useState(false);
  const darkBackground = useDarkBackground();
  const startNewThread = useStartNewThread(editor);
  const {
    refs,
    floatingStyles
  } = useFloating({
    placement: 'left-start',
    middleware: [alignToContainerEdge(containerRef, {
      mainAxisOffset: 32
    })]
  });
  useEffectiveSelection(editor, useCallback(selection => {
    if (!selection) {
      setIsVisible(false);
      return;
    }
    const domRange = ReactEditor.toDOMRange(editor, selection);
    refs.setPositionReference({
      getBoundingClientRect: () => domRange.getBoundingClientRect(),
      getClientRects: () => domRange.getClientRects()
    });
    setIsVisible(true);
  }, [editor, refs]));
  if (!isVisible) return null;
  return /*#__PURE__*/React.createElement("div", {
    ref: refs.setFloating,
    className: classNames(styles$c.box, darkBackground ? styles$c.onDark : styles$c.onLight),
    style: floatingStyles
  }, /*#__PURE__*/React.createElement(Badge, {
    counter: 0,
    mode: "icon",
    onClick: startNewThread
  }));
}

// Keeps a Slate `rangeRef` per comment thread alive so that ongoing
// text edits stay reflected in the thread's effective subject range
// without round-tripping through the server. When the upstream value
// is replaced (e.g. after a structural shift applied by the editor),
// `EditableText` calls `resetRangeRefs` from `useCachedValue`'s
// `onReset`, which fires from an effect *before* `setCachedValue`
// triggers the re-render in which Slate's `<Slate>` useMemo replaces
// `editor.children` with the new value. So `resetRangeRefs` only
// drops the stale refs and arms `pendingResyncRef`; the second effect
// below consumes that flag on the next render — by which point
// `editor.children` has flipped — and rebuilds against the new
// content. Rebuilding inside `resetRangeRefs` would sync against the
// still-old content and skip migrated threads whose new path doesn't
// yet exist there.
function useCommentRangeRefs(editor, threads) {
  const rangeRefsMap = useRef(new Map());
  const pendingResyncRef = useRef(false);
  const syncRangeRefs = useCallback(threads => {
    const map = rangeRefsMap.current;
    const currentIds = new Set(threads.map(t => t.id));
    for (const [id, rangeRef] of map) {
      if (!currentIds.has(id)) {
        rangeRef.unref();
        map.delete(id);
      }
    }
    for (const thread of threads) {
      if (!map.has(thread.id) && isValidRange(editor, thread.subjectRange)) {
        map.set(thread.id, Editor.rangeRef(editor, thread.subjectRange, {
          affinity: 'inward'
        }));
      }
    }
  }, [editor]);
  useEffect(() => {
    syncRangeRefs(threads);
  }, [threads, syncRangeRefs]);
  useEffect(() => {
    const map = rangeRefsMap.current;
    return () => {
      for (const rangeRef of map.values()) {
        rangeRef.unref();
      }
      map.clear();
    };
  }, [editor]);
  useEffect(() => {
    if (pendingResyncRef.current) {
      pendingResyncRef.current = false;
      syncRangeRefs(threads);
    }
  });
  const resetRangeRefs = useCallback(() => {
    for (const rangeRef of rangeRefsMap.current.values()) {
      rangeRef.unref();
    }
    rangeRefsMap.current.clear();
    pendingResyncRef.current = true;
  }, []);
  const trackedThreads = threads.map(t => {
    const rangeRef = rangeRefsMap.current.get(t.id);
    return (rangeRef === null || rangeRef === void 0 ? void 0 : rangeRef.current) ? {
      ...t,
      subjectRange: rangeRef.current
    } : t;
  });
  const getTrackedSubjectRanges = useCallback(() => {
    const ranges = {};
    threads.forEach(t => {
      const rangeRef = rangeRefsMap.current.get(t.id);
      if (rangeRef === null || rangeRef === void 0 ? void 0 : rangeRef.current) {
        ranges[t.id] = rangeRef.current;
      }
    });
    return ranges;
  }, [threads]);
  return {
    trackedThreads,
    resetRangeRefs,
    getTrackedSubjectRanges
  };
}
function isValidRange(editor, range) {
  return range && Node$1.has(editor, range.anchor.path) && Node$1.has(editor, range.focus.path);
}

const noThreads$1 = [];

// Bundles all commenting-related state and render helpers for the
// EditableText editor. Returns `enabled: false` when commenting is
// disabled for the current content element; consumers can then skip
// the commenting-specific decorate/BadgeColumn paths.
function useCommenting(editor) {
  const {
    contentElementPermaId,
    inlineComments
  } = useContentElementAttributes();
  const enabled = features.isEnabled('commenting') && inlineComments;

  // Track ranges for resolved threads too, so their subject ranges keep
  // following live edits and stay correct once a thread is reopened.
  // Resolved threads are merely hidden from the highlight overlay until
  // they become the highlighted thread (see `visibleThreads`).
  const elementThreads = useCommentThreads({
    subjectType: 'ContentElement',
    subjectId: contentElementPermaId
  });
  const threads = enabled ? elementThreads : noThreads$1;
  const {
    trackedThreads,
    resetRangeRefs,
    getTrackedSubjectRanges
  } = useCommentRangeRefs(editor, threads);
  const {
    anchors,
    registerAnchor
  } = useRangeAnchors();
  const {
    resolution
  } = useCommentDisplayFilter();
  const {
    highlightedThreadId,
    newThreadRange,
    selectThread
  } = useContentElementCommentSelection();

  // Move the cursor into the thread's block before the handler selects
  // it, so `Selection`'s `cursorLeftHighlightedThreadBlock` does not
  // treat a pre-existing cursor as having left the comment and re-select
  // the content element, which would hide the highlight again. Routing
  // through the handler also reveals a resolved thread (via
  // `visibleThreads`) when it is selected.
  useSelectCommentThreadHandler({
    subjectType: 'ContentElement',
    subjectId: contentElementPermaId,
    getScrollTarget: useCallback(threadId => {
      const range = getTrackedSubjectRanges()[threadId];
      return range ? domElementAtRangeStart(editor, range) : null;
    }, [editor, getTrackedSubjectRanges]),
    beforeSelect: useCallback(threadId => {
      const range = getTrackedSubjectRanges()[threadId];
      if (range) {
        Transforms.select(editor, Range.start(range));
      }
    }, [editor, getTrackedSubjectRanges]),
    selectThread
  });

  // Build highlights for all tracked threads, resolved ones included, so
  // the thread ids at the cursor (which scope the comments sidebar) cover
  // them too. Only `visibleHighlights` get a text overlay and a badge.
  const highlights = useCommentHighlights(trackedThreads, newThreadRange);
  const visibleHighlights = useMemo(() => highlights.filter(highlight => isVisible(highlight, {
    resolution,
    highlightedThreadId
  })), [highlights, resolution, highlightedThreadId]);

  // Stands in for the cursor once focus has left the editor, for the
  // badges as much as for the overlay.
  const highlightedRange = useMemo(() => {
    var _visibleHighlights$fi;
    return (_visibleHighlights$fi = visibleHighlights.find(highlight => {
      var _highlight$thread;
      return ((_highlight$thread = highlight.thread) === null || _highlight$thread === void 0 ? void 0 : _highlight$thread.id) === highlightedThreadId;
    })) === null || _visibleHighlights$fi === void 0 ? void 0 : _visibleHighlights$fi.range;
  }, [visibleHighlights, highlightedThreadId]);
  const decorate = useMemo(() => enabled ? decorateCommentHighlights(editor, visibleHighlights) : null, [editor, visibleHighlights, enabled]);
  const withCommentHighlightDecoration = useCallback(({
    attributes,
    children,
    leaf
  }) => {
    if (leaf.commentHighlight) {
      children = /*#__PURE__*/React.createElement(HighlightSpan, {
        rangeKey: leaf.rangeKey,
        subjectRange: leaf.subjectRange,
        highlightedRange: highlightedRange,
        resolved: leaf.resolved
      }, children);
    }
    if (leaf.firstInRange) {
      children = /*#__PURE__*/React.createElement(RangeAnchor, {
        rangeKey: leaf.rangeKey,
        onRegister: registerAnchor
      }, children);
    }
    return {
      attributes,
      children,
      leaf
    };
    // `threads` and `newThreadRange` are included to invalidate this
    // callback (and the `renderLeaf` that wraps it) when decorations
    // change. Without that, slate-react's `MemoizedText` would skip
    // re-rendering leaves whose decorations changed because its memo
    // equality function does not compare `decorations`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerAnchor, contentElementPermaId, threads, newThreadRange, highlightedThreadId, highlightedRange, resolution]);
  return {
    enabled,
    highlights,
    visibleHighlights,
    highlightedRange,
    anchors,
    decorate,
    withCommentHighlightDecoration,
    resetRangeRefs,
    getTrackedSubjectRanges
  };
}

// The range of a thread being composed and the thread the reviewer picked
// show even where the resolution filter would hide them.
function isVisible({
  thread
}, {
  resolution,
  highlightedThreadId
}) {
  return !thread || thread.id === highlightedThreadId || resolution === 'all' || !thread.resolvedAt;
}

// A resolved thread has no badge yet to scroll itself into view, so the
// commented text is scrolled directly. The leaf DOM already exists, so
// this resolves even before the highlight re-renders.
function domElementAtRangeStart(editor, range) {
  try {
    const start = Range.start(range);
    const domRange = ReactEditor.toDOMRange(editor, {
      anchor: start,
      focus: start
    });
    const {
      startContainer
    } = domRange;
    return startContainer.nodeType === Node.ELEMENT_NODE ? startContainer : startContainer.parentElement;
  } catch (e) {
    // toDOMRange throws when the range is not currently rendered.
    return null;
  }
}
function HighlightSpan({
  rangeKey,
  subjectRange,
  highlightedRange,
  resolved,
  children
}) {
  const threadId = parseInt(rangeKey, 10);
  const {
    selected,
    highlightedThreadId
  } = useContentElementCommentSelection();
  const {
    alwaysShowComments
  } = useCommentDisplayFilter();

  // Comes through the slate context, which reaches this span on every
  // selection change even though the memoized leaf around it does not
  // re-render for one.
  const overlapSelection = useOverlapSelection(highlightedRange);
  const isSelected = selected === 'comments' && highlightedThreadId === threadId || rangeKey === 'selection' && selected === 'newThread';

  // The question the badge column asks as well: what the reviewer has not
  // selected is what an uncluttered view leaves out.
  if (!alwaysShowComments && !isSelected && !rangeOverlapsSelection(subjectRange, overlapSelection)) {
    return children;
  }
  return /*#__PURE__*/React.createElement("span", {
    className: classNames(commentHighlightStyles.highlight, {
      [commentHighlightStyles.resolved]: resolved,
      [commentHighlightStyles.selected]: isSelected && !resolved
    })
  }, children);
}

function withCustomInsertBreak(editor) {
  const {
    insertBreak
  } = editor;
  editor.insertBreak = function () {
    const {
      selection
    } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n)
      });
      if (match) {
        const [block, path] = match;
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

var styles$d = {"linkTooltip":"LinkTooltip-module_linkTooltip__esBv0","thumbnail":"LinkTooltip-module_thumbnail__3Vzce","thumbnailClickMask":"LinkTooltip-module_thumbnailClickMask__3iSZw","newTab":"LinkTooltip-module_newTab__3uW7O","chapterNumber":"LinkTooltip-module_chapterNumber__YUvjI"};

function _extends$a() {
  _extends$a = Object.assign ? Object.assign.bind() : function (target) {
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
var ExternalLinkIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$a({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "external-link-alt",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-external-link-alt"] || "fa-external-link-alt") + " " + (styles["fa-w-16"] || "fa-w-16"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M432 320h-32a16 16 0 00-16 16v112H64V128h144a16 16 0 0016-16V80a16 16 0 00-16-16H48a48 48 0 00-48 48v352a48 48 0 0048 48h352a48 48 0 0048-48V336a16 16 0 00-16-16zM488 0H360c-21.37 0-32.05 25.91-17 41l35.73 35.73L135 320.37a24 24 0 000 34L157.67 377a24 24 0 0034 0l243.61-243.68L471 169c15 15 41 4.5 41-17V24a24 24 0 00-24-24z"
})));

const UpdateContext = createContext();
function LinkTooltipProvider(props) {
  const update = useContext(UpdateContext);
  if (update) {
    return props.children;
  } else {
    return /*#__PURE__*/React.createElement(LinkTooltipProviderInner, props);
  }
}
function LinkTooltipProviderInner({
  disabled,
  position,
  floatingStrategy,
  onClick,
  children,
  align = 'left',
  gap = 10
}) {
  const storylineMode = useStorylineActivity();
  const [state, setState] = useState();
  const arrowRef = useRef();
  const {
    refs,
    floatingStyles,
    context: floatingContext
  } = useFloating({
    strategy: floatingStrategy,
    placement: `${position === 'below' ? 'bottom' : 'top'}${align === 'left' ? '-start' : ''}`,
    middleware: [offset(gap), shift(), arrow({
      element: arrowRef,
      padding: 10
    }), inline()],
    whileElementsMounted: autoUpdate
  });
  const update = useMemo(() => {
    let timeout;
    return {
      activate(href, openInNewTab, linkRef) {
        clearTimeout(timeout);
        timeout = null;
        refs.setReference(linkRef.current);
        setState({
          href,
          openInNewTab
        });
      },
      keep() {
        clearTimeout(timeout);
        timeout = null;
      },
      deactivate({
        delay = 200
      } = {}) {
        if (!timeout) {
          timeout = setTimeout(() => {
            timeout = null;
            setState(null);
          }, delay);
        }
      }
    };
  }, [refs]);
  useEffect(() => {
    if (storylineMode !== 'active') {
      update.deactivate({
        delay: 0
      });
    }
  }, [storylineMode, update]);
  return /*#__PURE__*/React.createElement(UpdateContext.Provider, {
    value: update
  }, /*#__PURE__*/React.createElement(FloatingPortal, {
    root: useFloatingPortalRoot()
  }, /*#__PURE__*/React.createElement(LinkTooltip, {
    state: state,
    setFloating: refs.setFloating,
    floatingStyles: floatingStyles,
    floatingContext: floatingContext,
    arrowRef: arrowRef,
    onClick: onClick,
    disabled: disabled
  })), children);
}
function LinkPreview({
  disabled,
  href,
  openInNewTab,
  children,
  className
}) {
  const {
    activate,
    deactivate
  } = useContext(UpdateContext);
  const ref = useRef();
  useEffect(() => {
    if (disabled) {
      deactivate({
        delay: 0
      });
    }
  }, [disabled, deactivate]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    className: className,
    onMouseEnter: () => !disabled && activate(href, openInNewTab, ref),
    onMouseLeave: () => !disabled && deactivate()
  }, children);
}
function LinkTooltip({
  disabled,
  setFloating,
  floatingStyles,
  floatingContext,
  arrowRef,
  onClick,
  state
}) {
  const {
    keep,
    deactivate
  } = useContext(UpdateContext);
  if (disabled || !state || !state.href) {
    return null;
  }
  function handleClick(event) {
    event.stopPropagation();
    if (onClick) {
      onClick(event);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: setFloating,
    className: classNames(styles$d.linkTooltip),
    onClick: handleClick,
    onMouseEnter: keep,
    onMouseLeave: deactivate,
    style: floatingStyles
  }, /*#__PURE__*/React.createElement(FloatingArrow, {
    ref: arrowRef,
    context: floatingContext
  }), /*#__PURE__*/React.createElement(LinkDestination, {
    href: state.href,
    openInNewTab: state.openInNewTab
  }));
}
function LinkDestination({
  href,
  openInNewTab
}) {
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
function ChapterLinkDestination({
  permaId
}) {
  const chapter = useChapter({
    permaId
  });
  const mainStoryline = useMainStoryline();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  if (!chapter) {
    return /*#__PURE__*/React.createElement("span", null, t('pageflow_scrolled.inline_editing.link_tooltip.deleted_chapter'));
  }
  const isExcursion = mainStoryline && chapter.storylineId !== mainStoryline.id;
  if (isExcursion) {
    return /*#__PURE__*/React.createElement("a", {
      href: `#${chapter.chapterSlug}`,
      title: t('pageflow_scrolled.inline_editing.link_tooltip.visit_excursion')
    }, chapter.title ? t('pageflow_scrolled.inline_editing.link_tooltip.excursion_with_title', {
      title: chapter.title
    }) : t('pageflow_scrolled.inline_editing.link_tooltip.untitled_excursion'));
  }
  return /*#__PURE__*/React.createElement("a", {
    href: `#${chapter.chapterSlug}`,
    title: t('pageflow_scrolled.inline_editing.link_tooltip.visit_chapter')
  }, /*#__PURE__*/React.createElement("span", {
    className: styles$d.chapterNumber
  }, t('pageflow_scrolled.inline_editing.link_tooltip.chapter_number', {
    number: chapter.index + 1
  })), " ", chapter.title);
}
function SectionLinkDestination({
  permaId
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  return /*#__PURE__*/React.createElement("div", {
    className: styles$d.thumbnail
  }, /*#__PURE__*/React.createElement(SectionThumbnail, {
    sectionPermaId: permaId
  }), /*#__PURE__*/React.createElement("a", {
    href: `#section-${permaId}`,
    className: styles$d.thumbnailClickMask,
    title: t('pageflow_scrolled.inline_editing.link_tooltip.visit_section')
  }));
}
function ExternalLinkDestination({
  href,
  openInNewTab
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
    href: href,
    target: "_blank",
    rel: "noopener noreferrer"
  }, href, /*#__PURE__*/React.createElement(ExternalLinkIcon, {
    width: 10,
    height: 10
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$d.newTab
  }, openInNewTab ? t('pageflow_scrolled.inline_editing.link_tooltip.opens_in_new_tab') : t('pageflow_scrolled.inline_editing.link_tooltip.opens_in_same_tab')));
}
function FileLinkDestination({
  fileOptions
}) {
  const file = useDownloadableFile(fileOptions);
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  if (!file) {
    return /*#__PURE__*/React.createElement("span", null, t('pageflow_scrolled.inline_editing.link_tooltip.deleted_file'));
  }
  return /*#__PURE__*/React.createElement("a", {
    href: file.urls.download,
    target: "_blank",
    rel: "noopener noreferrer"
  }, file.displayName, /*#__PURE__*/React.createElement(ExternalLinkIcon, {
    width: 10,
    height: 10
  }));
}

function withLinks(editor) {
  const {
    isInline
  } = editor;
  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };
  return editor;
}
const renderElementWithLinkPreview = wrapRenderElementWithLinkPreview(renderElement);
function wrapRenderElementWithLinkPreview(renderElement) {
  return function (options) {
    if (options.element.type === 'link') {
      return /*#__PURE__*/React.createElement(LinkPreview, {
        href: options.element.href,
        openInNewTab: options.element.openInNewTab
      }, renderElement(options));
    } else {
      return renderElement(options);
    }
  };
}

// Used to render drop targets between paragraphs only when a content
// element is currently being dragged over the element. `react-dnd`
// causes "Update on unmounted component warning" when dropping an
// element removes a drop target [1]. As a workaround, couple
// rendering of drop targets to asynchronously updated state. That way
// the drop target is only removed after element has been dropped.
//
// [1] https://github.com/react-dnd/react-dnd/issues/1573
function useDropTargetsActive() {
  const [dropTargetsActive, setDropTargetsActive] = useState(false);
  const [{
    canDrop
  }, drop] = useDrop({
    accept: 'contentElement',
    collect: monitor => ({
      canDrop: monitor.canDrop() && monitor.isOver()
    })
  });
  useEffect(() => {
    if (canDrop) {
      setDropTargetsActive(true);
    } else {
      const timeout = setTimeout(() => {
        setDropTargetsActive(false);
      }, 10);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [canDrop]);
  return [dropTargetsActive, drop];
}

let abortPreviousCall;
function useSelectLinkDestination() {
  return () => {
    return new Promise((resolve, reject) => {
      if (abortPreviousCall) {
        abortPreviousCall();
      }
      abortPreviousCall = () => {
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

const mutuallyExclusive = {
  sup: 'sub',
  sub: 'sup'
};
function toggleMark(editor, format) {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    if (mutuallyExclusive[format] && isMarkActive(editor, mutuallyExclusive[format])) {
      Editor.removeMark(editor, mutuallyExclusive[format]);
    }
    Editor.addMark(editor, format, true);
  }
}
function isMarkActive(editor, format) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

function _extends$b() {
  _extends$b = Object.assign ? Object.assign.bind() : function (target) {
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
var BoldIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$b({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "bold",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-bold"] || "fa-bold") + " " + (styles["fa-w-12"] || "fa-w-12"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 384 512"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M333.49 238a122 122 0 0027-65.21C367.87 96.49 308 32 233.42 32H34a16 16 0 00-16 16v48a16 16 0 0016 16h31.87v288H34a16 16 0 00-16 16v48a16 16 0 0016 16h209.32c70.8 0 134.14-51.75 141-122.4 4.74-48.45-16.39-92.06-50.83-119.6zM145.66 112h87.76a48 48 0 010 96h-87.76zm87.76 288h-87.76V288h87.76a56 56 0 010 112z"
})));

function _extends$c() {
  _extends$c = Object.assign ? Object.assign.bind() : function (target) {
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
var UnderlineIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$c({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "underline",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-underline"] || "fa-underline") + " " + (styles["fa-w-14"] || "fa-w-14"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 448 512"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M32 64h32v160c0 88.22 71.78 160 160 160s160-71.78 160-160V64h32a16 16 0 0016-16V16a16 16 0 00-16-16H272a16 16 0 00-16 16v32a16 16 0 0016 16h32v160a80 80 0 01-160 0V64h32a16 16 0 0016-16V16a16 16 0 00-16-16H32a16 16 0 00-16 16v32a16 16 0 0016 16zm400 384H16a16 16 0 00-16 16v32a16 16 0 0016 16h416a16 16 0 0016-16v-32a16 16 0 00-16-16z"
})));

function _extends$d() {
  _extends$d = Object.assign ? Object.assign.bind() : function (target) {
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
var ItalicIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$d({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "italic",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-italic"] || "fa-italic") + " " + (styles["fa-w-10"] || "fa-w-10"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 320 512"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M320 48v32a16 16 0 01-16 16h-62.76l-80 320H208a16 16 0 0116 16v32a16 16 0 01-16 16H16a16 16 0 01-16-16v-32a16 16 0 0116-16h62.76l80-320H112a16 16 0 01-16-16V48a16 16 0 0116-16h192a16 16 0 0116 16z"
})));

function _extends$e() {
  _extends$e = Object.assign ? Object.assign.bind() : function (target) {
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
var StrikethroughIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$e({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "strikethrough",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-strikethrough"] || "fa-strikethrough") + " " + (styles["fa-w-16"] || "fa-w-16"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M496 224H293.9l-87.17-26.83A43.55 43.55 0 01219.55 112h66.79A49.89 49.89 0 01331 139.58a16 16 0 0021.46 7.15l42.94-21.47a16 16 0 007.16-21.46l-.53-1A128 128 0 00287.51 32h-68a123.68 123.68 0 00-123 135.64c2 20.89 10.1 39.83 21.78 56.36H16a16 16 0 00-16 16v32a16 16 0 0016 16h480a16 16 0 0016-16v-32a16 16 0 00-16-16zm-180.24 96A43 43 0 01336 356.45 43.59 43.59 0 01292.45 400h-66.79A49.89 49.89 0 01181 372.42a16 16 0 00-21.46-7.15l-42.94 21.47a16 16 0 00-7.16 21.46l.53 1A128 128 0 00224.49 480h68a123.68 123.68 0 00123-135.64 114.25 114.25 0 00-5.34-24.36z"
})));

function _extends$f() {
  _extends$f = Object.assign ? Object.assign.bind() : function (target) {
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
  return _extends$f.apply(this, arguments);
}
var SubIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$f({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M32 64C14.3 64 0 78.3 0 96s14.3 32 32 32h15.3l89.6 128-89.6 128H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c10.4 0 20.2-5.1 26.2-13.6L176 311.8l85.8 122.6c6 8.6 15.8 13.6 26.2 13.6h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-15.3l-89.6-128 89.6-128H320c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32c-10.4 0-20.2 5.1-26.2 13.6L176 200.2 90.2 77.6C84.2 69.1 74.4 64 64 64H32zm448 256c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-32 16c-15.8 7.9-22.2 27.1-14.3 42.9C393 361.5 404.3 368 416 368v80c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32V320z"
})));

function _extends$g() {
  _extends$g = Object.assign ? Object.assign.bind() : function (target) {
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
  return _extends$g.apply(this, arguments);
}
var SupIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$g({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M480 32c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-32 16c-15.8 7.9-22.2 27.1-14.3 42.9C393 73.5 404.3 80 416 80v80c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32V32zM32 64C14.3 64 0 78.3 0 96s14.3 32 32 32h15.3l89.6 128-89.6 128H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c10.4 0 20.2-5.1 26.2-13.6L176 311.8l85.8 122.6c6 8.6 15.8 13.6 26.2 13.6h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-15.3l-89.6-128 89.6-128H320c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32c-10.4 0-20.2 5.1-26.2 13.6L176 200.2 90.2 77.6C84.2 69.1 74.4 64 64 64H32z"
})));

function HoveringToolbar({
  children
}) {
  const editor = useSlate();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const selectLinkDestination = useSelectLinkDestination();
  const [isOpen, setIsOpen] = useState(false);
  const {
    refs,
    floatingStyles
  } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(5), shift({
      crossAxis: true,
      padding: {
        left: 10,
        right: 10
      }
    })]
  });
  useEffectiveSelection(editor, useCallback(selection => {
    if (!selection) {
      setIsOpen(false);
      return;
    }
    const domRange = ReactEditor.toDOMRange(editor, selection);
    refs.setPositionReference({
      getBoundingClientRect: () => domRange.getBoundingClientRect(),
      getClientRects: () => domRange.getClientRects()
    });
    setIsOpen(true);
  }, [editor, refs]));
  const floatingPortalRoot = useFloatingPortalRoot();
  return /*#__PURE__*/React.createElement(React.Fragment, null, isOpen && /*#__PURE__*/React.createElement(FloatingPortal, {
    root: floatingPortalRoot
  }, /*#__PURE__*/React.createElement("div", {
    ref: refs.setFloating,
    style: floatingStyles
  }, renderToolbar$1(editor, t, selectLinkDestination))), children);
}
function renderToolbar$1(editor, t, selectLinkDestination) {
  const buttons = [{
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
    name: 'sub',
    text: t('pageflow_scrolled.inline_editing.formats.sub'),
    icon: SubIcon
  }, {
    name: 'sup',
    text: t('pageflow_scrolled.inline_editing.formats.sup'),
    icon: SupIcon
  }, {
    name: 'link',
    text: isButtonActive(editor, 'link') ? t('pageflow_scrolled.inline_editing.remove_link') : t('pageflow_scrolled.inline_editing.insert_link'),
    icon: LinkIcon
  }].map(button => ({
    ...button,
    active: isButtonActive(editor, button.name)
  }));
  return /*#__PURE__*/React.createElement(Toolbar, {
    buttons: buttons,
    onButtonClick: name => handleButtonClick(editor, name, selectLinkDestination)
  });
}
function handleButtonClick(editor, format, selectLinkDestination) {
  if (format === 'link') {
    if (isLinkActive(editor)) {
      unwrapLink(editor);
    } else {
      selectLinkDestination().then(({
        href,
        openInNewTab
      }) => {
        wrapLink(editor, href, openInNewTab);
      }, () => {});
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
    match: n => n.type === 'link'
  });
}
function wrapLink(editor, href, openInNewTab) {
  const link = {
    type: 'link',
    href,
    openInNewTab,
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
  const [link] = Editor.nodes(editor, {
    match: n => n.type === 'link'
  });
  return !!link;
}

var styles$e = {"container":"index-module_container__3dD9z","shy":"index-module_shy__KgWjc","selected":"index-module_selected__mE58y","selection":"index-module_selection__3dUiD"};

// True when the cursor's top-level block differs from the highlighted
// thread's start block. Editing in the same block as the highlighted
// thread should keep the highlight in place (so the comment can be
// referenced while editing); only block changes mean the user moved
// past the comment's anchor.
function cursorLeftHighlightedThreadBlock({
  editor,
  highlightedThreadId,
  highlights
}) {
  var _highlights$find;
  if (!highlightedThreadId || !highlights) {
    return false;
  }
  const highlightedRange = (_highlights$find = highlights.find(h => {
    var _h$thread;
    return ((_h$thread = h.thread) === null || _h$thread === void 0 ? void 0 : _h$thread.id) === highlightedThreadId;
  })) === null || _highlights$find === void 0 ? void 0 : _highlights$find.range;
  if (!highlightedRange) return false;
  return editor.selection.anchor.path[0] !== highlightedRange.anchor.path[0];
}

// True when the cursor sits at a different range than the pending
// new-thread range AND the editor is focused. The focus guard is
// important: clicking the pending badge itself moves focus to the
// portaled badge button and can drift editor.selection — but that
// drift is not the user moving away from the new thread.
function cursorMovedFromPendingNewThreadRange({
  editor,
  newThreadRange
}) {
  if (!ReactEditor.isFocused(editor)) return false;
  return !Range.equals(editor.selection, newThreadRange);
}

function getUniformSelectedNode(editor, propertyName) {
  const currentNodeEntries = [...Editor.nodes(editor, {
    match: n => !!n.type,
    mode: 'highest'
  })];
  const values = [...new Set(currentNodeEntries.map(([node, path]) => node[propertyName]))];
  return values.length === 1 ? currentNodeEntries[0][0] : null;
}

function isBlockActive(editor, format) {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format
  });
  return !!match;
}
const listTypes = ['numbered-list', 'bulleted-list'];
function toggleBlock(editor, format) {
  const isActive = isBlockActive(editor, format);
  const isList = listTypes.includes(format);
  Transforms.unwrapNodes(editor, {
    match: n => listTypes.includes(n.type),
    split: true
  });
  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format
  });
  if (!isActive && isList) {
    const block = {
      type: format,
      children: [],
      ...preserveColorAndTypographyVariant(editor)
    };
    Transforms.wrapNodes(editor, block);
  }
}
function applyTypographyVariant(editor, variant) {
  applyProperties(editor, {
    variant
  });
}
function applyTypographySize(editor, size) {
  applyProperties(editor, {
    size
  });
}
function applyColor(editor, color) {
  applyProperties(editor, {
    color
  });
}
function applyTextAlign(editor, textAlign) {
  applyProperties(editor, {
    textAlign: textAlign === 'justify' ? 'justify' : undefined
  });
}
function applyProperties(editor, properties) {
  Transforms.setNodes(editor, properties, {
    mode: 'highest'
  });
  applyPropertiesToListItems(editor, properties);
}
function applyPropertiesToListItems(editor, properties) {
  const lists = Editor.nodes(editor, {
    match: n => listTypes.includes(n.type)
  });
  for (const [, listPath] of lists) {
    const items = Editor.nodes(editor, {
      at: listPath,
      match: n => n.type === 'list-item'
    });
    for (const [, itemPath] of items) {
      Transforms.setNodes(editor, properties, {
        at: itemPath
      });
    }
  }
}
function preserveColorAndTypographyVariant(editor) {
  const nodeEntry = Editor.above(editor, {
    at: Range.start(editor.selection),
    match: n => !!n.type
  });
  const result = {};
  if (nodeEntry && nodeEntry[0].variant) {
    result.variant = nodeEntry[0].variant;
  }
  if (nodeEntry && nodeEntry[0].color) {
    result.color = nodeEntry[0].color;
  }
  return result;
}
function withBlockNormalization({
  onlyParagraphs
}, editor) {
  if (!onlyParagraphs) {
    return editor;
  }
  const {
    normalizeNode
  } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      for (const [child, childPath] of Node$1.children(editor, path)) {
        if (Element$1.isElement(child) && child.type !== 'paragraph') {
          Transforms.unwrapNodes(editor, {
            match: n => listTypes.includes(n.type),
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
    }
    return normalizeNode([node, path]);
  };
  return editor;
}

function commentThreadIdsAtSelection(highlights, selection) {
  if (!selection) return [];
  return highlights.filter(h => h.thread && rangeOverlapsSelection(h.range, selection)).map(h => h.thread.id);
}

function computeBounds(editor) {
  if (!editor.selection) {
    return [0, 0];
  }
  const startPoint = Range.start(editor.selection);
  const endPoint = Range.end(editor.selection);
  const startPath = startPoint.path.slice(0, 1);
  let endPath = endPoint.path.slice(0, 1);
  if (!Path.equals(startPath, endPath) && endPoint.offset === 0) {
    endPath = Path.previous(endPath);
  }
  return [startPath[0], endPath[0]];
}

// Range to seed a new comment thread on the current slate selection.
// When the selection is collapsed (just a cursor), expand to the full
// surrounding top-level block so the new thread anchors to the whole
// paragraph rather than a zero-width point.
function newCommentThreadSubjectRange(editor) {
  if (!editor.selection) return undefined;
  if (Range.isCollapsed(editor.selection)) {
    const blockIdx = editor.selection.anchor.path[0];
    return {
      anchor: Editor.point(editor, [blockIdx], {
        edge: 'start'
      }),
      focus: Editor.point(editor, [blockIdx], {
        edge: 'end'
      })
    };
  }
  return editor.selection;
}

function _extends$h() {
  _extends$h = Object.assign ? Object.assign.bind() : function (target) {
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
  return _extends$h.apply(this, arguments);
}
var TextIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$h({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "align-justify",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-align-justify"] || "fa-align-justify") + " " + (styles["fa-w-14"] || "fa-w-14"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 448 512"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M432 416H16a16 16 0 00-16 16v32a16 16 0 0016 16h416a16 16 0 0016-16v-32a16 16 0 00-16-16zm0-128H16a16 16 0 00-16 16v32a16 16 0 0016 16h416a16 16 0 0016-16v-32a16 16 0 00-16-16zm0-128H16a16 16 0 00-16 16v32a16 16 0 0016 16h416a16 16 0 0016-16v-32a16 16 0 00-16-16zm0-128H16A16 16 0 000 48v32a16 16 0 0016 16h416a16 16 0 0016-16V48a16 16 0 00-16-16z"
})));

function _extends$i() {
  _extends$i = Object.assign ? Object.assign.bind() : function (target) {
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
  return _extends$i.apply(this, arguments);
}
var HeadingIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$i({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "heading",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-heading"] || "fa-heading") + " " + (styles["fa-w-16"] || "fa-w-16"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M448 96v320h32a16 16 0 0116 16v32a16 16 0 01-16 16H320a16 16 0 01-16-16v-32a16 16 0 0116-16h32V288H160v128h32a16 16 0 0116 16v32a16 16 0 01-16 16H32a16 16 0 01-16-16v-32a16 16 0 0116-16h32V96H32a16 16 0 01-16-16V48a16 16 0 0116-16h160a16 16 0 0116 16v32a16 16 0 01-16 16h-32v128h192V96h-32a16 16 0 01-16-16V48a16 16 0 0116-16h160a16 16 0 0116 16v32a16 16 0 01-16 16z"
})));

function _extends$j() {
  _extends$j = Object.assign ? Object.assign.bind() : function (target) {
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
  return _extends$j.apply(this, arguments);
}
var OlIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$j({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "list-ol",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-list-ol"] || "fa-list-ol") + " " + (styles["fa-w-16"] || "fa-w-16"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M61.77 401l17.5-20.15a19.92 19.92 0 005.07-14.19v-3.31C84.34 356 80.5 352 73 352H16a8 8 0 00-8 8v16a8 8 0 008 8h22.83a157.41 157.41 0 00-11 12.31l-5.61 7c-4 5.07-5.25 10.13-2.8 14.88l1.05 1.93c3 5.76 6.29 7.88 12.25 7.88h4.73c10.33 0 15.94 2.44 15.94 9.09 0 4.72-4.2 8.22-14.36 8.22a41.54 41.54 0 01-15.47-3.12c-6.49-3.88-11.74-3.5-15.6 3.12l-5.59 9.31c-3.72 6.13-3.19 11.72 2.63 15.94 7.71 4.69 20.38 9.44 37 9.44 34.16 0 48.5-22.75 48.5-44.12-.03-14.38-9.12-29.76-28.73-34.88zM496 224H176a16 16 0 00-16 16v32a16 16 0 0016 16h320a16 16 0 0016-16v-32a16 16 0 00-16-16zm0-160H176a16 16 0 00-16 16v32a16 16 0 0016 16h320a16 16 0 0016-16V80a16 16 0 00-16-16zm0 320H176a16 16 0 00-16 16v32a16 16 0 0016 16h320a16 16 0 0016-16v-32a16 16 0 00-16-16zM16 160h64a8 8 0 008-8v-16a8 8 0 00-8-8H64V40a8 8 0 00-8-8H32a8 8 0 00-7.14 4.42l-8 16A8 8 0 0024 64h8v64H16a8 8 0 00-8 8v16a8 8 0 008 8zm-3.91 160H80a8 8 0 008-8v-16a8 8 0 00-8-8H41.32c3.29-10.29 48.34-18.68 48.34-56.44 0-29.06-25-39.56-44.47-39.56-21.36 0-33.8 10-40.46 18.75-4.37 5.59-3 10.84 2.8 15.37l8.58 6.88c5.61 4.56 11 2.47 16.12-2.44a13.44 13.44 0 019.46-3.84c3.33 0 9.28 1.56 9.28 8.75C51 248.19 0 257.31 0 304.59v4C0 316 5.08 320 12.09 320z"
})));

function _extends$k() {
  _extends$k = Object.assign ? Object.assign.bind() : function (target) {
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
  return _extends$k.apply(this, arguments);
}
var UlIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$k({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "list-ul",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-list-ul"] || "fa-list-ul") + " " + (styles["fa-w-16"] || "fa-w-16"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M48 48a48 48 0 1048 48 48 48 0 00-48-48zm0 160a48 48 0 1048 48 48 48 0 00-48-48zm0 160a48 48 0 1048 48 48 48 0 00-48-48zm448 16H176a16 16 0 00-16 16v32a16 16 0 0016 16h320a16 16 0 0016-16v-32a16 16 0 00-16-16zm0-320H176a16 16 0 00-16 16v32a16 16 0 0016 16h320a16 16 0 0016-16V80a16 16 0 00-16-16zm0 160H176a16 16 0 00-16 16v32a16 16 0 0016 16h320a16 16 0 0016-16v-32a16 16 0 00-16-16z"
})));

function _extends$l() {
  _extends$l = Object.assign ? Object.assign.bind() : function (target) {
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
  return _extends$l.apply(this, arguments);
}
var QuoteIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$l({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "quote-right",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-quote-right"] || "fa-quote-right") + " " + (styles["fa-w-16"] || "fa-w-16"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M464 32H336c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48zm-288 0H48C21.5 32 0 53.5 0 80v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48z"
})));

function Selection(props) {
  const editor = useSlate();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const ref = useRef();
  const outerRef = useRef();
  const innerRef = useRef();
  const boundsRef = useRef();
  const lastRangeRef = useRef();
  const {
    setTransientState,
    select,
    isSelected: isContentElementSelected,
    type,
    range
  } = useContentElementEditorState();
  const {
    selected,
    highlightedThreadId,
    newThreadRange
  } = useContentElementCommentSelection();
  const newThreadActive = selected === 'newThread';
  useEffect(() => {
    var _getUniformSelectedNo, _getUniformSelectedNo2, _getUniformSelectedNo3, _getUniformSelectedNo4;
    const {
      selection
    } = editor;
    if (!ref.current) {
      return;
    }
    if (type === 'contentElement' && range && lastRangeRef.current !== range) {
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
      Transforms.deselect(editor);
      return;
    }
    if (!isContentElementSelected && !boundsRef.current) {
      // Only treat the selection as user-initiated when the editor is
      // actually focused. After an external value replacement, the
      // browser may clamp its DOM cursor to the start of the
      // shrunken contenteditable; slate-react's throttled
      // `selectionchange` listener then re-syncs that cursor into
      // `editor.selection`. Without this guard, that synthetic
      // selection would re-select the content element here.
      if (!ReactEditor.isFocused(editor)) {
        return;
      }
      select();
    }
    const [start, end] = computeBounds(editor);
    if (type === 'contentElementComments' && cursorLeftHighlightedThreadBlock({
      editor,
      highlightedThreadId,
      highlights: props.highlights
    })) {
      select();
      return;
    }
    if (newThreadActive && newThreadRange && cursorMovedFromPendingNewThreadRange({
      editor,
      newThreadRange
    })) {
      select();
      return;
    }
    setTransientState({
      editableTextIsSingleBlock: editor.children.length <= 1,
      exampleNode: getUniformSelectedNode(editor, 'type'),
      typographyVariant: (_getUniformSelectedNo = getUniformSelectedNode(editor, 'variant')) === null || _getUniformSelectedNo === void 0 ? void 0 : _getUniformSelectedNo.variant,
      typographySize: (_getUniformSelectedNo2 = getUniformSelectedNode(editor, 'size')) === null || _getUniformSelectedNo2 === void 0 ? void 0 : _getUniformSelectedNo2.size,
      color: (_getUniformSelectedNo3 = getUniformSelectedNode(editor, 'color')) === null || _getUniformSelectedNo3 === void 0 ? void 0 : _getUniformSelectedNo3.color,
      textAlign: (_getUniformSelectedNo4 = getUniformSelectedNode(editor, 'textAlign')) === null || _getUniformSelectedNo4 === void 0 ? void 0 : _getUniformSelectedNo4.textAlign,
      commentThreadIdsAtSelection: commentThreadIdsAtSelection(props.highlights || [], editor.selection),
      newCommentThreadSubjectRange: newCommentThreadSubjectRange(editor)
    });
    boundsRef.current = {
      start,
      end
    };
    updateRect(editor, start, end, outerRef.current, ref.current, innerRef.current);
  });
  useEffect(() => {
    if (!isContentElementSelected) return;
    function handleResize() {
      if (boundsRef.current) {
        updateRect(editor, boundsRef.current.start, boundsRef.current.end, outerRef.current, ref.current, innerRef.current);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isContentElementSelected, editor]);
  const [, drag] = useDrag({
    item: {
      type: 'contentElement',
      id: props.contentElementId
    },
    begin: () => ({
      type: 'contentElement',
      id: props.contentElementId,
      range: [boundsRef.current.start, boundsRef.current.end + 1]
    })
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: outerRef
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: styles$e.selection
  }, /*#__PURE__*/React.createElement(SelectionRect, {
    selected: true,
    drag: drag,
    scrollPoint: isContentElementSelected,
    insertButtonTitles: t('pageflow_scrolled.inline_editing.insert_content_element'),
    onInsertButtonClick: at => {
      if (at === 'before' && boundsRef.current.start === 0 || at === 'after' && !Node$1.has(editor, [boundsRef.current.end + 1])) {
        postInsertContentElementMessage({
          id: props.contentElementId,
          at
        });
      } else {
        postInsertContentElementMessage({
          id: props.contentElementId,
          at: 'split',
          splitPoint: at === 'before' ? boundsRef.current.start : boundsRef.current.end + 1
        });
      }
    },
    toolbarButtons: toolbarButtons(t).map(button => ({
      ...button,
      active: isBlockActive(editor, button.name)
    })),
    onToolbarButtonClick: name => toggleBlock(editor, name)
  }, /*#__PURE__*/React.createElement("div", {
    ref: innerRef
  }))));
}
function hideRect(el) {
  el.removeAttribute('style');
}
function updateRect(editor, startIndex, endIndex, outer, el, inner) {
  const [startDOMNode, endDOMNode] = getDOMNodes(editor, startIndex, endIndex);
  if (startDOMNode && endDOMNode) {
    const startRect = startDOMNode.getBoundingClientRect();
    const endRect = endDOMNode.getBoundingClientRect();
    const outerRect = outer.getBoundingClientRect();
    el.style.display = 'block';
    el.style.top = `${startRect.top - outerRect.top}px`;
    inner.style.height = `${endRect.bottom - startRect.top}px`;
  }
}
function getDOMNodes(editor, startIndex, endIndex) {
  const startNode = Node$1.get(editor, [startIndex]);
  const endNode = Node$1.get(editor, [endIndex]);
  try {
    const startDOMNode = ReactEditor.toDOMNode(editor, startNode);
    const endDOMNode = ReactEditor.toDOMNode(editor, endNode);
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

var styles$f = {"container":"DropTargets-module_container__3vudG","dropTarget":"DropTargets-module_dropTarget__3mmox","dropIndicator":"DropTargets-module_dropIndicator__2zu4d","isOver":"DropTargets-module_isOver__2usWn"};

function DropTargets$1({
  contentElementId
}) {
  const editor = useSlate();
  const [targets, setTargets] = useState();
  const containerRef = useRef();
  useEffect(() => {
    if (!targets) {
      setTargets(measureHeights(editor, containerRef.current));
    }
  }, [targets, editor]);
  return /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    className: styles$f.container
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
  return targets.map((target, index) => /*#__PURE__*/React.createElement(DropTarget, Object.assign({}, target, {
    key: index,
    onDrop: item => handleDrop(item, index)
  })));
}
function DropTarget({
  display,
  top,
  height,
  indicatorTop,
  onDrop
}) {
  const [{
    isOver
  }, drop] = useDrop({
    accept: 'contentElement',
    collect: monitor => ({
      isOver: monitor.isOver()
    }),
    drop: item => onDrop(item)
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: drop,
    className: classNames(styles$f.dropTarget, {
      [styles$f.isOver]: isOver
    }),
    style: {
      display,
      top,
      height
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$f.dropIndicator,
    style: {
      top: indicatorTop
    }
  }));
}
function measureHeights(editor, container) {
  const containerRect = container.getBoundingClientRect();
  let lastTargetDimensions = {
    top: 0,
    height: 0
  };
  let lastRectBottom = 0;
  const targetDimensions = editor.children.map((child, index) => {
    const node = Node$1.get(editor, [index]);
    const domNode = ReactEditor.toDOMNode(editor, node);
    const rect = domNode.getBoundingClientRect();
    const top = lastTargetDimensions.top + lastTargetDimensions.height;
    const bottom = rect.top + rect.height / 2 - containerRect.top;
    const targetDimensions = {
      top,
      height: bottom - top,
      display: editor.selection && Range.includes(editor.selection, [index]) ? 'none' : undefined,
      indicatorTop: index > 0 ? lastRectBottom + (rect.top - lastRectBottom) / 2 - containerRect.top - top : 0
    };
    lastRectBottom = rect.bottom;
    lastTargetDimensions = targetDimensions;
    return targetDimensions;
  });
  return [...targetDimensions, {
    top: lastTargetDimensions.top + lastTargetDimensions.height,
    height: containerRect.height - (lastTargetDimensions.top + lastTargetDimensions.height),
    indicatorTop: containerRect.height - (lastTargetDimensions.top + lastTargetDimensions.height)
  }];
}

const shy = '\u00AD';
function decorateCharacter([node, path], character, attributes, {
  length
}) {
  if (Text.isText(node)) {
    const parts = node.text.split(character);
    parts.pop();
    let i = 0;
    return parts.map(part => {
      i += part.length + 1;
      return {
        anchor: {
          path,
          offset: i - 1
        },
        focus: {
          path,
          offset: i - 1 + length
        },
        ...attributes
      };
    });
  }
  return [];
}
function deleteCharacter(editor, node, path, regExp, offset = 0) {
  const match = regExp.exec(node.text);
  if (match) {
    Transforms.delete(editor, {
      at: {
        path,
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
  return useCallback(event => {
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
function renderLeafWithLineBreakDecoration({
  leaf,
  children,
  attributes
}) {
  if (leaf.shy) {
    children = /*#__PURE__*/React.createElement("span", {
      className: styles$e.shy
    }, children);
  }
  return renderLeaf$1({
    leaf,
    children,
    attributes
  });
}
function withLineBreakNormalization(editor) {
  const {
    normalizeNode
  } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (node.text) {
      if (deleteCharacter(editor, node, path, new RegExp(`${shy}\\s`)) || deleteCharacter(editor, node, path, new RegExp(`^${shy}`)) || deleteCharacter(editor, node, path, new RegExp(`\\s${shy}`), 1) || deleteCharacter(editor, node, path, new RegExp(`${shy}${shy}`))) {
        return;
      }
    }
    return normalizeNode([node, path]);
  };
  return editor;
}

function useShortcutHandler(editor) {
  return useCallback(event => {
    if (!event.ctrlKey) {
      return;
    }
    if (event.key === 'z') {
      event.preventDefault();
      editor.undo();
    } else if (event.key === 'y') {
      event.preventDefault();
      editor.redo();
    } else if (event.key === 'b') {
      event.preventDefault();
      toggleMark(editor, 'bold');
    } else if (event.key === 'i') {
      event.preventDefault();
      toggleMark(editor, 'italic');
    } else if (event.key === 'u') {
      event.preventDefault();
      toggleMark(editor, 'underline');
    } else if (event.key === 'S') {
      event.preventDefault();
      toggleMark(editor, 'strikethrough');
    } else if (event.key === ',') {
      event.preventDefault();
      toggleMark(editor, 'sup');
    } else if (event.key === ';') {
      event.preventDefault();
      toggleMark(editor, 'sub');
    }
  }, [editor]);
}

function duplicateNodes(editor) {
  if (!editor.selection) {
    return;
  }
  const selectedEntries = Array.from(Editor.nodes(editor, {
    at: editor.selection,
    mode: 'highest',
    match: n => Element$1.isElement(n)
  }));
  if (selectedEntries.length === 0) {
    return;
  }
  const clonedNodes = selectedEntries.map(([node]) => JSON.parse(JSON.stringify(node)));
  const lastPath = selectedEntries[selectedEntries.length - 1][1];
  const insertAt = lastPath[0] + 1;
  Transforms.insertNodes(editor, clonedNodes, {
    at: [insertAt]
  });
  Transforms.select(editor, {
    anchor: Editor.start(editor, [insertAt]),
    focus: Editor.end(editor, [insertAt + clonedNodes.length - 1])
  });
}

const selectedClassName = styles$e.selected;
const EditableText = React.memo(function EditableText({
  value,
  contentElementId,
  placeholder,
  onChange,
  selectionRect,
  className,
  placeholderClassName,
  scaleCategory = 'body',
  typographyVariant,
  typographySize,
  autoFocus,
  floatingControlsPosition = 'above'
}) {
  const editor = useMemo(() => withLinks(withCustomInsertBreak(withBlockNormalization({
    onlyParagraphs: !selectionRect
  }, withLineBreakNormalization(withReact(withHistory(createEditor())))))), [selectionRect]);
  const handleLineBreaks = useLineBreakHandler(editor);
  const handleShortcuts = useShortcutHandler(editor);
  const handleKeyDown = useCallback(event => {
    handleLineBreaks(event);
    handleShortcuts(event);
  }, [handleLineBreaks, handleShortcuts]);
  useEffect(() => {
    if (autoFocus) {
      ReactEditor.focus(editor);
    }
  }, [autoFocus, editor]);
  const {
    enabled: commentingEnabled,
    anchors,
    highlights,
    visibleHighlights,
    highlightedRange,
    decorate: decorateComments,
    withCommentHighlightDecoration,
    resetRangeRefs,
    getTrackedSubjectRanges
  } = useCommenting(editor);
  const [cachedValue, setCachedValue] = useCachedValue(value, {
    defaultValue: [{
      type: 'paragraph',
      children: [{
        text: ''
      }]
    }],
    onDebouncedChange: nextValue => {
      if (onChange) {
        onChange(nextValue, {
          commentThreadSubjectRanges: getTrackedSubjectRanges()
        });
      }
    },
    onReset: nextValue => {
      resetSelectionIfOutsideNextValue(editor, nextValue);
      resetHistory(editor);
      resetRangeRefs();
    }
  });
  const {
    isSelected
  } = useContentElementEditorState();
  useContentElementEditorCommandSubscription(command => {
    if (command.type === 'REMOVE') {
      Transforms.removeNodes(editor, {
        mode: 'highest'
      });
    } else if (command.type === 'DUPLICATE') {
      duplicateNodes(editor);
      ReactEditor.focus(editor);
    } else if (command.type === 'MOVE_TO') {
      const {
        to
      } = command.payload;
      const [start, end] = computeBounds(editor);
      postMoveContentElementMessage({
        id: contentElementId,
        range: [start, end + 1],
        to
      });
    } else if (command.type === 'TRANSIENT_STATE_UPDATE') {
      if ('typographyVariant' in command.payload) {
        applyTypographyVariant(editor, command.payload.typographyVariant);
      }
      if ('typographySize' in command.payload) {
        applyTypographySize(editor, command.payload.typographySize);
      }
      if ('color' in command.payload) {
        applyColor(editor, command.payload.color);
      }
      if ('textAlign' in command.payload) {
        applyTextAlign(editor, command.payload.textAlign);
      }
    }
  });
  const [dropTargetsActive, dropTargetsRef] = useDropTargetsActive();
  const decorate = useMemo(() => {
    if (!commentingEnabled) {
      return decorateLineBreaks;
    }
    return entry => [...decorateLineBreaks(entry), ...decorateComments(entry)];
  }, [decorateComments, commentingEnabled]);
  const renderLeaf = useCallback(props => renderLeafWithLineBreakDecoration(withCommentHighlightDecoration(props)), [withCommentHighlightDecoration]);
  return /*#__PURE__*/React.createElement(Text$1, {
    scaleCategory: scaleCategory,
    typographyVariant: typographyVariant,
    typographySize: typographySize
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$e.container, {
      [styles$e.selected]: isSelected
    }),
    ref: el => {
      dropTargetsRef(el);
      anchors.containerRef.current = el;
    }
  }, /*#__PURE__*/React.createElement(Slate, {
    editor: editor,
    value: cachedValue,
    onChange: setCachedValue
  }, /*#__PURE__*/React.createElement(LinkTooltipProvider, {
    disabled: editor.selection && !Range.isCollapsed(editor.selection),
    position: floatingControlsPosition
  }, selectionRect && /*#__PURE__*/React.createElement(Selection, {
    contentElementId: contentElementId,
    highlights: highlights
  }), dropTargetsActive && /*#__PURE__*/React.createElement(DropTargets$1, {
    contentElementId: contentElementId
  }), /*#__PURE__*/React.createElement(HoveringToolbar, null, /*#__PURE__*/React.createElement(Editable, {
    className: className,
    decorate: decorate,
    onKeyDown: handleKeyDown,
    renderElement: renderElementWithLinkPreview,
    renderLeaf: renderLeaf
  }))), commentingEnabled && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BadgeColumn, {
    highlights: visibleHighlights,
    highlightedRange: highlightedRange,
    anchors: anchors
  }), /*#__PURE__*/React.createElement(PendingSelectionBadge, {
    containerRef: anchors.containerRef
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
  const nextEditor = {
    children: nextValue
  };
  if (editor.selection && (!hasTextAtPoint(nextEditor, editor.selection.anchor) || !hasTextAtPoint(nextEditor, editor.selection.focus))) {
    Transforms.deselect(editor);
    // Also drop the browser's DOM cursor when it sits inside this
    // editor's contenteditable. Otherwise slate-react's throttled
    // `selectionchange` listener would later re-sync that stale
    // cursor — clamped to the start of the now-shrunken content —
    // back into `editor.selection`, and `Selection`'s auto-select
    // would treat it as a user click and re-select this content
    // element (overriding whatever the calling op selected, e.g. a
    // freshly inserted image).
    const domSelection = window.getSelection();
    const editorEl = ReactEditor.toDOMNode(editor, editor);
    if (domSelection && editorEl.contains(domSelection.anchorNode)) {
      domSelection.removeAllRanges();
    }
  }
}
function hasTextAtPoint(editor, point) {
  if (!Node$1.has(editor, point.path)) {
    return false;
  }
  const node = Node$1.get(editor, point.path);
  return Text.isText(node) && point.offset <= node.text.length;
}
function resetHistory(editor) {
  editor.history.undos = [];
  editor.history.redos = [];
}

function useLineBreakHandler$1(editor) {
  return useCallback(event => {
    if (event.key !== 'Enter') {
      return true;
    }

    // Soft hyphens used to be inserted with Shift + Enter.
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
  return [...decorateCharacter(nodeEntry, shy, {
    shy: true
  }, {
    length: 1
  }), ...decorateCharacter(nodeEntry, "\n", {
    newLine: true
  }, {
    length: 0
  })];
}
function withLineBreakNormalization$1(editor) {
  const {
    normalizeNode
  } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0 && editor.children.length > 1) {
      Transforms.mergeNodes(editor);
      return;
    } else if (node.text) {
      if (deleteCharacter(editor, node, path, /\n\n/) || deleteCharacter(editor, node, path, new RegExp(`^\n`)) || deleteCharacter(editor, node, path, new RegExp(`${shy}\\s`)) || deleteCharacter(editor, node, path, new RegExp(`^${shy}`)) || deleteCharacter(editor, node, path, new RegExp(`\\s${shy}`), 1) || deleteCharacter(editor, node, path, new RegExp(`${shy}${shy}`))) {
        return;
      }
    }
    return normalizeNode([node, path]);
  };
  return editor;
}

function useShortcutHandler$1(editor) {
  return useCallback(event => {
    if (!event.ctrlKey) {
      return;
    }
    if (event.key === 'z') {
      event.preventDefault();
      editor.undo();
    } else if (event.key === 'y') {
      event.preventDefault();
      editor.redo();
    }
  }, [editor]);
}

var styles$g = {"shy":"index-module_shy__1E2-J","newLine":"index-module_newLine__1QnIs","selected":"index-module_selected__1U9ro","manualHyphens":"index-module_manualHyphens__16b2t"};

const EditableInlineText = memo(function EditableInlineText({
  value,
  defaultValue = '',
  hyphens,
  placeholder,
  onChange
}) {
  var _cachedValue$, _cachedValue$$childre;
  const editor = useMemo(() => withLineBreakNormalization$1(withReact(withHistory(createEditor()))), []);
  const handleLineBreaks = useLineBreakHandler$1(editor);
  const handleShortcuts = useShortcutHandler$1(editor);
  const handleKeyDown = useCallback(event => {
    handleLineBreaks(event);
    handleShortcuts(event);
  }, [handleLineBreaks, handleShortcuts]);
  const [cachedValue, setCachedValue] = useCachedValue(value, {
    defaultValue: [{
      type: 'heading',
      children: [{
        text: defaultValue
      }]
    }],
    onDebouncedChange: onChange
  });
  const {
    isSelected
  } = useContentElementEditorState();
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(frontendStyles.root, frontendStyles[`hyphens-${hyphens}`], {
      [styles$g.manualHyphens]: hyphens === 'manual'
    }, {
      [styles$g.selected]: isSelected
    }),
    spellCheck: "false"
  }, /*#__PURE__*/React.createElement(Slate, {
    editor: editor,
    value: cachedValue,
    onChange: setCachedValue
  }, /*#__PURE__*/React.createElement(Editable, {
    decorate: decorateLineBreaks$1,
    onKeyDown: handleKeyDown,
    renderElement: props => /*#__PURE__*/React.createElement(Element, props),
    renderLeaf: renderLeaf
  })), /*#__PURE__*/React.createElement(TextPlaceholder, {
    text: placeholder,
    visible: !((_cachedValue$ = cachedValue[0]) === null || _cachedValue$ === void 0 ? void 0 : (_cachedValue$$childre = _cachedValue$.children[0]) === null || _cachedValue$$childre === void 0 ? void 0 : _cachedValue$$childre.text)
  }));
});
function Element({
  attributes,
  children,
  element
}) {
  return /*#__PURE__*/React.createElement("div", Object.assign({}, attributes, {
    style: {
      position: 'relative'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: frontendStyles.textEffects
  }, children));
}
function renderLeaf({
  attributes,
  children,
  leaf
}) {
  if (leaf.shy) {
    children = /*#__PURE__*/React.createElement("span", {
      className: styles$g.shy
    }, children);
  }
  if (leaf.newLine) {
    children = /*#__PURE__*/React.createElement("span", {
      className: styles$g.newLine
    }, children);
  }
  return /*#__PURE__*/React.createElement("span", attributes, children);
}

const Row = {
  match(editor) {
    const [rowMatch] = Editor.nodes(editor, {
      match: n => n.type === 'row'
    });
    return rowMatch;
  }
};
const Cell = {
  splitChildren(editor, {
    cellNode,
    point
  }) {
    const [leafNode, leafPath] = Editor.leaf(editor, point.path);
    const cursorOffset = point.offset;
    const text = leafNode.text || '';
    const beforeText = text.slice(0, cursorOffset);
    const afterText = text.slice(cursorOffset);
    const splitIndex = leafPath[leafPath.length - 1];
    const beforeNodes = [];
    const afterNodes = [];
    cellNode.children.forEach((node, index) => {
      if (index < splitIndex) {
        beforeNodes.push(node);
      } else if (index === splitIndex) {
        if (beforeText) {
          beforeNodes.push({
            ...node,
            text: beforeText
          });
        }
        if (afterText) {
          afterNodes.push({
            ...node,
            text: afterText
          });
        }
      } else {
        afterNodes.push(node);
      }
    });
    return [beforeNodes, afterNodes];
  },
  match(editor, {
    at
  } = {}) {
    const [cellMatch] = Editor.nodes(editor, {
      match: n => n.type === 'label' || n.type === 'value',
      at
    });
    return cellMatch;
  },
  inFirstLine(editor, point) {
    const [node] = Editor.node(editor, point.path);
    const text = Node$1.string(node);
    const firstLineBreak = text.indexOf('\n');
    return firstLineBreak === -1 || point.offset <= firstLineBreak;
  },
  inLastLine(editor, point) {
    const [node] = Editor.node(editor, point.path);
    const text = Node$1.string(node);
    const lastLineBreak = text.lastIndexOf('\n');
    return lastLineBreak === -1 || point.offset > lastLineBreak;
  },
  getPointAtStartOfLastLine(editor, cellPath) {
    const [node] = Editor.node(editor, cellPath);
    const text = Node$1.string(node);
    const lastLineBreak = text.lastIndexOf('\n');
    const offset = lastLineBreak === -1 ? 0 : lastLineBreak + 1;
    return {
      path: cellPath,
      offset
    };
  }
};
const CellPath = {
  columnIndex(path) {
    return path[path.length - 1];
  },
  rowIndex(path) {
    return path[path.length - 2];
  }
};

const CellTransforms = {
  replaceContent(editor, nodes, {
    cellPath
  }) {
    Transforms.insertText(editor, '', {
      at: cellPath
    });
    if (nodes.length > 0) {
      Transforms.insertNodes(editor, nodes, {
        at: [...cellPath, 0]
      });
    }
  },
  deleteContentUntil(editor, {
    cellPath,
    point
  }) {
    if (!Editor.isStart(editor, point, cellPath)) {
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, cellPath),
          focus: point
        }
      });
    }
  },
  deleteContentFrom(editor, {
    cellPath,
    point
  }) {
    if (!Editor.isEnd(editor, point, cellPath)) {
      Transforms.delete(editor, {
        at: {
          anchor: point,
          focus: Editor.end(editor, cellPath)
        }
      });
    }
  }
};

const TableTransforms = {
  deleteRange(editor, [startPoint, endPoint]) {
    const startCellMatch = Cell.match(editor, {
      at: startPoint.path
    });
    const endCellMatch = Cell.match(editor, {
      at: endPoint.path
    });
    if (startCellMatch && endCellMatch) {
      const [startCellNode, startCellPath] = startCellMatch;
      const [endCellNode, endCellPath] = endCellMatch;
      if (!Path.equals(startCellPath, endCellPath)) {
        const rewrittenCellPath = getRewrittenCellPath(editor, startCellPath, endCellPath);
        const rows = Array.from(Editor.nodes(editor, {
          match: n => n.type === 'row',
          at: {
            anchor: startPoint,
            focus: endPoint
          }
        }));
        CellTransforms.deleteContentFrom(editor, {
          cellPath: startCellPath,
          point: startPoint
        });
        if (rewrittenCellPath) {
          var _beforeNodes;
          const beforeNodes = CellPath.columnIndex(startCellPath) === CellPath.columnIndex(endCellPath) ? Cell.splitChildren(editor, {
            cellNode: startCellNode,
            point: startPoint
          })[0] : [];
          const [, afterNodes] = Cell.splitChildren(editor, {
            cellNode: endCellNode,
            point: endPoint
          });
          CellTransforms.replaceContent(editor, beforeNodes.concat(afterNodes), {
            cellPath: rewrittenCellPath
          });
          Transforms.select(editor, {
            path: [...rewrittenCellPath, beforeNodes.length ? beforeNodes.length - 1 : 0],
            offset: ((_beforeNodes = beforeNodes[beforeNodes.length - 1]) === null || _beforeNodes === void 0 ? void 0 : _beforeNodes.text.length) || 0
          });
          rows.reverse().forEach(([_, rowPath]) => {
            if (rowPath[rowPath.length - 1] !== CellPath.rowIndex(rewrittenCellPath)) {
              Transforms.removeNodes(editor, {
                at: rowPath
              });
            }
          });
        } else {
          CellTransforms.deleteContentUntil(editor, {
            cellPath: endCellPath,
            point: endPoint
          });
          rows.slice(1, -1).reverse().forEach(([_, rowPath]) => {
            Transforms.removeNodes(editor, {
              at: rowPath
            });
          });
          Transforms.select(editor, startPoint);
        }
        return;
      }
    }
  }
};
function getRewrittenCellPath(editor, startCellPath, endCellPath) {
  if (CellPath.columnIndex(startCellPath) < CellPath.columnIndex(endCellPath)) {
    const [, rewrittenCellPath] = Editor.next(editor, {
      at: startCellPath
    });
    return rewrittenCellPath;
  } else if (CellPath.columnIndex(startCellPath) > CellPath.columnIndex(endCellPath)) {
    return null;
  } else if (CellPath.columnIndex(startCellPath) === 0) {
    return endCellPath;
  } else {
    return startCellPath;
  }
}

function withFixedColumns(editor) {
  const {
    deleteBackward,
    deleteForward,
    deleteFragment
  } = editor;
  editor.insertBreak = () => {
    const cellMatch = Cell.match(editor);
    if (!cellMatch) {
      return;
    }
    const [cellNode, cellPath] = cellMatch;
    const rowPath = Path.parent(cellPath);
    const columnIndex = CellPath.columnIndex(cellPath);
    const newRowPath = Path.next(rowPath);
    const [beforeNodes, afterNodes] = Cell.splitChildren(editor, {
      cellNode,
      point: editor.selection.anchor
    });
    if (columnIndex === 0) {
      CellTransforms.replaceContent(editor, afterNodes, {
        cellPath
      });
      const newRow = {
        type: 'row',
        children: [{
          type: 'label',
          children: beforeNodes
        }, {
          type: 'value',
          children: [{
            text: ''
          }]
        }]
      };
      Transforms.insertNodes(editor, newRow, {
        at: rowPath
      });
    } else {
      CellTransforms.replaceContent(editor, beforeNodes, {
        cellPath
      });
      const newRow = {
        type: 'row',
        children: [{
          type: 'label',
          children: [{
            text: ''
          }]
        }, {
          type: 'value',
          children: afterNodes
        }]
      };
      Transforms.insertNodes(editor, newRow, {
        at: newRowPath
      });
    }
    Transforms.select(editor, {
      path: [...newRowPath, afterNodes.length ? columnIndex : 0, 0],
      offset: 0
    });
  };
  editor.deleteBackward = function () {
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
      return;
    }
    const cellMatch = Cell.match(editor);
    if (!cellMatch) {
      return;
    }
    const [, cellPath] = cellMatch;
    if (!Editor.isStart(editor, editor.selection.anchor, cellPath)) {
      deleteBackward.apply(this, arguments);
      return;
    }
    const [row, rowPath] = Editor.parent(editor, cellPath);
    const previousRowMatch = Editor.previous(editor, {
      at: rowPath
    });
    if (CellPath.columnIndex(cellPath) === 0) {
      if (previousRowMatch) {
        const [previousRow, previousRowPath] = previousRowMatch;
        if (Node$1.string(previousRow) === '') {
          Transforms.delete(editor, {
            at: previousRowPath
          });
        } else if (Node$1.string(row) === '') {
          Transforms.delete(editor, {
            at: rowPath
          });
        } else if (Node$1.string(Node$1.child(previousRow, 1)) === '') {
          TableTransforms.deleteRange(editor, [Editor.end(editor, [...previousRowPath, 0]), editor.selection.anchor]);
        } else {
          Transforms.select(editor, Editor.end(editor, previousRowPath));
        }
      }
    } else {
      if (previousRowMatch) {
        const [, previousRowPath] = previousRowMatch;
        if (Node$1.string(Node$1.child(row, 0)) === '') {
          TableTransforms.deleteRange(editor, [Editor.end(editor, previousRowPath), editor.selection.anchor]);
          return;
        }
      }
      Transforms.select(editor, Editor.end(editor, Path.previous(cellPath)));
    }
  };
  editor.deleteForward = () => {
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
      return;
    }
    const cellMatch = Cell.match(editor);
    if (!cellMatch) {
      return;
    }
    const [, cellPath] = cellMatch;
    if (!Editor.isEnd(editor, editor.selection.anchor, cellPath)) {
      deleteForward();
      return;
    }
    const columnIndex = cellPath[cellPath.length - 1];
    const [row, rowPath] = Editor.parent(editor, cellPath);
    const nextRowMatch = Editor.next(editor, {
      at: rowPath
    });
    if (columnIndex === 0) {
      if (Node$1.string(row) === '') {
        const previousRowMatch = Editor.previous(editor, {
          at: rowPath
        });
        if (previousRowMatch || nextRowMatch) {
          Transforms.delete(editor, {
            at: rowPath
          });
          if (Node$1.has(editor, rowPath)) {
            Transforms.select(editor, Editor.start(editor, rowPath));
          } else {
            const [, previousRowPath] = previousRowMatch;
            Transforms.select(editor, Editor.start(editor, previousRowPath));
          }
        }
      } else {
        if (nextRowMatch) {
          const [, nextRowPath] = nextRowMatch;
          if (Node$1.string(Node$1.child(row, 1)) === '') {
            TableTransforms.deleteRange(editor, [editor.selection.anchor, Editor.start(editor, nextRowPath)]);
            return;
          }
        }
        Transforms.select(editor, Editor.start(editor, Path.next(cellPath)));
      }
    } else {
      if (nextRowMatch) {
        const [nextRow, nextRowPath] = nextRowMatch;
        if (Node$1.string(nextRow) === '') {
          Transforms.delete(editor, {
            at: nextRowPath
          });
        } else if (Node$1.string(Node$1.child(nextRow, 0)) === '') {
          TableTransforms.deleteRange(editor, [editor.selection.anchor, Editor.start(editor, [...nextRowPath, 1])]);
        } else {
          Transforms.select(editor, Editor.start(editor, nextRowPath));
        }
      }
    }
  };
  editor.deleteFragment = () => {
    if (editor.selection && Range.isExpanded(editor.selection)) {
      if (TableTransforms.deleteRange(editor, Range.edges(editor.selection))) {
        return;
      }
    }
    deleteFragment();
  };
  editor.insertData = function (data) {
    const fragment = data.getData('application/x-slate-fragment');
    if (fragment) {
      const decoded = decodeURIComponent(window.atob(fragment));
      const parsed = JSON.parse(decoded);
      if (parsed.every(element => element['type'] === 'row')) {
        editor.insertFragment(parsed);
        return;
      }
    }
    const text = data.getData('text/plain');
    if (text) {
      editor.insertText(text);
    }
  };
  editor.insertFragment = function (fragment) {
    if (fragment.length === 1 && fragment[0].children.length === 1) {
      Transforms.insertFragment(editor, fragment[0].children[0].children);
    } else {
      const rowMatch = Row.match(editor);
      if (rowMatch) {
        ensureLabelAndValueCells(fragment);
        const [, rowPath] = rowMatch;
        const nextRowPath = Path.next(rowPath);
        const pathRef = Editor.pathRef(editor, nextRowPath);
        Transforms.insertNodes(editor, fragment, {
          at: nextRowPath
        });
        Transforms.select(editor, Editor.end(editor, Path.previous(pathRef.unref())));
      }
    }
    function ensureLabelAndValueCells(fragment) {
      if (fragment[0].children.length === 1) {
        fragment[0].children.unshift({
          type: 'label',
          children: [{
            text: ''
          }]
        });
      }
      if (fragment[fragment.length - 1].children.length === 1) {
        fragment[fragment.length - 1].children.push({
          type: 'value',
          children: [{
            text: ''
          }]
        });
      }
    }
  };
  return editor;
}

function handleTableNavigation(editor, event, stacked) {
  if (stacked) {
    return;
  }
  const {
    selection
  } = editor;
  if (selection && Range.isCollapsed(selection)) {
    const cellMatch = Cell.match(editor);
    if (cellMatch) {
      const [, cellPath] = cellMatch;
      const rowPath = cellPath.slice(0, -1);
      if (event.key === 'ArrowUp' && Cell.inFirstLine(editor, selection.anchor)) {
        event.preventDefault();
        if (rowPath[rowPath.length - 1] > 0) {
          const previousRowPath = Path.previous(rowPath);
          const targetPath = [...previousRowPath, cellPath[cellPath.length - 1]];
          Transforms.select(editor, Cell.getPointAtStartOfLastLine(editor, Editor.start(editor, targetPath).path));
        }
      } else if (event.key === 'ArrowDown' && Cell.inLastLine(editor, selection.anchor)) {
        event.preventDefault();
        const nextRowPath = Path.next(rowPath);
        const targetPath = [...nextRowPath, cellPath[cellPath.length - 1]];
        if (Node$1.has(editor, targetPath)) {
          Transforms.select(editor, Editor.start(editor, targetPath));
        }
      }
    }
  }
}

var styles$h = {"placeholder":"placeholders-module_placeholder__2j2eo"};

function createRenderElementWithPlaceholder(options) {
  const renderElement = createRenderElement(options);
  return function ({
    attributes,
    children,
    element
  }) {
    if ((element.type === 'label' || element.type === 'value') && options.showPlaceholders && Node$1.string(element) === '') {
      children = /*#__PURE__*/React.createElement(React.Fragment, null, children, /*#__PURE__*/React.createElement("span", {
        contentEditable: false,
        className: styles$h.placeholder,
        "data-text": element.type === 'label' ? options.labelPlaceholder : options.valuePlaceholder
      }));
    }
    return renderElement({
      attributes,
      children,
      element
    });
  };
}

const EditableTable = React.memo(function EditableTable({
  value,
  onChange,
  className,
  labelScaleCategory = 'body',
  valueScaleCategory = 'body',
  labelPlaceholder,
  valuePlaceholder,
  floatingControlsPosition = 'below',
  stackedInPhoneLayout = false
}) {
  const editor = useMemo(() => withFixedColumns(withLinks(withLineBreakNormalization(withReact(withHistory(createEditor()))))), []);
  const {
    isSelected
  } = useContentElementEditorState();
  const phoneLayout = usePhoneLayout();
  const stacked = stackedInPhoneLayout && phoneLayout;
  const handleLineBreaks = useLineBreakHandler(editor);
  const handleShortcuts = useShortcutHandler(editor);
  const handleKeyDown = useCallback(event => {
    handleLineBreaks(event);
    handleShortcuts(event);
    handleTableNavigation(editor, event, stacked);
  }, [editor, handleLineBreaks, handleShortcuts, stacked]);
  const [cachedValue, setCachedValue] = useCachedValue(value, {
    defaultValue: [{
      type: 'row',
      children: [{
        type: 'label',
        children: [{
          text: ''
        }]
      }, {
        type: 'value',
        children: [{
          text: ''
        }]
      }]
    }],
    onDebouncedChange: onChange
  });
  const showPlaceholders = cachedValue.length === 1;
  const renderElement = useMemo(() => wrapRenderElementWithLinkPreview(createRenderElementWithPlaceholder({
    labelScaleCategory,
    valueScaleCategory,
    labelPlaceholder,
    valuePlaceholder,
    showPlaceholders
  })), [labelScaleCategory, valueScaleCategory, labelPlaceholder, valuePlaceholder, showPlaceholders]);
  return /*#__PURE__*/React.createElement(Slate, {
    editor: editor,
    value: cachedValue,
    onChange: setCachedValue
  }, /*#__PURE__*/React.createElement(LinkTooltipProvider, {
    disabled: editor.selection && !Range.isCollapsed(editor.selection),
    position: floatingControlsPosition
  }, /*#__PURE__*/React.createElement(HoveringToolbar, {
    position: floatingControlsPosition
  }), /*#__PURE__*/React.createElement("table", {
    className: classNames(className, tableStyles.table, {
      [selectedClassName]: isSelected
    }),
    "data-stacked": stacked ? '' : undefined
  }, /*#__PURE__*/React.createElement(Editable, {
    as: "tbody",
    decorate: decorateLineBreaks,
    onKeyDown: handleKeyDown,
    renderElement: renderElement,
    renderLeaf: renderLeafWithLineBreakDecoration
  }))));
});

var styles$i = {"wrapper":"EditableLink-module_wrapper__2sbJy"};

function EditableLink({
  className,
  href,
  openInNewTab,
  children,
  onChange,
  onClick,
  linkPreviewDisabled,
  linkPreviewPosition = 'below',
  linkPreviewAlign = 'center',
  floatingStrategy,
  actionButtonPosition = 'outside',
  actionButtonVisible = 'whenSelected',
  actionButtonPortal,
  allowRemove = false
}) {
  const selectLinkDestination = useSelectLinkDestination();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    isSelected: inSelectedContentElement
  } = useContentElementEditorState();
  const {
    isSelected: inSelectedWidget
  } = useWidgetEditorState();
  if (actionButtonVisible === 'whenSelected') {
    actionButtonVisible = inSelectedContentElement || inSelectedWidget;
  }
  function handleSelectLinkDestination() {
    selectLinkDestination().then(onChange, () => {});
  }
  function handleRemoveLink() {
    onChange(null);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles$i.wrapper
  }, /*#__PURE__*/React.createElement(LinkTooltipProvider, {
    position: linkPreviewPosition,
    floatingStrategy: floatingStrategy,
    align: linkPreviewAlign,
    onClick: onClick,
    gap: 5
  }, /*#__PURE__*/React.createElement(LinkPreview, {
    disabled: linkPreviewDisabled,
    href: href,
    openInNewTab: openInNewTab,
    className: className
  }, children)), actionButtonVisible && /*#__PURE__*/React.createElement(ActionButtons, {
    buttons: [{
      icon: 'link',
      text: href ? t('pageflow_scrolled.inline_editing.change_link_destination') : t('pageflow_scrolled.inline_editing.select_link_destination'),
      onClick: handleSelectLinkDestination
    }, ...(allowRemove && href ? [{
      icon: 'unlink',
      iconOnly: true,
      text: t('pageflow_scrolled.inline_editing.remove_link'),
      onClick: handleRemoveLink
    }] : [])],
    position: actionButtonPosition,
    portal: actionButtonPortal,
    floatingStrategy: floatingStrategy
  }));
}

function WidgetSelectionRect({
  children
}) {
  const {
    select,
    isSelected
  } = useWidgetEditorState();
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$3.wrapper, {
      [styles$3.selected]: isSelected
    }),
    onClick: () => select()
  }, children);
}

function PhonePlatformProvider({
  children
}) {
  const [phoneEmulationMode, setPhoneEmulationMode] = useState(false);
  useEffect(() => {
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
    return () => window.removeEventListener('message', receive);
  });
  return /*#__PURE__*/React.createElement(PhonePlatformContext.Provider, {
    value: phoneEmulationMode
  }, children);
}

function Placeholder() {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$j.placeholder
  }, /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: "100%",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "0",
    x2: "100%",
    y2: "100%",
    stroke: "rgba(255,255,255,0.2)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "100%",
    y1: "0",
    x2: "0",
    y2: "100%",
    stroke: "rgba(255,255,255,0.2)",
    strokeWidth: "1"
  })));
}

const extensions = {
  decorators: {
    Entry: EntryDecorator,
    Content: ContentDecorator,
    Section: SectionDecorator,
    ContentElement: ContentElementDecorator,
    SelectableWidget: SelectableWidgetDecorator,
    Widget: WidgetDecorator,
    Backdrop: BackdropDecorator,
    BackgroundContentElement: BackgroundContentElementDecorator,
    Foreground: ForegroundDecorator
  },
  alternatives: {
    LayoutWithPlaceholder,
    EditableText,
    EditableInlineText,
    EditableTable,
    EditableLink,
    LinkTooltipProvider,
    WidgetSelectionRect,
    ActionButton,
    ActionButtons,
    PhonePlatformProvider,
    Placeholder
  }
};

export { extensions };
