module Pageflow
  module UploadableFile
    extend ActiveSupport::Concern
    include ReusableFile

    included do
      alias_attribute :file_name, :attachment_on_s3_file_name
      alias_attribute :content_type, :attachment_on_s3_content_type
      alias_attribute :file_size, :attachment_on_s3_file_size

      has_attached_file(:attachment_on_s3,
                        Pageflow.config.paperclip_s3_default_options
                          .merge(
                            default_url: lambda do |attachment|
                              attachment.instance.attachment_default_url
                            end,
                            styles: lambda do |attachment|
                              attachment.instance.attachment_styles(attachment)
                            end
                          ))

      validates_attachment_presence :attachment_on_s3
      validates_attachment_file_name :attachment_on_s3, matches: %r{^[^/\\]+\.\w{3,4}$}
      do_not_validate_attachment_file_type :attachment_on_s3

      state_machine initial: 'uploading' do
        extend StateMachineJob::Macro

        state 'uploading'
        state 'uploaded'
        state 'uploading_failed'

        event :file_uploaded do
          transition 'uploading' => 'uploaded'
        end

        event :process
      end
    end

    # see https://github.com/rails/rails/issues/50048
    def file_name
      attachment_on_s3_file_name
    end

    def attachment
      attachment_on_s3
    end

    def attachment=(value)
      self.attachment_on_s3 = value
    end

    def direct_upload_config
      Pageflow.config.paperclip_direct_upload_options.call(attachment)
    end

    # Overwritten if a file type wants to merge its attachments default_url into
    # Pageflow.config.paperclip_s3_default_options.
    # (See Pageflow::ImageFile for example)
    def attachment_default_url
      ''
    end

    # Overwritten if a file type wants to add additional styles to
    # Pageflow.config.paperclip_s3_default_options.
    # (See Pageflow::ImageFile for example)
    def attachment_styles(_attachment)
      {}
    end

    # ReusableFile-overrides:

    def attachments_for_export
      [attachment]
    end

    def url
      return unless attachment.present?

      attachment.url
    end

    def basename
      File.basename(attachment.original_filename, '.*')
    end

    def extension
      File.extname(attachment.original_filename).sub(/\A\./, '')
    end

    def can_upload?
      uploading?
    end

    def retryable?
      false
    end

    def ready?
      attachment.present?
    end

    def failed?
      uploading_failed?
    end

    def publish!
      file_uploaded!
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
