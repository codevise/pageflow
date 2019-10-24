module Pageflow
  class PageTypes
    include Enumerable

    def initialize
      clear
    end

    def clear
      @page_types = []
      @page_types_by_name = {}
    end

    def register(page_type)
      @page_types << page_type
      @page_types_by_name[page_type.name] = page_type

      ensure_export_version_implemented(page_type)
    end

    def find_by_name!(name)
      @page_types_by_name.fetch(name) do
        raise "Unknown page type with name #{name}."
      end
    end

    def names
      map(&:name)
    end

    def each(&block)
      @page_types.each(&block)
    end

    private

    def ensure_export_version_implemented(page_type)
      page_type.export_version
    end
  end
end
