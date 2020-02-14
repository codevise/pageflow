require 'support/dominos/scrolled_entry'

module Dom
  module Editor
    class EntryPreview < Domino
      selector '#entry_preview'

      def section_count
        within_scrolled_entry(&:section_count)
      end

      def within_scrolled_entry
        within_frame(node.find('iframe')) do
          yield Dom::ScrolledEntry.find!
        end
      end
    end
  end
end
