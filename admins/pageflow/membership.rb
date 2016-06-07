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

      def permitted_params
        result = params.permit(membership: [:user_id, :entity_id, :entity_type, :role])
        restrict_attributes(result[:membership]) if result[:membership]
        result
      end

      def index
        if params[:user_id].present?
          redirect_to admin_user_url(params[:user_id])
        elsif params[:entry_id].present?
          redirect_to admin_entry_url(params[:entry_id])
        else
          redirect_to admin_account_url(params[:account_id])
        end
      end

      def destroy
        if resource.entity_type == 'Pageflow::Account'
          dependent_entry_ids = resource.entity.entry_memberships.where(user: resource.user)
                                .map(&:entity_id)
          Membership
            .where(user: resource.user,
                   entity_type: 'Pageflow::Entry',
                   entity_id: dependent_entry_ids).destroy_all
        end
        destroy! do
          if authorized?(:redirect_to_user, resource.user) && params[:user_id]
            admin_user_url(resource.user)
          elsif authorized?(:redirect_to_user, resource.user) && params[:entry_id]
            admin_entry_url(resource.entity)
          elsif params[:user_id] && authorized?(:index, resource.user)
            admin_users_url
          elsif params[:account_id]
            admin_accounts_url
          else
            admin_entries_url
          end
        end
      end

      private

      def restrict_attributes(attributes)
        if attributes[:role].present?
          role = attributes.delete(:role).to_sym
        end
        attributes.merge!(role: role)
      end
    end
  end
end
