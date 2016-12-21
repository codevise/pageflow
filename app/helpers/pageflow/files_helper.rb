module Pageflow
  module FilesHelper
    include RenderJsonHelper
    include VideoFilesHelper

    def file_format(file)
      file.format.presence || '-'
    end

    def file_dimensions(file)
      if file.width && file.height
        "#{file.width} x #{file.height}px"
      else
        "-"
      end
    end

    def file_duration(file)
      if file.duration_in_ms
        total_seconds = file.duration_in_ms / 1000
        seconds = total_seconds % 60
        minutes = (total_seconds / 60) % 60
        hours = total_seconds / (60 * 60)

        format("%02d:%02d:%02d", hours, minutes, seconds)
      else
        "-"
      end
    end

    def files_json_seeds(entry)
      inner = Pageflow.config.file_types.map do |file_type|
        json = render_json_partial(partial: 'pageflow/editor/files/file',
                                   collection: entry.find_files(file_type.model),
                                   locals: {file_type: file_type},
                                   as: :file)

        %'"#{file_type.collection_name}": #{json}'
      end.join(',')

      "{#{inner}}".html_safe
    end
  end
end
