import React, { createContext, useContext, useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import classNames from 'classnames';
import { a as useActiveExcursion, o as useFloatingPortalRoot, d as api, w as widths, g as useContentElementAttributes, U as PlainEditableText, N as renderLeaf, V as textStyles, T as Text, R as renderElement } from './FloatingPortalRootProvider-20c600de.js';
import './useDelayedBoolean-a387d85b.js';
import 'backbone-events-standalone';
import { useEntryMetadata } from 'pageflow-scrolled/entryState';
import 'i18n-js';
import { u as useI18n } from './i18n-493cd2a6.js';
import 'react-measure';
import { review, useCommentDisplayFilter, useLocatedCommentThreads, ActivityList, useUnreadThreadCount, useStoredCommentDisplayFilter, ReviewStateProvider, LocatedCommentThreadsProvider, CommentDisplayFilterProvider, ReviewMessageHandler, ThreadsBadge, ThreadList, useLocatedCommentThreadsForSubject, useAnchoredFloating, useRangeAnchors, useCommentThreads, useCommentHighlights, decorateCommentHighlights, RangeAnchor, commentHighlightStyles } from 'pageflow-scrolled/review';
import { useFloating, offset, shift, size, autoUpdate, FloatingPortal, flip } from '@floating-ui/react';
import { Node, Point, createEditor, Editor } from 'slate';
import { ReactEditor, withReact, Slate, Editable } from 'slate-react';
import { createReviewSession } from 'pageflow/review';

// Headings carry no ranged comments since EditableInlineText has no
// commenting alternative, so every comment refers to the header as a whole
// and the quote covers all three of its texts.
review.contentElementTypes.register('heading', {
  extractQuote(configuration) {
    const parts = [inlineText(configuration.tagline), mainText(configuration), inlineText(configuration.subtitle)];
    return parts.map(part => part.trim()).filter(Boolean).join('\n') || null;
  }
});

// Mirrors how EditableInlineText picks the legacy string value, so the quote
// never contains text the heading does not display.
function mainText(configuration) {
  return configuration.value ? inlineText(configuration.value) : configuration.children || '';
}
function inlineText(value) {
  return value ? value.map(node => Node.string(node)).join(' ') : '';
}

review.contentElementTypes.register('textBlock', {
  compareRanges(a, b) {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    return Point.compare(rangeStart(a), rangeStart(b));
  },
  // Element wide comments stay unquoted: the whole text is too long to serve
  // as a point of reference, and any edit anywhere in it would mark the quote
  // outdated.
  extractQuote(configuration, range) {
    if (!range) return null;
    const root = {
      children: configuration.value || []
    };
    if (!Node.has(root, range.anchor.path) || !Node.has(root, range.focus.path)) {
      return null;
    }
    const text = Node.fragment(root, range).map(node => Node.string(node)).join('\n').trim();
    return text || null;
  }
});
function rangeStart(range) {
  return Point.isBefore(range.anchor, range.focus) ? range.anchor : range.focus;
}

const SelectedSubjectContext = createContext({
  selectedSubject: null,
  setSelectedSubject: () => {},
  clearSelection: () => {}
});
const CommentNavigationContext = createContext({
  count: 0,
  position: 0,
  goToNext: () => {},
  goToPrevious: () => {},
  goToThread: () => {}
});
function SelectedSubjectProvider({
  children
}) {
  const {
    resolution
  } = useCommentDisplayFilter();
  const {
    chapters
  } = useLocatedCommentThreads();
  const {
    activateExcursionOfSection,
    returnFromExcursion
  } = useActiveExcursion();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const allTargets = useMemo(() => navigableTargets(chapters), [chapters]);
  const targets = useMemo(() => allTargets.filter(target => matchesResolution(target, resolution)), [allTargets, resolution]);
  const clearSelection = useCallback(() => {
    setSelectedSubject(null);
  }, []);
  const selectTarget = useCallback((target, options) => {
    if (movesToDifferentSubject(selectedSubject, target)) {
      if (target.excursion) {
        activateExcursionOfSection({
          id: target.sectionId
        });
      } else {
        returnFromExcursion();
      }
    }
    setSelectedSubject({
      subjectType: target.subjectType,
      subjectId: target.subjectId,
      subjectRange: target.subjectRange,
      highlightedThreadId: target.threadId,
      ...options
    });
  }, [selectedSubject, activateExcursionOfSection, returnFromExcursion]);
  const goTo = useCallback(step => {
    if (targets.length === 0) {
      return;
    }
    const current = currentTargetIndex(targets, selectedSubject);
    const next = current < 0 ? step > 0 ? 0 : targets.length - 1 : (current + step + targets.length) % targets.length;
    selectTarget(targets[next]);
  }, [targets, selectedSubject, selectTarget]);
  const goToThread = useCallback((threadId, options) => {
    const target = allTargets.find(target => target.threadId === threadId);
    if (target) {
      selectTarget(target, options);
    }
  }, [allTargets, selectTarget]);
  const position = useMemo(() => currentTargetIndex(targets, selectedSubject) + 1, [targets, selectedSubject]);
  const selection = useMemo(() => ({
    selectedSubject,
    setSelectedSubject,
    clearSelection
  }), [selectedSubject, clearSelection]);
  const navigation = useMemo(() => {
    var _selectedSubject$high;
    return {
      count: targets.length,
      position,
      highlightedThreadId: (_selectedSubject$high = selectedSubject === null || selectedSubject === void 0 ? void 0 : selectedSubject.highlightedThreadId) !== null && _selectedSubject$high !== void 0 ? _selectedSubject$high : null,
      goToNext: () => goTo(1),
      goToPrevious: () => goTo(-1),
      goToThread
    };
  }, [targets.length, position, selectedSubject, goTo, goToThread]);
  return /*#__PURE__*/React.createElement(SelectedSubjectContext.Provider, {
    value: selection
  }, /*#__PURE__*/React.createElement(CommentNavigationContext.Provider, {
    value: navigation
  }, children));
}
function useCommentNavigation() {
  return useContext(CommentNavigationContext);
}
function useSelectedSubject(subjectType, subjectId, subjectRange) {
  var _selectedSubject$high2;
  const {
    selectedSubject,
    setSelectedSubject,
    clearSelection
  } = useContext(SelectedSubjectContext);
  const isSelected = selectedSubject && selectedSubject.subjectType === subjectType && selectedSubject.subjectId === subjectId && (!subjectRange || JSON.stringify(selectedSubject.subjectRange) === JSON.stringify(subjectRange));
  const select = useCallback(options => {
    setSelectedSubject({
      subjectType,
      subjectId,
      subjectRange,
      ...options
    });
  }, [setSelectedSubject, subjectType, subjectId, subjectRange]);
  return {
    isSelected,
    hasSelection: !!selectedSubject,
    select,
    clearSelection,
    revealOnly: !!(isSelected && selectedSubject.revealOnly),
    showNewForm: isSelected && selectedSubject.showNewForm,
    subjectRange: isSelected ? selectedSubject.subjectRange : undefined,
    highlightedThreadId: isSelected ? (_selectedSubject$high2 = selectedSubject.highlightedThreadId) !== null && _selectedSubject$high2 !== void 0 ? _selectedSubject$high2 : null : null
  };
}
function movesToDifferentSubject(selectedSubject, target) {
  return !selectedSubject || subjectKey(selectedSubject) !== target.key;
}
function currentTargetIndex(targets, selectedSubject) {
  if (!selectedSubject) {
    return -1;
  }
  if (selectedSubject.highlightedThreadId != null) {
    return targets.findIndex(target => target.threadId === selectedSubject.highlightedThreadId);
  }
  const key = subjectKey(selectedSubject);
  return targets.findIndex(target => target.key === key);
}
function navigableTargets(chapters) {
  const targets = [];
  chapters.forEach(chapter => {
    chapter.sections.forEach(section => {
      const location = {
        sectionId: section.id,
        excursion: chapter.isExcursion
      };
      section.threads.forEach(thread => targets.push({
        key: subjectKey({
          subjectType: 'Section',
          subjectId: section.permaId
        }),
        subjectType: 'Section',
        subjectId: section.permaId,
        threadId: thread.id,
        resolved: !!thread.resolvedAt,
        ...location
      }));
      section.contentElements.forEach(contentElement => {
        pushTargets(targets, contentElement.threads, location);
      });
    });
  });
  return targets;
}
function pushTargets(targets, threads, location) {
  threads.forEach(thread => targets.push({
    key: subjectKey(thread),
    subjectType: thread.subjectType,
    subjectId: thread.subjectId,
    subjectRange: thread.subjectRange,
    threadId: thread.id,
    resolved: !!thread.resolvedAt,
    ...location
  }));
}
function matchesResolution(target, resolution) {
  return resolution === 'all' || resolution === 'unresolved' && !target.resolved || resolution === 'resolved' && target.resolved;
}
function subjectKey({
  subjectType,
  subjectId,
  subjectRange
}) {
  return `${subjectType}:${subjectId}:${subjectRange ? JSON.stringify(subjectRange) : ''}`;
}

const AddCommentModeContext = createContext({
  active: false,
  toggle: () => {},
  deactivate: () => {},
  preselect: () => {},
  clearPreselection: () => {}
});
function AddCommentModeProvider({
  children
}) {
  const [active, setActive] = useState(false);
  const preselectionRef = useRef(null);
  const {
    select
  } = useSelectedSubject();
  const toggle = useCallback(() => {
    if (!active && preselectionRef.current) {
      select(preselectionRef.current);
      preselectionRef.current = null;
      return;
    }
    setActive(prev => !prev);
  }, [active, select]);
  const deactivate = useCallback(() => {
    setActive(false);
  }, []);
  const preselect = useCallback(subject => {
    preselectionRef.current = subject;
  }, []);
  const clearPreselection = useCallback(subjectId => {
    var _preselectionRef$curr;
    if (((_preselectionRef$curr = preselectionRef.current) === null || _preselectionRef$curr === void 0 ? void 0 : _preselectionRef$curr.subjectId) === subjectId) {
      preselectionRef.current = null;
    }
  }, []);
  useEffect(() => {
    if (!active) return;
    function handleMouseDown(event) {
      if (!event.target.closest('[data-add-comment-overlay]') && !event.target.closest('[data-add-comment-toggle]')) {
        setActive(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [active]);
  const value = useMemo(() => ({
    active,
    toggle,
    deactivate,
    preselect,
    clearPreselection
  }), [active, toggle, deactivate, preselect, clearPreselection]);
  return /*#__PURE__*/React.createElement(AddCommentModeContext.Provider, {
    value: value
  }, children);
}
function useAddCommentMode() {
  return useContext(AddCommentModeContext);
}

const storageKey = 'pageflow.scrolled.commentingVisible';
const CommentingVisibilityContext = createContext({
  visible: true,
  toggle: () => {}
});
function CommentingVisibilityProvider({
  children
}) {
  const [visible, setVisible] = useState(readStoredVisibility);
  const toggle = useCallback(() => {
    const next = !visible;
    const flip = () => setVisible(next);

    // Without flushSync the transition captures the pre-toggle DOM.
    if (document.startViewTransition) {
      document.startViewTransition(() => flushSync(flip));
    } else {
      flip();
    }
    storeVisibility(next);
  }, [visible]);
  const value = useMemo(() => ({
    visible,
    toggle
  }), [visible, toggle]);
  return /*#__PURE__*/React.createElement(CommentingVisibilityContext.Provider, {
    value: value
  }, children);
}
function useCommentingVisibility() {
  return useContext(CommentingVisibilityContext);
}
function readStoredVisibility() {
  var _getLocalStorage;
  return ((_getLocalStorage = getLocalStorage()) === null || _getLocalStorage === void 0 ? void 0 : _getLocalStorage[storageKey]) !== 'false';
}
function storeVisibility(visible) {
  const storage = getLocalStorage();
  if (storage) {
    storage[storageKey] = visible;
  }
}
function getLocalStorage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch (e) {
    // Safari throws SecurityError when accessing window.localStorage
    // if cookies/website data are disabled.
    return null;
  }
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
var ActivityIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "16",
  height: "16"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"
}), /*#__PURE__*/React.createElement("path", {
  d: "M3 3v5h5m4-1v5l4 2"
})));

var styles = {"toolbar":"FloatingToolbar-module_toolbar__3iLrb","toggleIcon":"FloatingToolbar-module_toggleIcon__tzwy_","puck":"FloatingToolbar-module_puck__1N8t9","puckIdle":"FloatingToolbar-module_puckIdle__25dov","unreadDot":"FloatingToolbar-module_unreadDot__3Ykgi","navigation":"FloatingToolbar-module_navigation__2oEYm","button":"FloatingToolbar-module_button__2_Q49","count":"FloatingToolbar-module_count__37jUH","segmented":"FloatingToolbar-module_segmented__34nUI","chevronUp":"FloatingToolbar-module_chevronUp__tCL4E","chevronDown":"FloatingToolbar-module_chevronDown__2NELa","segment":"FloatingToolbar-module_segment__q3hcg","segmentCount":"FloatingToolbar-module_segmentCount__2Nsqk","addButton":"FloatingToolbar-module_addButton__2tgNA"};

var styles$1 = {"button":"ActivityButton-module_button__3BNt8","unseenDot":"ActivityButton-module_unseenDot__1w8QA","panel":"ActivityButton-module_panel__1tcQU","scroller":"ActivityButton-module_scroller__2RTTE"};

// Clears the default navigation: a 50px bar with an 8px progress bar.
const viewportPadding = {
  top: 74,
  right: 16,
  bottom: 16,
  left: 16
};
function ActivityButton() {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const [open, setOpen] = useState(false);
  const unreadCount = useUnreadThreadCount();
  const label = t('pageflow_scrolled.review.activity.toggle');
  const {
    clearSelection
  } = useSelectedSubject();
  const portalRoot = useFloatingPortalRoot();
  const {
    refs,
    floatingStyles
  } = useFloating({
    open,
    strategy: 'fixed',
    placement: 'top-end',
    middleware: [offset(8), shift({
      padding: viewportPadding
    }), size({
      padding: viewportPadding,
      apply({
        availableHeight,
        elements
      }) {
        elements.floating.style.maxHeight = `${availableHeight}px`;
      }
    })],
    whileElementsMounted: autoUpdate
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    ref: refs.setReference,
    className: classNames(styles.button, styles$1.button),
    onClick: () => {
      if (!open) {
        clearSelection();
      }
      setOpen(!open);
    },
    "aria-expanded": open,
    "aria-label": label,
    title: label
  }, /*#__PURE__*/React.createElement(ActivityIcon, null), unreadCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: styles$1.unseenDot
  })), open && /*#__PURE__*/React.createElement(FloatingPortal, {
    id: "floating-ui-above-navigation-widgets",
    root: portalRoot
  }, /*#__PURE__*/React.createElement(ActivityPanel, {
    ref: refs.setFloating,
    style: floatingStyles,
    onClose: () => setOpen(false)
  })));
}
const ActivityPanel = React.forwardRef(function ActivityPanel({
  style,
  onClose
}, ref) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    goToThread,
    highlightedThreadId
  } = useCommentNavigation();
  const panelRef = useRef();
  const setRefs = useCallback(node => {
    panelRef.current = node;
    ref(node);
  }, [ref]);
  useEffect(() => {
    function handleClick(event) {
      var _panelRef$current;
      if ((_panelRef$current = panelRef.current) === null || _panelRef$current === void 0 ? void 0 : _panelRef$current.contains(event.target)) return;
      if (event.target.closest('[data-comment-toolbar]')) return;
      onClose();
    }

    // An open popover would otherwise close itself on the same key.
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    ref: setRefs,
    className: styles$1.panel,
    style: style,
    role: "dialog",
    "aria-label": t('pageflow_scrolled.review.activity.toggle'),
    "data-comment-activity": true
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$1.scroller
  }, /*#__PURE__*/React.createElement(ActivityList, {
    highlightedThreadId: highlightedThreadId,
    onEntryClick: entry => goToThread(entry.threadId, {
      revealOnly: true
    })
  })));
});

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
var AddCommentIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$1({
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M22 17a2 2 0 01-2 2H6.828a2 2 0 00-1.414.586l-2.202 2.202A.71.71 0 012 21.286V5a2 2 0 012-2h16a2 2 0 012 2zM12 8v6m-3-3h6"
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
var CancelCommentIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$2({
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M22 17a2 2 0 01-2 2H6.828a2 2 0 00-1.414.586l-2.202 2.202A.71.71 0 012 21.286V5a2 2 0 012-2h16a2 2 0 012 2zm-7.5-8.5l-5 5m0-5l5 5"
})));

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
var ChevronIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$3({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "16",
  height: "16"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M6 9l6 6 6-6"
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
var HideCommentsIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$4({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "16",
  height: "16"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
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
var ShowCommentsIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$5({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "16",
  height: "16"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
})));

function FloatingToolbar() {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    visible
  } = useCommentingVisibility();
  const {
    active,
    deactivate
  } = useAddCommentMode();
  useEffect(() => {
    if (!visible && active) {
      deactivate();
    }
  }, [visible, active, deactivate]);
  if (!visible) {
    return /*#__PURE__*/React.createElement(ShowCommentsButton, null);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles.toolbar,
    role: "group",
    "aria-label": t('pageflow_scrolled.review.comment_toolbar'),
    "data-comment-toolbar": true
  }, /*#__PURE__*/React.createElement(PositionIndicator, null), /*#__PURE__*/React.createElement(ResolutionToggleButton, null), /*#__PURE__*/React.createElement(NavigationArrows, null), /*#__PURE__*/React.createElement(ActivityButton, null), /*#__PURE__*/React.createElement(HideCommentsButton, null), /*#__PURE__*/React.createElement(AddCommentButton, null));
}
function HideCommentsButton() {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    toggle
  } = useCommentingVisibility();
  const label = t('pageflow_scrolled.review.hide_comments');
  return /*#__PURE__*/React.createElement("button", {
    className: styles.button,
    onClick: toggle,
    "aria-label": label,
    title: label
  }, /*#__PURE__*/React.createElement(HideCommentsIcon, {
    className: styles.toggleIcon
  }));
}
function ShowCommentsButton() {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    toggle
  } = useCommentingVisibility();
  const unreadCount = useUnreadThreadCount();
  const unread = unreadCount > 0;
  const label = unread ? t('pageflow_scrolled.review.show_comments_with_unread', {
    count: unreadCount
  }) : t('pageflow_scrolled.review.show_comments');
  return /*#__PURE__*/React.createElement("button", {
    className: styles.puck,
    onClick: toggle,
    "aria-label": label,
    title: label
  }, /*#__PURE__*/React.createElement(ShowCommentsIcon, {
    className: styles.toggleIcon
  }), unread && /*#__PURE__*/React.createElement("span", {
    className: styles.unreadDot
  }));
}
function PositionIndicator() {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    count,
    position
  } = useCommentNavigation();
  return /*#__PURE__*/React.createElement("span", {
    className: styles.count,
    title: t('pageflow_scrolled.review.comment_count', {
      count
    })
  }, position || '–', " /");
}
function NavigationArrows() {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    count,
    goToPrevious,
    goToNext
  } = useCommentNavigation();
  return /*#__PURE__*/React.createElement("div", {
    className: styles.navigation
  }, /*#__PURE__*/React.createElement("button", {
    className: styles.button,
    onClick: goToPrevious,
    disabled: count === 0,
    "aria-label": t('pageflow_scrolled.review.previous_comment'),
    title: t('pageflow_scrolled.review.previous_comment')
  }, /*#__PURE__*/React.createElement(ChevronIcon, {
    className: styles.chevronUp
  })), /*#__PURE__*/React.createElement("button", {
    className: styles.button,
    onClick: goToNext,
    disabled: count === 0,
    "aria-label": t('pageflow_scrolled.review.next_comment'),
    title: t('pageflow_scrolled.review.next_comment')
  }, /*#__PURE__*/React.createElement(ChevronIcon, {
    className: styles.chevronDown
  })));
}
const resolutions = ['unresolved', 'all'];
function ResolutionToggleButton() {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    resolution,
    setResolution
  } = useCommentDisplayFilter();
  const {
    threads
  } = useLocatedCommentThreads();
  const counts = {
    unresolved: threads.filter(thread => !thread.resolvedAt).length,
    all: threads.length
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.segmented,
    role: "group",
    "aria-label": t('pageflow_scrolled.review.filter.label')
  }, resolutions.map(value => /*#__PURE__*/React.createElement("button", {
    key: value,
    type: "button",
    className: styles.segment,
    "aria-pressed": resolution === value,
    onClick: () => setResolution(value)
  }, t(`pageflow_scrolled.review.filter.${value}`), /*#__PURE__*/React.createElement("span", {
    className: styles.segmentCount,
    "aria-hidden": "true"
  }, counts[value]))));
}
function AddCommentButton() {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    active,
    toggle
  } = useAddCommentMode();
  const Icon = active ? CancelCommentIcon : AddCommentIcon;
  const label = t(active ? 'pageflow_scrolled.review.cancel_add_comment' : 'pageflow_scrolled.review.add_comment');
  return /*#__PURE__*/React.createElement("button", {
    className: classNames(styles.button, styles.addButton),
    onClick: toggle,
    "data-add-comment-toggle": true,
    "aria-label": label,
    title: label
  }, /*#__PURE__*/React.createElement(Icon, null));
}

