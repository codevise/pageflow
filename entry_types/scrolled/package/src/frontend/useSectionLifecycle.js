import {createContext} from 'react';

import {
  createScrollPositionLifecycleProvider,
  createScrollPositionLifecycleHook
} from './useScrollPositionLifecycle';

export const SectionLifecycleContext = createContext();

export const SectionLifecycleProvider = createScrollPositionLifecycleProvider(
  SectionLifecycleContext
);

export const useSectionLifecycle = createScrollPositionLifecycleHook(
  SectionLifecycleContext
);
