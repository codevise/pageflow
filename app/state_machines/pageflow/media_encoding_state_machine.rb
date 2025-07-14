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
                     if: ->(file) { Pageflow.config.confirm_encoding_jobs?(file) }
          transition 'encoded' => 'waiting_for_confirmation',
                     if: ->(file) { Pageflow.config.confirm_encoding_jobs?(file) }

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

          result(
            :ok,
            state: 'waiting_for_confirmation',
            if: ->(file) { Pageflow.config.confirm_encoding_jobs?(file) }
          )
          result ok: 'waiting_for_encoding'

          result error: 'fetching_meta_data_failed'
        end

        event :confirm_encoding do
          transition 'waiting_for_confirmation' => 'waiting_for_encoding'
        end

        after_transition 'waiting_for_confirmation' => 'waiting_for_encoding' do |file|
          Pageflow.config.hooks.invoke(:file_encoding_confirmed, file:)
        end

        after_transition any => 'waiting_for_encoding' do |file|
          Pageflow.config.hooks.invoke(:file_encoding, file:)
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
          Pageflow.config.hooks.invoke(:file_encoded, file:)
        end

        after_transition any => 'encoding_failed' do |file|
          Pageflow.config.hooks.invoke(:file_encoding_failed, file:)
        end
      end
    end

    # UploadableFile-overrides
    def retryable?
      # Calling `can_retry_encoding?` invokes
      # `Pageflow.config.confirm_encoding_jobs` which might depend on
      # accessing `file.entry.account`. If the file has been reused in
      # a different entry and the original entry has been deleted, we
      # default to making the file not retryable to prevent
      # exceptions.
      entry &&
        can_retry_encoding? &&
        !encoded?
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
