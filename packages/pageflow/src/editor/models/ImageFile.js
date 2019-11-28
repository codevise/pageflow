import {ReusableFile} from './ReusableFile';

export const ImageFile = ReusableFile.extend({
  stages: [
    {
      name: 'uploading',
      activeStates: ['uploading'],
      failedStates: ['uploading_failed']
    },
    {
      name: 'processing',
      activeStates: ['processing'],
      finishedStates: ['processed'],
      failedStates: ['processing_failed']
    }
  ],

  readyState: 'processed',

  getBackgroundPositioningImageUrl: function() {
    return this.get('url');
  },

  isPositionable: function() {
    return this.isReady();
  }
});