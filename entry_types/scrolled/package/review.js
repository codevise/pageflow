import React, { useMemo, createContext, useReducer, useContext, useEffect, useCallback, useState, useRef, forwardRef } from 'react';
import { useContentElement, useSectionPermaIdOfSubject, useEntryStructureWithContentElements } from 'pageflow-scrolled/entryState';
import classNames from 'classnames';
import { useI18n, useFloatingPortalRoot, useLocale } from 'pageflow-scrolled/frontend';
import { useFloating, offset, flip, shift, autoUpdate, useClick, useDismiss, useRole, useListNavigation, useTypeahead, useInteractions, FloatingPortal, FloatingFocusManager } from '@floating-ui/react';
import { Text, Node as Node$1, Range, Point } from 'slate';

// Kept out of the editor and frontend registries to keep Slate out of the
// always-on frontend bundle.
class ContentElementTypeRegistry {
  constructor() {
    this.types = {};
  }
  register(typeName, options) {
    this.types[typeName] = options;
  }
  findCompareRanges(typeName) {
    var _this$types$typeName;
    return (_this$types$typeName = this.types[typeName]) === null || _this$types$typeName === void 0 ? void 0 : _this$types$typeName.compareRanges;
  }
  findExtractQuote(typeName) {
    var _this$types$typeName2;
    return (_this$types$typeName2 = this.types[typeName]) === null || _this$types$typeName2 === void 0 ? void 0 : _this$types$typeName2.extractQuote;
  }
}

const review = {
  contentElementTypes: new ContentElementTypeRegistry()
};

function postCreateCommentThreadMessage({
  subjectType,
  subjectId,
  subjectRange,
  sectionPermaId,
  body,
  quote
}) {
  window.top.postMessage({
    type: 'CREATE_COMMENT_THREAD',
    payload: {
      subjectType,
      subjectId,
      subjectRange,
      sectionPermaId,
      body,
      quote
    }
  }, window.location.origin);
}
function postCreateCommentMessage({
  threadId,
  body,
  quote
}) {
  window.top.postMessage({
    type: 'CREATE_COMMENT',
    payload: {
      threadId,
      body,
      quote
    }
  }, window.location.origin);
}
function postUpdateCommentMessage({
  threadId,
  commentId,
  body
}) {
  window.top.postMessage({
    type: 'UPDATE_COMMENT',
    payload: {
      threadId,
      commentId,
      body
    }
  }, window.location.origin);
}
function postSetCommentDraftMessage(draft) {
  window.top.postMessage({
    type: 'SET_COMMENT_DRAFT',
    payload: draft
  }, window.location.origin);
}
function postMarkThreadsReadMessage(permaIds) {
  window.top.postMessage({
    type: 'MARK_THREADS_READ',
    payload: {
      permaIds
    }
  }, window.location.origin);
}
function postUpdateThreadMessage({
  threadId,
  resolved
}) {
  window.top.postMessage({
    type: 'UPDATE_THREAD',
    payload: {
      threadId,
      resolved
    }
  }, window.location.origin);
}
function postReviewStateResetMessage(targetWindow, state) {
  targetWindow.postMessage({
    type: 'REVIEW_STATE_RESET',
    payload: state
  }, window.location.origin);
}
function postReviewStateThreadChangeMessage(targetWindow, thread) {
  targetWindow.postMessage({
    type: 'REVIEW_STATE_THREAD_CHANGE',
    payload: thread
  }, window.location.origin);
}
function postReviewStateDraftsChangeMessage(targetWindow, drafts) {
  targetWindow.postMessage({
    type: 'REVIEW_STATE_DRAFTS_CHANGE',
    payload: drafts
  }, window.location.origin);
}
function postReviewStateReadsChangeMessage(targetWindow, reads) {
  targetWindow.postMessage({
    type: 'REVIEW_STATE_READS_CHANGE',
    payload: reads
  }, window.location.origin);
}

// Matches Pageflow::Comment::QUOTE_LIMIT.
const QUOTE_LIMIT = 4000;

/**
 * @private
 */
function useSubjectQuote({
  subjectType,
  subjectId,
  subjectRange
}) {
  const contentElement = useContentElement({
    permaId: subjectId
  });
  const isContentElement = subjectType === 'ContentElement';
  return useMemo(() => {
    if (!isContentElement || !contentElement) return null;
    const extractQuote = review.contentElementTypes.findExtractQuote(contentElement.type);
    const quote = extractQuote ? extractQuote(contentElement.props, subjectRange) : null;
    return quote ? quote.slice(0, QUOTE_LIMIT) : null;
  }, [isContentElement, subjectRange, contentElement]);
}

const ReviewStateContext = createContext(null);
const CommentDraftsContext = createContext(null);
const CommentThreadReadsContext = createContext(null);
const emptyCommentThreadReads = {};
function ReviewStateProvider({
  initialState,
  initialDrafts,
  setDraft,
  children
}) {
  const [state, dispatch] = useReducer(reducer, {
    initialState,
    initialDrafts
  }, initState);
  useStateMessages(dispatch);
  const value = useMemo(() => ({
    currentUser: state.currentUser,
    commentThreads: Object.values(state.threads)
  }), [state.currentUser, state.threads]);
  const draftsValue = useDraftsValue({
    drafts: state.drafts,
    setDraft,
    dispatch
  });
  const readsValue = useReadsValue(state.commentThreadReads);
  return /*#__PURE__*/React.createElement(ReviewStateContext.Provider, {
    value: value
  }, /*#__PURE__*/React.createElement(CommentDraftsContext.Provider, {
    value: draftsValue
  }, /*#__PURE__*/React.createElement(CommentThreadReadsContext.Provider, {
    value: readsValue
  }, children)));
}
function useCommentDraft({
  threadId,
  subjectType,
  subjectId
}) {
  const {
    drafts,
    setDraft
  } = useContext(CommentDraftsContext);
  return [drafts[draftKey({
    threadId,
    subjectType,
    subjectId
  })], useCallback(body => setDraft(threadId ? {
    threadId,
    body
  } : {
    subjectType,
    subjectId,
    body
  }), [setDraft, threadId, subjectType, subjectId])];
}
function useCreateCommentThread({
  subjectType,
  subjectId,
  subjectRange
}) {
  const {
    createThread
  } = useContext(CommentDraftsContext);
  const sectionPermaId = useSectionPermaIdOfSubject({
    subjectType,
    subjectId
  });
  const quote = useSubjectQuote({
    subjectType,
    subjectId,
    subjectRange
  });
  return useCallback(body => createThread({
    subjectType,
    subjectId,
    subjectRange,
    sectionPermaId,
    body,
    quote
  }), [createThread, subjectType, subjectId, subjectRange, sectionPermaId, quote]);
}
function useCreateComment({
  threadId,
  subjectType,
  subjectId,
  subjectRange
}) {
  const {
    createComment
  } = useContext(CommentDraftsContext);
  const quote = useSubjectQuote({
    subjectType,
    subjectId,
    subjectRange
  });
  return useCallback(body => createComment({
    threadId,
    body,
    quote
  }), [createComment, threadId, quote]);
}
function useUpdateComment({
  threadId,
  commentId
}) {
  return useCallback(body => postUpdateCommentMessage({
    threadId,
    commentId,
    body
  }), [threadId, commentId]);
}
function useCurrentUser() {
  const context = useContext(ReviewStateContext);
  return context ? context.currentUser : null;
}
function useCommentThreadReads() {
  const context = useContext(CommentThreadReadsContext);
  return context ? context.commentThreadReads : emptyCommentThreadReads;
}
function useMarkThreadRead() {
  const context = useContext(CommentThreadReadsContext);
  return context === null || context === void 0 ? void 0 : context.markThreadRead;
}
function useCommentThread(threadId) {
  const context = useContext(ReviewStateContext);
  return context === null || context === void 0 ? void 0 : context.commentThreads.find(t => t.id === threadId);
}
function useCommentThreads({
  subjectType,
  subjectId,
  subjectRange,
  resolution = 'all',
  revealedThreadId
} = {}) {
  const context = useContext(ReviewStateContext);
  const commentThreads = context ? context.commentThreads : [];
  const hasSubject = subjectType !== undefined;
  return useMemo(() => {
    const rangeKey = subjectRange ? JSON.stringify(subjectRange) : undefined;
    return commentThreads.filter(thread => (!hasSubject || thread.subjectType === subjectType && thread.subjectId === subjectId && (!rangeKey || JSON.stringify(thread.subjectRange) === rangeKey)) && (matchesResolution(thread, resolution) || thread.id === revealedThreadId));
  }, [commentThreads, hasSubject, subjectType, subjectId, subjectRange, resolution, revealedThreadId]);
}
function matchesResolution(thread, resolution) {
  return resolution === 'all' || resolution === 'unresolved' && !thread.resolvedAt || resolution === 'resolved' && !!thread.resolvedAt;
}
function useStateMessages(dispatch) {
  useEffect(() => {
    function handleMessage(event) {
      if (window.location.href.indexOf(event.origin) !== 0) return;
      const {
        type,
        payload
      } = event.data;
      if (type === 'REVIEW_STATE_RESET') {
        dispatch({
          type: 'RESET',
          payload
        });
      } else if (type === 'REVIEW_STATE_THREAD_CHANGE') {
        dispatch({
          type: 'UPSERT_THREAD',
          payload
        });
      } else if (type === 'REVIEW_STATE_DRAFTS_CHANGE') {
        dispatch({
          type: 'SET_DRAFTS',
          payload
        });
      } else if (type === 'REVIEW_STATE_READS_CHANGE') {
        dispatch({
          type: 'SET_READS',
          payload
        });
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [dispatch]);
}
function useDraftsValue({
  drafts,
  setDraft,
  dispatch
}) {
  const createThread = useCallback(payload => {
    const {
      subjectType,
      subjectId,
      body
    } = payload;
    dispatch({
      type: 'SET_DRAFT',
      payload: {
        subjectType,
        subjectId,
        body,
        pending: true
      }
    });
    postCreateCommentThreadMessage(payload);
  }, [dispatch]);
  const createComment = useCallback(payload => {
    const {
      threadId,
      body
    } = payload;
    dispatch({
      type: 'SET_DRAFT',
      payload: {
        threadId,
        body,
        pending: true
      }
    });
    postCreateCommentMessage(payload);
  }, [dispatch]);
  return useMemo(() => ({
    drafts,
    setDraft: setDraft || postSetCommentDraftMessage,
    createThread,
    createComment
  }), [drafts, setDraft, createThread, createComment]);
}
function useReadsValue(commentThreadReads) {
  const markThreadRead = useCallback(permaId => postMarkThreadsReadMessage([permaId]), []);
  return useMemo(() => ({
    commentThreadReads,
    markThreadRead
  }), [commentThreadReads, markThreadRead]);
}
function initState({
  initialState,
  initialDrafts
}) {
  const empty = {
    currentUser: null,
    threads: {},
    drafts: initialDrafts || {},
    commentThreadReads: {}
  };
  if (initialState) {
    return reducer(empty, {
      type: 'RESET',
      payload: initialState
    });
  }
  return empty;
}
function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      {
        const threads = {};
        action.payload.commentThreads.forEach(thread => {
          threads[thread.id] = thread;
        });
        return {
          ...state,
          currentUser: action.payload.currentUser,
          threads,
          commentThreadReads: action.payload.commentThreadReads || {}
        };
      }
    case 'SET_READS':
      return {
        ...state,
        commentThreadReads: action.payload
      };
    case 'SET_DRAFTS':
      return {
        ...state,
        drafts: action.payload
      };
    case 'SET_DRAFT':
      return {
        ...state,
        drafts: {
          ...state.drafts,
          [draftKey(action.payload)]: action.payload
        }
      };
    case 'UPSERT_THREAD':
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.payload.id]: action.payload
        }
      };
    default:
      return state;
  }
}
function draftKey({
  threadId,
  subjectType,
  subjectId
}) {
  return threadId ? `Thread:${threadId}` : `${subjectType}:${subjectId}`;
}

