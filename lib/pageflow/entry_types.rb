module Pageflow
  # A collection of {EntryType} objects.
  #
  # @since 15.1
  class EntryTypes
    include Enumerable

    # @api private
    def initialize
      @entry_types_by_name = {}
    end

    # Register an entry type.
    #
    # @param entry_type [EntryType]
    def register(entry_type)
      @entry_types_by_name[entry_type.name] = entry_type
    end

    # @api private
    def find_by_name!(name)
      @entry_types_by_name.fetch(name) do
        raise "Unknown entry type with name #{name}."
      end
    end

    # @api private
    def each(&block)
      @entry_types_by_name.values.each(&block)
    end

    # @api private
    def routes(router)
      each do |entry_type|
        next unless entry_type.editor_app

        router.instance_eval do
          nested do
            scope '/:entry_type', constraints: {entry_type: entry_type.name} do
              mount entry_type.editor_app, at: '/'
            end
          end
        end
      end
    end
  end
end
