import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';

import {useLocatedCommentThreads} from 'pageflow-scrolled/review';
import {useActiveExcursion} from '../useActiveExcursion';
import {useCommentDisplayFilter} from './CommentDisplayFilterProvider';

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

export function SelectedSubjectProvider({children}) {
  const {resolution} = useCommentDisplayFilter();
  const {chapters} = useLocatedCommentThreads();
  const {activateExcursionOfSection, returnFromExcursion} = useActiveExcursion();

  const [selectedSubject, setSelectedSubject] = useState(null);

  const allTargets = useMemo(() => navigableTargets(chapters), [chapters]);

  const targets = useMemo(
    () => allTargets.filter(target => matchesResolution(target, resolution)),
    [allTargets, resolution]
  );

  const clearSelection = useCallback(() => {
    setSelectedSubject(null);
  }, []);

  const selectTarget = useCallback(target => {
    // Activate the excursion the target lives in (or leave the current
    // one) before selecting it, so its popover can mount and open. Only
    // needed when moving to a different subject.
    if (!selectedSubject || subjectKey(selectedSubject) !== target.key) {
      if (target.excursion) {
        activateExcursionOfSection({id: target.sectionId});
      }
      else {
        returnFromExcursion();
      }
    }

    setSelectedSubject({
      subjectType: target.subjectType,
      subjectId: target.subjectId,
      subjectRange: target.subjectRange,
      highlightedThreadId: target.threadId
    });
  }, [selectedSubject, activateExcursionOfSection, returnFromExcursion]);

  const goTo = useCallback(step => {
    if (targets.length === 0) {
      return;
    }

    const current = currentTargetIndex(targets, selectedSubject);
    const next = current < 0
      ? (step > 0 ? 0 : targets.length - 1)
      : (current + step + targets.length) % targets.length;

    selectTarget(targets[next]);
  }, [targets, selectedSubject, selectTarget]);

  // Searched among all targets rather than the filtered ones, so that a
  // resolved thread stays reachable from lists that show it whatever the
  // toolbar filters. Showing it is left to the selection: turning all
  // resolved threads on for the sake of one changes the whole preview.
  const goToThread = useCallback(threadId => {
    const target = allTargets.find(target => target.threadId === threadId);

    if (target) {
      selectTarget(target);
    }
  }, [allTargets, selectTarget]);

  const position = useMemo(
    () => currentTargetIndex(targets, selectedSubject) + 1,
    [targets, selectedSubject]
  );

  const selection = useMemo(() => ({
    selectedSubject,
    setSelectedSubject,
    clearSelection
  }), [selectedSubject, clearSelection]);

  const navigation = useMemo(() => ({
    count: targets.length,
    position,
    goToNext: () => goTo(1),
    goToPrevious: () => goTo(-1),
    goToThread
  }), [targets.length, position, goTo, goToThread]);

  return (
    <SelectedSubjectContext.Provider value={selection}>
      <CommentNavigationContext.Provider value={navigation}>
        {children}
      </CommentNavigationContext.Provider>
    </SelectedSubjectContext.Provider>
  );
}

export function useCommentNavigation() {
  return useContext(CommentNavigationContext);
}

export function useSelectedSubject(subjectType, subjectId, subjectRange) {
  const {selectedSubject, setSelectedSubject, clearSelection} = useContext(SelectedSubjectContext);

  const isSelected = selectedSubject &&
                     selectedSubject.subjectType === subjectType &&
                     selectedSubject.subjectId === subjectId &&
                     (!subjectRange || JSON.stringify(selectedSubject.subjectRange) === JSON.stringify(subjectRange));

  const select = useCallback((options) => {
    setSelectedSubject({subjectType, subjectId, subjectRange, ...options});
  }, [setSelectedSubject, subjectType, subjectId, subjectRange]);

  return {isSelected, hasSelection: !!selectedSubject, select, clearSelection,
          showNewForm: isSelected && selectedSubject.showNewForm,
          subjectRange: isSelected ? selectedSubject.subjectRange : undefined,
          highlightedThreadId: isSelected ? selectedSubject.highlightedThreadId ?? null : null};
}

// The cursor the arrows step from: the highlighted thread when one is
// set by navigation, otherwise the selected subject's first thread (so
// arrows continue from a clicked badge), otherwise nothing.
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
      const location = {sectionId: section.id, excursion: chapter.isExcursion};

      // A section's list also holds the orphaned threads of its deleted
      // content elements; all of them navigate to the section, since an
      // orphan's own subject no longer exists in the preview.
      section.threads.forEach(thread => targets.push({
        key: subjectKey({subjectType: 'Section', subjectId: section.permaId}),
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
  return resolution === 'all' ||
         (resolution === 'unresolved' && !target.resolved) ||
         (resolution === 'resolved' && target.resolved);
}

function subjectKey({subjectType, subjectId, subjectRange}) {
  return `${subjectType}:${subjectId}:${subjectRange ? JSON.stringify(subjectRange) : ''}`;
}
