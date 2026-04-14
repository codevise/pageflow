import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';

const SelectedSubjectContext = createContext({
  selectedSubject: null,
  setSelectedSubject: () => {},
  clearSelection: () => {}
});

export function SelectedSubjectProvider({children}) {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const clearSelection = useCallback(() => {
    setSelectedSubject(null);
  }, []);

  const value = useMemo(() => ({
    selectedSubject,
    setSelectedSubject,
    clearSelection
  }), [selectedSubject, clearSelection]);

  return (
    <SelectedSubjectContext.Provider value={value}>
      {children}
    </SelectedSubjectContext.Provider>
  );
}

export function useSelectedSubject(subjectType, subjectId) {
  const {selectedSubject, setSelectedSubject, clearSelection} = useContext(SelectedSubjectContext);

  const isSelected = selectedSubject &&
                     selectedSubject.subjectType === subjectType &&
                     selectedSubject.subjectId === subjectId;

  const select = useCallback((options) => {
    setSelectedSubject({subjectType, subjectId, ...options});
  }, [setSelectedSubject, subjectType, subjectId]);

  return {isSelected, hasSelection: !!selectedSubject, select, clearSelection,
          showNewForm: isSelected && selectedSubject.showNewForm,
          subjectRange: isSelected ? selectedSubject.subjectRange : undefined};
}
