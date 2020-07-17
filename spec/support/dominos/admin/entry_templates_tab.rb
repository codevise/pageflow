module Dom
  module Admin
    class EntryTemplatesTab < Domino
      selector '.entry_templates_tab'

      def edit_link
        within(node) do
          find_link('Edit')
        end
      end
    end
  end
end
