pageflow.encodedFile = {
  stageMapping: function() {
    var mapping = {
      uploading: {
        activeStates: ['uploading'],
        finishedStates: ['not_uploaded_to_s3', 'upload_to_s3', 'uploading_to_s3', 'upload_to_s3_failed', 'waiting_for_meta_data', 'fetching_meta_data', 'fetching_meta_data_failed', 'waiting_for_confirmation', 'waiting_for_encoding', 'encoding', 'encoded', 'encoding_failed'],
        failedStates: ['upload_failed']
      },
      uploading_to_s3: {
        activeStates: ['uploading_to_s3'],
        finishedStates: ['waiting_for_meta_data', 'fetching_meta_data', 'fetching_meta_data_failed', 'waiting_for_confirmation', 'waiting_for_encoding', 'encoding', 'encoded', 'encoding_failed'],
        failedStates: ['upload_to_s3_failed']},
      fetching_meta_data: {
        activeStates: ['waiting_for_meta_data', 'fetching_meta_data'],
        finishedStates: ['waiting_for_confirmation', 'waiting_for_encoding', 'encoding', 'encoded', 'encoding_failed'],
        failedStates: ['fetching_meta_data_failed']},
      encoding: {
        actionRequiredStates: ['waiting_for_confirmation'],
        activeStates: ['waiting_for_encoding', 'encoding'],
        finishedStates: ['encoded'],
        failedStates: ['fetching_meta_data_failed', 'encoding_failed']
      }
    };

    if (!pageflow.config.confirmEncodingJobs) {
      delete mapping.fetching_meta_data;
    }

    return mapping;
  },

  isReady: function() {
    return this.get('state') === 'encoded';
  },

  isConfirmable: function() {
    return this.get('state') === 'waiting_for_confirmation';
  },

  isFailed: function() {
    return this.get('state').match(/_failed$/);
  },

  isPending: function() {
    return !this.isUploading() && !this.isReady() && !this.isFailed();
  },

  isRetryable: function() {
    return ['upload_to_s3_failed', 'encoding_failed'].indexOf(this.get('state')) >= 0;
  },
};