const resolutionStorageKey = 'pageflow.scrolled.commentsResolution';
function EntryDecorator({
  commentingInitialState,
  children
}) {
  const commentDisplayFilter = useStoredCommentDisplayFilter(resolutionStorageKey);
  return /*#__PURE__*/React.createElement(ReviewStateProvider, {
    initialState: commentingInitialState
  }, /*#__PURE__*/React.createElement(ReviewSessionSetup, {
    initialState: commentingInitialState
  }), /*#__PURE__*/React.createElement(LocatedCommentThreadsProvider, null, /*#__PURE__*/React.createElement(CommentingVisibilityProvider, null, /*#__PURE__*/React.createElement(CommentDisplayFilterProvider, commentDisplayFilter, /*#__PURE__*/React.createElement(SelectedSubjectProvider, null, /*#__PURE__*/React.createElement(AddCommentModeProvider, null, children, /*#__PURE__*/React.createElement(FloatingToolbar, null)))))));
}
function ReviewSessionSetup({
  initialState
}) {
  const entryMetadata = useEntryMetadata();
  const entryId = entryMetadata === null || entryMetadata === void 0 ? void 0 : entryMetadata.id;
  useEffect(() => {
    if (!entryId) return;
    const session = createReviewSession({
      entryId,
      initialState
    });
    const handler = ReviewMessageHandler.create({
      session,
      targetWindow: window
    });
    if (!initialState) {
      session.fetch();
    }
    return () => handler.dispose();
  }, [entryId, initialState]);
  return null;
}

