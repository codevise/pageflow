import {modelLifecycleTrackingView} from './modelLifecycleTrackingView';

export const failureIndicatingView = modelLifecycleTrackingView({
  classNames: {
    failed: 'failed',
    failureMessage: 'failure .message',
    retryButton: 'retry'
  }
});
