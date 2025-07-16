module Dom
  module Admin
    class EntriesPage < Domino
      selector '.admin_entries'

      def add_entry_link
        within(node) do
          find_link(I18n.t('active_admin.new_model',
                           model: I18n.t('activerecord.models.entry.one')))
        end
      end
    end
  end
end
