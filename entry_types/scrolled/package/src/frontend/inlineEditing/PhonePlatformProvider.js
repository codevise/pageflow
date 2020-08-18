import React, {useEffect, useState} from 'react';

import PhonePlatformContext from '../PhonePlatformContext';

export function PhonePlatformProvider({children}) {

  const [phoneEmulationMode, setPhoneEmulationMode] = useState(false);

  useEffect(() => {
    window.addEventListener('message', receive);

    function receive(event) {
      if (event.data.type === 'CHANGE_EMULATION_MODE') {
        if(event.data['payload'] === 'phone') {
          setPhoneEmulationMode(true);
        }
        else {
          setPhoneEmulationMode(false);
        }
      }
    }
    return () => window.removeEventListener('message', receive);
  });

  return (
    <PhonePlatformContext.Provider value={phoneEmulationMode} >
      {children}
    </PhonePlatformContext.Provider>
  );
}