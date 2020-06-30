import React, {createContext, useContext} from 'react';

const DarkBackgroundContext = createContext(true);

export function BackgroundColorProvider({dark, invert, children}) {
  const previousValue = useDarkBackground();

  return (
    <DarkBackgroundContext.Provider value={getValue({dark, invert, previousValue})}>
      {children}
    </DarkBackgroundContext.Provider>
  );
}

function getValue({dark, invert, previousValue}) {
  if (dark !== undefined) {
    return dark;
  }
  else if (invert === true) {
    return !previousValue;
  }
  else {
    return previousValue;
  }
}


/**
 * Use to invert elements depending on whether they are rendered on a
 * dark or light background to ensure correct display in inverted
 * sections or in sections with card appearance.
 *
 * @return {boolean}
 */
export function useDarkBackground() {
  return useContext(DarkBackgroundContext);
}
