module Pageflow
  module ImageFileStateMachine
    extend ActiveSupport::Concern

    included do
      state_machine :initial => 'not_processed' do
        extend StateMachineJob::Macro

        state 'not_processed'
        state 'processing'
        state 'processed'

        state 'processing_to_s3_failed'

        event :process do
          transition 'not_processed' => 'processing'
          transition 'processing_failed' => 'processing'
        end

        job ProcessFileJob do
          on_enter 'processing'
          result :ok => 'processed'
          result :error => 'processing_failed'
        end
      end
    end

    def retry!
      process!
    end

    def publish!
      process!
    end

    def retryable?
      processing_failed?
    end

    def ready?
      processed?
    end
  end
end
