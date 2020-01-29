module Pageflow
  # Format and generate seed data for files
  module FilesHelper
    include RenderJsonHelper

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

    # Render seed data for all files of the revision.
    #
    # @param [JBuilder] json
    # @param [PublishedEntry] entry
    # @since 15.1
    def files_json_seed(json, entry)
      Pageflow.config.file_types.each do |file_type|
        json.set!(file_type.collection_name) do
          json.array!(entry.find_files(file_type.model)) do |file|
            json.partial!('pageflow/files/file', file: file, file_type: file_type)
          end
        end
      end
    end
  end
end
