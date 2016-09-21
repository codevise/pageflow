module Pageflow
  ActiveAdmin.register Entry, :as => 'Entry' do
    menu :priority => 1

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
      if authorized?(:read, Account)
        column :account, sortable: 'account_id' do |entry|
          link_to(entry.account.name,
                  admin_account_path(entry.account),
                  data: {id: entry.account.id})
        end
      end
      column :created_at
      column :edited_at
      column :published_at, sortable: 'pageflow_revisions.published_at'

      column class: 'buttons' do |entry|
        if authorized?(:edit, Entry)
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
    filter :with_publication_state, as: :select, collection: -> { collection_for_entry_publication_states }

    sidebar :folders, :only => :index do
      text_node(link_to(I18n.t('pageflow.admin.entries.add_folder'), new_admin_folder_path, :class => 'new'))
      grouped_folder_list(Folder.includes(:account).accessible_by(Ability.new(current_user), :read),
                          :class => authorized?(:manage, Folder) ? 'editable' : nil,
                          :active_id => params[:folder_id],
                          :grouped_by_accounts => authorized?(:read, Account))
    end

    form do |f|
      f.inputs do
        f.input :title, :hint => I18n.t('pageflow.admin.entries.title_hint')
        if authorized?(:read, Account)
          f.input :account, :include_blank => false

          unless f.object.new_record?
            f.input :theming, :include_blank => false
          end
        end
        if authorized?(:manage, Folder)
          f.input :folder, :collection => collection_for_folders(f.object.account), :include_blank => true
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

    member_action :duplicate, :method => :post do
      entry = Entry.find(params[:id])
      authorize!(:duplicate, entry)
      new_entry = entry.duplicate
      redirect_to(edit_admin_entry_path(new_entry))
    end

    member_action :snapshot, :method => :post do
      entry = Entry.find(params[:id])
      authorize!(:snapshot, entry)
      entry.snapshot(:creator => current_user, :type => 'user')
      redirect_to(admin_entry_path(entry, params.slice(:tab)))
    end

    member_action :preview do
      entry = Entry.find(params[:id])
      authorize!(:show, entry.draft)
      redirect_to(pageflow.revision_path(entry.draft))
    end

    show :title => :title do |entry|
      render 'attributes_table', :entry => entry
      render 'links', :entry => entry

      tabs_view(Pageflow.config.admin_resource_tabs.find_by_resource(:entry),
                :i18n => 'pageflow.admin.resource_tabs',
                :authorize => true,
                :build_args => [entry])
    end

    controller do
      helper FoldersHelper
      helper EntriesHelper
      helper Pageflow::Admin::EntriesHelper
      helper Pageflow::Admin::FeaturesHelper
      helper Pageflow::Admin::RevisionsHelper
      helper Pageflow::Admin::FormHelper

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

      def permitted_params
        result = params.permit(entry: permitted_attributes)

        if result[:entry]
          permit_feature_states(result[:entry])
        end

        result
      end

      private

      def permitted_attributes
        result = [:title]

        target = params[:id] ? resource : current_user.account
        result += Pageflow.config_for(target).admin_form_inputs.permitted_attributes_for(:entry)

        result += [:account_id, :theming_id] if authorized?(:read, Account)
        result << :folder_id if authorized?(:manage, Folder)
        result
      end

      def permit_feature_states(attributes)
        if authorized?(:read, Account)
          feature_states = params[:entry][:feature_states].try(:permit!)
          attributes.merge!(feature_states: feature_states || {})
        end
      end
    end
  end
end
