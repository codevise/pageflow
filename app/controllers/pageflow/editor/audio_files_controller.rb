module Pageflow
  module Editor
    class AudioFilesController < FilesController
      protected

      def model
        AudioFile
      end
    end
  end
end
