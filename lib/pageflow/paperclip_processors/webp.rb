require 'vips'

module Pageflow
  module PaperclipProcessors
    # @api private
    class Webp < Paperclip::Processor
      ANIMATED_FORMATS = %w[.gif].freeze

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
          thumbnail = Vips::Image.thumbnail(
            ANIMATED_FORMATS.include?(@current_format) ? "#{source.path}[n=-1]" : source.path,
            width,
            size: @should_crop ? :both : :down,
            height:,
            crop:
          )
          thumbnail.webpsave(destination.path)
        rescue Vips::Error => e
          if @whiny
            message = "There was an error processing the thumbnail for #{@basename}:\n" + e.message
            raise Paperclip::Error, message
          end
        end

        destination
      end

      private

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
