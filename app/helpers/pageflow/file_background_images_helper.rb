module Pageflow
  # @api private
  module FileBackgroundImagesHelper
    include BackgroundImageHelper

    ALLOWED_BREAKPOINTS = [:mobile, :desktop].freeze

    def file_background_images_css(entry, breakpoint_name)
      render(partial: 'pageflow/file_background_images/rule',
             collection: Rules.new(Pageflow.config.file_types.with_css_background_image_support,
                                   entry,
                                   breakpoint_name).to_a)
    end

    # @api private
    class Rules
      def initialize(file_types, entry, breakpoint_name)
        @file_types = file_types
        @entry = entry
        @breakpoint_name = breakpoint_name
      end

      def to_a
        file_types.flat_map do |file_type|
          rules_for_file_type(file_type)
        end
      end

      private

      attr_reader :entry, :file_types, :breakpoint_name

      def rules_for_file_type(file_type)
        entry.find_files(file_type.model).flat_map do |file|
          exclude_rules_with_blank_url(rules_for_file(file_type, file))
        end
      end

      def rules_for_file(file_type, file)
        file_type.css_background_image_urls_for(file, entry:).map do |name, url|
          {
            prefix: rule_prefix(file_type, name),
            file:,
            url: url_for_breakpoint(file_type, url)
          }
        end
      end

      def url_for_breakpoint(file_type, url)
        if url.is_a?(Hash)
          unknown_breakpoint_names = url.keys - ALLOWED_BREAKPOINTS

          if unknown_breakpoint_names.any?
            raise("Unknown breakpoints #{unknown_breakpoint_names.join(', ')} used in " \
                  "css_background_image_urls of file type #{file_type.collection_name}.")
          end

          url[breakpoint_name]
        else
          url
        end
      end

      def rule_prefix(file_type, name)
        [
          file_type.css_background_image_class_prefix,
          name == :default ? nil : name
        ].compact.join('_')
      end

      def exclude_rules_with_blank_url(rules)
        rules.reject do |rule|
          rule[:url].blank?
        end
      end
    end
  end
end
