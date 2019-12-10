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
        register_help_entries(config, page_type)
        register_revision_components(config, page_type)
        register_file_types(config, page_type)
      end
    end

    private

    def ensure_export_version_implemented(page_type)
      page_type.export_version
    end

    def register_help_entries(config, page_type)
      config.help_entries.register(page_type.help_entry_translation_key,
                                   parent: 'pageflow.help_entries.page_types')
    end

    def register_revision_components(config, page_type)
      page_type.revision_components.each do |component|
        config.revision_components.register(component)
      end
    end

    def register_file_types(config, page_type)
      # After a deprecation period against initializing FileType with
      # a model reference instead of a model name string, we could
      # rewrite this to register the page type's file types one by one
      # right here instead of lazily in FileTypes#each.
      config.file_types.register(
        -> { page_type.file_types }
      )
    end
  end
end
