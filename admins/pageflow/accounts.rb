module Pageflow
  ActiveAdmin.register Account, :as => 'Account' do
    menu :priority => 3

    config.batch_actions = false

    index do
      column :name do |account|
        link_to account.name, admin_account_path(account)
      end
      column :entries_count do |account|
        account.entries_count
      end
      column :users_count do |account|
        account.users_count
      end
      column :default_theming do |account|
        account.default_theming.theme_name
      end
    end

    filter :name

    form :partial => 'form'

    show :title => :name do |account|
      render 'account_details', :account => account
      render 'theming_details', :account => account

      tabs_view(Pageflow.config.admin_resource_tabs.find_by_resource(:theming),
                :i18n => 'pageflow.admin.resource_tabs',
                :build_args => [account.default_theming])
    end

    controller do
      helper Pageflow::Admin::FeaturesHelper
      helper ThemesHelper
      helper WidgetsHelper

      def new
        @account = Account.new
        @account.build_default_theming
      end

      def create
        @account = Account.new(permitted_params[:account])
        @account.build_default_theming(permitted_params[:account][:default_theming_attributes])
        super
        update_widgets
      end

      def update
        update! do |success, failure|
          success.html { redirect_to(admin_account_path(resource, params.slice(:tab))) }
        end
        update_widgets
      end

      def update_widgets
        @account.default_theming.widgets.batch_update!(widgets_params) if @account.valid?
      end

      def widgets_params
        params.fetch(:widgets, {}).map do |role, type_name|
          {role: role, type_name: type_name}
        end
      end

      def permitted_params
        result = params.permit(account: permitted_account_attributes)

        if result[:account]
          feature_states = params[:account][:feature_states].try(:permit!)
          result[:account].merge!(feature_states: feature_states || {})
        end

        result
      end

      def scoped_collection
        super.includes(:users, :entries, :themings)
      end

      private

      def permitted_account_attributes
        [
          :name,
          :default_file_rights,
          default_theming_attributes: permitted_theming_attributes
        ] +
          permitted_attributes_for(:account)
      end

      def permitted_theming_attributes
        [
          :cname,
          :theme_name,
          :imprint_link_url,
          :imprint_link_label,
          :copyright_link_url,
          :copyright_link_label,
          :home_url,
          :home_button_enabled_by_default
        ] +
          permitted_attributes_for(:theming)
      end

      def permitted_attributes_for(resource_name)
        if params[:id]
          Pageflow.config_for(resource).admin_form_inputs.permitted_attributes_for(resource_name)
        else
          []
        end
      end
    end
  end
end
