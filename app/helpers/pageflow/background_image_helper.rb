module Pageflow
  module BackgroundImageHelper
    include RevisionFileHelper

    def background_image_div(configuration, property_base_name, options = {})
      Div.new(@entry, self, configuration, property_base_name, options).render
    end

    def background_image_div_with_size(configuration, property_base_name, options = {})
      DivWithSizeAttributes.new(@entry, self, configuration, property_base_name, options).render
    end

    def background_image_tag(image_perma_id, options = {})
      image = find_file_in_entry(ImageFile, image_perma_id)
      return unless image&.ready?

      options = options.merge('data-src': image.attachment.url(:medium))
      options = options.merge('data-printsrc': image.attachment.url(:print))
      image_tag('', options)
    end

    def background_image_lazy_loading_css_class(prefix, model)
      css_class = [prefix, model.perma_id].join('_')
      ".load_all_images .#{css_class}, .load_image.#{css_class}"
    end

    class Div
      attr_reader :configuration, :property_base_name, :options

      delegate :content_tag, to: :@template

      def initialize(entry, template, configuration, property_base_name, options)
        @entry = entry
        @template = template
        @configuration = configuration
        @property_base_name = property_base_name
        @options = options
      end

      def render
        content_tag(:div, '', class: css_class, style: inline_style, data: data_attributes)
      end

      protected

      def data_attributes
        options.slice(:style_group)
      end

      def file_perma_id
        configuration["#{property_base_name}_id"]
      end

      def inline_style
        "background-position: #{background_position('x')} #{background_position('y')};"
      end

      private

      def css_class
        ["background background_image #{image_css_class}", options[:class]].compact.join(' ')
      end

      def image_css_class
        [image_css_class_prefix, options[:style_group], file_perma_id || 'none'].compact.join('_')
      end

      def image_css_class_prefix
        file_type.css_background_image_class_prefix
      end

      def background_position(coord)
        property_name = "#{property_base_name}_#{coord}"
        configuration.key?(property_name) ? "#{configuration[property_name]}%" : "50%"
      end

      def file_type
        collection_name = options.fetch(:file_type, 'image_file').pluralize
        Pageflow.config.file_types.find_by_collection_name!(collection_name)
      end
    end

    class DivWithSizeAttributes < Div
      include RevisionFileHelper

      def data_attributes
        if file
          super.merge(width: file.width, height: file.height)
        else
          super
        end
      end

      def inline_style
        if options[:spanning]
          "padding-top: #{padding_top}%; width: 100%; background-position: 0 0" # fix me (yet disables background_position option)
        else
          super
        end
      end

      private

      def padding_top
        if file
          file.height / file.width.to_f * 100
        else
          0
        end
      end

      def file
        @file ||= (find_file || :none)
        @file == :none ? nil : @file
      end

      def find_file
        find_file_in_entry(file_type.model, file_perma_id)
      end
    end
  end
end
