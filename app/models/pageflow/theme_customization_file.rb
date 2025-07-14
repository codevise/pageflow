module Pageflow
  # A file that has been uploaded by the user to customize a theme,
  # e.g., to use a custom logo.
  #
  # @since 15.7
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
    #
    # @api private
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

    # The name of the originally uploaded file
    def file_name
      attachment_file_name
    end

    # A hash of urls based on the styles that were defined when
    # registering the entry type.
    def urls
      styles_from_options.map { |style, _|
        [style, attachment.url(style)]
      }.to_h
    end

    # @api private
    def options_from_entry_type
      theme_customization.entry_type.theme_files.fetch(type_name.to_sym, {})
    end

    # @api private
    def attachment_styles
      styles_from_options.except(:original)
    end

    # @api private
    def styles_from_options
      styles = options_from_entry_type.fetch(:styles, {})
      styles.respond_to?(:call) ? styles.call(self) : styles
    end
  end
end
