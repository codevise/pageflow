module Pageflow
  module HostedFile
    extend ActiveSupport::Concern
    include UploadedFile

    included do
      alias_attribute :file_name, :attachment_file_name

      has_attached_file(:attachment,
                        Pageflow.config.paperclip_s3_default_options
                          .merge(
                            default_url: lambda do |attachment|
                              attachment.instance.attachment_default_url
                            end,
                            styles: lambda do |attachment|
                              attachment.instance.attachment_styles(attachment)
                            end
                          ))

      validates :attachment, presence: true

      do_not_validate_attachment_file_type(:attachment)

      state_machine initial: 'uploading' do
        extend StateMachineJob::Macro

        state 'uploading'
        state 'uploaded'
        state 'uploading_failed'

        event :publish do
          transition 'uploading' => 'uploaded'
        end

        event :process
      end
    end

    def attachment_default_url
      ''
    end

    def attachment_styles(_attachment)
      {}
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