var styles$2 = {"badge":"Popover-module_badge__16NvD","threadList":"Popover-module_threadList__2nA5p"};

function Popover({
  subjectType,
  subjectId,
  subjectRange,
  placement = 'bottom-start',
  strategy = 'absolute',
  hideNewTopicButton
}) {
  const {
    isSelected,
    revealOnly,
    showNewForm,
    select,
    clearSelection,
    highlightedThreadId
  } = useSelectedSubject(subjectType, subjectId, subjectRange);
  const {
    resolution
  } = useCommentDisplayFilter();
  const [reference, setReference] = useState(null);
  useEffect(() => {
    if (isSelected && highlightedThreadId != null) {
      reference === null || reference === void 0 ? void 0 : reference.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      });
    }
  }, [isSelected, highlightedThreadId, reference]);
  function handleBadgeClick() {
    if (isSelected && !revealOnly) {
      clearSelection();
    } else {
      select(revealOnly ? {
        highlightedThreadId
      } : undefined);
    }
  }
  return /*#__PURE__*/React.createElement("span", {
    ref: setReference,
    className: styles$2.badge
  }, /*#__PURE__*/React.createElement(ThreadsBadge, {
    subjectType: subjectType,
    subjectId: subjectId,
    subjectRange: subjectRange,
    resolution: resolution,
    revealedThreadId: highlightedThreadId,
    mode: isSelected ? 'active' : undefined,
    onClick: handleBadgeClick
  }), isSelected && !revealOnly && /*#__PURE__*/React.createElement(OpenThreadList, {
    reference: reference,
    subjectType: subjectType,
    subjectId: subjectId,
    subjectRange: subjectRange,
    placement: placement,
    strategy: strategy,
    showNewForm: showNewForm,
    hideNewTopicButton: hideNewTopicButton,
    highlightedThreadId: highlightedThreadId,
    expandResolved: resolution === 'all',
    onDismiss: clearSelection
  }));
}
function OpenThreadList({
  reference,
  subjectType,
  subjectId,
  subjectRange,
  placement,
  strategy,
  showNewForm,
  hideNewTopicButton,
  highlightedThreadId,
  expandResolved,
  onDismiss
}) {
  const portalRoot = useFloatingPortalRoot();
  const {
    refs,
    floatingStyles
  } = useFloating({
    open: true,
    elements: {
      reference
    },
    placement,
    strategy,
    middleware: [offset(8), flip({
      fallbackPlacements: [placement.startsWith('top') ? 'bottom-start' : 'top-start'],
      rootBoundary: 'document'
    }), shift({
      padding: 8
    })],
    whileElementsMounted: autoUpdate
  });
  useEffect(() => {
    function handleClick(event) {
      var _refs$floating$curren;
      if (reference === null || reference === void 0 ? void 0 : reference.contains(event.target)) return;
      if ((_refs$floating$curren = refs.floating.current) === null || _refs$floating$curren === void 0 ? void 0 : _refs$floating$curren.contains(event.target)) return;
      if (event.target.closest('[data-comment-highlight]')) return;
      if (event.target.closest('[data-comment-toolbar]')) return;
      if (event.target.closest('[data-comment-menu]')) return;
      onDismiss();
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onDismiss();
      }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [reference, refs.floating, onDismiss]);
  return /*#__PURE__*/React.createElement(FloatingPortal, {
    root: portalRoot
  }, /*#__PURE__*/React.createElement("div", {
    ref: refs.setFloating,
    "data-floating-raised": true,
    className: styles$2.threadList,
    style: floatingStyles
  }, /*#__PURE__*/React.createElement(ThreadList, {
    subjectType: subjectType,
    subjectId: subjectId,
    subjectRange: subjectRange,
    highlightedThreadId: highlightedThreadId,
    expandResolved: expandResolved,
    showNewForm: showNewForm,
    hideNewTopicButton: hideNewTopicButton
  })));
}

var styles$3 = {"wrapper":"SectionDecorator-module_wrapper__3oQuz","commentBadge":"SectionDecorator-module_commentBadge__2MYch","sticky":"SectionDecorator-module_sticky__M1Elo","addButton":"SectionDecorator-module_addButton__3-FuB","pill":"SectionDecorator-module_pill__1wMMW AddCommentOverlay-module_pill__K6tzV"};

function SectionDecorator({
  section,
  children
}) {
  const {
    visible
  } = useCommentingVisibility();
  const {
    active
  } = useAddCommentMode();
  const {
    isSelected,
    highlightedThreadId
  } = useSelectedSubject('Section', section.permaId);
  const {
    resolution
  } = useCommentDisplayFilter();
  const threads = useLocatedCommentThreadsForSubject({
    subjectType: 'Section',
    subjectId: section.permaId,
    resolution,
    revealedThreadId: highlightedThreadId
  });
  const hasThreads = threads.length > 0;
  if (!visible) {
    return children;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles$3.wrapper
  }, children, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$3.commentBadge, {
      [styles$3.sticky]: hasThreads || active || isSelected
    })
  }, active ? /*#__PURE__*/React.createElement(AddCommentButton$1, {
    permaId: section.permaId
  }) : /*#__PURE__*/React.createElement(Popover, {
    subjectType: "Section",
    subjectId: section.permaId,
    placement: "top-start",
    strategy: "fixed"
  })));
}
function AddCommentButton$1({
  permaId
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    deactivate
  } = useAddCommentMode();
  const {
    select
  } = useSelectedSubject('Section', permaId);
  function handleClick() {
    select({
      showNewForm: true
    });
    deactivate();
  }
  return /*#__PURE__*/React.createElement("button", {
    "data-add-comment-overlay": true,
    onClick: handleClick,
    className: styles$3.addButton,
    "aria-label": t('pageflow_scrolled.review.select_section')
  }, /*#__PURE__*/React.createElement("span", {
    className: styles$3.pill
  }, /*#__PURE__*/React.createElement(AddCommentIcon, null)));
}

