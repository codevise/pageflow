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
          icon_link_to(pageflow.editor_entry_path(entry),
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

    csv do
      column :slug
      column :title
      column :created_at
      column :edited_at
      column :published_at
    end

    filter :title
    filter :account,
           as: :searchable_select,
           ajax: true,
           if: ->(_) { authorized?(:index, :accounts) }
    filter :created_at
    filter :edited_at
    filter :first_published_at
    filter :published_revision_published_at, as: :date_range
    filter :with_publication_state,
           as: :select,
           collection: -> { collection_for_entry_publication_states }

    sidebar :folders, only: :index do
      if AccountPolicy::Scope.new(current_user, Account).folder_addable.any?
        text_node(link_to(I18n.t('pageflow.admin.entries.add_folder'),
                          new_admin_folder_path,
                          class: 'new'))
      end
      grouped_folder_list(Folder.accessible_by(current_ability, :read).includes(:account),
                          active_id: params[:folder_id],
                          grouped_by_accounts: authorized?(:see, :accounts))
    end

    searchable_select_options(name: :eligible_accounts,
                              text_attribute: :name,
                              scope: lambda do
                                AccountPolicy::Scope
                                  .new(current_user, Account)
                                  .entry_movable
                                  .order(:name)
                              end)

    searchable_select_options(name: :eligible_themings,
                              text_attribute: :name,
                              scope: lambda do |params|
                                entry = Entry.find(params[:entry_id])
                                ThemingPolicy::Scope
                                  .new(current_user, Theming)
                                  .themings_allowed_for(entry.account)
                              end,
                              filter: lambda do |term, scope|
                                scope.ransack(account_name_cont: term).result
                              end)

    form do |f|
      f.inputs do
        f.input :title, hint: I18n.t('pageflow.admin.entries.title_hint')

        if authorized?(:update_account_on, resource)
          f.input(:account,
                  as: :searchable_select,
                  include_blank: false,
                  ajax: {
                    resource: Entry,
                    collection_name: :eligible_accounts
                  },
                  input_html: {class: 'entry_account_input', style: 'width: 200px'})
        end

        if authorized?(:update_theming_on, resource) && !f.object.new_record?
          f.input(:theming,
                  as: :searchable_select,
                  ajax: {
                    resource: Entry,
                    collection_name: :eligible_themings,
                    params: {
                      entry_id: resource.id
                    }
                  },
                  include_blank: false,
                  input_html: {style: 'width: 200px'})
        end

        if f.object.new_record?
          f.input :type_name,
                  as: :select,
                  include_blank: false,
                  collection: entry_type_collection,
                  wrapper_html: {style: 'display: none'}
        end

        if authorized?(:configure_folder_for, resource)
          folder_collection = collection_for_folders(resource.account, resource.folder)
          f.input(:folder,
                  collection: folder_collection,
                  include_blank: true) unless folder_collection.empty?
        end

        Pageflow.config_for(f.object).admin_form_inputs.build(:entry, f)
      end
      f.actions
    end

    action_item(:depublish, only: :show) do
      if authorized?(:publish, entry) && entry.published?
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

    collection_action :entry_types do
      account = Pageflow::Account.find(params[:account_id])

      if authorized?(:see_entry_types, account)
        @entry_types = helpers.entry_type_collection_for_account(account)

        render(layout: false)
      else
        render(partial: 'not_allowed_to_see_entry_types', status: 403)
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
      redirect_to(admin_entry_path(entry, params.permit(:tab)))
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
      helper EmbedCodeHelper
      helper Admin::EntriesHelper
      helper Admin::FeaturesHelper
      helper Admin::FormHelper
      helper Admin::MembershipsHelper
      helper Admin::RevisionsHelper

      after_build do |entry|
        entry.account ||= account_policy_scope.entry_creatable.first || Account.first
        entry.theming ||= entry.account.default_theming
      end

      before_update do |entry|
        if entry.account_id_changed? && !authorized?(:update_theming_on, resource)
          entry.theming = entry.account.default_theming
        end
      end

      def update
        update! do |success, _|
          success.html { redirect_to(admin_entry_path(resource, params.permit(:tab))) }
        end
      end

      def scoped_collection
        result = super.includes(:theming, :account, {memberships: :user}, :published_revision).references(:published_revision)
        params.key?(:folder_id) ? result.where(folder_id: params[:folder_id]) : result
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
        AccountPolicy::Scope.new(current_user, Account)
      end

      def theming_policy_scope
        ThemingPolicy::Scope.new(current_user, Theming)
      end

      def permitted_attributes
        result = [:title, :type_name]
        target = if !params[:id] && current_user.admin?
                   Account.first
                 elsif params[:id]
                   resource
                 else
                   current_user.accounts.first
                 end
        result += Pageflow.config_for(target).admin_form_inputs.permitted_attributes_for(:entry)
        result += permitted_account_attributes

        if params[:id]
          result << :folder_id if authorized?(:configure_folder_for, resource)
        end

        if params[:id]
          accounts = resource.account
        else
          accounts = account_policy_scope.themings_accessible
        end

        result += permitted_theming_attributes(accounts)

        result
      end

      def permit_feature_states(attributes)
        if params[:id] && authorized?(:update_feature_configuration_on, resource)
          feature_states = params[:entry][:feature_states].try(:permit!)
          attributes.merge!(feature_states: feature_states || {})
        end
      end

      def permitted_theming_attributes(accounts)
        if (create_or_new_action? || authorized?(:update_theming_on, resource)) &&
           theming_params_present? && theming_in_allowed_themings_for?(accounts)
          [:theming_id]
        else
          []
        end
      end

      def theming_params_present?
        params[:entry] && params[:entry][:theming_id]
      end

      def create_or_new_action?
        [:create, :new].include?(action_name.to_sym)
      end

      def theming_in_allowed_themings_for?(accounts)
        theming_policy_scope.themings_allowed_for(accounts)
          .include?(Theming.find(params[:entry][:theming_id]))
      end

      def permitted_account_attributes
        if account_params_present? &&
           (action_name.to_sym == :create || legally_moving_entry_to_other_account)
          [:account_id]
        else
          []
        end
      end

      def legally_moving_entry_to_other_account
        action_name.to_sym == :update && authorized?(:update_account_on, resource) &&
          account_policy_scope.entry_movable.include?(Account.find(params[:entry][:account_id]))
      end

      def account_params_present?
        params[:entry] && params[:entry][:account_id]
      end
    end
  end
end
