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

    form :partial => 'form'

    show :title => :name do |account|
      render 'account_details', :account => account
      render 'theming_details', :account => account

      div :class => 'columns' do
        render 'entries_panel', :account => account
        render 'users_panel', :account => account
      end
    end

    controller do
      helper ThemesHelper

      def new
        @account = Account.new
        @account.default_theming = Theming.new
      end

      def create
        @account = Account.new(permitted_params[:account])
        @account.build_default_theming(permitted_params[:account][:default_theming_attributes])
        super
      end

      def permitted_params
        params.permit(:account => [:name, :default_file_rights, :default_theming_attributes => [:cname, :theme_name, :imprint_link_url, :imprint_link_label, :copyright_link_url, :copyright_link_label, :home_url, :home_button_enabled_by_default]])
      end
    end
  end
end
