module Pageflow
  module Admin
    class EntriesTab < ViewComponent
      def build(theming)
        account = theming.account
        embedded_index_table account.entries, blank_slate_text: I18n.t('pageflow.admin.entries.no_members') do
          table_for_collection :class => 'entries', :i18n => Pageflow::Entry do
            column :title do |entry|
              link_to(entry.title, admin_entry_path(entry))
            end
          end
        end
      end
    end
  end
end
