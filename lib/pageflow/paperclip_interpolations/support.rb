module Pageflow
  module PaperclipInterpolations
    # @api private
    module Support
      extend self

      def pageflow_placeholder(_attachment, style)
        "pageflow/placeholder_#{style}.jpg"
      end

      def pageflow_attachments_version(_attachment, style)
        version = Pageflow.config.paperclip_attachments_version
        "#{version}/" if version.present? && style != :original
      end

      def class_basename(attachment, _style)
        attachment \
          .instance
          .class
          .name
          .demodulize
          .underscore
          .pluralize
      end
    end
  end
end
