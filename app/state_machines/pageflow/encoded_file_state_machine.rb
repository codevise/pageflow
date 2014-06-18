module Pageflow
  module EncodedFileStateMachine
    extend ActiveSupport::Concern

    included do
      state_machine :initial => 'not_uploaded_to_s3' do
        extend StateMachineJob::Macro

        state 'not_uploaded_to_s3'
        state 'uploading_to_s3'
        state 'waiting_for_confirmation'
        state 'waiting_for_encoding'
        state 'encoding'
        state 'encoded'

        state 'upload_to_s3_failed'
        state 'encoding_failed'

        event :publish do
          transition 'not_uploaded_to_s3' => 'uploading_to_s3'
        end

        event :retry do
          transition 'upload_to_s3_failed' => 'uploading_to_s3'
          transition 'encoding_failed' => 'waiting_for_encoding'
          transition 'encoded' => 'waiting_for_encoding'
        end

        job UploadFileToS3Job do
          on_enter 'uploading_to_s3'
          result :pending, :retry_after => 30.seconds

          result :ok, :state => 'waiting_for_confirmation', :if => lambda { Pageflow.config.confirm_encoding_jobs }
          result :ok, :state => 'waiting_for_encoding'

          result :error => 'uploading_to_s3_failed'
        end

        event :confirm_encoding do
          transition 'waiting_for_confirmation' => 'waiting_for_encoding'
        end

        job SubmitFileToZencoderJob do
          on_enter 'waiting_for_encoding'
          result :ok => 'encoding'
          result :error => 'encoding_failed'
        end

        job PollZencoderJob do
          on_enter 'encoding'
          result :pending, :retry_after => 2.seconds
          result :ok => 'encoded'
          result :error => 'encoding_failed'
        end
      end
    end
  end
end
