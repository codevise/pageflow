module Pageflow
  ActiveAdmin.register User do
    menu priority: 2, if: proc { authorized?(:index, current_user) }

    config.batch_actions = false
    config.clear_action_items!

    index do
      column :full_name, sortable: 'last_name' do |user|
        link_to(user.full_name, admin_user_path(user))
      end
      column :email
      column I18n.t('pageflow.admin.users.accounts'), class: 'col-accounts' do |user|
        user_account_badge_list(user)
      end
      column :last_sign_in_at
      column :sign_in_count
      boolean_status_tag_column :suspended?
    end

    filter :last_name
    filter :first_name
    filter :email

    action_item(:invite, only: :index) do
      link_to I18n.t('pageflow.admin.users.invite_user'),
              new_admin_user_path,
              data: {rel: 'invite_user'}
    end

    show do |user|
      div do
        attributes_table_for user do
          row :last_name, class: 'last_name'
          row :first_name, class: 'first_name'
          row :email, class: 'email'

          row :created_at
          row :last_sign_in_at
          boolean_status_tag_row :suspended?
          row :locale do
            I18n.t('language', locale: user.locale)
          end
          if user.admin?
            row :admin, class: 'admin' do
              I18n.t('pageflow.admin.users.roles.admin')
            end
          end
        end

        para do
          link_to I18n.t('pageflow.admin.users.resend_invitation'),
                  resend_invitation_admin_user_path(user),
                  method: :post, class: 'button', data: {rel: 'resend_invitation'}
        end

        entry_memberships = user.memberships.on_entries
                            .accessible_by(Ability.new(current_user), :index)
        if entry_memberships.any?
          panel I18n.t('activerecord.models.entry.other') do
            table_for entry_memberships, class: 'memberships', i18n: Membership do
              column :entry do |membership|
                link_to(membership.entry.title, admin_entry_path(membership.entry))
              end
              column :role, sortable: 'pageflow_memberships.role' do |membership|
                span class: "membership_role #{membership.role}" do
                  I18n.t(membership.role, scope: 'activerecord.values.pageflow/membership.role')
                end
              end
              column I18n.t('activerecord.models.account.one'), :account do |membership|
                if authorized?(:read, Account)
                  link_to(membership.entity.account.name,
                          admin_account_path(membership.entity.account))
                else
                  membership.entity.account.name
                end
              end
              column :created_at, sortable: 'pageflow_memberships.created_at'
              column do |membership|
                if authorized?(:update, membership)
                  link_to(I18n.t('pageflow.admin.users.edit_role'),
                          edit_admin_user_membership_path(user, membership, entity_type: :entry),
                          data: {
                            rel: "edit_entry_role_#{membership.role}"
                          })
                end
              end
              column do |membership|
                if authorized?(:destroy, membership)
                  link_to(I18n.t('pageflow.admin.users.delete'),
                          admin_user_membership_path(user, membership),
                          method: :delete,
                          data: {
                            confirm: I18n.t('active_admin.delete_confirmation'),
                            rel: "delete_entry_membership_#{membership.role}"
                          })
                end
              end
            end
            render 'add_membership_button_if_needed', entity_type: 'entry'
          end
        else
          render 'add_membership_button_if_needed', entity_type: 'entry'
        end

        account_memberships = user.memberships.on_accounts
                              .accessible_by(Ability.new(current_user), :index)
        if account_memberships.any?
          panel I18n.t('activerecord.models.account.other') do
            table_for account_memberships, class: 'memberships', i18n: Membership do
              if authorized?(:list_memberships_on, Account)
              end
              column I18n.t('activerecord.models.account.one'), :account do |membership|
                if authorized?(:read, Account)
                  link_to(membership.entity.name, admin_account_path(membership.entity))
                else
                  membership.entity.name
                end
              end
              column :role, sortable: 'pageflow_memberships.role' do |membership|
                span class: "membership_role #{membership.role}" do
                  I18n.t(membership.role, scope: 'activerecord.values.pageflow/membership.role')
                end
              end
              column :created_at, sortable: 'pageflow_memberships.created_at'
              column do |membership|
                if authorized?(:update, membership)
                  link_to(I18n.t('pageflow.admin.users.edit_role'),
                          edit_admin_user_membership_path(user, membership, entity_type: :account),
                          data: {
                            rel: 'edit_account_role'
                          })
                end
              end
              column do |membership|
                if authorized?(:destroy, membership)
                  link_to(I18n.t('pageflow.admin.users.delete'),
                          admin_user_membership_path(user, membership),
                          method: :delete,
                          data: {
                            confirm: I18n.t('active_admin.delete_confirmation'),
                            rel: "delete_account_membership_#{membership.role}"
                          })
                end
              end
            end
            render 'add_membership_button_if_needed', entity_type: 'account'
          end
        else
          render 'add_membership_button_if_needed', entity_type: 'account'
        end
      end
    end

    action_item(:edit, only: :show) do
      if authorized?(:edit, resource)
        link_to I18n.t('pageflow.admin.users.edit'),
                edit_admin_user_path(user),
                data: {rel: 'edit_user'}
      end
    end

    action_item(:toggle_suspended, only: :show) do
      if user != current_user && authorized?(:suspend, resource)
        if user.suspended?
          link_to I18n.t('pageflow.admin.users.unsuspend'),
                  unsuspend_admin_user_path(user),
                  method: :post, data: {rel: 'unsuspend_user'}
        else
          link_to I18n.t('pageflow.admin.users.suspend'),
                  suspend_admin_user_path(user),
                  method: :post, data: {rel: 'suspend_user'}
        end
      end
    end

    action_item(:delete, only: :show) do
      if user != current_user && authorized?(:destroy, resource)
        link_to I18n.t('pageflow.admin.users.delete'),
                admin_user_path(user),
                method: :delete,
                data: {rel: 'delete_user',
                       confirm: I18n.t('pageflow.admin.users.confirm_delete')}
      end
    end

    form(partial: 'form')

    collection_action 'me', title: I18n.t('pageflow.admin.users.account'), method: [:get, :patch] do
      if request.patch?
        if current_user.update_with_password(user_profile_params)
          sign_in current_user, bypass: true
          redirect_to admin_root_path, notice: I18n.t('pageflow.admin.users.me.updated')
        end
      end
    end

    collection_action 'delete_me',
                      title: I18n.t('pageflow.admin.users.account'), method: [:get, :delete] do
      if request.delete?
        if authorized?(:delete_own_user, current_user) &&
           current_user.destroy_with_password(params.require(:user)[:current_password])
          redirect_to admin_root_path, notice: I18n.t('pageflow.admin.users.me.updated')
        end
      end
    end

    member_action :resend_invitation, method: :post do
      InvitedUser.find(params[:id]).send_invitation!
      redirect_to :back, notice: I18n.t('pageflow.admin.users.resent_invitation')
    end

    member_action :suspend, method: :post do
      User.find(params[:id]).suspend!
      redirect_to :back, notice: I18n.t('pageflow.admin.users.suspended')
    end

    member_action :unsuspend, method: :post do
      User.find(params[:id]).unsuspend!
      redirect_to :back, notice: I18n.t('pageflow.admin.users.unsuspended')
    end

    controller do
      include Pageflow::QuotaVerification

      helper Pageflow::Admin::UsersHelper
      helper Pageflow::Admin::FormHelper
      helper Pageflow::Admin::LocalesHelper
      helper Pageflow::Admin::MembershipsHelper
      helper Pageflow::QuotaHelper

      def build_new_resource
        InvitedUser.new(permitted_params[:user])
      end

      def create_resource(user)
        known_user = User.find_by(email: resource.email)
        if known_user
          Membership.create(user: known_user,
                            role: resource.initial_role,
                            entity_id: resource.initial_account,
                            entity_type: 'Pageflow::Account')
        else
          verify_quota!(:users, params[:user][:account])
          Membership.create(user: resource,
                            role: resource.initial_role,
                            entity_id: resource.initial_account,
                            entity_type: 'Pageflow::Account')
          super
        end
      end

      def user_profile_params
        params.require(:user).permit(:first_name,
                                     :last_name,
                                     :current_password,
                                     :password,
                                     :password_confirmation,
                                     :locale,
                                     :admin)
      end

      def permitted_params
        params.permit(user: [:first_name,
                             :last_name,
                             :email,
                             :password,
                             :password_confirmation,
                             :locale,
                             :admin,
                             :initial_role,
                             :initial_account])
      end
    end
  end
end
