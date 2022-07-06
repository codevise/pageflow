module Pageflow
  module PaperclipProcessors
    # @api private
    class Noop < Paperclip::Processor
      def make
        File.new(file.path)
      end
    end
  end
end
