module Pageflow
  ActiveAdmin.register Account, :as => 'Account' do
    menu :priority => 3

    config.batch_actions = false
    config.clear_sidebar_sections!

    index do
      column :name do |account|
        link_to account.name, admin_account_path(account)
      end
    end

    form do |f|
      f.inputs do
        f.input :name
        f.input :default_file_rights
        f.input :default_theming, :include_blank => false
      end
      f.actions
    end

    show :title => :name do |account|
      attributes_table_for account do
        row :name, :class => 'name'
        row :default_file_rights, :class => 'default_file_rights'
        row :default_theming, :class => 'default_theming'
        row :created_at
      end

      div :class => 'columns' do
        panel I18n.t('activerecord.models.user.other') do
          if account.users.any?
            table_for account.users, :i18n => User do
              column :full_name do |user|
                link_to user.full_name, admin_user_path(user)
              end
            end
          else
            div :class => "blank_slate_container" do
              span :class => "blank_slate" do
                I18n.t('admin.accounts.no_members')
              end
            end
          end
        end

        panel t('activerecord.models.entry.other') do
          if account.entries.any?
            table_for account.entries, :i18n => Entry do
              column :title do |entry|
                link_to(entry.title, admin_entry_path(entry))
              end
            end
          else
            div :class => "blank_slate_container" do
              span :class => "blank_slate" do
                I18n.t('admin.accounts.no_entries')
              end
            end
          end
        end
      end
    end

    controller do
      def permitted_params
        params.permit(:account => [:name, :default_file_rights, :default_theming_id])
      end
    end
  end
end
