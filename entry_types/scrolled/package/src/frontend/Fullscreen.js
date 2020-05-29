import React, {useContext} from 'react';

import styles from './Fullscreen.module.css';

export const HeightContext = React.createContext();

export function FullscreenHeightProvider({height, children}) {
  return (
    <HeightContext.Provider value={height}>
      {children}
    </HeightContext.Provider>
  );
}

export default React.forwardRef(function Fullscreen(props, ref) {
  const height = useContext(HeightContext);

  return (
    <div ref={ref} className={styles.root} style={{height}}>
      {props.children}
    </div>
  )
})
