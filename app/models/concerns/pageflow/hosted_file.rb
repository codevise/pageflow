module Pageflow
  module HostedFile
    extend ActiveSupport::Concern
    include UploadedFile

    included do
      has_attached_file(:attachment_on_filesystem, Pageflow.config.paperclip_filesystem_default_options)
      has_attached_file(:attachment_on_s3, Pageflow.config.paperclip_s3_default_options)

      do_not_validate_attachment_file_type(:attachment_on_filesystem)
      do_not_validate_attachment_file_type(:attachment_on_s3)

      state_machine initial: 'not_uploaded_to_s3' do
        extend StateMachineJob::Macro

        state 'not_uploaded_to_s3'
        state 'uploading_to_s3'
        state 'uploaded_to_s3'
        state 'uploading_to_s3_failed'

        event :publish do
          transition 'not_uploaded_to_s3' => 'uploading_to_s3'
        end

        event :retry do
          transition 'uploading_to_s3_failed' => 'uploading_to_s3'
        end

        job UploadFileToS3Job do
          on_enter 'uploading_to_s3'
          result :pending, retry_after: 30.seconds
          result :ok, state: 'uploaded_to_s3'
          result :error, state: 'uploading_to_s3_failed'
        end

        event :process
      end
    end

    def attachment
      attachment_on_s3.present? ? attachment_on_s3 : attachment_on_filesystem
    end

    def attachment=(value)
      self.attachment_on_filesystem = value
    end

    def keep_on_filesystem_after_upload_to_s3?
      false
    end

    def retryable?
      can_retry?
    end

    def ready?
      attachment_on_s3.present?
    end

    def basename
      File.basename(attachment.original_filename, '.*')
    end

    def url
      if attachment_on_s3.present?
        attachment.url
      end
    end

    def original_url
      url
    end

    # @deprecated Write a migration instead
    def self.columns(t)
      t.belongs_to(:entry, index: true)
      t.belongs_to(:uploader, index: true)

      t.string(:state)
      t.string(:rights)

      t.string(:attachment_on_filesystem_file_name)
      t.string(:attachment_on_filesystem_content_type)
      t.integer(:attachment_on_filesystem_file_size, limit: 8)
      t.datetime(:attachment_on_filesystem_updated_at)

      t.string(:attachment_on_s3_file_name)
      t.string(:attachment_on_s3_content_type)
      t.integer(:attachment_on_s3_file_size, limit: 8)
      t.datetime(:attachment_on_s3_updated_at)

      t.timestamps
    end

    module ClassMethods
      def processing_state_machine(&block)
        state_machine do
          extend StateMachineJob::Macro

          after_transition(any => 'uploaded_to_s3') do |hosted_file|
            hosted_file.process!
          end

          instance_eval(&block)
        end
      end
    end
  end
end
