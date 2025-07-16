module Pageflow
  module Admin
    # @api private
    class EntriesTab < ViewComponent
      def build(account)
        embedded_index_table(account.entries,
                             blank_slate_text: I18n.t('pageflow.admin.entries.no_members')) do
          table_for_collection(sortable: true, class: 'entries', i18n: Pageflow::Entry) do
            column :title, sortable: :title do |entry|
              link_to(entry.title, admin_entry_path(entry))
            end
            column :created_at
            column :updated_at
          end
        end
      end
    end
  end
end
