module Pageflow
  class FileReuse
    attr_accessor :source_entry, :destination_entry, :file_type, :file

    def initialize(destination_entry, source_entry, file_type, file_id)
      @source_entry = source_entry
      @destination_entry = destination_entry
      @file_type = file_type
      @file = source_entry.find_file(file_type.model, file_id)
    end

    def save!
      destination_entry.use_file(file)

      file_type.nested_file_types.each do |nested_file_type|
        source_entry.find_files(nested_file_type.model).each do |nested_file|
          next if nested_file.parent_file_id != file.id ||
                  nested_file.parent_file_model_type != file.model_name.name

          destination_entry.use_file(nested_file)
        end
      end
    end
  end
end
