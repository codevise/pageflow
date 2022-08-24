import React, {useContext, useMemo} from 'react';

import styles from './Fullscreen.module.css';

export const DimensionContext = React.createContext({});

export function useFullscreenDimensions() {
  return useContext(DimensionContext);
}

export function FullscreenDimensionProvider({width, height, children}) {
  const value = useMemo(() => ({width, height}),
                        [width, height])

  return (
    <DimensionContext.Provider value={value}>
      {children}
    </DimensionContext.Provider>
  );
}

export default React.forwardRef(function Fullscreen(props, ref) {
  const {height} = useFullscreenDimensions();

  return (
    <div ref={ref} className={styles.root} style={{height}}>
      {props.children}
    </div>
  )
})
