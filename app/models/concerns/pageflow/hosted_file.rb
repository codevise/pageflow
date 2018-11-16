module Pageflow
  module HostedFile
    extend ActiveSupport::Concern
    include UploadedFile

    included do
      has_attached_file(:attachment_on_s3, Pageflow.config.paperclip_s3_default_options)

      validates :attachment, presence: true

      do_not_validate_attachment_file_type(:attachment_on_s3)

      state_machine initial: 'uploadable' do
        extend StateMachineJob::Macro

        state 'uploadable'
        state 'uploading_to_s3'
        state 'uploaded_to_s3'
        state 'uploading_to_s3_failed'

        event :publish do
          transition 'uploadable' => 'uploaded_to_s3'
        end

        # TODO: Set this in case the direct upload fails?
        # job UploadFileToS3Job do
        #   result :error, state: 'uploading_failed'
        # end

        event :process
      end
    end

    def attachment
      attachment_on_s3
    end

    def attachment=(value)
      self.attachment_on_s3 = value
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
