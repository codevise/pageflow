module Pageflow
  module BackgroundImageHelper
    def background_image_div(configuration, property_base_name, options = {})
      Div.new(self, configuration, property_base_name, options).render
    end

    def background_image_div_with_size(configuration, property_base_name, options = {})
      DivWithSizeAttributes.new(self, configuration, property_base_name, options).render
    end

    def background_image_tag(image_id, options = {})
      if image = ImageFile.find_by_id(image_id)
        options = options.merge(:'data-src' => image.attachment.url(:medium))
        options = options.merge(:'data-printsrc' => image.attachment.url(:print))
        image_tag('', options)
      end
    end

    class Div
      attr_reader :configuration, :property_base_name, :options

      delegate :content_tag, :to => :@template

      def initialize(template, configuration, property_base_name, options)
        @template = template
        @configuration = configuration
        @property_base_name = property_base_name
        @options = options
      end

      def render
        content_tag(:div, '', :class => css_class, :style => inline_style, :data => data_attributes)
      end

      protected

      def data_attributes
      end

      def image_id
        configuration["#{property_base_name}_id"]
      end

      def inline_style
        "background-position: #{background_position('x')} #{background_position('y')};"
      end

      private

      def css_class
        ["background background_image image_#{image_id || 'none'}", options[:class]].compact.join(' ')
      end

      def background_position(coord)
        property_name = "#{property_base_name}_#{coord}"
        configuration.key?(property_name) ? "#{configuration[property_name]}%" : "50%"
      end
    end

    class DivWithSizeAttributes < Div
      def data_attributes
        if image_file
          {:width => image_file.width, :height => image_file.height}
        end
      end

      def inline_style
        if options[:spanning]
          "padding-top: #{padding_top}%; width: 100%; background-position: 0 0" # fix me (yet disables background_position option)
        else
          super
        end
      end

      def padding_top
        if image_file
          image_file.height / image_file.width.to_f * 100
        else
          0
        end
      end

      def image_file
        @image_file ||= (ImageFile.find_by_id(image_id) || :none)
        @image_file == :none ? nil : @image_file
      end
    end
  end
end
