pageflow.encodedFile = {
  stages: function() {
    var stages = [];

    if (pageflow.config.confirmEncodingJobs) {
      stages.push({
        name: 'fetching_meta_data',
        activeStates: ['waiting_for_meta_data', 'fetching_meta_data'],
        failedStates: ['fetching_meta_data_failed']
      });
    }

    stages.push({
      name: 'encoding',
      actionRequiredStates: ['waiting_for_confirmation'],
      activeStates: ['waiting_for_encoding', 'encoding'],
      failedStates: ['fetching_meta_data_failed', 'encoding_failed']
    });

    return stages;
  },

  readyState: 'encoded',

  isConfirmable: function() {
    return this.get('state') === 'waiting_for_confirmation';
  },

  isRetryable: function() {
    return ['upload_to_s3_failed', 'encoding_failed'].indexOf(this.get('state')) >= 0;
  },
};