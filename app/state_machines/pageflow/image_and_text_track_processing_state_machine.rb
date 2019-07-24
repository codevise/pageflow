module Pageflow
  module ImageAndTextTrackProcessingStateMachine
    extend ActiveSupport::Concern

    included do
      processing_state_machine do
        extend StateMachineJob::Macro

        state 'processing'
        state 'processed'
        state 'processing_failed'

        event :process do
          transition 'uploaded' => 'processing'
          transition 'processing_failed' => 'processing'
        end

        job ProcessImageOrTextTrackJob do
          on_enter 'processing'
          result :ok => 'processed'
          result :error => 'processing_failed'
        end
      end
    end

    # UploadableFile-overrides
    def retry!
      process!
    end

    def retryable?
      processing_failed?
    end

    def ready?
      processed?
    end

    def failed?
      super || processing_failed?
    end
  end
end