var styles$4 = {"highlight":"AddCommentOverlay-module_highlight__1VAyf","pill":"AddCommentOverlay-module_pill__K6tzV"};

function AddCommentOverlay({
  permaId
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    active,
    deactivate
  } = useAddCommentMode();
  const {
    select
  } = useSelectedSubject('ContentElement', permaId);
  if (!active) return null;
  function handleClick() {
    select({
      showNewForm: true
    });
    deactivate();
  }
  return /*#__PURE__*/React.createElement("button", {
    onClick: handleClick,
    "data-add-comment-overlay": true,
    className: styles$4.highlight,
    "aria-label": t('pageflow_scrolled.review.select_content_element'),
    title: t('pageflow_scrolled.review.select_content_element')
  }, /*#__PURE__*/React.createElement("span", {
    className: styles$4.pill
  }, /*#__PURE__*/React.createElement(AddCommentIcon, null)));
}

var styles$5 = {"wrapper":"ContentElementDecorator-module_wrapper__omtl-","selected":"ContentElementDecorator-module_selected__1xIK9","badge":"ContentElementDecorator-module_badge__3RBr6","badgeFlush":"ContentElementDecorator-module_badgeFlush__1lR32"};

function ContentElementDecorator({
  type,
  width,
  customMargin,
  permaId,
  children
}) {
  const {
    inlineComments
  } = api.contentElementTypes.getOptions(type) || {};
  if (inlineComments) {
    return children;
  }
  return /*#__PURE__*/React.createElement(DefaultCommentDecorator, {
    permaId: permaId,
    flush: width === widths.full || customMargin
  }, children);
}
function DefaultCommentDecorator({
  permaId,
  flush,
  children
}) {
  const {
    visible
  } = useCommentingVisibility();
  const {
    active
  } = useAddCommentMode();
  const {
    isSelected
  } = useSelectedSubject('ContentElement', permaId);
  if (!visible) {
    return children;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$5.wrapper, {
      [styles$5.selected]: isSelected
    })
  }, /*#__PURE__*/React.createElement("div", {
    inert: active ? '' : undefined
  }, children), /*#__PURE__*/React.createElement(AddCommentOverlay, {
    permaId: permaId
  }), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$5.badge, {
      [styles$5.badgeFlush]: flush
    })
  }, /*#__PURE__*/React.createElement(Popover, {
    subjectType: "ContentElement",
    subjectId: permaId
  })));
}

