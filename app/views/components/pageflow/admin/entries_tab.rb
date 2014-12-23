module Pageflow
  module Admin
    class EntriesTab < ViewComponent
      def build(theming)
        account = theming.account
        if account.entries.any?
          table_for account.entries, :i18n => Pageflow::Entry do
            column :title do |entry|
              link_to(entry.title, admin_entry_path(entry))
            end
          end
          else
            div :class => "blank_slate_container" do
            span :class => "blank_slate" do
              I18n.t('pageflow.admin.accounts.no_entries')
            end
          end
        end
      end
    end
  end
end
