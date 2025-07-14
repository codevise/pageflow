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
      column :created_at do |entry|
        timestamp(entry.created_at)
      end
      column :edited_at do |entry|
        timestamp(entry.edited_at)
      end
      column :published_at, sortable: 'pageflow_revisions.published_at' do |entry|
        timestamp(entry.published_at)
      end

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
    filter :type_name,
           as: :select,
           collection: -> { entry_type_collection },
           if: ->(_) { authorized?(:filter_by_type, :entries) }
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

    searchable_select_options(text_attribute: :title,
                              scope: lambda do |params|
                                scope = EntryPolicy::Scope.new(current_user, Entry).resolve
                                scope = scope.where(site_id: params[:site_id]) if params[:site_id]
                                scope
                              end)

    searchable_select_options(name: :eligible_accounts,
                              text_attribute: :name,
                              scope: lambda do
                                AccountPolicy::Scope
                                  .new(current_user, Account)
                                  .entry_movable
                                  .order(:name)
                              end)

    searchable_select_options(name: :eligible_sites,
                              text_attribute: :name_with_account_prefix,
                              scope: lambda do |params|
                                account = Account.find(params[:account_id])
                                SitePolicy::Scope
                                  .new(current_user, Site)
                                  .sites_allowed_for(account)
                              end,
                              filter: lambda do |term, scope|
                                scope.ransack(account_name_cont: term).result
                              end)

    form(partial: 'form')

    action_item(:depublish, only: :show, priority: 6) do
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

    action_item(:duplicate, only: :show, priority: 5) do
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

    collection_action :entry_site_and_type_name_input do
      account = Pageflow::Account.find(params[:account_id])
      @entry = Pageflow::Entry.new(account:,
                                   type_name: params[:entry_type_name])

      apply_entry_defaults(@entry)

      if authorized?(:see_entry_types, account)
        render(layout: false)
      else
        head :forbidden
      end
    end

    collection_action :permalink_inputs do
      @entry = Entry.new(permitted_params[:entry])

      apply_entry_defaults(@entry)

      if authorized?(:create, @entry)
        render(layout: false)
      else
        head :forbidden
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
      render('attributes_table', entry:)
      render('links', entry:)

      tabs_view(Pageflow.config.admin_resource_tabs.find_by_resource(entry),
                i18n: 'pageflow.admin.resource_tabs',
                authorize: :see_entry_admin_tab,
                build_args: [entry])
    end

    controller do
      helper FoldersHelper
      helper EntriesHelper
      helper EmbedCodeHelper
      helper SitesHelper
      helper Admin::EntriesHelper
      helper Admin::FeaturesHelper
      helper Admin::FormHelper
      helper Admin::MembershipsHelper
      helper Admin::RevisionsHelper
      helper Admin::EntryTranslationsHelper

      helper_method :account_policy_scope
      helper_method :site_policy_scope

      after_build do |entry|
        handle_site_param(entry)
        apply_entry_defaults(entry)
        handle_root_permalink(entry)

        if action_name == 'new' &&
           (default_entry_type = Pageflow.config.default_entry_type&.call(entry.account))

          entry.type_name = default_entry_type.name
        end
      end

      after_create do |entry|
        Pageflow.config.hooks.invoke(:entry_created, entry:) if entry.persisted?
      end

      before_update do |entry|
        if entry.account_id_changed? && !authorized?(:update_site_on, resource)
          entry.site = entry.account.default_site
        end
      end

      def create
        create! do |success, _|
          success.html do
            case Pageflow.config.after_entry_create_redirect_to
            when :admin
              redirect_to admin_entry_path(resource)
            when :editor
              redirect_to pageflow.editor_entry_path(resource)
            end
          end
        end
      end

      def update
        update! do |success, _|
          success.html { redirect_to(admin_entry_path(resource, params.permit(:tab))) }
        end
      end

      def scoped_collection
        result =
          super
          .includes(:site,
                    {permalink: :directory},
                    :account,
                    {memberships: :user},
                    :published_revision)
          .references(:published_revision)

        params.key?(:folder_id) ? result.where(folder_id: params[:folder_id]) : result
      end

      def permitted_params
        result = params.permit(entry: permitted_attributes)

        permit_feature_states(result[:entry]) if result[:entry]

        result
      end

      private

      def handle_site_param(entry)
        return unless params[:site_id]

        site = site_policy_scope.sites_allowed_for(
          account_policy_scope.entry_creatable
        ).find(params[:site_id])

        entry.site = site
        entry.account = site.account
      end

      def apply_entry_defaults(entry)
        entry.account ||= account_policy_scope.entry_creatable.first || Account.first
        entry.site ||= entry.account.default_site
      end

      def handle_root_permalink(entry)
        return unless params[:at] == 'root'
        return unless authorized?(:manage_root_entry, entry.site)

        entry.build_permalink unless entry.permalink
        entry.permalink.assign_attributes(
          directory: entry.site.root_permalink_directory,
          slug: '',
          allow_root_path: '1'
        )
      end

      def account_policy_scope
        AccountPolicy::Scope.new(current_user, Account)
      end

      def site_policy_scope
        SitePolicy::Scope.new(current_user, Site)
      end

      def permitted_attributes
        result = [:title, :type_name, {permalink_attributes: [:slug, :directory_id]}]
        target = if !params[:id] && current_user.admin?
                   Account.first
                 elsif params[:id]
                   resource
                 else
                   current_user.accounts.first
                 end
        result += Pageflow.config_for(target).admin_form_inputs.permitted_attributes_for(:entry)
        result += permitted_account_attributes

        result << :folder_id if params[:id] && authorized?(:configure_folder_for, resource)

        accounts = if params[:id]
                     resource.account
                   else
                     account_policy_scope.sites_accessible
                   end

        result += permitted_site_attributes(accounts)

        result
      end

      def permit_feature_states(attributes)
        return unless params[:id] && authorized?(:update_feature_configuration_on, resource)

        feature_states = params[:entry][:feature_states].try(:permit!)
        attributes.merge!(feature_states: feature_states || {})
      end

      def permitted_site_attributes(accounts)
        if (create_or_new_action? || authorized?(:update_site_on, resource)) &&
           site_params_present? && site_in_allowed_sites_for?(accounts)
          [:site_id]
        else
          []
        end
      end

      def site_params_present?
        params[:entry] && params[:entry][:site_id]
      end

      def create_or_new_action?
        [:create, :new, :permalink_inputs].include?(action_name.to_sym)
      end

      def site_in_allowed_sites_for?(accounts)
        site_policy_scope.sites_allowed_for(accounts)
                         .include?(Site.find(params[:entry][:site_id]))
      end

      def permitted_account_attributes
        if account_params_present? &&
           (create_or_new_action? || legally_moving_entry_to_other_account)
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
