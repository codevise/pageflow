module Pageflow
  module Admin
    class EntriesTab < ViewComponent
      def build(theming)
        account = theming.account
        embedded_index_table account.entries.order(
            params[:order] && Entry.column_names.include?(params[:order].gsub('_asc', '').gsub('_desc', '')) ?
                params[:order].gsub('_asc', ' asc').gsub('_desc', ' desc') : 'title desc'),
                             blank_slate_text: I18n.t('pageflow.admin.entries.no_members') do
          table_for_collection sortable: true, class: 'entries', i18n: Pageflow::Entry do
            column :title, sortable: :title do |entry|
              link_to(entry.title, admin_entry_path(entry))
            end
            column I18n.t('pageflow.admin.entries.members'), class: 'members' do |entry|
              entry_user_badge_list(entry)
            end
            column :created_at
            column :updated_at
            column :first_published_at
          end
        end
      end
    end
  end
end
