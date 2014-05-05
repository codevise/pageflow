module Pageflow
  module Editor
    class VideoFilesController < FilesController
      protected

      def model
        VideoFile
      end
    end
  end
end
