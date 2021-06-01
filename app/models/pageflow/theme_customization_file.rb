module Pageflow
  # @api private
  class ThemeCustomizationFile < ApplicationRecord
    belongs_to :theme_customization

    has_attached_file(:attachment,
                      Pageflow
                        .config.paperclip_s3_default_options
                        .merge(styles: ->(attachment) { attachment.instance.attachment_styles }))

    # Paperclip requires a content type validator for security
    # reasons. Sub-classes are fine, though. The original validator
    # does not provide a way to dynamically determine the permitted
    # content types.
    class AttachmentContentTypeValidator < Paperclip::Validators::AttachmentContentTypeValidator
      def validate_whitelist(record, attribute, value)
        return if value =~ record.options_from_entry_type[:content_type]
        record.errors.add(attribute, :invalid)
      end

      # Override to not require :content_type option.
      def check_validity!
        true
      end
    end

    validates_with AttachmentContentTypeValidator, attributes: :attachment

    def urls
      attachment_styles.map { |style, _|
        [style, attachment.url(style)]
      }.to_h
    end

    def attachment_styles
      options_from_entry_type.fetch(:styles, {})
    end

    def options_from_entry_type
      theme_customization.entry_type.theme_files.fetch(type_name.to_sym, {})
    end
  end
end
