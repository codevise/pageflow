import React, {createContext, useContext, useMemo, useState} from 'react';

const StorylineActivityContext = createContext('active');

const MainStorylineCoverageContext = createContext({
  mainStorylineCovered: false,
  setMainStorylineCovered: () => {}
});

export function MainStorylineActivity({activeExcursion, children}) {
  const {mainStorylineCovered} = useContext(MainStorylineCoverageContext);

  const mode = activeExcursion
    ? (mainStorylineCovered ? 'covered' : 'background')
    : 'active';

  return (
    <StorylineActivityContext.Provider value={mode}>
      {children}
    </StorylineActivityContext.Provider>
  );
}

export function MainStorylineCoverageProvider({children}) {
  const [mainStorylineCovered, setMainStorylineCovered] = useState(false);
  const value = useMemo(() => ({mainStorylineCovered, setMainStorylineCovered}), [mainStorylineCovered]);

  return (
    <MainStorylineCoverageContext.Provider value={value}>
      {children}
    </MainStorylineCoverageContext.Provider>
  );
}

export function useStorylineActivity() {
  return useContext(StorylineActivityContext);
}

export function useMainStorylineCoverage() {
  return useContext(MainStorylineCoverageContext);
}
