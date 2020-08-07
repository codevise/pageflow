module Pageflow
  module Admin
    class EntryTemplatesTab < ViewComponent
      def build(theming)
        account = theming.account
        table_subjects = account.existing_and_potential_entry_templates

        table_for(table_subjects, i18n: Pageflow::EntryTemplate) do
          column do |entry_template|
            if entry_template.id
              render 'admin/accounts/entry_template_details', entry_template: entry_template
            else
              h5(entry_template.translated_entry_type_name)
            end
          end
          column do |entry_template|
            if entry_template.id
              edit_link(entry_template, account)
            else
              new_link(entry_template, account)
            end
          end
        end
      end

      def new_link(entry_template, account)
        link_to(
          I18n.t('active_admin.new'),
          new_admin_account_entry_template_path(
            account,
            entry_template,
            entry_type_name: entry_template.entry_type_name
          )
        )
      end

      def edit_link(entry_template, account)
        link_to(
          I18n.t('active_admin.edit'),
          edit_admin_account_entry_template_path(
            account,
            entry_template
          )
        )
      end
    end
  end
end
