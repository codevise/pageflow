module Pageflow
  ActiveAdmin.register Membership, :as => 'Membership' do
    menu false

    actions :new, :create, :edit, :update, :destroy

    form :partial => 'form'

    controller do
      belongs_to :entry, :parent_class => Pageflow::Entry, :polymorphic => true
      belongs_to :account, parent_class: Pageflow::Account, polymorphic: true
      belongs_to :user, :parent_class => User, :polymorphic => true

      helper Pageflow::Admin::MembershipsHelper
      helper Pageflow::Admin::FormHelper

      def permitted_params
        params.permit(:membership => [:user_id, :entity_id, :entity_type, :role])
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
            redirect_url = admin_user_url(resource.user)
          elsif authorized?(:redirect_to_user, resource.user) && params[:entry_id]
            redirect_url = admin_entry_url(resource.entity)
          elsif params[:user_id] && authorized?(:index, resource.user)
            redirect_url = admin_users_url
          else
            redirect_url = admin_entries_url
          end
          redirect_url
        end
      end
    end
  end
end
