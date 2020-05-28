import React, {useMemo} from 'react';
import BackboneEvents from 'backbone-events-standalone';

import {ContentElementEditorCommandEmitterContext} from '../useContentElementEditorCommandSubscription';

export function useContentElementEditorCommandEmitter() {
  return useMemo(() => Object.assign({}, BackboneEvents), [])
}

export function ContentElementEditorCommandSubscriptionProvider({emitter, children}) {
  return (
    <ContentElementEditorCommandEmitterContext.Provider value={emitter}>
      {children}
    </ContentElementEditorCommandEmitterContext.Provider>
  );
}
