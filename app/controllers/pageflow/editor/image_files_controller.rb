module Pageflow
  module Editor
    class ImageFilesController < FilesController
      protected

      def model
        ImageFile
      end
    end
  end
end
