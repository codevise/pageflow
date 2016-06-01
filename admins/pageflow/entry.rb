module Pageflow
  ActiveAdmin.register Entry, as: 'Entry' do
    menu priority: 1

    config.batch_actions = false

    index do
      column class: 'publication_state' do |entry|
        entry_publication_state_indicator(entry)
      end
      column :title, sortable: 'title' do |entry|
        link_to(entry.title, admin_entry_path(entry))
      end
      column I18n.t('pageflow.admin.entries.members'), class: 'members' do |entry|
        entry_user_badge_list(entry)
      end
      if authorized?(:see, :accounts)
        column :account, sortable: 'account_id' do |entry|
          if authorized?(:read, entry.account)
            link_to(entry.account.name,
                    admin_account_path(entry.account),
                    data: {id: entry.account.id})
          else
            entry.account.name
          end
        end
      end
      column :created_at
      column :edited_at
      column :published_at, sortable: 'pageflow_revisions.published_at'

      column class: 'buttons' do |entry|
        if authorized?(:edit, entry)
          icon_link_to(pageflow.edit_entry_path(entry),
                       tooltip: I18n.t('pageflow.admin.entries.editor_hint'),
                       class: 'editor')
        end

        icon_link_to(preview_admin_entry_path(entry),
                     tooltip: I18n.t('pageflow.admin.entries.preview'),
                     class: 'preview')

        if entry.published?
          icon_link_to(pretty_entry_url(entry),
                       tooltip: I18n.t('pageflow.admin.entries.show_public_hint'),
                       class: 'show_public')
        end
      end
    end

    filter :title
    filter :account
    filter :created_at
    filter :edited_at
    filter :first_published_at
    filter :published_revision_published_at, as: :date_range
    filter :with_publication_state,
           as: :select,
           collection: -> { collection_for_entry_publication_states }

    sidebar :folders, only: :index do
      text_node(link_to(I18n.t('pageflow.admin.entries.add_folder'),
                        new_admin_folder_path,
                        class: 'new'))
      grouped_folder_list(Folder.accessible_by(Ability.new(current_user), :read),
                          active_id: params[:folder_id],
                          grouped_by_accounts: true)
    end

    form do |f|
      f.inputs do
        f.input :title, hint: I18n.t('pageflow.admin.entries.title_hint')

        if authorized?(:update_account_on, resource)
          f.input :account,
                  collection: eligible_accounts,
                  include_blank: false,
                  input_html: {onchange: jquery_for_disabling_on_change}
        end

        unless f.object.new_record?
          eligible_themings = ThemingPolicy::Scope.new(current_user, Pageflow::Theming)
                              .themings_allowed_for(resource.account).load
        end

        if authorized?(:update_theming_on, resource) && !f.object.new_record?
          f.input :theming, collection: eligible_themings, include_blank: false
        end

        if authorized?(:configure_folder_for, resource) || controller.action_name == :create
          resource_folder_id = resource.folder ? resource.folder.id : nil
          f.input(:folder,
                  collection: collection_for_folders(resource.account,
                                                     resource_folder_id),
                  include_blank: true) unless collection_for_folders(resource.account,
                                                                     resource_folder_id).empty?
        end

        Pageflow.config_for(f.object).admin_form_inputs.build(:entry, f)
      end
      f.actions
    end

    action_item(:depublish, only: :show) do
      if authorized?(:publish, Entry) && entry.published?
        button_to(I18n.t('pageflow.admin.entries.depublish'),
                  pageflow.current_entry_revisions_path(entry),
                  method: :delete,
                  form_class: 'action_item depublish',
                  data: {
                    rel: 'depublish',
                    confirm: I18n.t('pageflow.admin.entries.confirm_depublish')
                  })
      end
    end

    action_item(:duplicate, only: :show) do
      if authorized?(:duplicate, entry)
        button_to(I18n.t('pageflow.admin.entries.duplicate'),
                  duplicate_admin_entry_path(entry),
                  method: :post,
                  form_class: 'action_item duplicate',
                  data: {
                    rel: 'duplicate',
                    confirm: I18n.t('pageflow.admin.entries.confirm_duplicate')
                  })
      end
    end

    member_action :duplicate, method: :post do
      entry = Entry.find(params[:id])
      authorize!(:duplicate, entry)
      new_entry = entry.duplicate
      redirect_to(edit_admin_entry_path(new_entry))
    end

    member_action :snapshot, method: :post do
      entry = Entry.find(params[:id])
      authorize!(:snapshot, entry)
      entry.snapshot(creator: current_user, type: 'user')
      redirect_to(admin_entry_path(entry))
    end

    member_action :preview do
      entry = Entry.find(params[:id])
      authorize!(:read, entry.draft)
      redirect_to(pageflow.revision_path(entry.draft))
    end

    show title: :title do |entry|
      render 'attributes_table', entry: entry
      render 'links', entry: entry

      tabs_view(Pageflow.config.admin_resource_tabs.find_by_resource(entry),
                i18n: 'pageflow.admin.resource_tabs',
                authorize: :see_entry_admin_tab,
                build_args: [entry])
    end

    controller do
      helper FoldersHelper
      helper EntriesHelper
      helper Pageflow::Admin::EntriesHelper
      helper Pageflow::Admin::FeaturesHelper
      helper Pageflow::Admin::FormHelper
      helper Pageflow::Admin::MembershipsHelper
      helper Pageflow::Admin::RevisionsHelper

      after_build do |entry|
        entry.account ||= current_user.account
        entry.theming ||= entry.account.default_theming
      end

      def update
        update! do |success, _|
          success.html { redirect_to(admin_entry_path(resource, params.slice(:tab))) }
        end
      end

      def scoped_collection
        result = super.includes(:theming, :account, :users, :published_revision).references(:published_revision)
        params.key?(:folder_id) ? result.where(folder_id: params[:folder_id]) : result
      end

      def build_new_resource
        super.tap do |entry|
          entry.account ||=
            AccountPolicy::Scope.new(current_user, Pageflow::Account).entry_creatable.first ||
            Pageflow::Account.first

          entry.theming ||= entry.account.default_theming
        end
      end

      def permitted_params
        result = params.permit(entry: permitted_attributes)

        if result[:entry]
          permit_feature_states(result[:entry])
        end

        result
      end

      private

      def account_policy_scope
        AccountPolicy::Scope.new(current_user, Pageflow::Account)
      end

      def theming_policy_scope
        ThemingPolicy::Scope.new(current_user, Pageflow::Theming)
      end

      def permitted_attributes
        result = [:title]
        target = if !params[:id] && current_user.admin?
                   Account.first
                 elsif params[:id]
                   resource
                 else
                   current_user.accounts.first
                 end
        result += Pageflow.config_for(target).admin_form_inputs.permitted_attributes_for(:entry)
        result += permit_account || []

        if params[:id]
          result << :folder_id if authorized?(:configure_folder_for, resource)
        end

        if params[:id]
          accounts = resource.account
        else
          accounts = account_policy_scope.themings_accessible
        end

        result += permit_theming(accounts) || []

        result
      end

      def permit_feature_states(attributes)
        if params[:id] && authorized?(:update_feature_configuration_on, resource)
          feature_states = params[:entry][:feature_states].try(:permit!)
          attributes.merge!(feature_states: feature_states || {})
        end
      end

      def permit_theming(accounts)
        if ([:create, :new].include?(action_name.to_sym) ||
            authorized?(:update_theming_on, resource)) && params[:entry] &&
           params[:entry][:theming_id] &&
           theming_policy_scope.themings_allowed_for(accounts)
           .include?(Pageflow::Theming.find(params[:entry][:theming_id]))
          [:theming_id]
        end
      end

      def permit_account
        if params[:entry] && params[:entry][:account_id] &&
           (action_name.to_sym == :create ||
            action_name.to_sym == :update && authorized?(:update_account_on, resource)) &&
           account_policy_scope.entry_movable
             .include?(Pageflow::Account.find(params[:entry][:account_id]))
          [:account_id]
        end
      end
    end
  end
end
