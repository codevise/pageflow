module Pageflow
  ActiveAdmin.register Membership, as: 'Membership' do
    menu false

    actions :new, :create, :edit, :update, :destroy

    form partial: 'form'

    searchable_select_options(name: :potential_accounts_for_user,
                              text_attribute: :name,
                              scope: lambda do |params|
                                user = User.find(params[:parent_id])

                                PotentialMemberships
                                  .creatable_by(current_user)
                                  .accounts_for_user(user)
                                  .order(:name)
                              end)

    searchable_select_options(name: :potential_entries_for_user,
                              display_text: lambda do |entry|
                                [entry.try(:account_name), entry.title].compact.join(' / ')
                              end,
                              scope: lambda do |params|
                                user = User.find(params[:parent_id])
                                entries = PotentialMemberships
                                  .creatable_by(current_user)
                                  .entries_for_user(user)

                                if can?(:see, :accounts)
                                  entries.include_account_name.order('account_name', :title)
                                else
                                  entries.order(:title)
                                end
                              end,
                              filter: lambda do |term, scope|
                                EntryTitleOrAccountNameQuery::Scope.new(term, scope).resolve
                              end)

    searchable_select_options(name: :potential_users_for_account,
                              text_attribute: :formal_name,
                              scope: lambda do |params|
                                account = Account.find(params[:parent_id])
                                PotentialMemberships
                                  .creatable_by(current_user)
                                  .users_for_account(account)
                                  .order(:last_name, :first_name)
                              end,
                              filter: lambda do |term, scope|
                                UserNameQuery::Scope.new(term, scope).resolve
                              end)

    searchable_select_options(name: :potential_users_for_entry,
                              text_attribute: :formal_name,
                              scope: lambda do |params|
                                entry = Entry.find(params[:parent_id])
                                PotentialMemberships
                                  .creatable_by(current_user)
                                  .users_for_entry(entry)
                                  .order(:last_name, :first_name)
                              end,
                              filter: lambda do |term, scope|
                                UserNameQuery::Scope.new(term, scope).resolve
                              end)

    controller do
      # We put the `belongs_to` call in the controller block to work
      # around the issue that ActiveAdmin does not yet support
      # polymorphic nested resources [1]. This works since the
      # underlying InheritedResources library does support polymorphic
      # nesting [2]. As mentioned in the ActiveAdmin issue, we need to
      # set up routes manually then, though. This is done in
      # `Pageflow.routes` [3].
      #
      # [1] activeadmin/activeadmin#221
      # [2] https://github.com/activeadmin/inherited_resources#polymorphic-belongs-to
      # [3] https://github.com/codevise/pageflow/blob/023fdb7c5b3b917bb94f4adafa18a31f8bd9c753/lib/pageflow.rb#L10

      belongs_to :entry, parent_class: Pageflow::Entry, polymorphic: true
      belongs_to :account, parent_class: Pageflow::Account, polymorphic: true
      belongs_to :user, parent_class: User, polymorphic: true

      helper Pageflow::Admin::MembershipsHelper
      helper Pageflow::Admin::FormHelper

      def index
        if params[:user_id].present?
          redirect_to admin_user_url(params[:user_id])
        elsif params[:entry_id].present?
          redirect_to admin_entry_url(params[:entry_id])
        else
          redirect_to admin_account_url(params[:account_id])
        end
      end

      def create
        create! { redirect_path }
      end

      def update
        update! { redirect_path }
      end

      def destroy
        if resource.entity_type == 'Pageflow::Account'
          resource.entity.entry_memberships.where(user: resource.user).destroy_all
        end

        destroy! { redirect_path }
      end

      private

      def permitted_params
        params.permit(membership: [:user_id, :entity_id, :entity_type, :role])
      end

      def redirect_path
        if params[:user_id].present? && authorized?(:redirect_to_user, resource.user)
          tab = resource.entity_type == 'Pageflow::Account' ? 'accounts' : 'entries'
          admin_user_path(params[:user_id], tab: tab)
        elsif params[:user_id].present? && authorized?(:index, resource.user)
          admin_users_path
        elsif params[:account_id].present? && authorized?(:read, resource.entity)
          admin_account_path(params[:account_id], tab: 'users')
        elsif params[:account_id].present? && authorized?(:index, :accounts)
          admin_accounts_path
        elsif params[:entry_id].present?
          admin_entry_path(params[:entry_id])
        else
          admin_entries_path
        end
      end
    end
  end
end
