module Pageflow
  ActiveAdmin.register Account, as: 'Account' do
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

    form partial: 'form'

    show title: :name do |account|
      render('account_details', account:)

      tabs_view(Pageflow.config.admin_resource_tabs.find_by_resource(account),
                i18n: 'pageflow.admin.resource_tabs',
                authorize: :see_account_admin_tab,
                build_args: [account])
    end

    controller do
      helper Admin::CutoffModesHelper
      helper Admin::FeaturesHelper
      helper Admin::FormHelper
      helper Admin::LocalesHelper
      helper Admin::MembershipsHelper
      helper Admin::SitesHelper
      helper ThemesHelper

      def new
        @account = Account.new
        @account.build_default_site
      end

      def create
        account_params = permitted_params[:account] || {}
        @account = Account.new(account_params)
        @account.build_default_site(permitted_params.fetch(:account, {})[
                                         :default_site_attributes])
        super
      end

      def update
        update! do |success, _failure|
          success.html { redirect_to(admin_account_path(resource, params.permit(:tab))) }
        end
      end

      def permitted_params
        result = params.permit(account: permitted_account_attributes)

        with_permitted_feature_states(result)
      end

      def scoped_collection
        super.includes(:default_site)
      end

      private

      def with_permitted_feature_states(result)
        result[:account] && permit_feature_states(result[:account])

        result
      end

      def permitted_account_attributes
        [
          :name,
          :default_file_rights,
          {default_site_attributes: permitted_site_attributes}
        ] +
          permitted_attributes_for(:account)
      end

      def permitted_site_attributes
        [
          :cname,
          :additional_cnames,
          :imprint_link_url,
          :imprint_link_label,
          :copyright_link_url,
          :copyright_link_label,
          :privacy_link_url,
          :home_url
        ] +
          permitted_attributes_for(:site)
      end

      def permitted_attributes_for(resource_name)
        config = params[:id] ? Pageflow.config_for(resource) : Pageflow.config
        config.admin_form_inputs.permitted_attributes_for(resource_name)
      end

      def permit_feature_states(attributes)
        return unless params[:id] && authorized?(:update_feature_configuration_on, resource)

        feature_states = params[:account][:feature_states].try(:permit!)
        attributes.merge!(feature_states: feature_states || {})
      end
    end
  end
end
