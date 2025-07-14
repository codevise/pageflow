module Pageflow
  class HelpEntries
    include Enumerable

    def initialize
      @help_entries = []
      @help_entries_by_name = {}
    end

    # Add a section to the help dialog displayed in the editor.
    #
    # Translation keys for the help entry are derived from its name by
    # appending ".menu_item" and ".text". Text is parsed as markdown.
    #
    # @param [String] name  Translation key prefix
    # @param [Hash] options
    # @option options [String] :parent  Name of the parent help entry
    # @option options [Fixnum] :priority (10) Entries with higher
    #          priority come first in the entry list.
    def register(name, options = {})
      help_entry = HelpEntry.new(name, options)
      @help_entries_by_name[name] = help_entry

      collection = find_collection(options[:parent])

      collection << help_entry
      collection.sort_by! { |help_entry| -help_entry.priority }
    end

    # @api private
    def flat
      map { |help_entry|
        [help_entry, help_entry.children]
      }.flatten
    end

    def each(&block)
      @help_entries.each(&block)
    end

    private

    def find_collection(name)
      if name
        parent = @help_entries_by_name.fetch(name) do
          throw "Help entry with name #{name} not found."
        end

        parent.children
      else
        @help_entries
      end
    end
  end
end
