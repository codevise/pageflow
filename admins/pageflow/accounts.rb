module Pageflow
  ActiveAdmin.register Account, :as => 'Account' do
    menu({priority: 3}.merge(Pageflow.config.account_admin_menu_options))

    config.batch_actions = false

    index do
      column :name do |account|
        if authorized?(:read, account)
          link_to(account.name,
                  admin_account_path(account),
                  data: {id: account.id})
        else
          account.name
        end
      end
      column :entries_count do |account|
        account.entries_count if authorized?(:read, account)
      end
      column :users_count do |account|
        account.memberships.size if authorized?(:read, account)
      end
      account_memberships = current_user.memberships.on_accounts
      account_roles = account_memberships.each_with_object({}) do |membership, roles|
        roles[membership.entity_id] = membership.role
      end
      if authorized?(:see_own_role_on, :accounts)
        column :own_role do |account|
          own_role = account_roles[account.id]
          membership_role_with_tooltip(own_role, scope: 'own_account_role')
        end
      end
      column :default_theming do |account|
        account.default_theming.theme_name if authorized?(:read, account)
      end
    end

    csv do
      column :name
      column :entries_count
      column :users_count
    end

    filter :name

    searchable_select_options(text_attribute: :name,
                              scope: lambda do
                                Account
                                  .accessible_by(current_ability, :read)
                                  .order(:name)
                              end)

    searchable_select_options(name: :member_addable,
                              text_attribute: :name,
                              scope: lambda do
                                AccountPolicy::Scope.new(current_user, Account)
                                  .member_addable
                                  .order(:name)
                              end)

    form :partial => 'form'

    show :title => :name do |account|
      render 'account_details', :account => account
      render 'theming_details', :account => account

      tabs_view(Pageflow.config.admin_resource_tabs.find_by_resource(account.default_theming),
                i18n: 'pageflow.admin.resource_tabs',
                authorize: :see_theming_admin_tab,
                build_args: [account.default_theming])
    end

    controller do
      helper Pageflow::Admin::FeaturesHelper
      helper Pageflow::Admin::FormHelper
      helper Pageflow::Admin::LocalesHelper
      helper Pageflow::Admin::MembershipsHelper
      helper Pageflow::Admin::WidgetsHelper
      helper ThemesHelper

      def new
        @account = Account.new
        @account.build_default_theming(
          default_locale: current_user.locale,
          share_providers: Pageflow.config.default_share_providers
        )
      end

      def create
        @account = Account.new(permitted_params[:account])
        @account.build_default_theming(permitted_params.fetch(:account, {})[:default_theming_attributes])
        super
        update_widgets
      end

      def update
        update! do |success, failure|
          success.html { redirect_to(admin_account_path(resource, params.permit(:tab))) }
        end
        update_widgets
      end

      def update_widgets
        @account.default_theming.widgets.batch_update!(widgets_params) if @account.valid?
      end

      def widgets_params
        (params[:widgets].try(:permit!).to_h || {}).map do |role, type_name|
          {role: role, type_name: type_name}
        end
      end

      def permitted_params
        result = params.permit(account: permitted_account_attributes)

        if result[:account]
          permit_feature_states(result[:account])
        end

        result
      end

      def scoped_collection
        super.includes(:default_theming)
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
          :additional_cnames,
          :theme_name,
          :imprint_link_url,
          :imprint_link_label,
          :copyright_link_url,
          :copyright_link_label,
          :privacy_link_url,
          :home_url,
          :home_button_enabled_by_default,
          :default_author,
          :default_publisher,
          :default_keywords,
          :default_locale,
          share_providers: []
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

      def permit_feature_states(attributes)
        if params[:id] && authorized?(:update_feature_configuration_on, resource)
          feature_states = params[:account][:feature_states].try(:permit!)
          attributes.merge!(feature_states: feature_states || {})
        end
      end
    end
  end
end