function sortByRange(threads, compareRanges) {
  if (!compareRanges) return threads;
  return [...threads].sort((a, b) => compareRanges(a.subjectRange, b.subjectRange));
}

const EMPTY = {
  chapters: [],
  threads: [],
  bySubject: new Map()
};
const LocatedCommentThreadsContext = createContext(EMPTY);
function LocatedCommentThreadsProvider({
  children
}) {
  const located = useComputeLocatedCommentThreads();
  return /*#__PURE__*/React.createElement(LocatedCommentThreadsContext.Provider, {
    value: located
  }, children);
}

/**
 * @private
 */
function useLocatedCommentThreads() {
  return useContext(LocatedCommentThreadsContext);
}
function useComputeLocatedCommentThreads() {
  const structure = useEntryStructureWithContentElements();
  const allThreads = useCommentThreads();
  return useMemo(() => locateThreads(structure, allThreads), [structure, allThreads]);
}
function locateThreads(structure, allThreads) {
  const threadsBySection = groupBySection(allThreads);
  const chapters = placeThreadsOnSubjects(structure, groupBySubject(allThreads), threadsBySection);
  prependOrphans(chapters, threadsBySection);
  chapters.forEach(chapter => {
    chapter.threadCount = countThreads(chapter.sections);
  });
  return {
    chapters,
    threads: flatten(chapters),
    bySubject: buildSubjectIndex(chapters)
  };
}
function placeThreadsOnSubjects(structure, threadsBySubject, threadsBySection) {
  function take(subjectType, subjectId, compareRanges) {
    const subjectThreads = sortByRange(threadsBySubject[subjectKey(subjectType, subjectId)] || [], compareRanges);
    subjectThreads.forEach(thread => {
      var _threadsBySection$get;
      return (_threadsBySection$get = threadsBySection.get(thread.sectionPermaId)) === null || _threadsBySection$get === void 0 ? void 0 : _threadsBySection$get.delete(thread);
    });
    return subjectThreads;
  }
  return [...structure.main, ...structure.excursions].map(chapter => ({
    ...chapter,
    sections: chapter.sections.map(section => ({
      ...section,
      threads: take('Section', section.permaId),
      contentElements: section.contentElements.map(contentElement => ({
        ...contentElement,
        threads: take('ContentElement', contentElement.permaId, review.contentElementTypes.findCompareRanges(contentElement.type))
      }))
    }))
  }));
}
function prependOrphans(chapters, threadsBySection) {
  chapters.forEach(chapter => chapter.sections.forEach(section => {
    section.threads = [...drainSection(threadsBySection, section.permaId), ...section.threads];
  }));
  prependHomelessOrphans(chapters, threadsBySection);
}
function prependHomelessOrphans(chapters, threadsBySection) {
  var _chapters$;
  const firstSection = (_chapters$ = chapters[0]) === null || _chapters$ === void 0 ? void 0 : _chapters$.sections[0];
  const homelessOrphans = [...threadsBySection.values()].flatMap(set => [...set]).map(markOrphan);
  if (firstSection && homelessOrphans.length > 0) {
    firstSection.threads = [...homelessOrphans, ...firstSection.threads];
  }
}
function drainSection(threadsBySection, sectionPermaId) {
  const orphans = threadsBySection.get(sectionPermaId);
  threadsBySection.delete(sectionPermaId);
  return orphans ? [...orphans].map(markOrphan) : [];
}
function markOrphan(thread) {
  return {
    ...thread,
    orphaned: true
  };
}
function flatten(chapters) {
  const threads = [];
  chapters.forEach(chapter => chapter.sections.forEach(section => {
    threads.push(...section.threads);
    section.contentElements.forEach(contentElement => threads.push(...contentElement.threads));
  }));
  return threads;
}
function buildSubjectIndex(chapters) {
  const bySubject = new Map();
  chapters.forEach(chapter => chapter.sections.forEach(section => {
    bySubject.set(subjectKey('Section', section.permaId), section.threads);
    section.contentElements.forEach(contentElement => bySubject.set(subjectKey('ContentElement', contentElement.permaId), contentElement.threads));
  }));
  return bySubject;
}
function countThreads(sections) {
  return sections.reduce((count, section) => count + section.threads.length + section.contentElements.reduce((sum, element) => sum + element.threads.length, 0), 0);
}
function groupBySubject(threads) {
  const result = {};
  threads.forEach(thread => {
    const key = subjectKey(thread.subjectType, thread.subjectId);
    (result[key] || (result[key] = [])).push(thread);
  });
  return result;
}
function groupBySection(threads) {
  const result = new Map();
  threads.forEach(thread => {
    if (!result.has(thread.sectionPermaId)) {
      result.set(thread.sectionPermaId, new Set());
    }
    result.get(thread.sectionPermaId).add(thread);
  });
  return result;
}
function subjectKey(subjectType, subjectId) {
  return `${subjectType}:${subjectId}`;
}

const NONE = [];

/**
 * @private
 */
function useLocatedCommentThreadsForSubject({
  subjectType,
  subjectId,
  subjectRange,
  resolution = 'all',
  revealedThreadId
}) {
  const {
    bySubject
  } = useLocatedCommentThreads();
  return useMemo(() => {
    const threads = bySubject.get(`${subjectType}:${subjectId}`) || NONE;
    const rangeKey = subjectRange ? JSON.stringify(subjectRange) : undefined;
    return threads.filter(thread => (matchesResolution(thread, resolution) || thread.id === revealedThreadId) && (!rangeKey || JSON.stringify(thread.subjectRange) === rangeKey));
  }, [bySubject, subjectType, subjectId, subjectRange, resolution, revealedThreadId]);
}

