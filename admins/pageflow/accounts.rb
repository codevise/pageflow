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
        account.first_paged_entry_template.theme_name if authorized?(:read, account)
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
      render 'entry_template_details', account: account

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
        @account.build_default_theming
        @entry_template = @account.entry_templates.build(
          default_locale: current_user.locale,
          share_providers: Pageflow.config.default_share_providers,
          entry_type: 'paged'
        )
      end

      def create
        account_params = (permitted_params[:account] || {})
                         .except(:paged_entry_template_attributes)
        @account = Account.new(account_params)
        @account.build_default_theming(permitted_params.fetch(:account, {})[
                                         :default_theming_attributes])
        @entry_template = @account.entry_templates.build({entry_type: 'paged'}
                                                  .merge(entry_template_params))

        super
        update_widgets('paged')
      end

      def edit
        @entry_template = resource.first_paged_entry_template
        super
      end

      def update
        @entry_template = resource.entry_templates.find_or_initialize_by(
          entry_type: 'paged'
        )
        @entry_template.assign_attributes(entry_template_params)
        @entry_template.save
        update! do |success, failure|
          success.html { redirect_to(admin_account_path(resource, params.permit(:tab))) }
        end
        update_widgets('paged')
      end

      def entry_template_params
        current_params = permitted_params_with_entry_template_attributes.fetch(:account, {})[
          :paged_entry_template_attributes]&.to_hash
        if current_params
          config = true_false_strings_to_booleans_or_numbers(
            current_params['configuration']
          )
          share_providers = true_false_strings_to_booleans_or_numbers(
            current_params['share_providers']
          )
          current_params.merge('configuration' => config, 'share_providers' => share_providers)
        else
          {}
        end
      end

      def update_widgets(entry_type)
        if @account.valid?
          EntryTemplate.find_by(account_id: @account.id, entry_type: entry_type)
            &.widgets&.batch_update!(widgets_params)
        end
      end

      def widgets_params
        (params[:widgets].try(:permit!).to_h || {}).map do |role, type_name|
          {role: role, type_name: type_name}
        end
      end

      def permitted_params
        result = params.permit(account: permitted_account_attributes)

        with_permitted_feature_states(result)
      end

      def permitted_params_with_entry_template_attributes
        result = params.permit(account: permitted_account_attributes_plus_entry_template)

        with_permitted_feature_states(result)
      end

      def scoped_collection
        super.includes(:default_theming)
      end

      private

      def with_permitted_feature_states(result)
        result[:account] && permit_feature_states(result[:account])

        result
      end

      def true_false_strings_to_booleans_or_numbers(hash)
        hash&.map { |k, v| [k, to_boolean_or_number(v)] }&.to_h
      end

      def to_boolean_or_number(value)
        case value
        when 'false'
          false
        when 'true'
          true
        when '0'
          0
        when '1'
          1
        else
          value
        end
      end

      def permitted_account_attributes
        [
          :name,
          :default_file_rights,
          default_theming_attributes: permitted_theming_attributes
        ] +
          permitted_attributes_for(:account)
      end

      def permitted_account_attributes_plus_entry_template
        permitted_account_attributes +
          [paged_entry_template_attributes: permitted_entry_template_attributes]
      end

      def permitted_theming_attributes
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
          permitted_attributes_for(:theming)
      end

      def permitted_entry_template_attributes
        [
          :theme_name,
          :default_author,
          :default_publisher,
          :default_keywords,
          :default_locale,
          share_providers: [],
          configuration: {}
        ]
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
