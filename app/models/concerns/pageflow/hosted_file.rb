module Pageflow
  module HostedFile
    extend ActiveSupport::Concern
    include UploadedFile

    included do
      alias_attribute :file_name, :attachment_on_s3_file_name

      validates :attachment_on_s3, presence: true

      do_not_validate_attachment_file_type(:attachment_on_s3)

      state_machine initial: 'uploadable' do
        extend StateMachineJob::Macro

        state 'uploadable'
        state 'uploading'
        state 'uploaded'
        state 'uploading_failed'

        event :upload do
          transition 'uploadable' => 'uploading'
        end

        event :publish do
          transition 'uploading' => 'uploaded'
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

    def ready?
      attachment.present?
    end

    def basename
      File.basename(attachment.original_filename, '.*')
    end

    def url
      if attachment.present?
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

          after_transition(any => 'uploaded', &:process!)

          instance_eval(&block)
        end
      end
    end
  end
end