const noop = () => {};
const CommentDisplayFilterContext = createContext({
  resolution: 'unresolved',
  alwaysShowComments: true,
  setResolution: noop
});
function CommentDisplayFilterProvider({
  resolution = 'unresolved',
  alwaysShowComments = true,
  setResolution = noop,
  children
}) {
  const value = useMemo(() => ({
    resolution,
    alwaysShowComments,
    setResolution
  }), [resolution, alwaysShowComments, setResolution]);
  return /*#__PURE__*/React.createElement(CommentDisplayFilterContext.Provider, {
    value: value
  }, children);
}
function useCommentDisplayFilter() {
  return useContext(CommentDisplayFilterContext);
}
function useStoredCommentDisplayFilter(storageKey) {
  const [resolution, setResolution] = useState(() => readResolution(storageKey));
  const store = useCallback(resolution => {
    setResolution(resolution);
    storeResolution(storageKey, resolution);
  }, [storageKey]);
  return useMemo(() => ({
    resolution,
    setResolution: store
  }), [resolution, store]);
}
function readResolution(storageKey) {
  var _getLocalStorage;
  return ((_getLocalStorage = getLocalStorage()) === null || _getLocalStorage === void 0 ? void 0 : _getLocalStorage[storageKey]) === 'all' ? 'all' : 'unresolved';
}
function storeResolution(storageKey, resolution) {
  const storage = getLocalStorage();
  if (storage) {
    storage[storageKey] = resolution;
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

const ReviewMessageHandler = {
  create({
    session,
    targetWindow
  }) {
    function handleMessage(event) {
      if (window.location.href.indexOf(event.origin) !== 0) return;
      if (event.source !== targetWindow) return;
      const {
        type,
        payload
      } = event.data;
      if (type === 'CREATE_COMMENT_THREAD') {
        session.createThread(payload);
      } else if (type === 'CREATE_COMMENT') {
        session.createComment(payload);
      } else if (type === 'UPDATE_THREAD') {
        session.updateThread(payload);
      } else if (type === 'UPDATE_COMMENT') {
        session.updateComment(payload);
      } else if (type === 'SET_COMMENT_DRAFT') {
        session.setDraft(payload);
      } else if (type === 'MARK_THREADS_READ') {
        session.markThreadsRead(payload.permaIds);
      }
    }
    function handleReset(state) {
      postReviewStateResetMessage(targetWindow, state);
    }
    function handleThreadChange(thread) {
      postReviewStateThreadChangeMessage(targetWindow, thread);
    }
    function handleDraftsChange(drafts) {
      postReviewStateDraftsChangeMessage(targetWindow, drafts);
    }
    function handleReadsChange(reads) {
      postReviewStateReadsChangeMessage(targetWindow, reads);
    }
    window.addEventListener('message', handleMessage);
    session.on('reset', handleReset);
    session.on('change:thread', handleThreadChange);
    session.on('change:drafts', handleDraftsChange);
    session.on('change:reads', handleReadsChange);
    return {
      dispose() {
        window.removeEventListener('message', handleMessage);
        session.off('reset', handleReset);
        session.off('change:thread', handleThreadChange);
        session.off('change:drafts', handleDraftsChange);
        session.off('change:reads', handleReadsChange);
      }
    };
  }
};

const CommentThreadReadsSnapshotContext = createContext(null);
function CommentThreadReadsSnapshot({
  enabled = true,
  resetOn,
  children
}) {
  const outerSnapshot = useContext(CommentThreadReadsSnapshotContext);
  const liveReads = useCommentThreadReads();
  const currentUser = useCurrentUser();
  const snapshot = useRef(null);
  const lastResetOn = useRef(resetOn);
  if (resetOn !== lastResetOn.current) {
    lastResetOn.current = resetOn;
    snapshot.current = null;
  }
  if (!enabled) {
    snapshot.current = null;
  } else if (!snapshot.current && currentUser) {
    snapshot.current = liveReads;
  }
  return /*#__PURE__*/React.createElement(CommentThreadReadsSnapshotContext.Provider, {
    value: outerSnapshot || snapshot.current
  }, children);
}
function useDisplayedCommentThreadReads() {
  const snapshot = useContext(CommentThreadReadsSnapshotContext);
  const liveReads = useCommentThreadReads();
  return snapshot || liveReads;
}

function useUnreadActivityCount(threads) {
  const currentUser = useCurrentUser();
  const commentThreadReads = useDisplayedCommentThreadReads();
  return useMemo(() => threads.reduce((count, thread) => count + unreadActivity(thread, {
    currentUser,
    readAt: commentThreadReads[thread.permaId]
  }).length, 0), [threads, currentUser, commentThreadReads]);
}
function useUnreadActivity(thread) {
  const currentUser = useCurrentUser();
  const commentThreadReads = useDisplayedCommentThreadReads();
  return useMemo(() => unreadActivity(thread, {
    currentUser,
    readAt: commentThreadReads[thread.permaId]
  }), [thread, currentUser, commentThreadReads]);
}
function useLiveUnreadActivity(thread) {
  const currentUser = useCurrentUser();
  const commentThreadReads = useCommentThreadReads();
  return useMemo(() => unreadActivity(thread, {
    currentUser,
    readAt: commentThreadReads[thread.permaId]
  }), [thread, currentUser, commentThreadReads]);
}
function threadActivity(thread) {
  const activity = thread.comments.map(comment => ({
    ...comment,
    at: comment.createdAt
  }));
  if (thread.resolvedAt) {
    activity.push({
      resolution: true,
      at: thread.resolvedAt,
      createdAt: thread.resolvedAt,
      creatorId: thread.resolvedById
    });
  }
  return activity;
}
function unreadActivity(thread, {
  currentUser,
  readAt
}) {
  return threadActivity(thread).filter(event => isUnread(event, {
    currentUser,
    readAt
  }));
}

// Kept in sync with Pageflow::EntryCommentSummary, which applies the same
// rule server side.
function isUnread({
  creatorId,
  createdAt
}, {
  currentUser,
  readAt
}) {
  if (!currentUser || creatorId === currentUser.id) return false;
  const seenUpTo = latestTime([readAt, currentUser.unreadCommentsSinceAt]);
  return seenUpTo === null || new Date(createdAt).getTime() > seenUpTo;
}
function latestTime(timestamps) {
  const times = timestamps.filter(Boolean).map(timestamp => new Date(timestamp).getTime());
  return times.length ? Math.max(...times) : null;
}

function watchUnreadComments({
  entry,
  session
}) {
  function update() {
    entry.set('hasUnreadComments', hasUnreadComments(session.state));
  }
  session.on('reset', update);
  session.on('change:thread', update);
  session.on('change:reads', update);
  update();
}
function hasUnreadComments(state) {
  if (!state) {
    return false;
  }
  const {
    currentUser,
    commentThreads,
    commentThreadReads = {}
  } = state;
  return commentThreads.some(thread => unreadActivity(thread, {
    currentUser,
    readAt: commentThreadReads[thread.permaId]
  }).length > 0);
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
var CommentIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "16",
  height: "16"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M22 17a2 2 0 01-2 2H6.828a2 2 0 00-1.414.586l-2.202 2.202A.71.71 0 012 21.286V5a2 2 0 012-2h16a2 2 0 012 2zM7 11h10M7 15h6M7 7h8"
})));

var styles = {"badge":"Badge-module_badge__3p6yC","active":"Badge-module_active__j183x","resolved":"Badge-module_resolved__3lpoW","dot":"Badge-module_dot__7JmxD","iconOnly":"Badge-module_iconOnly__3DRC8","icon":"Badge-module_icon__3DcSk","unread":"Badge-module_unread__2Gbxx"};

const Badge = forwardRef(function Badge({
  counter,
  hasThreads = counter > 0,
  mode,
  resolved,
  unreadCount = 0,
  onClick
}, ref) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const unread = unreadCount > 0;
  const variant = resolveVariant(mode, hasThreads, unread);
  if (!variant) {
    return null;
  }
  return /*#__PURE__*/React.createElement("button", {
    ref: ref,
    role: "status",
    "aria-label": unread ? t('pageflow_scrolled.review.unread_count', {
      count: unreadCount
    }) : undefined,
    className: classNames(styles.badge, styles[variant], {
      [styles.resolved]: resolved,
      [styles.unread]: unread
    }),
    onClick: onClick
  }, variant !== 'dot' && /*#__PURE__*/React.createElement(CommentIcon, {
    className: styles.icon
  }), (variant === 'active' || variant === 'expanded') && counter > 1 ? counter : null);
});
function resolveVariant(mode, hasThreads, unread) {
  switch (mode) {
    case 'active':
      return 'active';
    case 'icon':
      return hasThreads ? 'expanded' : 'iconOnly';
    case 'none':
      return null;
    case 'dot':
      // A dot would leave the unread dot sitting on a dot.
      return hasThreads ? unread ? 'expanded' : 'dot' : null;
    default:
      return hasThreads ? 'expanded' : null;
  }
}

function ThreadsBadge({
  subjectType,
  subjectId,
  subjectRange,
  onClick,
  mode,
  resolution = 'unresolved',
  revealedThreadId
}) {
  const threads = useLocatedCommentThreadsForSubject({
    subjectType,
    subjectId,
    subjectRange,
    resolution,
    revealedThreadId
  });
  const unresolvedThreads = useLocatedCommentThreadsForSubject({
    subjectType,
    subjectId,
    subjectRange,
    resolution: 'unresolved'
  });
  const counted = threads.filter(thread => thread.id !== revealedThreadId);
  const unreadCount = useUnreadActivityCount(threads);
  const handleClick = useCallback(() => {
    if (onClick) onClick(threads);
  }, [onClick, threads]);
  const resolved = threads.length > 0 && unresolvedThreads.length === 0;
  return /*#__PURE__*/React.createElement(Badge, {
    counter: counted.length,
    hasThreads: threads.length > 0,
    mode: mode,
    resolved: resolved,
    unreadCount: unreadCount,
    onClick: handleClick
  });
}

var styles$1 = {"avatar":"Avatar-module_avatar__3yj0L","avatarStack":"Avatar-module_avatarStack__1g6pW","stackedAvatar":"Avatar-module_stackedAvatar__mthMW"};

function Avatar({
  name,
  className
}) {
  const initial = (name || '?')[0].toUpperCase();
  const hue = nameToHue(name);
  return /*#__PURE__*/React.createElement("span", {
    className: `${styles$1.avatar} ${className || ''}`,
    style: {
      backgroundColor: `hsl(${hue}, 45%, 40%)`
    }
  }, initial);
}
function AvatarStack({
  names
}) {
  const unique = [...new Set(names.filter(Boolean))];
  return /*#__PURE__*/React.createElement("span", {
    className: styles$1.avatarStack
  }, unique.map((name, i) => /*#__PURE__*/React.createElement(Avatar, {
    key: i,
    name: name,
    className: styles$1.stackedAvatar
  })));
}
function nameToHue(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

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
var EllipsisIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$1({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "16",
  height: "16"
}, props), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "5",
  r: "1"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "1"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "19",
  r: "1"
})));

