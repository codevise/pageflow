require 'support/dominos/scrolled_entry'

module Dom
  module Editor
    class EntryPreview < Domino
      selector '#entry_preview'

      def section_count
        within_frame(node.find('iframe')) do
          Dom::ScrolledEntry.find!.section_count
        end
      end
    end
  end
end
