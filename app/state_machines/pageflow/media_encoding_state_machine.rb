module Pageflow
  module MediaEncodingStateMachine
    extend ActiveSupport::Concern

    included do
      processing_state_machine do
        state 'waiting_for_meta_data'
        state 'fetching_meta_data'
        state 'waiting_for_confirmation'
        state 'waiting_for_encoding'
        state 'encoding'
        state 'encoded'

        state 'fetching_meta_data_failed'
        state 'encoding_failed'

        event :process do
          transition any => 'waiting_for_meta_data',
                     if: -> { Pageflow.config.confirm_encoding_jobs }
          transition any => 'waiting_for_encoding'
        end

        event :retry_encoding do
          transition 'encoding_failed' => 'waiting_for_confirmation',
                     if: -> { Pageflow.config.confirm_encoding_jobs }
          transition 'encoded' => 'waiting_for_confirmation',
                     if: -> { Pageflow.config.confirm_encoding_jobs }

          transition 'encoding_failed' => 'waiting_for_encoding'
          transition 'encoded' => 'waiting_for_encoding'
        end

        job RequestMetaDataFromZencoderJob do
          on_enter 'waiting_for_meta_data'
          result ok: 'fetching_meta_data'
          result error: 'fetching_meta_data_failed'
        end

        job PollMetaDataFromZencoderJob do
          on_enter 'fetching_meta_data'
          result :pending, retry_after: 2.seconds
          result ok: 'waiting_for_confirmation'
          result error: 'fetching_meta_data_failed'
        end

        event :confirm_encoding do
          transition 'waiting_for_confirmation' => 'waiting_for_encoding'
        end

        after_transition 'waiting_for_confirmation' => 'waiting_for_encoding' do |file|
          Pageflow.config.hooks.invoke(:file_encoding_confirmed, file: file)
        end

        job SubmitFileToZencoderJob do
          on_enter 'waiting_for_encoding'
          result ok: 'encoding'
          result error: 'encoding_failed'
        end

        job PollZencoderJob do
          on_enter 'encoding'
          result :pending, retry_after: 2.seconds
          result ok: 'encoded'
          result error: 'encoding_failed'
        end

        after_transition any => 'encoded' do |file|
          Pageflow.config.hooks.invoke(:file_encoded, file: file)
        end

        after_transition any => 'encoding_failed' do |file|
          Pageflow.config.hooks.invoke(:file_encoding_failed, file: file)
        end
      end
    end

    # UploadableFile-overrides
    def retryable?
      can_retry_encoding? && !encoded?
    end

    def ready?
      encoded?
    end

    def failed?
      super ||
        fetching_meta_data_failed? ||
        encoding_failed?
    end

    def retry!
      retry_encoding!
    end
  end
end
