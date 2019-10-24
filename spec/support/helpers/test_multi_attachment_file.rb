module Pageflow
  class TestMultiAttachmentFile < ActiveRecord::Base
    self.table_name = :test_multi_attachment_files
    include ReusableFile

    has_attached_file :first_attachment, Pageflow.config.paperclip_s3_default_options
    has_attached_file :second_attachment, Pageflow.config.paperclip_s3_default_options

    do_not_validate_attachment_file_type(:first_attachment)
    do_not_validate_attachment_file_type(:second_attachment)

    def retryable?
      false
    end

    def ready?
      first_attachment.present? && second_attachment.present?
    end

    def failed?
      false
    end

    def publish!; end

    def attachments_for_export
      [first_attachment, second_attachment]
    end
  end
end
