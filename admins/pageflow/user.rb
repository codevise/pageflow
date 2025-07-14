module Pageflow
  ActiveAdmin.register User do
    menu priority: 2

    actions :all, except: [:new, :create]

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
      boolean_status_tag_column :suspended?
    end

    csv do
      column :id
      column :first_name
      column :last_name
      column :email
      column :suspended?
    end

    filter :last_name
    filter :first_name
    filter :email

    action_item(:invite, only: :index) do
      link_to I18n.t('pageflow.admin.users.invite_user'),
              invitation_admin_users_path,
              data: {rel: 'invite_user'}
    end

    show do |user|
      div do
        render('attributes_table', user:)

        para do
          link_to I18n.t('pageflow.admin.users.resend_invitation'),
                  resend_invitation_admin_user_path(user),
                  method: :post, class: 'button', data: {rel: 'resend_invitation'}
        end
      end

      tabs_view(Pageflow.config.admin_resource_tabs.find_by_resource(user),
                i18n: 'pageflow.admin.resource_tabs',
                authorize: :see_user_admin_tab,
                build_args: [user])
    end

    action_item(:edit, only: :show) do
      if authorized?(:edit, resource)
        link_to I18n.t('pageflow.admin.users.edit'),
                edit_admin_user_path(user),
                data: {rel: 'edit_user'}
      end
    end

    action_item(:toggle_suspended, priority: 5, only: :show) do
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

    after_update do |user|
      Pageflow.config.hooks.invoke(:user_changed, user)
    end

    collection_action :invitation, method: [:get, :post] do
      @page_title = I18n.t('pageflow.admin.users.invite_user')
      @invitation_form = InvitationForm.new(invitation_form_params.fetch(:invitation_form, {}),
                                            AccountPolicy::Scope.new(current_user, Account)
                                              .member_addable)

      if request.post?
        if @invitation_form.save
          Pageflow.config.hooks.invoke(:user_changed, @invitation_form.target_user)
          redirect_to(admin_user_path(@invitation_form.target_user))
        else
          render status: 422
        end
      end
    end

    collection_action :quota_state do
      @account = Pageflow::Account.find(params[:account_id])
      if authorized?(:see_user_quota, @account)
        render(layout: false)
      else
        render(partial: 'not_allowed_to_see_user_quota')
      end
    end

    collection_action 'me', title: I18n.t('pageflow.admin.users.account'), method: [:get, :patch] do
      @user = User.find(current_user.id)

      if request.patch? && @user.update_with_password(user_profile_params)
        Pageflow.config.hooks.invoke(:user_changed, @user)

        bypass_sign_in @user, scope: :user
        redirect_to admin_root_path, notice: I18n.t('pageflow.admin.users.me.updated')
      end
    end

    collection_action 'delete_me',
                      title: I18n.t('pageflow.admin.users.account'), method: [:get, :delete] do
      if request.delete? && (authorized?(:delete_own_user, current_user) &&
           current_user.destroy_with_password(params.require(:user)[:current_password]))
        redirect_to admin_root_path, notice: I18n.t('pageflow.admin.users.me.updated')
      end
    end

    member_action :resend_invitation, method: :post do
      user = InvitedUser.find(params[:id])
      authorize!(:read, user)
      user.send_invitation!
      redirect_back fallback_location: admin_user_path(user),
                    notice: I18n.t('pageflow.admin.users.resent_invitation')
    end

    member_action :suspend, method: :post do
      user = User.find(params[:id])
      authorize!(:suspend, user)
      user.suspend!
      redirect_back fallback_location: admin_user_path(user),
                    notice: I18n.t('pageflow.admin.users.suspended')
    end

    member_action :unsuspend, method: :post do
      user = User.find(params[:id])
      authorize!(:suspend, user)
      user.unsuspend!
      redirect_back fallback_location: admin_user_path(user),
                    notice: I18n.t('pageflow.admin.users.unsuspended')
    end

    controller do
      include QuotaVerification
      helper Admin::FormHelper
      helper Admin::LocalesHelper
      helper Admin::MembershipsHelper
      helper Admin::UsersHelper
      helper QuotaHelper

      def scoped_collection
        super.includes(account_memberships: :entity)
      end

      def invitation_form_params
        params.permit(invitation_form: {
                        user: permitted_user_attributes,
                        membership: [:entity_id, :role]
                      })
      end

      def user_profile_params
        params.require(:user).permit(:first_name,
                                     :last_name,
                                     :current_password,
                                     :password,
                                     :password_confirmation,
                                     :locale)
      end

      def permitted_params
        params.permit(user: permitted_user_attributes)
      end

      private

      def permitted_user_attributes
        attributes = [
          :first_name,
          :last_name,
          :email,
          :locale
        ]

        attributes << :admin if authorized?(:set_admin, current_user)
        attributes
      end
    end
  end
end