var styles$2 = {"menu":"CommentMenu-module_menu__24kxI","button":"CommentMenu-module_button__10Le9","list":"CommentMenu-module_list__3B1nV","item":"CommentMenu-module_item__2exBD"};

function CommentMenu({
  label,
  items
}) {
  const portalRoot = useFloatingPortalRoot();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const elementsRef = useRef([]);
  const labelsRef = useRef([]);
  labelsRef.current = items.map(item => item.label);
  const {
    refs,
    floatingStyles,
    context
  } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-end',
    middleware: [offset(4), flip({
      padding: 8
    }), shift({
      padding: 8
    })],
    whileElementsMounted: autoUpdate
  });
  const click = useClick(context);
  const dismiss = useDismiss(context, {
    escapeKey: false
  });
  const role = useRole(context, {
    role: 'menu'
  });
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: setActiveIndex,
    enabled: open
  });
  const {
    getReferenceProps,
    getFloatingProps,
    getItemProps
  } = useInteractions([click, dismiss, role, listNavigation, typeahead]);

  // React 16 dispatches all events from the document, so enclosing popovers
  // listening there for Escape would close along with the menu.
  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setOpen(false);
      }
    }
    document.addEventListener('keydown', closeOnEscape, true);
    return () => document.removeEventListener('keydown', closeOnEscape, true);
  }, [open]);
  function stopPropagation(event) {
    event.stopPropagation();
  }
  return /*#__PURE__*/React.createElement("span", {
    className: styles$2.menu,
    onClick: stopPropagation
  }, /*#__PURE__*/React.createElement("button", Object.assign({
    ref: refs.setReference,
    type: "button",
    className: styles$2.button,
    "aria-label": label
  }, getReferenceProps()), /*#__PURE__*/React.createElement(EllipsisIcon, null)), open && /*#__PURE__*/React.createElement(FloatingPortal, {
    root: portalRoot
  }, /*#__PURE__*/React.createElement(FloatingFocusManager, {
    context: context,
    modal: false
  }, /*#__PURE__*/React.createElement("div", Object.assign({
    ref: refs.setFloating,
    "data-comment-menu": true,
    "data-floating-raised": true,
    className: styles$2.list,
    style: floatingStyles,
    onClick: stopPropagation
  }, getFloatingProps()), items.map(({
    icon: Icon,
    label,
    onSelect
  }, index) => /*#__PURE__*/React.createElement("button", Object.assign({
    key: label,
    ref: node => elementsRef.current[index] = node,
    type: "button",
    role: "menuitem",
    className: styles$2.item,
    tabIndex: activeIndex === index ? 0 : -1
  }, getItemProps({
    onClick() {
      setOpen(false);
      if (onSelect) onSelect();
    }
  })), /*#__PURE__*/React.createElement(Icon, null), label))))));
}

function autoGrow(el) {
  el.style.height = 'auto';
  if (el.scrollHeight > 0) {
    el.style.height = el.scrollHeight + 'px';
  }
}
function autoResize(el) {
  if (el) {
    autoGrow(el);
  }
}

function formatDate(isoString, locale, options) {
  const date = new Date(isoString);
  const fromCurrentYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleString(locale, {
    month: 'short',
    day: 'numeric',
    ...(!fromCurrentYear && {
      year: 'numeric'
    }),
    ...options
  });
}
function formatDateTime(isoString, locale) {
  return formatDate(isoString, locale, {
    hour: 'numeric',
    minute: '2-digit'
  });
}

function isSubmitShortcut(event) {
  return (event.metaKey || event.ctrlKey) && event.key === 'Enter';
}

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
var EditIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$2({
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
  d: "M21.174 6.812a1 1 0 00-3.986-3.987L3.842 16.174a2 2 0 00-.5.83l-1.321 4.352a.5.5 0 00.623.622l4.353-1.32a2 2 0 00.83-.497zM15 5l4 4"
})));

var styles$3 = {"header":"Comment-module_header__2oN4m","headerText":"Comment-module_headerText__1ZuhQ","author":"Comment-module_author__2LNS1","headerMenu":"Comment-module_headerMenu__25LDn","timestamp":"Comment-module_timestamp__2zNl2","quote":"Comment-module_quote__1G-yv","body":"Comment-module_body__3KfZL","editedHint":"Comment-module_editedHint__buRnz","editForm":"Comment-module_editForm__qbsHA","editInput":"Comment-module_editInput__2M2h8","editActions":"Comment-module_editActions__39B25","saveButton":"Comment-module_saveButton__GW-z-","cancelButton":"Comment-module_cancelButton__3vfW0"};

function Comment({
  comment,
  threadId,
  showQuote,
  editing,
  onEdit,
  onEditEnd
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const locale = useLocale({
    locale: 'ui'
  });
  const currentUser = useCurrentUser();
  const editable = !!onEdit && comment.creatorId === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: styles$3.header
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: comment.creatorName
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$3.headerText
  }, /*#__PURE__*/React.createElement("span", {
    className: styles$3.author
  }, comment.creatorName), comment.createdAt && /*#__PURE__*/React.createElement("time", {
    className: styles$3.timestamp,
    dateTime: comment.createdAt
  }, formatDate(comment.createdAt, locale))), editable && /*#__PURE__*/React.createElement("span", {
    className: styles$3.headerMenu
  }, /*#__PURE__*/React.createElement(CommentMenu, {
    label: t('pageflow_scrolled.review.comment_actions'),
    items: [{
      icon: EditIcon,
      label: t('pageflow_scrolled.review.edit_comment'),
      onSelect: onEdit
    }]
  }))), showQuote && /*#__PURE__*/React.createElement("blockquote", {
    className: styles$3.quote
  }, comment.quote), editing ? /*#__PURE__*/React.createElement(EditForm, {
    comment: comment,
    threadId: threadId,
    onDone: onEditEnd
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: styles$3.body
  }, comment.body), comment.editedAt && /*#__PURE__*/React.createElement("p", {
    className: styles$3.editedHint
  }, t('pageflow_scrolled.review.edited', {
    date: formatDateTime(comment.editedAt, locale)
  }))));
}
function EditForm({
  comment,
  threadId,
  onDone
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const [body, setBody] = useState(comment.body);
  const hasText = body.trim().length > 0;
  const updateComment = useUpdateComment({
    threadId,
    commentId: comment.id
  });

  // Focusing without preventScroll yanks the page to the top before
  // floating-ui has positioned the portaled popover.
  const setInputRef = useCallback(node => {
    autoResize(node);
    node === null || node === void 0 ? void 0 : node.focus({
      preventScroll: true
    });
  }, []);
  function handleChange(e) {
    setBody(e.target.value);
    autoGrow(e.target);
  }
  function handleSubmit(event) {
    event.preventDefault();
    save();
  }
  function handleKeyDown(event) {
    if (isSubmitShortcut(event)) {
      event.preventDefault();
      save();
    }
  }
  function save() {
    if (!hasText) return;
    updateComment(body);
    onDone();
  }
  return /*#__PURE__*/React.createElement("form", {
    className: styles$3.editForm,
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("textarea", {
    className: styles$3.editInput,
    ref: setInputRef,
    value: body,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    rows: 1
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$3.editActions
  }, /*#__PURE__*/React.createElement("button", {
    className: styles$3.cancelButton,
    type: "button",
    onClick: onDone
  }, t('pageflow_scrolled.review.cancel')), /*#__PURE__*/React.createElement("button", {
    className: styles$3.saveButton,
    type: "submit",
    disabled: !hasText
  }, t('pageflow_scrolled.review.save'))));
}

function useDraftedBody(draftOf) {
  const [draft, setDraft] = useCommentDraft(draftOf);
  const [body, setBody] = useState(() => (draft === null || draft === void 0 ? void 0 : draft.body) || '');
  const pending = !!(draft === null || draft === void 0 ? void 0 : draft.pending);
  const latest = useRef();
  latest.current = {
    body,
    pending,
    setDraft
  };
  const wasPending = useRef(false);
  useEffect(() => {
    if (pending) {
      wasPending.current = true;
    } else if (wasPending.current) {
      wasPending.current = false;
      if (!draft) setBody('');
    }
  }, [pending, draft]);
  useEffect(() => () => {
    const {
      body,
      pending,
      setDraft
    } = latest.current;
    if (pending) return;
    setDraft(body);
  }, []);
  return {
    body,
    setBody,
    submitting: pending
  };
}

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
var SendIcon = (({
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
  d: "M3.714 3.048a.498.498 0 00-.683.627l2.843 7.627a2 2 0 010 1.396l-2.842 7.627a.498.498 0 00.682.627l18-8.5a.5.5 0 000-.904zM6 12h16"
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
var SpinnerIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$4({
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
}, props), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10",
  stroke: "currentColor",
  strokeWidth: "4",
  opacity: ".23"
}), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
  opacity: ".75"
})));

var styles$4 = {"form":"ReplyForm-module_form__3OLBD","input":"ReplyForm-module_input__3g68H","actions":"ReplyForm-module_actions__3ZEiR","hint":"ReplyForm-module_hint__1N8JU","submitButton":"ReplyForm-module_submitButton__2nYwT","spinner":"ReplyForm-module_spinner__3uGA7","spin":"ReplyForm-module_spin__23uBX"};

