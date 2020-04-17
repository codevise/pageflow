import {modelLifecycleTrackingView} from './modelLifecycleTrackingView';

export const loadable = modelLifecycleTrackingView({
  classNames: {
    creating: 'creating',
    destroying: 'destroying'
  }
});
