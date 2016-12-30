require 'webvtt'
require 'fileutils'

module Pageflow
  module PaperclipProcessors
    class Vtt < Paperclip::Processor
      def make
        destination = make_tempfile_for(file.path)

        if File.extname(file.path) =~ /\.srt$/
          srt_to_vtt(file.path, destination.path)
        else
          FileUtils.cp(file.path, destination.path)
        end

        destination
      end

      private

      def srt_to_vtt(source_path, destination_path)
        WebVTT.convert_from_srt(source_path, destination_path)
      end

      def make_tempfile_for(path)
        basename = File.basename(path, File.extname(path))

        tempfile = Tempfile.new([basename, '.vtt'])
        tempfile.binmode

        tempfile
      end
    end
  end
end