function ReplyForm({
  threadId,
  subjectType,
  subjectId,
  subjectRange,
  onSubmit
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    body,
    setBody,
    submitting
  } = useDraftedBody({
    threadId
  });
  const hasText = body.trim().length > 0;
  const createComment = useCreateComment({
    threadId,
    subjectType,
    subjectId,
    subjectRange
  });
  function handleChange(e) {
    setBody(e.target.value);
    autoGrow(e.target);
  }
  function handleSubmit(event) {
    event.preventDefault();
    createReply();
  }
  function handleKeyDown(event) {
    if (isSubmitShortcut(event)) {
      event.preventDefault();
      createReply();
    }
  }
  function createReply() {
    if (!hasText || submitting) return;
    createComment(body);
    if (onSubmit) onSubmit();
  }
  return /*#__PURE__*/React.createElement("form", {
    className: styles$4.form,
    onSubmit: handleSubmit,
    "aria-busy": submitting
  }, /*#__PURE__*/React.createElement("textarea", {
    className: styles$4.input,
    ref: autoResize,
    value: body,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    placeholder: t('pageflow_scrolled.review.reply_placeholder'),
    disabled: submitting,
    rows: 1
  }), hasText && /*#__PURE__*/React.createElement("div", {
    className: styles$4.actions
  }, !submitting && /*#__PURE__*/React.createElement("span", {
    className: styles$4.hint
  }, t('pageflow_scrolled.review.enter_for_new_line')), /*#__PURE__*/React.createElement("button", {
    className: styles$4.submitButton,
    type: "submit",
    disabled: submitting,
    "aria-label": t('pageflow_scrolled.review.send')
  }, submitting ? /*#__PURE__*/React.createElement(SpinnerIcon, {
    className: styles$4.spinner
  }) : /*#__PURE__*/React.createElement(SendIcon, null), t('pageflow_scrolled.review.send'))));
}

function commentsWithOutdatedQuote(comments, currentQuote) {
  const ids = new Set();
  comments.forEach((comment, index) => {
    const previousQuote = index > 0 ? comments[index - 1].quote : undefined;
    if (comment.quote && comment.quote !== currentQuote && comment.quote !== previousQuote) {
      ids.add(comment.id);
    }
  });
  return ids;
}

const DWELL_TIME = 800;

