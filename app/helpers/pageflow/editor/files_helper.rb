module Pageflow
  module Editor
    # @api private
    module FilesHelper
      include Pageflow::FilesHelper
      include AudioFilesHelper
      include VideoFilesHelper
      include RenderJsonHelper

      def editor_files_json_seed(entry)
        inner = Pageflow.config.file_types.map { |file_type|
          json = render_json_partial(partial: 'pageflow/editor/files/file',
                                     collection: entry.find_files(file_type.model),
                                     locals: {file_type:},
                                     as: :file)

          %("#{file_type.collection_name}": #{json})
        }.join(',')

        "{#{inner}}".html_safe
      end
    end
  end
end
