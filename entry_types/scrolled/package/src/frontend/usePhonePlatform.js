import React from 'react';
import PhonePlatformContext from './PhonePlatformContext';

export function usePhonePlatform() {
    return React.useContext(PhonePlatformContext);
}
