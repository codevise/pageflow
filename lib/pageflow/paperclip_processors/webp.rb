require 'vips'

module Pageflow
  module PaperclipProcessors
    # @api private
    class Webp < Paperclip::Processor
      ANIMATED_FORMATS = %w[.gif].freeze
      SVG_FORMATS = %w[.svg .svgz].freeze

      def initialize(file, options = {}, attachment = nil)
        super

        geometry = options[:geometry].to_s
        @should_crop = geometry[-1, 1] == '#'

        @target_geometry = Paperclip::Geometry.parse(geometry)
        @whiny = options.fetch(:whiny, true)

        @current_format = File.extname(file.path)
        @basename = File.basename(@file.path, @current_format)
      end

      def make
        source = @file
        filename = [@basename, '.webp'].join
        destination = Paperclip::TempfileFactory.new.generate(filename)

        begin
          thumbnail(source.path).webpsave(destination.path)
        rescue Vips::Error => e
          if @whiny
            message = "There was an error processing the thumbnail for #{@basename}:\n" + e.message
            raise Paperclip::Error, message
          end
        end

        destination
      end

      private

      def thumbnail(path)
        options = {size: @should_crop ? :both : :down, height:, crop:}

        if undetectable_svg?(path)
          svg_thumbnail(path, options)
        elsif ANIMATED_FORMATS.include?(@current_format)
          Vips::Image.thumbnail("#{path}[n=-1]", width, **options)
        else
          Vips::Image.thumbnail(path, width, **options)
        end
      end

      # libvips only detects SVGs whose svg tag is within the first kilobyte
      def undetectable_svg?(path)
        SVG_FORMATS.include?(@current_format.downcase) &&
          !Vips.vips_foreign_find_load(path)
      end

      def svg_thumbnail(path, options)
        Vips::Image
          .svgload(path, scale: svg_scale(Vips::Image.svgload(path)))
          .thumbnail_image(width, **options)
      end

      # Without rendering at target size, huge declared dimensions
      # exhaust memory before thumbnail_image can shrink the image
      def svg_scale(svg)
        ratios = [width.to_f / svg.width, height.to_f / svg.height]
        @should_crop ? ratios.max : [*ratios, 1].min
      end

      def crop
        return unless @should_crop

        @options[:crop] || :centre
      end

      def width
        @target_geometry.width
      end

      def height
        @target_geometry.height
      end
    end
  end
end
