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

    def setup(config)
      config.help_entries.register('pageflow.help_entries.page_types', priority: 10)
      each do |page_type|
        config.help_entries.register(page_type.help_entry_translation_key,
                                     parent: 'pageflow.help_entries.page_types')

        page_type.revision_components.each do |component|
          config.revision_components.register(component)
        end
      end
    end

    private

    def ensure_export_version_implemented(page_type)
      page_type.export_version
    end
  end
end
