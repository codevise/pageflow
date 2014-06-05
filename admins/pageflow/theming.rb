module Pageflow
  ActiveAdmin.register Theming, :as => 'Theming' do
    actions :index, :show, :edit, :update

    config.batch_actions = false
    config.clear_sidebar_sections!

    index :pagination_total => false, :download_links => false do
      if authorized?(:read, Pageflow::Account)
        column :account do |theming|
          link_to theming.account.name, admin_account_path(theming.account)
        end
      end
      column :theme do |theming|
        theming.theme.css_dir
      end
      column do |theming|
        link_to t('admin.themings.show'), admin_theming_path(theming)
      end
    end

    show do |theming|
      attributes_table_for theming do
        row :imprint_link_label, :class => 'imprint-label'
        row :imprint_link_url, :class => 'imprint-url'
        row :copyright_link_label, :class => 'copyright-label'
        row :copyright_link_url, :class => 'copyright-url'
        row :cname, :class => 'cname'
        row :created_at
      end
    end

    form :partial => 'form'

    controller do
      def permitted_params
        params.permit(:theming => [:copyright_link_label, :copyright_link_url, :imprint_link_label, :imprint_link_url, :theme_id, :cname])
      end
    end
  end
end
