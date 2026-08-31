import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';

import {useCommentDisplayFilter, useLocatedCommentThreads} from 'pageflow-scrolled/review';
import {useActiveExcursion} from '../useActiveExcursion';

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

  const selectTarget = useCallback((target, options) => {
    if (movesToDifferentSubject(selectedSubject, target)) {
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
      highlightedThreadId: target.threadId,
      ...options
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

  const goToThread = useCallback((threadId, options) => {
    const target = allTargets.find(target => target.threadId === threadId);

    if (target) {
      selectTarget(target, options);
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
    highlightedThreadId: selectedSubject?.highlightedThreadId ?? null,
    goToNext: () => goTo(1),
    goToPrevious: () => goTo(-1),
    goToThread
  }), [targets.length, position, selectedSubject, goTo, goToThread]);

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
          revealOnly: !!(isSelected && selectedSubject.revealOnly),
          showNewForm: isSelected && selectedSubject.showNewForm,
          subjectRange: isSelected ? selectedSubject.subjectRange : undefined,
          highlightedThreadId: isSelected ? selectedSubject.highlightedThreadId ?? null : null};
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
      const location = {sectionId: section.id, excursion: chapter.isExcursion};

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
