module Pageflow
  # List of file importers will be maintained using this class
  # File importer plugin is required to register itself to this list
  class FileImporters
    include Enumerable

    def initialize
      clear
    end

    def register(file_importer)
      @file_importers[file_importer.name] = file_importer
    end

    def clear
      @file_importers = {}
    end

    def each(&block)
      @file_importers.values.each(&block)
    end

    def find_by_name!(name)
      fetch_by_name(name) do
        raise "Unknown file importer with name '#{name}'."
      end
    end

    def fetch_by_name(name, &block)
      @file_importers.fetch(name, &block)
    end
  end
end
