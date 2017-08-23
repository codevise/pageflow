module Pageflow
  ActiveAdmin.register Membership, as: 'Membership' do
    menu false

    actions :new, :create, :edit, :update, :destroy

    form partial: 'form'

    controller do
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
