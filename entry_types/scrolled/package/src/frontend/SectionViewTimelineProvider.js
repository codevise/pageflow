import React, {useContext, useEffect, useState, useRef} from 'react';

import {prefersReducedMotion} from './prefersReducedMotion';

const SectionViewTimelineContext = React.createContext();

export function SectionViewTimelineProvider({backdrop, children}) {
  const [timeline, setTimeline] = useState();
  const ref = useRef();

  const isNeeded = backdrop?.effects?.some(effect => effect.name === 'scrollParallax');

  useEffect(() => {
    if (!isNeeded || !window.ViewTimeline || prefersReducedMotion()) {
      return;
    }

    setTimeline(new window.ViewTimeline({
      subject: ref.current
    }));

    return () => setTimeline(null);
  }, [isNeeded]);

  return (
    <div ref={ref}>
      <SectionViewTimelineContext.Provider value={timeline}>
        {children}
      </SectionViewTimelineContext.Provider>
    </div>
  )
}

export function useSectionViewTimeline() {
  return useContext(SectionViewTimelineContext);
}