// A thread taller than the viewport could never reach a visibility ratio.
const ROOT_MARGIN = '-10% 0px -10% 0px';
function useMarkThreadReadWhenSeen({
  thread,
  ref,
  enabled
}) {
  const unread = useLiveUnreadActivity(thread);
  const markThreadRead = useMarkThreadRead();
  const {
    permaId
  } = thread;
  const hasUnread = unread.length > 0;
  useEffect(() => {
    const element = ref.current;
    if (!enabled || !hasUnread || !markThreadRead || !element) return;
    let timeout;
    const observer = new IntersectionObserver(entries => {
      clearTimeout(timeout);
      if (entries[entries.length - 1].isIntersecting) {
        timeout = setTimeout(() => markThreadRead(permaId), DWELL_TIME);
      }
    }, {
      rootMargin: ROOT_MARGIN
    });
    observer.observe(element);
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [enabled, hasUnread, markThreadRead, permaId, ref]);
}

const ScrollHighlightedThreadIntoViewContext = createContext(false);
function ScrollHighlightedThreadIntoViewProvider({
  children
}) {
  return /*#__PURE__*/React.createElement(ScrollHighlightedThreadIntoViewContext.Provider, {
    value: true
  }, children);
}
function useScrollHighlightedThreadIntoView() {
  return useContext(ScrollHighlightedThreadIntoViewContext);
}

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
var ChevronIcon = (({
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
  d: "M6 9l6 6 6-6"
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
var ResolveIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$6({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "16",
  height: "16"
}, props), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("path", {
  d: "M9 12l2 2 4-4"
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
var UnresolveIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$7({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "16",
  height: "16"
}, props), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("path", {
  d: "M15 9l-6 6m0-6l6 6"
})));

var styles$5 = {"thread":"Thread-module_thread__2dVNT","clickable":"Thread-module_clickable__363ed","highlighted":"Thread-module_highlighted__QPdWq","unreadTopic":"Thread-module_unreadTopic__lV9Gx","unreadDot":"Thread-module_unreadDot__2eXv2","replyCount":"Thread-module_replyCount__1BtL6","counts":"Thread-module_counts__xwlLv","count":"Thread-module_count__2M10h","unreadReplyCount":"Thread-module_unreadReplyCount__3edml","unreadRepliesDivider":"Thread-module_unreadRepliesDivider__3MluU","deletedHint":"Thread-module_deletedHint___87Af","replyChevron":"Thread-module_replyChevron__1D9Id","chevronExpanded":"Thread-module_chevronExpanded__3yPgT","repliesToggle":"Thread-module_repliesToggle__3AB0y","resolveRow":"Thread-module_resolveRow__J-YwZ","resolveButton":"Thread-module_resolveButton__3jHc5","resolveRowIcon":"Thread-module_resolveRowIcon__jadO-","resolveIcon":"Thread-module_resolveIcon__3BY4k Thread-module_resolveRowIcon__jadO-","unreadResolution":"Thread-module_unreadResolution__aWpoR","resolutionIcon":"Thread-module_resolutionIcon__1Ukvm Thread-module_resolveRowIcon__jadO-","resolution":"Thread-module_resolution__ky9CL","resolver":"Thread-module_resolver__1uT7v","resolutionMeta":"Thread-module_resolutionMeta__16YZ7","foldedReplies":"Thread-module_foldedReplies__bF4Xu","foldedRepliesButton":"Thread-module_foldedRepliesButton__rZA-u Thread-module_foldedReplies__bF4Xu"};

function Thread({
  thread,
  collapsed: collapsedProp,
  visibleReplyCount,
  onExpandReplies,
  onToggle,
  onReply,
  onResolve,
  onClick,
  highlighted,
  showUnreadMarker,
  markReadWhenHighlighted,
  interactive = true
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const firstComment = thread.comments[0];
  const replies = thread.comments.slice(1);
  const [replyDraft] = useCommentDraft({
    threadId: thread.id
  });
  const collapsed = collapsedProp && !replyDraft;
  const repliesCollapsed = collapsed && replies.length > 0;
  const {
    shownReplies,
    foldedReplyCount
  } = foldReplies(replies, {
    visibleReplyCount,
    collapsed: repliesCollapsed
  });
  const hiddenReplies = repliesCollapsed ? replies : replies.slice(0, foldedReplyCount);
  const {
    unread,
    unreadTopic,
    unreadReplyCount,
    unreadResolution,
    firstUnreadReplyId,
    hidesUnread
  } = useUnreadMarkers({
    thread,
    firstComment,
    replies,
    hiddenReplies
  });
  const hidesUnreadReplies = repliesCollapsed && unreadReplyCount > 0;
  const [editingCommentId, setEditingCommentId] = useState(null);
  const editing = editingCommentId !== null;
  function editProps(comment) {
    return {
      threadId: thread.id,
      editing: editingCommentId === comment.id,
      onEdit: interactive ? () => setEditingCommentId(comment.id) : undefined,
      onEditEnd: () => setEditingCommentId(null)
    };
  }
  const currentQuote = useSubjectQuote(thread);
  const outdatedQuotes = useMemo(() => commentsWithOutdatedQuote(thread.comments, currentQuote), [thread.comments, currentQuote]);
  const ref = useRef();
  const scrollHighlightedIntoView = useScrollHighlightedThreadIntoView();
  useMarkThreadReadWhenSeen({
    thread,
    ref,
    enabled: !hidesUnread && (highlighted || !markReadWhenHighlighted)
  });
  useEffect(() => {
    if (scrollHighlightedIntoView && highlighted && ref.current) {
      ref.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [scrollHighlightedIntoView, highlighted]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: classNames(styles$5.thread, {
      [styles$5.highlighted]: highlighted,
      [styles$5.unreadTopic]: showUnreadMarker && unreadTopic,
      [styles$5.clickable]: onClick
    }),
    onClick: onClick,
    "aria-current": highlighted ? 'true' : undefined
  }, showUnreadMarker && unread.length > 0 && /*#__PURE__*/React.createElement("span", {
    role: "img",
    className: styles$5.unreadDot,
    "aria-label": t('pageflow_scrolled.review.unread_count', {
      count: unread.length
    })
  }), thread.orphaned && /*#__PURE__*/React.createElement("p", {
    className: styles$5.deletedHint
  }, t('pageflow_scrolled.review.refers_to_deleted_element')), firstComment && /*#__PURE__*/React.createElement(Comment, Object.assign({
    comment: firstComment,
    showQuote: outdatedQuotes.has(firstComment.id)
  }, editProps(firstComment))), replies.length > 0 && !foldedReplyCount && /*#__PURE__*/React.createElement("button", {
    className: styles$5.repliesToggle,
    onClick: onToggle,
    "aria-expanded": !collapsed
  }, /*#__PURE__*/React.createElement("span", {
    className: styles$5.replyCount
  }, /*#__PURE__*/React.createElement("span", {
    className: styles$5.counts
  }, /*#__PURE__*/React.createElement("span", {
    className: styles$5.count
  }, t('pageflow_scrolled.review.reply_count', {
    count: replies.length
  })), hidesUnreadReplies && /*#__PURE__*/React.createElement("span", {
    className: styles$5.unreadReplyCount
  }, t('pageflow_scrolled.review.unread_reply_count', {
    count: unreadReplyCount
  }))), /*#__PURE__*/React.createElement(ChevronIcon, {
    className: classNames(styles$5.replyChevron, {
      [styles$5.chevronExpanded]: !collapsed
    })
  })), repliesCollapsed && /*#__PURE__*/React.createElement(AvatarStack, {
    names: replies.map(c => c.creatorName)
  })), !collapsed && foldedReplyCount > 0 && /*#__PURE__*/React.createElement(FoldedReplies, {
    count: foldedReplyCount,
    onExpand: onExpandReplies
  }), !collapsed && shownReplies.map(comment => /*#__PURE__*/React.createElement(React.Fragment, {
    key: comment.id
  }, comment.id === firstUnreadReplyId && /*#__PURE__*/React.createElement("div", {
    className: styles$5.unreadRepliesDivider
  }, t('pageflow_scrolled.review.unread_replies')), /*#__PURE__*/React.createElement(Comment, Object.assign({
    comment: comment,
    showQuote: outdatedQuotes.has(comment.id)
  }, editProps(comment))))), interactive && !thread.resolvedAt && !repliesCollapsed && !foldedReplyCount && !editing && /*#__PURE__*/React.createElement(ReplyForm, {
    threadId: thread.id,
    subjectType: thread.subjectType,
    subjectId: thread.subjectId,
    subjectRange: thread.subjectRange,
    onSubmit: onReply
  }), (thread.resolvedAt || interactive && onResolve && !repliesCollapsed) && /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$5.resolveRow, {
      [styles$5.unreadResolution]: unreadResolution
    })
  }, thread.resolvedAt ? /*#__PURE__*/React.createElement(Resolution, {
    thread: thread,
    onUnresolve: interactive ? onResolve : undefined
  }) : /*#__PURE__*/React.createElement("button", {
    className: styles$5.resolveButton,
    onClick: onResolve
  }, /*#__PURE__*/React.createElement(ResolveIcon, {
    className: styles$5.resolveIcon
  }), t('pageflow_scrolled.review.resolve'))));
}
function foldReplies(replies, {
  visibleReplyCount,
  collapsed
}) {
  const foldedReplyCount = collapsed || visibleReplyCount === undefined ? 0 : Math.max(replies.length - visibleReplyCount, 0);
  return {
    foldedReplyCount,
    shownReplies: foldedReplyCount > 0 ? replies.slice(foldedReplyCount) : replies
  };
}
function useUnreadMarkers({
  thread,
  firstComment,
  replies,
  hiddenReplies
}) {
  const unread = useUnreadActivity(thread);
  const unreadIds = useMemo(() => new Set(unread.map(event => event.id)), [unread]);
  const firstUnreadReplyId = useMemo(() => {
    var _replies$find;
    if (!unread.length || unread[0].id === (firstComment === null || firstComment === void 0 ? void 0 : firstComment.id)) {
      return null;
    }
    return (_replies$find = replies.find(reply => unreadIds.has(reply.id))) === null || _replies$find === void 0 ? void 0 : _replies$find.id;
  }, [unread, unreadIds, replies, firstComment]);
  return {
    unread,
    firstUnreadReplyId,
    unreadTopic: !!firstComment && unreadIds.has(firstComment.id),
    unreadReplyCount: replies.filter(reply => unreadIds.has(reply.id)).length,
    unreadResolution: unread.some(event => event.resolution),
    hidesUnread: hiddenReplies.some(reply => unreadIds.has(reply.id))
  };
}
function Resolution({
  thread,
  onUnresolve
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const locale = useLocale({
    locale: 'ui'
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ResolveIcon, {
    className: styles$5.resolutionIcon
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$5.resolution
  }, /*#__PURE__*/React.createElement("span", null, t(thread.resolverName ? 'pageflow_scrolled.review.resolution_by' : 'pageflow_scrolled.review.resolution')), /*#__PURE__*/React.createElement("span", {
    className: styles$5.resolutionMeta
  }, thread.resolverName && /*#__PURE__*/React.createElement("span", {
    className: styles$5.resolver
  }, thread.resolverName), /*#__PURE__*/React.createElement("time", {
    dateTime: thread.resolvedAt
  }, formatDate(thread.resolvedAt, locale)))), onUnresolve && /*#__PURE__*/React.createElement(CommentMenu, {
    label: t('pageflow_scrolled.review.thread_actions'),
    items: [{
      icon: UnresolveIcon,
      label: t('pageflow_scrolled.review.unresolve'),
      onSelect: onUnresolve
    }]
  }));
}
function FoldedReplies({
  count,
  onExpand
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const label = t('pageflow_scrolled.review.earlier_reply_count', {
    count
  });
  if (!onExpand) {
    return /*#__PURE__*/React.createElement("div", {
      className: styles$5.foldedReplies
    }, label);
  }
  return /*#__PURE__*/React.createElement("button", {
    className: styles$5.foldedRepliesButton,
    onClick: onExpand
  }, label);
}

var styles$6 = {"form":"NewThreadForm-module_form__dNsMB","input":"NewThreadForm-module_input__2HX-m","actions":"NewThreadForm-module_actions__OVGqx","hint":"NewThreadForm-module_hint__1_RFf","submitButton":"NewThreadForm-module_submitButton__3_ZpM","spinner":"NewThreadForm-module_spinner__1XkBe","spin":"NewThreadForm-module_spin__3P_Js"};

function NewThreadForm({
  subjectType,
  subjectId,
  subjectRange,
  onSubmit
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    body,
    setBody,
    submitting
  } = useDraftedBody({
    subjectType,
    subjectId
  });
  const hasText = body.trim().length > 0;
  const createCommentThread = useCreateCommentThread({
    subjectType,
    subjectId,
    subjectRange
  });

  // Focusing without preventScroll yanks the page to the top before
  // floating-ui has positioned the portaled popover.
  const setInputRef = useCallback(node => {
    autoResize(node);
    node === null || node === void 0 ? void 0 : node.focus({
      preventScroll: true
    });
  }, []);
  function handleChange(e) {
    setBody(e.target.value);
    autoGrow(e.target);
  }
  function handleSubmit(event) {
    event.preventDefault();
    createThread();
  }
  function handleKeyDown(event) {
    if (isSubmitShortcut(event)) {
      event.preventDefault();
      createThread();
    }
  }
  function createThread() {
    if (!hasText || submitting) return;
    createCommentThread(body);
    if (onSubmit) onSubmit();
  }
  return /*#__PURE__*/React.createElement("form", {
    className: styles$6.form,
    onSubmit: handleSubmit,
    "aria-busy": submitting
  }, /*#__PURE__*/React.createElement("textarea", {
    className: styles$6.input,
    ref: setInputRef,
    value: body,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    placeholder: t('pageflow_scrolled.review.add_comment_placeholder'),
    disabled: submitting,
    rows: 3
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$6.actions
  }, hasText && !submitting && /*#__PURE__*/React.createElement("span", {
    className: styles$6.hint
  }, t('pageflow_scrolled.review.enter_for_new_line')), /*#__PURE__*/React.createElement("button", {
    className: styles$6.submitButton,
    type: "submit",
    disabled: submitting
  }, submitting ? /*#__PURE__*/React.createElement(SpinnerIcon, {
    className: styles$6.spinner
  }) : /*#__PURE__*/React.createElement(SendIcon, null), t('pageflow_scrolled.review.send'))));
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
var NewTopicIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$8({
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
  d: "M5 12h14m-7-7v14"
})));

var styles$7 = {"container":"ThreadList-module_container__2tqnD","newTopicButton":"ThreadList-module_newTopicButton__hRHCb","reversed":"ThreadList-module_reversed__1ujqo","resolvedSection":"ThreadList-module_resolvedSection__2mZhS","resolvedPill":"ThreadList-module_resolvedPill__2i3zE","chevron":"ThreadList-module_chevron__3xHNN","chevronExpanded":"ThreadList-module_chevronExpanded__2WNCc","blankSlate":"ThreadList-module_blankSlate__hyyTF"};

function ThreadList({
  subjectType,
  subjectId,
  subjectRange,
  filter,
  resolution,
  highlightedThreadId,
  onThreadClick,
  restrictInteractionsToHighlighted,
  showNewForm: showNewFormProp,
  hideNewTopicButton,
  reversed,
  expandResolved,
  startCollapsed,
  markReadWhenHighlighted
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const pickedThreadId = Array.isArray(highlightedThreadId) ? null : highlightedThreadId;
  const {
    activeThreads,
    resolvedThreads
  } = useThreadsByResolution({
    subjectType,
    subjectId,
    subjectRange,
    filter,
    resolution,
    pickedThreadId
  });
  const isHighlighted = thread => Array.isArray(highlightedThreadId) ? highlightedThreadId.includes(thread.id) : thread.id === highlightedThreadId;
  const noThreads = activeThreads.length === 0 && resolvedThreads.length === 0;
  const [draft] = useCommentDraft({
    subjectType,
    subjectId
  });
  const [expandedThreadId, setExpandedThreadId] = useState(() => {
    var _ref;
    return startCollapsed ? undefined : (_ref = soleThread(activeThreads) || soleThread(resolvedThreads)) === null || _ref === void 0 ? void 0 : _ref.id;
  });
  const [resolvedToggled, setResolvedToggled] = useState(null);
  const revealsResolved = !!expandResolved || resolution === 'all' || resolvedThreads.some(thread => thread.id === pickedThreadId);
  const [formToggled, setFormToggled] = useState(showNewFormProp !== undefined ? showNewFormProp : revealsResolved ? noThreads : activeThreads.length === 0);
  const showResolved = resolvedToggled !== null ? resolvedToggled : revealsResolved;
  const showNewForm = showNewFormProp !== false && (!!draft || formToggled);
  function toggleThread(threadId) {
    setExpandedThreadId(expandedThreadId === threadId ? null : threadId);
  }
  return /*#__PURE__*/React.createElement(CommentThreadReadsSnapshot, {
    resetOn: expandedThreadId
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$7.container
  }, !showNewForm && !hideNewTopicButton && /*#__PURE__*/React.createElement("button", {
    className: classNames(styles$7.newTopicButton, {
      [styles$7.reversed]: reversed
    }),
    onClick: () => setFormToggled(true),
    "aria-label": t('pageflow_scrolled.review.new_topic')
  }, /*#__PURE__*/React.createElement(NewTopicIcon, null), t('pageflow_scrolled.review.new_topic')), showNewForm && /*#__PURE__*/React.createElement(NewThreadForm, {
    subjectType: subjectType,
    subjectId: subjectId,
    subjectRange: subjectRange,
    onSubmit: () => setFormToggled(false)
  }), noThreads && !showNewForm && /*#__PURE__*/React.createElement("p", {
    className: styles$7.blankSlate
  }, t('pageflow_scrolled.review.no_threads_yet')), activeThreads.map(thread => /*#__PURE__*/React.createElement(Thread, {
    key: thread.id,
    thread: thread,
    collapsed: expandedThreadId !== thread.id,
    showUnreadMarker: activeThreads.length > 1,
    onToggle: () => toggleThread(thread.id),
    onReply: () => setExpandedThreadId(thread.id),
    markReadWhenHighlighted: markReadWhenHighlighted,
    onResolve: () => postUpdateThreadMessage({
      threadId: thread.id,
      resolved: true
    }),
    onClick: onThreadClick && (() => onThreadClick(thread)),
    highlighted: isHighlighted(thread),
    interactive: !restrictInteractionsToHighlighted || isHighlighted(thread)
  })), resolvedThreads.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: styles$7.resolvedSection
  }, /*#__PURE__*/React.createElement("button", {
    className: styles$7.resolvedPill,
    onClick: () => setResolvedToggled(!showResolved)
  }, t('pageflow_scrolled.review.resolved_count', {
    count: resolvedThreads.length
  }), /*#__PURE__*/React.createElement(ChevronIcon, {
    className: classNames(styles$7.chevron, {
      [styles$7.chevronExpanded]: showResolved
    })
  })), showResolved && resolvedThreads.map(thread => /*#__PURE__*/React.createElement(Thread, {
    key: thread.id,
    thread: thread,
    collapsed: expandedThreadId !== thread.id,
    showUnreadMarker: resolvedThreads.length > 1,
    onToggle: () => toggleThread(thread.id),
    onReply: () => setExpandedThreadId(thread.id),
    markReadWhenHighlighted: markReadWhenHighlighted,
    onResolve: () => postUpdateThreadMessage({
      threadId: thread.id,
      resolved: false
    }),
    onClick: onThreadClick && (() => onThreadClick(thread)),
    highlighted: isHighlighted(thread),
    interactive: !restrictInteractionsToHighlighted || isHighlighted(thread)
  })))));
}
function useThreadsByResolution({
  subjectType,
  subjectId,
  subjectRange,
  filter,
  resolution,
  pickedThreadId
}) {
  const allActiveThreads = useLocatedCommentThreadsForSubject({
    subjectType,
    subjectId,
    subjectRange,
    resolution: 'unresolved'
  });
  const allResolvedThreads = useLocatedCommentThreadsForSubject({
    subjectType,
    subjectId,
    subjectRange,
    resolution: 'resolved'
  });
  const activeThreads = useMemo(() => filter ? allActiveThreads.filter(filter) : allActiveThreads, [allActiveThreads, filter]);
  const resolvedThreads = useMemo(() => {
    const threads = filter ? allResolvedThreads.filter(filter) : allResolvedThreads;
    return resolution === 'unresolved' ? threads.filter(thread => thread.id === pickedThreadId) : threads;
  }, [allResolvedThreads, filter, resolution, pickedThreadId]);
  return {
    activeThreads,
    resolvedThreads
  };
}
function soleThread(threads) {
  return threads.length === 1 ? threads[0] : undefined;
}

function useActivityEntries() {
  const {
    threads
  } = useLocatedCommentThreads();
  const currentUser = useCurrentUser();
  const commentThreadReads = useDisplayedCommentThreadReads();
  const entries = useMemo(() => activityEntries({
    threads,
    currentUser,
    commentThreadReads
  }), [threads, currentUser, commentThreadReads]);
  return useHeldOrder(entries);
}
function useHeldOrder(entries) {
  const takenAt = useRef(new Map());
  return useMemo(() => {
    entries.forEach(entry => {
      if (!takenAt.current.has(entry.threadId)) {
        takenAt.current.set(entry.threadId, entry.at);
      }
    });
    return entries.map(entry => ({
      ...entry,
      at: takenAt.current.get(entry.threadId)
    })).sort(compareEntries);
  }, [entries]);
}
function useUnreadThreadCount() {
  const {
    threads
  } = useLocatedCommentThreads();
  const currentUser = useCurrentUser();
  const commentThreadReads = useCommentThreadReads();
  return useMemo(() => activityEntries({
    threads,
    currentUser,
    commentThreadReads
  }).filter(entry => entry.unreadCount > 0).length, [threads, currentUser, commentThreadReads]);
}
function activityEntries({
  threads,
  currentUser,
  commentThreadReads
}) {
  return threads.map(thread => threadEntry(thread, {
    currentUser,
    readAt: commentThreadReads[thread.permaId]
  })).filter(Boolean).sort(compareEntries);
}
function threadEntry(thread, {
  currentUser,
  readAt
}) {
  const events = threadActivity(thread);
  if (!events.length) return null;
  const latest = events.reduce((result, event) => new Date(event.at) >= new Date(result.at) ? event : result);
  const unreadEvents = events.filter(event => isUnread(event, {
    currentUser,
    readAt
  }));
  return {
    key: `thread-${thread.id}`,
    thread,
    threadId: thread.id,
    threadPermaId: thread.permaId,
    at: latest.at,
    unreadCount: unreadEvents.length,
    unreadCommentIds: unreadEvents.filter(event => event.id).map(event => event.id),
    resolved: !!thread.resolvedAt
  };
}
function compareEntries(a, b) {
  return new Date(b.at) - new Date(a.at) || a.threadId - b.threadId;
}

var styles$8 = {"list":"ActivityList-module_list__C2frv","showMore":"ActivityList-module_showMore__2KhKz","blankSlate":"ActivityList-module_blankSlate__TIhSd","entry":"ActivityList-module_entry__7ZmzZ","summary":"ActivityList-module_summary__3EBBY","dayHeading":"ActivityList-module_dayHeading__ItHH0"};

function ActivityList({
  onEntryClick,
  highlightedThreadId,
  pageSize = 30
}) {
  return /*#__PURE__*/React.createElement(CommentThreadReadsSnapshot, null, /*#__PURE__*/React.createElement(Entries, {
    onEntryClick: onEntryClick,
    highlightedThreadId: highlightedThreadId,
    pageSize: pageSize
  }));
}

// The entries have to be read inside the snapshot for the freeze to apply.
function Entries({
  onEntryClick,
  highlightedThreadId,
  pageSize
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const entries = useActivityEntries();
  const [pages, setPages] = useState(1);
  if (!entries.length) {
    return /*#__PURE__*/React.createElement("p", {
      className: styles$8.blankSlate
    }, t('pageflow_scrolled.review.activity.no_activity_yet'));
  }
  const shown = entries.slice(0, pages * pageSize);
  return /*#__PURE__*/React.createElement("div", {
    className: styles$8.list
  }, dayGroups(shown).map(group => /*#__PURE__*/React.createElement(React.Fragment, {
    key: group.day
  }, /*#__PURE__*/React.createElement(DayHeading, {
    day: group.day,
    at: group.at
  }), group.entries.map(entry => /*#__PURE__*/React.createElement(Entry, {
    key: entry.key,
    entry: entry,
    day: group.day,
    highlighted: entry.threadId === highlightedThreadId,
    onClick: onEntryClick && (() => onEntryClick(entry))
  })))), shown.length < entries.length && /*#__PURE__*/React.createElement("button", {
    className: styles$8.showMore,
    onClick: () => setPages(pages + 1)
  }, t('pageflow_scrolled.review.activity.show_more')));
}
function Entry({
  entry,
  day,
  highlighted,
  onClick
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const [expanded, setExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: styles$8.entry
  }, /*#__PURE__*/React.createElement("p", {
    className: styles$8.summary
  }, summary(t, entry, day)), /*#__PURE__*/React.createElement(Thread, {
    thread: entry.thread,
    visibleReplyCount: expanded ? undefined : visibleReplyCount(entry, day),
    onExpandReplies: () => setExpanded(true),
    collapsed: collapsed,
    onToggle: () => setCollapsed(!collapsed),
    showUnreadMarker: true,
    markReadWhenHighlighted: true,
    onClick: onClick,
    highlighted: highlighted,
    onResolve: () => postUpdateThreadMessage({
      threadId: entry.threadId,
      resolved: !entry.resolved
    })
  }));
}
function summary(t, {
  thread
}, day) {
  const replies = thread.comments.slice(1);
  const parts = [onDay(thread.comments[0], day) && t('pageflow_scrolled.review.activity.summary.topic'), replyCountPart(t, replies.filter(reply => onDay(reply, day)).length), thread.resolvedAt && dayOf(thread.resolvedAt) === day && t('pageflow_scrolled.review.activity.summary.resolution')].filter(Boolean);
  return joinParts(t, parts);
}
function replyCountPart(t, count) {
  return count > 0 && t('pageflow_scrolled.review.activity.summary.reply_count', {
    count
  });
}
function onDay(comment, day) {
  return dayOf(comment.createdAt) === day;
}
function joinParts(t, parts) {
  if (parts.length < 2) {
    return parts[0];
  }
  return [parts.slice(0, -1).join(', '), parts[parts.length - 1]].join(t('pageflow_scrolled.review.activity.summary.and'));
}
function visibleReplyCount({
  thread,
  unreadCommentIds
}, day) {
  const replies = thread.comments.slice(1);
  const starts = [replies.findIndex(reply => unreadCommentIds.includes(reply.id)), replies.findIndex(reply => dayOf(reply.createdAt) === day)].filter(index => index >= 0);
  return starts.length ? replies.length - Math.min(...starts) : Math.min(replies.length, 1);
}
function DayHeading({
  day,
  at
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const locale = useLocale({
    locale: 'ui'
  });
  return /*#__PURE__*/React.createElement("h3", {
    className: styles$8.dayHeading
  }, /*#__PURE__*/React.createElement("time", {
    dateTime: day
  }, dayLabel(t, {
    day,
    at
  }, locale)));
}
function dayGroups(entries) {
  const groups = [];
  entries.forEach(entry => {
    const day = dayOf(entry.at);
    const current = groups[groups.length - 1];
    if (current && current.day === day) {
      current.entries.push(entry);
    } else {
      groups.push({
        day,
        at: entry.at,
        entries: [entry]
      });
    }
  });
  return groups;
}
function dayOf(at) {
  const date = new Date(at);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// Formatted from a timestamp within the day: a bare date parses as UTC
// midnight, which reads as the day before west of it.
function dayLabel(t, {
  day,
  at
}, locale) {
  const days = daysSince(day);
  if (days === 0) {
    return t('pageflow_scrolled.review.activity.today');
  }
  if (days === 1) {
    return t('pageflow_scrolled.review.activity.yesterday');
  }
  return formatDate(at, locale);
}
function daysSince(day) {
  const [year, month, date] = day.split('-').map(Number);
  const then = new Date(year, month - 1, date);
  const now = new Date();
  return Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - then) / 86400000);
}

const emptyDecorations = [];
function useCommentHighlights(threads, subjectRange) {
  return useMemo(() => buildHighlights(threads, subjectRange), [threads, subjectRange]);
}
function decorateCommentHighlights(editor, highlights) {
  return function decorate([node, path]) {
    if (!Text.isText(node)) return emptyDecorations;
    const nodeRange = {
      anchor: {
        path,
        offset: 0
      },
      focus: {
        path,
        offset: node.text.length
      }
    };
    const decorations = [];
    for (const highlight of highlights) {
      if (!isValidRange(editor, highlight.range)) continue;
      const intersection = Range.intersection(highlight.range, nodeRange);
      if (intersection) {
        var _highlight$thread;
        const isFirst = Point.equals(Range.start(intersection), Range.start(highlight.range));
        const isLast = Point.equals(Range.end(intersection), Range.end(highlight.range));
        decorations.push({
          ...intersection,
          commentHighlight: true,
          subjectRange: highlight.range,
          rangeKey: highlight.key,
          resolved: !!((_highlight$thread = highlight.thread) === null || _highlight$thread === void 0 ? void 0 : _highlight$thread.resolvedAt),
          ...(isFirst && {
            firstInRange: true
          }),
          ...(isLast && {
            lastInRange: true
          })
        });
      }
    }
    return decorations;
  };
}
function buildHighlights(threads, subjectRange) {
  const highlights = threads.map(t => ({
    key: String(t.id),
    range: t.subjectRange,
    thread: t
  }));
  if (subjectRange && !threads.some(t => t.subjectRange === subjectRange)) {
    highlights.push({
      key: 'selection',
      range: subjectRange
    });
  }
  return highlights;
}
function isValidRange(editor, range) {
  return range && Node$1.has(editor, range.anchor.path) && Node$1.has(editor, range.focus.path);
}

var commentHighlights_module = {"highlight":"commentHighlights-module_highlight__2X0JV","selected":"commentHighlights-module_selected__2AM1C","resolved":"commentHighlights-module_resolved__2Eu8w"};

function useRangeAnchors() {
  const containerRef = useRef(null);
  const elements = useRef(new Map());
  const [version, setVersion] = useState(0);

  // Slate splits a decorated range wherever another decoration overlaps
  // it, so several elements can carry the same range key.
  const registerAnchor = useCallback((rangeKey, el, mounted = true) => {
    if (!el) return;
    const registered = elements.current.get(rangeKey) || [];
    const remaining = mounted ? [...registered, el] : registered.filter(other => other !== el);
    if (remaining.length) {
      elements.current.set(rangeKey, remaining);
    } else {
      elements.current.delete(rangeKey);
    }
    setVersion(v => v + 1);
  }, []);
  const anchors = useMemo(() => ({
    containerRef,
    _elements: elements,
    _version: version
  }), [version]);
  return {
    anchors,
    registerAnchor
  };
}
function RangeAnchor({
  rangeKey,
  onRegister,
  children
}) {
  const ref = useRef(null);
  useEffect(() => {
    // The cleanup runs once React has detached the ref.
    const el = ref.current;
    onRegister(rangeKey, el);
    return () => onRegister(rangeKey, el, false);
  }, [rangeKey, onRegister]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref
  }, children);
}
function useAnchoredFloating(rangeKey, anchors, {
  placement = 'right-start',
  flipOnOverflow = false,
  mainAxisOffset = 32,
  fitWidth
} = {}) {
  var _middlewareData$align;
  const hasAnchor = anchors._elements.current.has(rangeKey);
  const {
    refs,
    floatingStyles,
    placement: resolvedPlacement,
    isPositioned,
    middlewareData
  } = useFloating({
    placement,
    middleware: [alignToContainerEdge(anchors.containerRef, {
      mainAxisOffset,
      fitWidth
    }), ...(flipOnOverflow ? [flip({
      crossAxis: false,
      padding: 8
    })] : []), clampXToViewport({
      viewportPadding: 0
    })],
    whileElementsMounted: (reference, floating, update) => autoUpdate(reference, floating, update, {
      elementResize: false
    })
  });
  useEffect(() => {
    const registered = anchors._elements.current.get(rangeKey);
    if (registered) {
      refs.setReference(firstInDocument(registered));
    }
  }, [refs, anchors, rangeKey, anchors._version]);
  const fits = (_middlewareData$align = middlewareData.alignToContainerEdge) === null || _middlewareData$align === void 0 ? void 0 : _middlewareData$align.fits;
  return {
    refs,
    floatingStyles,
    placement: resolvedPlacement,
    isPositioned,
    hasAnchor,
    fits
  };
}
function firstInDocument(elements) {
  return elements.reduce((first, el) => first.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING ? el : first);
}
function alignToContainerEdge(containerRef, {
  mainAxisOffset = 0,
  viewportPadding = 0,
  fitWidth
} = {}) {
  return {
    name: 'alignToContainerEdge',
    fn(state) {
      const containerEl = containerRef.current;
      if (!containerEl) return {};
      const {
        rects,
        placement
      } = state;
      const containerRect = containerEl.getBoundingClientRect();
      const toLocalX = viewportToLocalX(state);
      let x;
      if (placement.startsWith('right')) {
        x = toLocalX(containerRect.right + mainAxisOffset);
      } else if (placement.startsWith('left')) {
        x = toLocalX(containerRect.left - mainAxisOffset) - rects.floating.width;
      } else {
        return {};
      }
      const data = {};
      if (fitWidth !== undefined) {
        const viewportWidth = document.documentElement.clientWidth;
        const fitsRight = containerRect.right + mainAxisOffset + fitWidth + viewportPadding <= viewportWidth;
        const fitsLeft = containerRect.left - mainAxisOffset - fitWidth - viewportPadding >= 0;
        data.fits = fitsRight || fitsLeft;
      }
      return {
        x,
        data
      };
    }
  };
}
function clampXToViewport({
  viewportPadding = 8
} = {}) {
  return {
    name: 'clampXToViewport',
    fn(state) {
      const {
        x,
        rects
      } = state;
      const toLocalX = viewportToLocalX(state);
      const viewportWidth = document.documentElement.clientWidth;
      const minX = toLocalX(viewportPadding);
      const maxX = toLocalX(viewportWidth - viewportPadding) - rects.floating.width;
      return {
        x: Math.max(minX, Math.min(x, maxX))
      };
    }
  };
}

// Floating UI applies `x`/`y` in the offsetParent's unscaled space, which
// getBoundingClientRect's viewport coordinates only match while the
// offsetParent is unscaled.
function viewportToLocalX({
  rects,
  elements
}) {
  const referenceRect = elements.reference.getBoundingClientRect();
  const scale = rects.reference.width ? referenceRect.width / rects.reference.width : 1;
  return viewportX => rects.reference.x + (viewportX - referenceRect.left) / scale;
}

export { ActivityList, Badge, CommentDisplayFilterProvider, CommentThreadReadsSnapshot, LocatedCommentThreadsProvider, NewThreadForm, RangeAnchor, ReviewMessageHandler, ReviewStateProvider, ScrollHighlightedThreadIntoViewProvider, Thread, ThreadList, ThreadsBadge, activityEntries, alignToContainerEdge, commentHighlights_module as commentHighlightStyles, decorateCommentHighlights, matchesResolution, postCreateCommentThreadMessage, postUpdateThreadMessage, review, useActivityEntries, useAnchoredFloating, useCommentDisplayFilter, useCommentHighlights, useCommentThread, useCommentThreads, useLocatedCommentThreads, useLocatedCommentThreadsForSubject, useRangeAnchors, useStoredCommentDisplayFilter, useUnreadActivityCount, useUnreadThreadCount, watchUnreadComments };
