require 'open3'

module Pageflow
  module PaperclipProcessors
    # @api private
    class AudioWaveform < Paperclip::Processor
      def make
        destination = make_tempfile_for(file.path)

        generate_peak_data(input: file.path,
                           output: destination.path)

        destination
      end

      private

      def generate_peak_data(input:, output:)
        _stdout, stderr, status = Open3.capture3('audiowaveform',
                                                 '-i',
                                                 input,
                                                 '-o',
                                                 output,
                                                 '--pixels-per-second',
                                                 '10',
                                                 '--bits',
                                                 '8')

        raise "audiowaveform failed: #{stderr}" unless status.success?
      end

      def make_tempfile_for(path)
        basename = File.basename(path, File.extname(path))

        tempfile = Tempfile.new([basename, '.json'])
        tempfile.binmode

        tempfile
      end
    end
  end
end