var styles$6 = {"hint":"AddCommentHint-module_hint__1tsMa","tooltip":"AddCommentHint-module_tooltip__28laa"};

function AddCommentHint() {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  return /*#__PURE__*/React.createElement("div", {
    className: styles$6.hint
  }, /*#__PURE__*/React.createElement("span", {
    className: styles$6.tooltip
  }, t('pageflow_scrolled.review.select_text_to_comment')));
}

var styles$7 = {"floating":"PopoversColumn-module_floating__2fpOt"};

function PopoversColumn({
  highlights,
  anchors
}) {
  return highlights.map(highlight => /*#__PURE__*/React.createElement(PositionedPopover, {
    key: highlight.key,
    rangeKey: highlight.key,
    subjectRange: highlight.range,
    anchors: anchors
  }));
}
function PositionedPopover({
  rangeKey,
  subjectRange,
  anchors
}) {
  const {
    contentElementPermaId
  } = useContentElementAttributes();
  const {
    refs,
    floatingStyles,
    hasAnchor
  } = useAnchoredFloating(rangeKey, anchors, {
    placement: 'left-end'
  });
  if (!hasAnchor) return null;
  return /*#__PURE__*/React.createElement("div", {
    ref: refs.setFloating,
    className: styles$7.floating,
    style: floatingStyles
  }, /*#__PURE__*/React.createElement(Popover, {
    subjectType: "ContentElement",
    subjectId: contentElementPermaId,
    subjectRange: subjectRange,
    hideNewTopicButton: true
  }));
}

