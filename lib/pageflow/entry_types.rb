module Pageflow
  # A collection of {EntryType} objects.
  #
  # @since edge
  class EntryTypes
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
  end
end
