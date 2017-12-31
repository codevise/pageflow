module Pageflow
  module PaperclipInterpolations
    class Support
      attr_reader :attachment, :style

      def initialize(attachment, style)
        @attachment = attachment
        @style = style
      end

      def pageflow_placeholder
        "pageflow/placeholder_#{style}.jpg"
      end

      def pageflow_attachments_version
        version = Pageflow.config.paperclip_attachments_version

        if version.present? && style != :original
          "#{version}/"
        end
      end

      def class_basename
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