const slateSelection = {
  inEditor(editor) {
    const domSelection = window.getSelection();
    if (!domSelection || !domSelection.anchorNode || !domSelection.focusNode || domSelection.isCollapsed) return null;
    if (!ReactEditor.hasDOMNode(editor, domSelection.anchorNode) || !ReactEditor.hasDOMNode(editor, domSelection.focusNode)) return null;
    try {
      return ReactEditor.toSlateRange(editor, domSelection);
    } catch (e) {
      return null;
    }
  }
};

var commentingStyles = {"activeOverlay":"EditableTextHighlight-module_activeOverlay__6krun","clickable":"EditableTextHighlight-module_clickable__1nF8U"};

const defaultValue = [{
  type: 'paragraph',
  children: [{
    text: ''
  }]
}];
const EditableText = React.memo(function EditableText(props) {
  const {
    inlineComments
  } = useContentElementAttributes();
  const {
    visible
  } = useCommentingVisibility();
  if (inlineComments && visible) {
    return /*#__PURE__*/React.createElement(CommentingEditableText, props);
  }
  return /*#__PURE__*/React.createElement(PlainEditableText, props);
});
function CommentingEditableText({
  value,
  className,
  scaleCategory = 'body',
  typographyVariant,
  typographySize
}) {
  const editor = useMemo(() => withLinks(withReact(createEditor())), []);
  const {
    anchors,
    registerAnchor
  } = useRangeAnchors();
  const {
    contentElementPermaId
  } = useContentElementAttributes();
  const {
    active,
    deactivate,
    preselect,
    clearPreselection
  } = useAddCommentMode();
  const {
    subjectRange,
    select,
    highlightedThreadId
  } = useSelectedSubject('ContentElement', contentElementPermaId);
  const {
    resolution
  } = useCommentDisplayFilter();
  const threads = useCommentThreads({
    subjectType: 'ContentElement',
    subjectId: contentElementPermaId,
    resolution,
    revealedThreadId: highlightedThreadId
  });
  const highlights = useCommentHighlights(threads, subjectRange);
  usePreselection(editor, contentElementPermaId, threads, active, preselect, clearPreselection);
  const handleMouseUp = useSelectTextOnMouseUp(active, editor, threads, deactivate, select);
  const decorate = useMemo(() => decorateCommentHighlights(editor, highlights), [editor, highlights]);
  const renderLeafCb = useCallback(({
    attributes,
    children,
    leaf
  }) => {
    if (leaf.commentHighlight) {
      children = /*#__PURE__*/React.createElement(ClickableHighlight, {
        subjectRange: leaf.subjectRange
      }, children);
    }
    if (leaf.lastInRange) {
      children = /*#__PURE__*/React.createElement(RangeAnchor, {
        rangeKey: leaf.rangeKey,
        onRegister: registerAnchor
      }, children);
    }
    return renderLeaf({
      attributes,
      children,
      leaf
    });
  }, [registerAnchor]);
  return /*#__PURE__*/React.createElement("div", {
    ref: anchors.containerRef,
    className: classNames(textStyles.root, className, {
      [commentingStyles.activeOverlay]: active && !subjectRange
    }),
    "data-add-comment-overlay": true,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Text, {
    scaleCategory: scaleCategory,
    typographyVariant: typographyVariant,
    typographySize: typographySize
  }, /*#__PURE__*/React.createElement(Slate, {
    editor: editor,
    value: value || defaultValue,
    onChange: () => {}
  }, /*#__PURE__*/React.createElement(Editable, {
    key: (subjectRange ? 'highlighted' : 'plain') + threads.length,
    onMouseUp: handleMouseUp,
    readOnly: true,
    decorate: decorate,
    renderElement: renderElement,
    renderLeaf: renderLeafCb
  }))), active && !subjectRange && /*#__PURE__*/React.createElement(AddCommentHint, null), /*#__PURE__*/React.createElement(PopoversColumn, {
    highlights: highlights,
    anchors: anchors
  }));
}
function ClickableHighlight({
  subjectRange,
  children
}) {
  const {
    contentElementPermaId
  } = useContentElementAttributes();
  const {
    deactivate
  } = useAddCommentMode();
  const {
    isSelected,
    revealOnly,
    select,
    highlightedThreadId
  } = useSelectedSubject('ContentElement', contentElementPermaId, subjectRange);
  function handleClick(event) {
    if (event.target.closest('a')) return;
    if (isSelected && !revealOnly) return;
    deactivate();
    select(revealOnly ? {
      highlightedThreadId
    } : undefined);
  }
  return /*#__PURE__*/React.createElement("span", {
    className: classNames(commentHighlightStyles.highlight, {
      [commentHighlightStyles.selected]: isSelected,
      [commentingStyles.clickable]: !isSelected || revealOnly
    }),
    "data-comment-highlight": true,
    onClick: handleClick
  }, children);
}
function useSelectTextOnMouseUp(active, editor, threads, deactivate, select) {
  return useCallback(event => {
    if (!active) return;
    const slateRange = slateSelection.inEditor(editor) || topLevelRangeFromEvent(editor, event);
    if (!slateRange) return;
    const matchingThread = findMatchingThread(threads, slateRange);
    deactivate();
    select({
      subjectRange: (matchingThread === null || matchingThread === void 0 ? void 0 : matchingThread.subjectRange) || slateRange,
      showNewForm: !matchingThread
    });
  }, [active, editor, threads, deactivate, select]);
}
function topLevelRangeFromEvent(editor, event) {
  if (event.target.closest('a')) return null;
  if (event.target.closest('[data-comment-highlight]')) return null;
  try {
    const node = ReactEditor.toSlateNode(editor, event.target);
    const path = ReactEditor.findPath(editor, node);
    if (!path.length) return null;
    return Editor.range(editor, [path[0]]);
  } catch (e) {
    return null;
  }
}
function usePreselection(editor, contentElementPermaId, threads, active, preselect, clearPreselection) {
  useEffect(() => {
    function handleSelectionChange() {
      if (active) return;
      const slateRange = slateSelection.inEditor(editor);
      if (slateRange) {
        const matchingThread = findMatchingThread(threads, slateRange);
        preselect({
          subjectType: 'ContentElement',
          subjectId: contentElementPermaId,
          subjectRange: (matchingThread === null || matchingThread === void 0 ? void 0 : matchingThread.subjectRange) || slateRange,
          showNewForm: !matchingThread
        });
      } else {
        clearPreselection(contentElementPermaId);
      }
    }
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [editor, contentElementPermaId, threads, active, preselect, clearPreselection]);
}
function findMatchingThread(threads, slateRange) {
  const key = JSON.stringify(slateRange);
  return threads.find(t => JSON.stringify(t.subjectRange) === key);
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

const extensions = {
  decorators: {
    Entry: EntryDecorator,
    Section: SectionDecorator,
    ContentElement: ContentElementDecorator
  },
  alternatives: {
    EditableText
  }
};

export { extensions };
